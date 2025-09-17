import { notFound } from "next/navigation";
import ProfileCard, { ProfileData } from "@/components/ProfileCard";

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

async function getProfile(handle: string): Promise<ProfileData | null> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/profile/${handle}`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (res.status === 404) return null;
    if (!res.ok) return null;

    // ✅ trust API response
    const data = await res.json();
    return data as ProfileData;
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

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Profile not found</h1>
        <p>Handle: {params.handle}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-10 px-5">
      <ProfileCard data={data} />
    </main>
  );
}
