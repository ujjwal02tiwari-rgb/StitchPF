
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ProfileSchema = z.object({
  handle: z.string().min(2).max(32).regex(/^[a-z0-9_]+$/i),
  name: z.string().min(1),
  email: z.string().email().optional(),
  avatarB64: z.string().optional(), // keep base64 for now
  title: z.string().min(1),
  bio: z.string().max(280),
  theme: z.enum(['ocean', 'aurora', 'sunset', 'galaxy']),
  accentHex: z.string().regex(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i),
  cardSlug: z.string().min(2).max(48).regex(/^[a-z0-9-]+$/i),
  links: z.array(z.object({ label: z.string().min(1), url: z.string().url() })).max(12),
});

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = ProfileSchema.parse(payload);

    const user = await prisma.user.upsert({
      where: { handle: data.handle },
      create: {
        handle: data.handle,
        name: data.name,
        email: data.email,
        avatarB64: data.avatarB64,
      },
      update: {
        name: data.name,
        email: data.email,
        avatarB64: data.avatarB64 ?? undefined,
      },
      select: { id: true },
    });

    const profile = await prisma.profile.upsert({
      where: { cardSlug: data.cardSlug },
      update: {
        title: data.title,
        bio: data.bio,
        theme: data.theme,
        accentHex: data.accentHex,
        userId: user.id,
        links: {
          deleteMany: {}, 
          create: data.links.map(l => ({ label: l.label, url: l.url })),
        },
      },
      create: {
        title: data.title,
        bio: data.bio,
        theme: data.theme,
        accentHex: data.accentHex,
        cardSlug: data.cardSlug,
        userId: user.id,
        links: { create: data.links.map(l => ({ label: l.label, url: l.url })) },
      },
      include: { links: true },
    });

    return NextResponse.json({ ok: true, profile }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Invalid payload' }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ ok: false, error: 'Missing slug' }, { status: 400 });

  const profile = await prisma.profile.findUnique({
    where: { cardSlug: slug },
    include: { user: true, links: true },
  });

  if (!profile) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, profile });
}
