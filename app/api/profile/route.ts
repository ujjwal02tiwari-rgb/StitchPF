import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming body:", body);

    const { email, handle, fullName, bio, location, website, avatar, theme, accent } = body;

    if (!email || !handle) {
      return NextResponse.json({ error: "Email and handle are required" }, { status: 400 });
    }

    // Upsert Profile linked to a User
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

    // Prisma error codes
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Handle already exists. Please choose another." },
        { status: 400 }
      );
    }

    if (err.code === "P2003") {
      return NextResponse.json(
        { error: "User relation failed. Check userId / email." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Failed to save profile" },
      { status: 500 }
    );
  }
}
