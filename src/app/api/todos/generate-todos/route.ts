import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../../../../lib/prisma";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const GEMINI_KEY = process.env.GEMINI_KEY as string

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { prompt } = await request.json();

  const genAI = new GoogleGenerativeAI(GEMINI_KEY);

  const schema = {
    "type": "object",
    "properties": {
      "todos": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "userId": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "userId"
          ]
        }
      }
    },
    "required": [
      "todos"
    ]
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: schema as object,
      },
    });

    const result =
      await model.generateContent(`This is a todo application which user used to create and manage thier todos, the user will give prompts like make list of things that should pack before going to travel, etc. so your job is to generate list of todos and in userId out this id ${userId} there in each todo. Break the list in sperated short todos to display them at the front end. Below is the prompt that is typed by the user.
    
    User Prompt: ${prompt}`);

    const generatedTodos = JSON.parse(result.response.text());
 

    try {
      const saveTodos = await prisma.todos.createMany({
        data: generatedTodos.todos,
      });

      if (!saveTodos) {
        throw new Error
      }
    } catch (error) {
      console.log("Error saving todos",error)
      return NextResponse.json(
        { message: "Error saving todos" },
        { status: 401 }
      );
    }

    return NextResponse.json({ todos: generatedTodos.todos }, { status: 200 });
  } catch (error) {
    console.log("Error Generating Prompt", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
