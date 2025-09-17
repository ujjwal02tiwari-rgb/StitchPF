import { notFound } from "next/navigation";
import ProfileCard, { ProfileData } from "@/components/ProfileCard";

async function getProfile(handle: string): Promise<ProfileData | null> {
  try {
    const url = `/api/profile/${handle}`;
    console.log("Fetching profile from:", url); // ✅ log URL

    const res = await fetch(url, { cache: "no-store" });

    console.log("Response status:", res.status); // ✅ log status

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    const data = await res.json();
    console.log("Profile data:", data); // ✅ log payload

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

  if (!data) {
    console.log("No profile found for handle:", params.handle);
    return notFound();
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-10 px-5">
      <ProfileCard data={data} />
    </main>
  );
}
