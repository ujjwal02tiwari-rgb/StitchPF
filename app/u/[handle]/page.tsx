import { notFound } from "next/navigation";
import ProfileCard, { ProfileData } from "@/components/ProfileCard";

async function getProfile(handle: string): Promise<ProfileData | null> {
  try {
    // Use relative URL so Next.js routes it internally
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/profile/${handle}`, {
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    return res.json();
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
}

type ProfilePageProps = {
  params: { handle: string };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const data = await getProfile(params.handle);

  if (!data) return notFound();

  return (
    <main className="min-h-screen flex items-center justify-center py-10 px-5">
      <ProfileCard data={data} />
    </main>
  );
}
