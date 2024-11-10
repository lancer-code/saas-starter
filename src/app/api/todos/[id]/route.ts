import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { use } from "react";

let ITEMS_PER_PAGE = 10;

export default async function GET(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = searchParams.get("page") || "1";

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
        createdAt: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip: (Number(page) - 1) * ITEMS_PER_PAGE,
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

    const totalPages = Math.ceil(totalTodos / ITEMS_PER_PAGE);

    return NextResponse.json(
      { todos, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  try {
    const todo = await prisma.todos.update({
      where: {
        userId: id,
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

export async function DELETE(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  try {
    const todo = await prisma.todos.delete({
      where: {
        userId: id,
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

    if (!user.isSubscribed && user.todos.length >= 3) {
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
