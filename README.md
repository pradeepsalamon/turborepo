# Book My Show Monorepo

This repository contains:

- `apps/web`: Next.js frontend
- `apps/api`: NestJS API with Prisma
- `postgres`: PostgreSQL for local and containerized deployments

## Production-ready changes in this repo

- Frontend API calls now use `NEXT_PUBLIC_API_URL`
- API CORS now uses `FRONTEND_URL`
- Auth cookies now switch to secure production settings automatically
- Next.js is configured for standalone production builds

## Environment variables

Use these sample files as your starting point:

- `apps/web/.env.example`
- `apps/api/.env.example`
- `.env.production.example`

Minimum values you should set for a real deployment:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
FRONTEND_URL=https://your-domain.com
JWT_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgresql://postgres:postgrespassword@postgres:5432/bookmyshow
COOKIE_SECURE=true
COOKIE_DOMAIN=your-domain.com
```

## Local development

Run the apps:

```sh
npm install
npm run dev
```

Frontend:

- `http://localhost:3000`

API:

- `http://localhost:3001`

## Recommended deployment shape

If you deploy on a VPS or cloud VM:

1. Put Nginx or Caddy in front of the app.
2. Run the web app on port `3000`.
3. Run the API on port `3001`.
4. Enable HTTPS.
5. Set `COOKIE_SECURE=true`.
6. Set `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` to the real HTTPS domains.

## Verification

Before deploying, run:

```sh
npm run build
npm run check-types
```
