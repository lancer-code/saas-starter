import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { generateTodo } = await request.json();

  const transformedTodos = generateTodo.map(({ todoId, ...rest }) => ({
    userId: userId, 
    ...rest,
  }));

  console.log(transformedTodos);

  try {
    const saveTodos = await prisma.todos.createMany({
      data: transformedTodos,
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
