'use client';

import { notFound } from 'next/navigation';
import ProfileCard, { ProfileData } from '@/components/ProfileCard';
import { prisma } from '@/lib/prisma';

type ProfilePageProps = {
  params: { handle: string };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await prisma.profile.findUnique({
    where: { handle: params.handle },
  });

  if (!profile) return notFound();

  const data: ProfileData = {
    fullName: profile.fullName ?? '',
    bio: profile.bio ?? undefined,
    location: profile.location ?? undefined,
    website: profile.website ?? undefined,
    avatar: profile.avatar ?? undefined,
    theme: profile.theme ?? 'ocean',
    accent: profile.accent ?? undefined,
    handle: profile.handle ?? undefined,
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-10 px-5">
      <ProfileCard data={data} />
    </main>
  );
}
