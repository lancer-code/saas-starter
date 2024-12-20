import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";


let ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
  const {userId}  = await auth();

  

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";


  try {
    const todos = await prisma.todos.findMany({
      where: {
        userId: userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const totalTodos = await prisma.todos.count({
      where: {
        userId: userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
        
      },
    });

    const totalTodosCompleted = await prisma.todos.count({
      where: {
        userId: userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
        compeleted: {
          equals: true,
        },
      },
    });
    const totalTodosRemaining = await prisma.todos.count({
      where: {
        userId: userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
        compeleted: {
          equals: false, 
        },
        },
      },
    );

    return NextResponse.json(
      { todos, totalTodos, totalTodosCompleted, totalTodosRemaining },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


