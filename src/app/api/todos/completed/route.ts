import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    const { userId } = auth();
    const {todoId} = await request.json()
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { id } = await request.json();
  
    try {
      const todo = await prisma.todos.update({
        where: {
            todoId: todoId,
        },
        data: {
          compeleted: true,
        },
      });
  
      return NextResponse.json({ todo }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }