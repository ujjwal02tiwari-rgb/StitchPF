import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, handle, fullName, bio, location, website, avatar, theme, accent } = body;

    if (!email || !handle) {
      return NextResponse.json({ error: "Email and handle are required" }, { status: 400 });
    }

    // Ensure a User exists for this email
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          handle,
          name: fullName,
        },
      });
    }

    // Create or update Profile for this handle
    const profile = await prisma.profile.upsert({
      where: { handle },
      update: {
        fullName,
        bio,
        location,
        website,
        avatar,
        theme,
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
        userId: user.id,
      },
    });

    return NextResponse.json(profile, { status: 200 });
  } catch (err: any) {
    console.error("Error saving profile:", err);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
