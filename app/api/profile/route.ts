// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Try header/body first, otherwise auto-create a user based on handle
    let userId: string | null =
      (req.headers.get('x-user-id') ?? body.userId ?? null) as string | null;

    if (!userId) {
      if (!body.handle) {
        return NextResponse.json({ error: 'Missing handle' }, { status: 400 });
      }
      // email is just to satisfy a UNIQUE field; tweak if your model differs
      const email = `${body.handle}@local.invalid`;

      const user = await prisma.user.upsert({
        where: { email },          // must be UNIQUE in your schema
        update: {},
        create: { handle: body.handle, email },
      });
      userId = user.id;
    }

    // Create/update the profile (handle is UNIQUE on Profile)
    const profile = await prisma.profile.upsert({
      where: { handle: body.handle },
      update: {
        fullName: body.fullName,
        title: body.title,
        bio: body.bio ?? null,
        location: body.location ?? null,
        website: body.website ?? null,
        avatar: body.avatar ?? null,
        theme: body.theme ?? null,
        accent: body.accent ?? null,
        userId,
      },
      create: {
        handle: body.handle,
        fullName: body.fullName,
        title: body.title,
        bio: body.bio ?? null,
        location: body.location ?? null,
        website: body.website ?? null,
        avatar: body.avatar ?? null,
        theme: body.theme ?? null,
        accent: body.accent ?? null,
        userId,
      },
    });

    return NextResponse.json({ handle: profile.handle });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Failed to save profile' },
      { status: 500 }
    );
  }
}
