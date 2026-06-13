# Dub Profile

**The recruiting profile for youth athletes — "LinkedIn for kids' sports."**

Parents build one master profile for their child that spans every sport they play,
drill into each sport for stats, highlights, level, and practice details, and set a
discreet availability status ("Open to Offers" / "On the Radar" / "Locked In") so
coaches can find players who are actually looking.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Marketing landing page (parent + coach paths) |
| `athlete.html` | Master multi-sport profile. Drill into any sport. Supports `?id=<athlete>` |
| `sport.html` | Sport-specific page: stats, highlight reel, level/tier, practice, status. Uses `?athlete=<id>&sport=<key>`, with a Back-to-master link |
| `discover.html` | Coach/manager dashboard: filter by sport, level, location, age, and availability; shortlist athletes and reach out one-by-one or in bulk |

## How it's built

Plain static **HTML + CSS + vanilla JS** — no build step, no framework, no dependencies.
Deploys anywhere static (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

- `styles.css` — design system (dark, electric, athletic "trading-card" look)
- `data.js` — shared mock data: sports config + sample athletes. In production this is replaced by your API.
- `app.js` — client-side rendering for the athlete/sport/discover pages plus all interactions (filters, shortlist, reach-out modal, mobile nav)
- `assets/favicon.svg` — logo mark

Fonts (Anton + Archivo + Plus Jakarta Sans) load from Google Fonts; the design falls
back to system fonts gracefully if they're unavailable.

## Run locally

It's static, so just open `index.html` — or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

**GitHub Pages:** push to your default branch and enable Pages (Settings → Pages → deploy from branch, root).
**Netlify / Vercel / Cloudflare Pages:** point the project at this repo; no build command, publish directory is the repo root.

## What's a prototype vs. production

This is a high-fidelity front-end prototype. The flows, filtering, and drill-down are
real and interactive, but data is mocked in `data.js` and "reach out" / "message"
actions show confirmation toasts rather than sending anything. The next step is wiring
these pages to a backend (accounts for parents and coaches, real profiles, messaging/SMS,
and approval of coach connections).
