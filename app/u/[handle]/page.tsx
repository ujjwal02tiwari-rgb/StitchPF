import { notFound } from "next/navigation";
import ProfileCard, { ProfileData } from "@/components/ProfileCard";

async function getProfile(handle: string): Promise<ProfileData | null> {
  try {
    // ✅ use relative URL with "absolute" option so Next.js resolves correctly
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/profile/${handle}`, {
      cache: "no-store",
      // Force internal resolution (works in Vercel prod + dev)
      next: { revalidate: 0 },
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      console.error("API error:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();

    const profile: ProfileData = {
      fullName: data.fullName ?? "",
      bio: data.bio ?? undefined,
      location: data.location ?? undefined,
      website: data.website ?? undefined,
      avatar: data.avatar ?? undefined,
      theme: data.theme ?? "ocean",
      accent: data.accent ?? undefined,
      handle: data.handle,
    };

    return profile;
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
