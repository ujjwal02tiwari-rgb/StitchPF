import { ProfileData } from "@/components/ProfileCard";

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
  const res = await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  // Support both { profile: {...} } and flat {...}
  const profile = data.profile || data;

  if (!res.ok) {
    throw new Error(profile.error || "Failed to save profile");
  }

  if (!profile.handle) {
    throw new Error("Profile response missing handle");
  }

  return profile;
}
