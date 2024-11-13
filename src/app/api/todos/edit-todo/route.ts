import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    const {userId}  = await auth();
    const {todoId, title} = await request.json()
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const todo = await prisma.todos.update({
        where: {
            todoId: todoId,
        },
        data: {
          title: title,
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