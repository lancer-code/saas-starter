import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import exp from "constants";
import { use } from "react";

export default async function POST(request: NextResponse) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User Not found" }, { status: 401 });
    }

    const subscriptionEndsDate = new Date();
    subscriptionEndsDate.setMonth(subscriptionEndsDate.getMonth() + 1);

    const updateUser = await prisma.user.update({
      where: { userId: userId },
      data: { subscriptionEnds: subscriptionEndsDate, isSubscribed: true },
    });

    if (!updateUser) {
      throw new Error();
    }

    return NextResponse.json(
      { message: "Subscribed Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Internal Server Error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



export async function GET(request:NextResponse) {

    const {userId} = auth()

    if(!userId){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    try {
        
        const user = await prisma.user.findUnique({
            where:{
                userId:userId
            }
        })

        if(!user){
            return NextResponse.json({error:"User not found"}, {status:401})
        }

        if (!user.isSubscribed) {
            return NextResponse.json({ error: "User is not subscribed" }, { status: 401 });
        }

        const currentDate = new Date();

        if (user.subscriptionEnds && user.subscriptionEnds < currentDate) {
            
            const updateUser = await prisma.user.update({
                where:{userId:userId},
                data:{
                    isSubscribed:false,
                    subscriptionEnds:null
                }
            })

            if (!updateUser) {
                throw new Error();
            }
        }

        return NextResponse.json({message:"Subscribed Canceled Successfully"}, {status:200})

    } catch (error) {
        console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 })
    }
}
