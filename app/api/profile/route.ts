import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, handle, fullName, bio, location, website, avatar, theme, accent } = body;

    if (!email || !handle) {
      return NextResponse.json({ error: "Email and handle are required" }, { status: 400 });
    }

    const profile = await prisma.profile.upsert({
      where: { handle },
      update: {
        fullName,
        bio,
        location,
        website,
        avatar,
        theme: theme || "ocean",
        accent,
      },
      create: {
        handle,
        fullName,
        bio,
        location,
        website,
        avatar,
        theme: theme || "ocean",
        accent,
        user: {
          connectOrCreate: {
            where: { email },
            create: {
              email,
              handle,
              name: fullName,
            },
          },
        },
      },
    });

    return NextResponse.json(profile, { status: 200 });
  } catch (err: any) {
    console.error("Error saving profile:", err);

    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Handle already exists. Please choose another." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
