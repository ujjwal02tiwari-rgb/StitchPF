

export type ProfileFormValues = {
  handle: string;
  fullName: string;
  title: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  theme?: "ocean" | "aurora" | "sunset" | "galaxy";
  accent?: string;
};


export type SaveProfilePayload = ProfileFormValues & { email: string };

export async function saveProfile(values: SaveProfilePayload) {
  const res = await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to save profile");
  }

  
  return res.json() as Promise<{ handle: string }>;
}
