import { prisma } from "@/lib/prisma";
import ProfileCard from "@/components/ProfileCard";

export const dynamic = "force-dynamic";
export const revalidate = 0; 


export default async function UserProfile({ params }: { params: { handle: string } }) {
  const profile = await prisma.profile.findUnique({
    where: { handle: params.handle.toLowerCase() }
  });

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Profile not found</h1>
          <p className="text-slate-300/90 mt-2">This handle doesn’t exist yet.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="max-w-3xl mx-auto px-5 py-14">
        <ProfileCard data={{
          fullName: profile.fullName,
          title: profile.title,
          bio: profile.bio ?? undefined,
          location: profile.location ?? undefined,
          website: profile.website ?? undefined,
          avatar: profile.avatar ?? undefined,
          theme: profile.theme,
          accent: profile.accent,
          handle: profile.handle,
        }} />
        <div className="mt-6 text-center text-slate-300/80">
          Share: <code className="bg-white/10 px-2 py-1 rounded">{`${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''}/u/${profile.handle}`}</code>
        </div>
      </section>
    </main>
  );
}
