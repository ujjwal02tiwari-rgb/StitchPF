import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, handle } = body;

    if (!email || !handle) {
      return NextResponse.json(
        { error: "Email and handle are required." },
        { status: 400 }
      );
    }

    let userId: string;

    const user = await prisma.user.upsert({
      where: { email }, // must be UNIQUE in your schema
      update: {},
      create: {
        handle,
        email,
        
        name: body.name ?? handle,
      },
    });

    userId = user.id;

    return NextResponse.json({ userId }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
