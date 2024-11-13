import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";


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

