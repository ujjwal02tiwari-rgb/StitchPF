import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { handle, fullName, bio, location, website, avatar, theme, accent } = body;

    if (!handle) {
      return NextResponse.json({ error: "Missing handle" }, { status: 400 });
    }

    const updatedProfile = await prisma.profile.update({
      where: { handle },
      data: {
        fullName,
        bio,
        location,
        website,
        avatar,
        theme,
        accent,
      },
    });

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (err) {
    console.error("Error updating profile:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
