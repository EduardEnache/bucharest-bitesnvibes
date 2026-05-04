# București Bites & Vibes

A self-hosted, mobile-first web application to manage, track, and discover venues (restaurants, coffee shops, pubs, bars) in Bucharest, Romania.

## Prerequisites

- Docker & Docker Compose installed
- A Google Cloud account (for OAuth and Maps API)

## First-Time Setup

```bash
# Clone or copy the project
cd bucuresti-bites

# Create your environment file
cp .env.example .env
nano .env  # Fill in all values (see below)
```

## Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Go to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Application type: **Web Application**
6. Add Authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret** to your `.env` file

## Google Maps API Setup

1. Go to [console.cloud.google.com/apis](https://console.cloud.google.com/apis)
2. Enable: **Maps JavaScript API**, **Places API**, **Geocoding API**
3. Create an API key, restrict to your domain
4. Add to `.env` (You can use the **same API key** for both during testing):
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_single_key`
   - `GOOGLE_MAPS_SERVER_KEY=your_single_key`
5. Restart the app: `docker compose restart app`

## Domain Setup with Cloudflare

### Option A: Free subdomain (DuckDNS)
1. Register at [duckdns.org](https://duckdns.org) for a free subdomain
2. Add it to Cloudflare as a custom hostname

### Option B: Custom domain (~$10/year)
1. Register a `.ro` or `.com` domain
2. Transfer nameservers to Cloudflare (free plan)

### Cloudflare Tunnel
1. Go to [one.dash.cloudflare.com](https://one.dash.cloudflare.com)
2. Navigate to **Access > Tunnels > Create Tunnel**
3. Name it `bites-tunnel`
4. Copy the tunnel token → paste into `.env` as `CLOUDFLARE_TUNNEL_TOKEN`
5. Configure public hostname: `your-domain.com → http://nginx:80`
6. Set `NEXTAUTH_URL=https://your-domain.com` in `.env`

## Running the Application

```bash
# Start all services
docker compose up -d

# Watch logs
docker compose logs -f app

# First run only — run migrations & seed:
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma db seed
```

## Useful Commands

```bash
# Stop all services
docker compose down

# Rebuild after code changes
docker compose up -d --build

# Access database shell
docker compose exec db psql -U bites_user -d bites_vibes

# View logs for specific service
docker compose logs -f [app|db|nginx|cloudflared]

# Run Prisma Studio (local dev)
npx prisma studio
```

## Updating the App

```bash
git pull
docker compose up -d --build
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS (Obsidian theme) |
| Database | PostgreSQL 15 |
| ORM | Prisma |
| Auth | NextAuth.js v4 (Google OAuth) |
| Maps | Google Maps JavaScript API |
| Animations | Framer Motion |
| Deployment | Docker Compose |
| Reverse Proxy | Nginx |
| Tunnel | Cloudflare Tunnel |
