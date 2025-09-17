import ProfileCard, { ProfileData } from "@/components/ProfileCard";

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

async function getProfile(handle: string): Promise<any> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/profile/${handle}`;

  const res = await fetch(url, { cache: "no-store" });

  let json: any = null;
  try {
    json = await res.json();
  } catch (err) {
    console.error("Failed to parse JSON:", err);
  }

  return { status: res.status, json };
}

type ProfilePageProps = {
  params: { handle: string };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const result = await getProfile(params.handle);

  return (
    <main className="min-h-screen flex items-center justify-center p-8 text-white">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Debug Profile Page</h1>
        <p>Status: {result.status}</p>
        <pre className="bg-slate-800 p-4 rounded-lg text-sm">
          {JSON.stringify(result.json, null, 2)}
        </pre>
      </div>
    </main>
  );
}
