import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(request: NextRequest) {
  const {userId}  = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { generatedTodos } = await request.json();

  console.log("Save Todos api ", generatedTodos)
  // const transformedTodos = generatedTodos.map(({ todoId, ai, ...rest }) => ({ 
  //   ...rest,
  // }));

  // console.log("transformedTodos",transformedTodos);

  try {
    const saveTodos = await prisma.todos.createMany({
      data: generatedTodos,
    });

    if (!saveTodos) {
      throw new Error("Error saving todos");
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log("Error saving todos", error);
    return NextResponse.json({ status: 500 });
  }
}
