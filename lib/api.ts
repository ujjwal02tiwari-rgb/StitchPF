
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

export async function saveProfile(formData: ProfileFormValues) {
  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'Failed to save');
  return json; 
}
