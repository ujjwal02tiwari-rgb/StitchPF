import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      handle,
      fullName,
      title,
      bio,
      location,
      website,
      avatar,
      theme,
      accent,
    } = body;

    if (!email || !handle || !fullName || !title) {
      return NextResponse.json(
        { error: "Email, handle, fullName, and title are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { email }, // email must be unique in your schema
      update: {
        handle,
        name: fullName,
        title,
        bio,
        location,
        website,
        avatar,
        theme,
        accent,
      },
      create: {
        email,
        handle,
        name: fullName,
        title,
        bio,
        location,
        website,
        avatar,
        theme,
        accent,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error in /api/profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
