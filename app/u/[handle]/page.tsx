import prisma from '@/lib/prisma';
import ProfileCard from '@/components/ProfileCard';
import { notFound } from 'next/navigation';

type PageProps = { params: { handle: string } };

export const revalidate = 60; // optional ISR

export default async function UserProfilePage({ params }: PageProps) {
  const handle = params.handle.toLowerCase();

  const profile = await prisma.profile.findUnique({
    where: { handle },
    select: {
      handle: true,
      fullName: true,
      title: true,
      bio: true,
      location: true,
      website: true,
      avatar: true,
      theme: true,
      accent: true,
    },
  });

  if (!profile) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <section className="max-w-3xl mx-auto px-5 py-14">
        <ProfileCard
          data={{
            fullName: profile.fullName ?? '',   // <- coerce from string|null to string
            title: profile.title ?? '',         // <- coerce
            bio: profile.bio ?? undefined,
            location: profile.location ?? undefined,
            website: profile.website ?? undefined,
            avatar: profile.avatar ?? undefined,
            theme: profile.theme ?? 'ocean',
            accent: profile.accent ?? '#22d3ee',
            handle: profile.handle ?? handle,
          }}
        />
      </section>
    </main>
  );
}
