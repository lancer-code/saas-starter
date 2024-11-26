import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../../../../lib/prisma";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const GEMINI_KEY = process.env.GEMINI_KEY as string;

  if (!userId) {
      return NextResponse.json(
          { message: "Unauthorized" },
          { status: 401 }
      );
  }

  if (!GEMINI_KEY) {
      return NextResponse.json(
          { message: "Missing API key" },
          { status: 500 }
      );
  }

  const schema = {
    type: "object",
    properties: {
      todos: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            userId: {
              type: "string",
            },
          },
          required: ["title", "userId"],
        },
      },
    },
    required: ["todos"],
  };

  try {
      const { prompt } = await request.json();
      
      if (!prompt) {
          return NextResponse.json(
              { message: "Prompt is required" },
              { status: 400 }
          );
      }

      const genAI = new GoogleGenerativeAI(GEMINI_KEY);
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

      // Generate content with better error handling
      let generatedTodos;
      try {
          const result = await model.generateContent(`
              This is a todo application which user used to create and manage their todos, 
              the user will give prompts like make list of things that should pack before going to travel, etc. 
              so your job is to generate list of todos and in userId out this id ${userId} there in each todo. 
              Break the list in separated short todos to display them at the front end. 
              Below is the prompt that is typed by the user.
              
              User Prompt: ${prompt}
          `);

          generatedTodos = JSON.parse(result.response.text());
      } catch (error) {
          console.error("Error generating/parsing AI response:", error);
          return NextResponse.json(
              { message: "Error generating todos" },
              { status: 500 }
          );
      }

      // Save todos with better error handling
      try {
          const saveTodos = await prisma.todos.createMany({
              data: generatedTodos.todos,
          });

          if (!saveTodos) {
              throw new Error("Failed to save todos to database");
          }

          return NextResponse.json(
              { todos: generatedTodos.todos },
              { status: 200 }
          );
      } catch (error) {
          console.error("Database error:", error);
          return NextResponse.json(
              { message: "Error saving todos to database" },
              { status: 500 }
          );
      }
  } catch (error) {
      console.error("General error:", error);
      return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
      );
  }
}
