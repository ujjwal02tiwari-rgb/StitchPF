import { notFound } from "next/navigation";
import ProfileCard from "@/components/ProfileCard";
import { prisma } from "@/lib/prisma";
import { mapProfile } from "@/lib/profileMapper";

type ProfilePageProps = {
  params: { handle: string };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await prisma.profile.findUnique({
    where: { handle: params.handle },
  });

  if (!profile) return notFound();

  const data = mapProfile(profile);

  return (
    <main className="min-h-screen flex items-center justify-center py-10 px-5">
      <ProfileCard data={data} />
    </main>
  );
}
