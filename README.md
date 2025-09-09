# LinkGlyph — Shareable Profile Cards

A fullstack Next.js app (TypeScript, App Router) with Prisma + SQLite that generates beautiful, shareable public profile pages.

## Features
- Live preview as you type (Framer Motion animations)
- Themes (Ocean, Aurora, Sunset, Galaxy) + accent color
- Upload avatar (stored as base64 in DB for simplicity)
- Shareable link at `/u/[handle]`
- Strong input validation (zod) & graceful error handling
- TailwindCSS with glassmorphism + gradient accents

## Stack
- Next.js 14 (App Router, Server Actions)
- Prisma + SQLite
- TailwindCSS, Framer Motion, lucide-react
- TypeScript, Zod

## Quickstart
```
npm i
npm run prisma:push
npm run dev
# open http://localhost:3000
```
