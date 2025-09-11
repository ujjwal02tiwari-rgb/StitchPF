
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

export async function saveProfile(payload: ProfileFormValues) {
  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': process.env.NEXT_PUBLIC_USER_ID || '',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to save');
  }
  return res.json();
}

