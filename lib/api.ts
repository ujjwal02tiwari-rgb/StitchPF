import { ProfileData } from '@/components/ProfileCard';

/**
 * The payload we send to the backend API when saving a profile.
 * Matches the fields in your Prisma `Profile` model (minus `title` which we removed).
 */
export type SaveProfilePayload = {
  email: string;
  handle: string;
  fullName: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  theme?: string;
  accent?: string;
};

/**
 * Call the API to save a profile
 */
export async function saveProfile(payload: SaveProfilePayload): Promise<{ handle: string }> {
  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to save profile: ${res.statusText}`);
  }

  return res.json();
}
