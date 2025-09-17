export default async function ProfilePage({ params }: { params: { handle: string } }) {
  try {
    // Use relative fetch (works in server components)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/profile/${params.handle}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return <h1>Error fetching profile: {res.status}</h1>;
    }

    const data = await res.json();

    return (
      <main className="min-h-screen flex items-center justify-center py-10 px-5">
        <pre className="text-white">{JSON.stringify(data, null, 2)}</pre>
      </main>
    );
  } catch (err: any) {
    return <h1>Error: {err.message}</h1>;
  }
}
