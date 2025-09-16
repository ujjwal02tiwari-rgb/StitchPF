import { ProfileData } from '@/components/ProfileCard';

/**
 * Payload sent when saving a profile.
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
 * Save or update a profile via the API.
 * Always throws with a meaningful error if saving fails.
 */
export async function saveProfile(payload: SaveProfilePayload): Promise<{ handle: string }> {
  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to save profile');
  }

  if (!data.handle) {
    throw new Error('Profile response missing handle');
  }

  return data;
}
