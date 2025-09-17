import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProfileData } from "@/components/ProfileCard";

export async function GET(
  req: Request,
  { params }: { params: { handle: string } }
) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { handle: params.handle },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Map to ProfileData shape
    const data: ProfileData = {
      fullName: profile.fullName ?? "",
      bio: profile.bio ?? undefined,
      location: profile.location ?? undefined,
      website: profile.website ?? undefined,
      avatar: profile.avatar ?? undefined,
      theme: profile.theme ?? "ocean",
      accent: profile.accent ?? undefined,
      handle: profile.handle,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching profile:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
