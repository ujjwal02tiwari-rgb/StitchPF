import { notFound } from "next/navigation";
import ProfileCard, { ProfileData } from "@/components/ProfileCard";

async function getProfile(handle: string): Promise<ProfileData | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window === "undefined" ? process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` : window.location.origin) ||
    "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/profile/${handle}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const profile = await res.json();

    return {
      fullName: profile.fullName ?? "",
      bio: profile.bio ?? undefined,
      location: profile.location ?? undefined,
      website: profile.website ?? undefined,
      avatar: profile.avatar ?? undefined,
      theme: profile.theme ?? "ocean",
      accent: profile.accent ?? undefined,
      handle: profile.handle ?? undefined,
    };
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
