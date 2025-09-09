import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/*
 * API route to create or update a profile.
 *
 * Accepts JSON with:
 *  - handle (string): unique identifier (required)
 *  - fullName (string): person's name (required)
 *  - title (string): headline or job title (required)
 *  - bio (string): optional biography
 *  - location (string): optional location
 *  - website (string): optional URL
 *  - avatar (string): optional base64 avatar
 *  - theme (string): "ocean" | "aurora" | "sunset" | "galaxy" (optional)
 *  - accent (string): hex colour (optional)
 *
 * If a profile exists, it updates it; otherwise it creates a new one.
 */

const ProfileSchema = z.object({
  handle: z
    .string()
    .min(2)
    .max(32)
    .regex(/^[a-z0-9_]+$/i, {
      message: "Handle may only contain letters, numbers and underscores",
    }),
  fullName: z.string().min(1, { message: "Full name cannot be empty" }),
  title: z.string().min(1, { message: "Title cannot be empty" }),
  bio: z.string().max(280).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url({ message: "Website must be a valid URL" }).optional(),
  avatar: z.string().optional(),
  theme: z.enum(["ocean", "aurora", "sunset", "galaxy"]).optional(),
  accent: z
    .string()
    .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, {
      message: "Accent must be a valid hex colour",
    })
    .optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = ProfileSchema.parse(payload);

    // normalise handle to lowercase to ensure case-insensitive uniqueness
    const handle = data.handle.toLowerCase();

    // insert or update the profile
    const profile = await prisma.profile.upsert({
      where: { handle },
      update: {
        fullName: data.fullName,
        title: data.title,
        bio: data.bio ?? null,
        location: data.location ?? null,
        website: data.website ?? null,
        avatar: data.avatar ?? null,
        theme: data.theme ?? "ocean",
        accent: data.accent ?? "#22d3ee",
      },
      create: {
        handle,
        fullName: data.fullName,
        title: data.title,
        bio: data.bio ?? null,
        location: data.location ?? null,
        website: data.website ?? null,
        avatar: data.avatar ?? null,
        theme: data.theme ?? "ocean",
        accent: data.accent ?? "#22d3ee",
      },
    });

    // respond with OK and the handle (used by the client to build /u/{handle})
    return NextResponse.json({ ok: true, handle: profile.handle }, { status: 200 });
  } catch (err: any) {
    // return error details if validation or DB upsert fails
    return NextResponse.json(
      { ok: false, error: err.message ?? "Invalid data" },
      { status: 400 },
    );
  }
}
