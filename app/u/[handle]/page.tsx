import { notFound } from "next/navigation";
import ProfileCard, { ProfileData } from "@/components/ProfileCard";

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    // On Vercel, e.g. stitch-xxxxx.vercel.app
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback for local dev
  return "http://localhost:3000";
}

async function getProfile(handle: string): Promise<ProfileData | null> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/profile/${handle}`;
  console.log("Fetching from:", url);

  try {
    const res = await fetch(url, { cache: "no-store" });

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
