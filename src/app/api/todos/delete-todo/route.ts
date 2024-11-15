import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(request: NextRequest) {
    const {userId}  = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const {todoId} = await request.json()

  
    try {
      const todo = await prisma.todos.delete({
        where: {
            todoId: todoId,
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