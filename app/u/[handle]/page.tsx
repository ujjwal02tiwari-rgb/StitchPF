import { notFound } from "next/navigation";
import ProfileCard, { ProfileData } from "@/components/ProfileCard";

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

async function getProfile(handle: string): Promise<ProfileData | null> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/profile/${handle}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json", // ✅ ensures correct response
      },
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      console.error("API error:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();

    // ✅ Map API response to ProfileData
    const data: ProfileData = {
      fullName: json.fullName ?? "",
      bio: json.bio ?? undefined,
      location: json.location ?? undefined,
      website: json.website ?? undefined,
      avatar: json.avatar ?? undefined,
      theme: json.theme ?? "ocean",
      accent: json.accent ?? undefined,
      handle: json.handle,
    };

    return data;
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
