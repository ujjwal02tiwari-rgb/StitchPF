import { Profile } from "@prisma/client";
import { ProfileData } from "@/components/ProfileCard";

// Convert Prisma model → ProfileData used by frontend
export function mapProfile(profile: Profile): ProfileData {
  return {
    fullName: profile.fullName ?? "",
    bio: profile.bio ?? undefined,
    location: profile.location ?? undefined,
    website: profile.website ?? undefined,
    avatar: profile.avatar ?? undefined,
    theme: profile.theme ?? "ocean",
    accent: profile.accent ?? undefined,
    handle: profile.handle,
  };
}
