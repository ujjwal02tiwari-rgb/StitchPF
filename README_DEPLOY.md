# Deploying LinkGlyph on Vercel (Single Repo)

## 1) Create a Postgres Database
Use Neon, Supabase, or another managed PostgreSQL provider. Copy the connection string.

## 2) Configure Vercel Environment Variables
- `DATABASE_URL` – your Postgres connection string (include `sslmode=require` if needed).
- `NEXT_PUBLIC_SITE_URL` – your deployed domain (e.g. https://your-app.vercel.app).

## 3) Deploy the Repository
Vercel will:
- Run `postinstall` (`prisma generate && prisma db push`) to create tables if necessary.
- Run `build` (`prisma generate && next build`).
- Serve your Next.js app via serverless functions.

## 4) Verify Deployment
Check `/api/health` to confirm the API returns `ok`.
