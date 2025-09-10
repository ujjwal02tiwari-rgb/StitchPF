import { Prisma } from "@prisma/client";

const updateData: Prisma.ProfileUpdateInput = {
  name: data.fullName,
  title: data.title,
  bio: data.bio ?? undefined,        // use undefined to skip update
  location: data.location ?? undefined,
  // avatar, theme, accent ... (whatever fields actually exist)
};

await prisma.profile.upsert({
  where: { handle },
  update: updateData,
  create: { handle, ...updateData },
});

