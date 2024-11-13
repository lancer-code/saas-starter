import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(request: NextRequest) {
    const { userId } = auth();
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { title } = await request.json();
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          userId: userId,
        },
        include: {
          todos: true,
        },
      });
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      if (!user.isSubscribed && user.todos.length >= 10) {
        return NextResponse.json(
          { error: "Free Users can only create 3 Todos" },
          { status: 403 }
        );
      }
  
      const todo = await prisma.todos.create({
        data: {
          title,
          userId,
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