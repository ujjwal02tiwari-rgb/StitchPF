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
    if (!res.ok) {
      console.error("API error:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();

    // Defensive check: ensure handle exists
    if (!json?.handle) {
      console.error("Invalid API response:", json);
      return null;
    }

    return json as ProfileData;
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
    // Instead of black 404, show a friendly message
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
          <p>Handle: {params.handle}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-10 px-5">
      <ProfileCard data={data} />
    </main>
  );
}
