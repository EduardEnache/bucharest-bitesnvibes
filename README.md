<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,55:1f2a44,100:3b82f6&height=200&section=header&text=Bucure%C8%99ti%20Bites%20%C2%B7%20Vibes&fontSize=46&fontColor=ffffff&fontAlignY=36&desc=A%20self-hosted%2C%20mobile-first%20guide%20to%20the%20city%27s%20food%20and%20drink&descSize=16&descAlignY=58&animation=fadeIn" width="100%" alt="București Bites & Vibes"/>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google%20Maps-Places%20API-4285F4?style=flat-square&logo=googlemaps&logoColor=white)

<sub><a href="#-what-it-is">What it is</a> &nbsp;·&nbsp; <a href="#-features">Features</a> &nbsp;·&nbsp; <a href="#-architecture">Architecture</a> &nbsp;·&nbsp; <a href="#-data-model">Data model</a> &nbsp;·&nbsp; <a href="docs/SETUP.md">Setup guide</a></sub>

</div>

<br/>

> Every city-dweller keeps a mental list of "places I should try". This app makes it a real one:
> restaurants, coffee shops, pubs and bars in Bucharest, pulled from Google Places, tracked from *to try*
> to *favourite*, organised into lists, rated, and shown on a live map. Built to run on your own box, for you and the friends you invite.

## ◆ &nbsp;What it is

A full-stack Next.js App Router application with a PostgreSQL database, Google sign-in restricted to an
allow-list of accounts, and Google Places as the source of truth for venue details. It ships as three containers
(app, database, nginx) plus an optional Cloudflare Tunnel, so it can be reached from anywhere without opening ports.

## ◆ &nbsp;Features

<table>
  <tr>
    <td width="33%" valign="top">
      <h4>📍 Add from Google</h4>
      <p>Autocomplete search or paste a Maps link; name, address, coordinates, hours, rating, price level and photos are pulled from the Places API.</p>
    </td>
    <td width="33%" valign="top">
      <h4>✅ Track every venue</h4>
      <p>To try, visited, not going or favourite, with your own rating, visit date and notes next to Google's numbers.</p>
    </td>
    <td width="33%" valign="top">
      <h4>🗺️ Live map</h4>
      <p>Every venue as a pin, filterable by type, status and neighbourhood, with a quick-look popup.</p>
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top">
      <h4>🗂️ Lists</h4>
      <p>Curated collections ("date night", "best flat white"), private or shared.</p>
    </td>
    <td width="33%" valign="top">
      <h4>📰 Activity feed</h4>
      <p>A timeline of what was added, rated, visited and favourited.</p>
    </td>
    <td width="33%" valign="top">
      <h4>🔐 Invite-only</h4>
      <p>NextAuth with Google OAuth; only e-mails on the allow-list can sign in.</p>
    </td>
  </tr>
</table>

## ◆ &nbsp;Architecture

```mermaid
flowchart LR
    U["Phone / desktop"] -->|HTTPS| CF["Cloudflare Tunnel<br/>(optional)"]
    CF --> NG["nginx"]
    subgraph Docker Compose
      NG --> APP["Next.js 16<br/>App Router + API routes"]
      APP --> PR["Prisma ORM"]
      PR --> PG[("PostgreSQL 15")]
    end
    APP -->|server key| GP["Google Places API"]
    U -->|browser key| GM["Google Maps JS"]
    APP --> NA["NextAuth<br/>Google OAuth + allow-list"]
```

- **App Router + route handlers.** Pages for dashboard, directory, map, lists, activity and settings; JSON APIs under `src/app/api/*` for venues, lists, places and activity.
- **Two Google keys.** A browser key for the map and a restricted server key for Places lookups, so the server key never reaches the client.
- **Client data with SWR**, animations with Framer Motion, styling with Tailwind CSS 4.
- **Migrations and seed** via Prisma; the container entrypoint applies migrations on start.

## ◆ &nbsp;Data model

```mermaid
erDiagram
    VENUE ||--o{ LIST_VENUE : "appears in"
    LIST ||--o{ LIST_VENUE : contains
    VENUE ||--o{ ACTIVITY : "is subject of"
    LIST ||--o{ ACTIVITY : "is subject of"
    VENUE {
      string name
      string type
      enum status "TO_TRY | VISITED | NOT_GOING | FAVORITE"
      float personalRating
      float googleRating
      int priceLevel
      float lat
      float lng
      string neighborhood
    }
    LIST {
      string name
      bool isPublic
    }
    ACTIVITY {
      enum type "ADDED | RATED | VISITED | FAVORITED | ..."
    }
```

## ◆ &nbsp;Run it

```sh
cp .env.example .env          # database, NextAuth, Google OAuth + Maps keys, allow-list
docker compose up -d --build  # app + postgres + nginx on :3000
```

Google Cloud setup (OAuth client, Maps and Places keys), domains, the Cloudflare Tunnel and day-to-day commands are in the
**[setup guide](docs/SETUP.md)**.

## ◆ &nbsp;Tech

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth-000000?style=flat-square&logo=auth0&logoColor=white)
![nginx](https://img.shields.io/badge/nginx-009639?style=flat-square&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare%20Tunnel-F38020?style=flat-square&logo=cloudflare&logoColor=white)

<br/>

<div align="center">
<sub>Built by <a href="https://github.com/EduardEnache"><b>Eduard-Florentin Enache</b></a> &nbsp;·&nbsp; Data · BI · AI product builder</sub>
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3b82f6,45:1f2a44,100:0d1117&height=90&section=footer" width="100%" alt=""/>
</div>
