import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
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
 *  - userId (string): OPTIONAL if you also send it via `x-user-id` header
 *
 * If a profile exists (by handle), it updates it; otherwise it creates a new one.
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
  // allow passing userId in payload; alternatively use x-user-id header
  userId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const data = ProfileSchema.parse(payload);

    // Resolve the userId: body -> x-user-id header -> first existing user (fallback)
    const headerUserId = headers().get("x-user-id") ?? undefined;
    let userId = data.userId ?? headerUserId ?? undefined;

    if (!userId) {
      // Try to use any existing user as a sensible fallback for local/dev
      const anyUser = await prisma.user.findFirst({ select: { id: true } });
      if (anyUser) {
        userId = anyUser.id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing user id. Provide `userId` in the request body or `x-user-id` header, or seed a User record.",
        },
        { status: 401 },
      );
    }

    // normalise handle to lowercase to ensure case-insensitive uniqueness
    const handle = data.handle.toLowerCase();

    // insert or update the profile
    const profile = await prisma.profile.upsert({
      where: { handle }, // ensure `handle` is @unique in your Prisma schema
      update: {
        fullName: data.fullName ?? undefined,
        title: data.title ?? undefined,
        bio: data.bio ?? undefined,
        location: data.location ?? undefined,
        website: data.website ?? undefined,
        avatar: data.avatar ?? undefined,
        // On update, only change theme/accent when provided
        theme: data.theme ?? undefined,
        accent: data.accent ?? undefined,
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

        // ✅ REQUIRED relation: connect the profile to its user
        user: { connect: { id: userId } },
        // (If your Profile model exposes `userId` scalar, you could use `userId` instead.)
      },
      include: { user: { select: { id: true } } },
    });

    // respond with OK and the handle (used by the client to build /u/{handle})
    return NextResponse.json(
      { ok: true, handle: profile.handle, userId: profile.user.id },
      { status: 200 },
    );
  } catch (err: any) {
    const message =
      err?.name === "ZodError"
        ? err.issues?.[0]?.message || "Invalid data"
        : err?.message || "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
