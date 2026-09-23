# TaskFlow — public site

The public-facing Next.js front end of TaskFlow: landing page, sign-up and login, and a
read-only dashboard showing the logged-in user's projects and tasks.

See the [main README](../README.md) for the full project: architecture, API reference,
setup for all three apps, and known limitations.

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev -- -p 3001
```

Opens on `http://localhost:3001`. The API must be running on port 5000 first.

## Environment variables

| Variable | Purpose | Local value |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the TaskFlow API | `http://localhost:5000/api` |
| `NEXT_PUBLIC_SITE_URL` | This site's own URL, used by `robots.txt` and `sitemap.xml` | `http://localhost:3001` |
