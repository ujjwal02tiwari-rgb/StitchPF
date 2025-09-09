

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ProfileSchema = z.object({
  handle: z.string().min(2).max(32).regex(/^[a-z0-9_]+$/i),
  fullName: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().max(280).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional(),
  avatar: z.string().optional(),
  theme: z.enum(["ocean", "aurora", "sunset", "galaxy"]).optional(),
  accent: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).optional(),
});

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = ProfileSchema.parse(payload);
    const handle = data.handle.toLowerCase();

  const profile = await prisma.profile.upsert({
  where: { handle },
  update: {
    fullName: data.fullName,
    title: data.title,
    theme: data.theme ?? 'ocean',
    accent: data.accent ?? '#22d3ee',
    ...(data.bio ? { bio: data.bio } : {}),
    ...(data.location ? { location: data.location } : {}),
    ...(data.website ? { website: data.website } : {}),
    ...(data.avatar ? { avatar: data.avatar } : {}),
  },
  create: {
    handle,
    fullName: data.fullName,
    title: data.title,
    theme: data.theme ?? 'ocean',
    accent: data.accent ?? '#22d3ee',
    ...(data.bio ? { bio: data.bio } : {}),
    ...(data.location ? { location: data.location } : {}),
    ...(data.website ? { website: data.website } : {}),
    ...(data.avatar ? { avatar: data.avatar } : {}),
  },
});


    return NextResponse.json({ ok: true, handle: profile.handle }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Invalid payload" }, { status: 400 });
  }
}

