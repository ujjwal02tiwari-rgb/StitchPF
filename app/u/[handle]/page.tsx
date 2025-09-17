import ProfileCard, { ProfileData } from "@/components/ProfileCard";

async function getProfile(handle: string): Promise<{ status: number; data: any }> {
  try {
    const res = await fetch(`/api/profile/${handle}`, {
      cache: "no-store",
    });

    let json: any = null;
    try {
      json = await res.json();
    } catch {
      // ignore parse error
    }

    return { status: res.status, data: json };
  } catch (err: any) {
    return { status: 500, data: { error: err.message } };
  }
}

type ProfilePageProps = {
  params: { handle: string };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const result = await getProfile(params.handle);

  if (result.status !== 200) {
    return (
      <main className="min-h-screen flex items-center justify-center p-10 text-white">
        <div>
          <h1 className="text-2xl font-bold">Error fetching profile</h1>
          <p>Status: {result.status}</p>
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      </main>
    );
  }

  const data: ProfileData = result.data;

  return (
    <main className="min-h-screen flex items-center justify-center py-10 px-5">
      <ProfileCard data={data} />
    </main>
  );
}
