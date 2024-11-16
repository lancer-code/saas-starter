
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    const {userId}  = await auth();

    if(!userId){
        return new Response("Unauthorized", {status:401})
    }

    const data = await request.json()

    console.log("Prompt23",data.prompt)

    try {
        
        return NextResponse.json({todos: "213"},{status:200})
    } catch (error) {
        console.log("Error Generating Prompt", error)
        return new Response("Internal Server Error", {status:500})
    }
}