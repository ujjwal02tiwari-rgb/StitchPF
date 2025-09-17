import { notFound } from "next/navigation";
import ProfileCard, { ProfileData } from "@/components/ProfileCard";

async function getProfile(handle: string): Promise<ProfileData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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

export default function TestPage({ params }: { params: { handle: string } }) {
  return (
    <main className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Handle: {params.handle}</h1>
    </main>
  );
}

