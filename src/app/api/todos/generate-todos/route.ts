
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    const {userId}  = await auth();

    if(!userId){
        return new Response("Unauthorized", {status:401})
    }

    const {generateTodo} = await request.json()

    console.log(generateTodo)

    try {
        
        return NextResponse.json({todos: "213"},{status:200})
    } catch (error) {
        
    }

    

}