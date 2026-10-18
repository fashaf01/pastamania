# PastaMania Sri Lanka – Web App (v0.1)

Customer-facing web app for PastaMania Sri Lanka, built with React + Vite. Mobile-first, with a bottom tab bar on phones and installable as a home-screen app (PWA manifest included).

## Features

- **Home** – hero, FridayMania banner, signature dishes, events, branches, socials
- **Menu** – per-branch menu (Havelock, Alfred House, One Galle Face) with search and category filters; remembers the selected branch
- **Offers** – FridayMania (weekly BOGO), combos and NTB Amex points vouchers
- **Branches** – address, hours, tap-to-call, Google Maps directions, Uber Eats store link
- **Events** – Christmas menu teaser, Dough Workz kids workshops, catering with an enquiry form (sends by email; WhatsApp optional)
- **Order** button everywhere – opens a branch picker linking to each Uber Eats store and PickMe Food

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Deploy

Any static host works. `vercel.json` is included so client-side routes (`/menu`, `/offers`, …) resolve on Vercel. For Netlify, add a `public/_redirects` file containing `/* /index.html 200`.

## Updating content

All content lives in `src/data/` – no code changes needed for routine updates:

| File | What it holds |
|---|---|
| `brand.js` | Contacts, socials, optional WhatsApp number |
| `branches.js` | Addresses, phones, hours, Uber Eats links |
| `menu.js` | Menu items and prices per branch, signature dishes |
| `offers.js` | FridayMania and current combos/rewards |
| `events.js` | Christmas, Dough Workz, catering |

Comments like `// M01`, `// P16` refer to source IDs in the research dossier (18 Oct 2026).

## To confirm with PastaMania before launch

The first version is seeded from public research. These items need the brand's confirmation:

- [ ] **Logo, food photos and brand colours** – the app uses placeholder emoji art and a red/gold palette taken from public artwork
- [ ] **Official dine-in menu and prices** – current prices are Uber Eats delivery prices; Alfred House menu is partial
- [ ] **Dine-in hours** per branch (sources conflict) and holiday hours
- [ ] **Phone numbers** – Havelock number, and which of the two One Galle Face numbers is current
- [ ] **WhatsApp number** for enquiries (set `whatsapp` in `brand.js` to enable WhatsApp buttons)
- [ ] **FridayMania** – this week's hero dish and whether it applies at all branches
- [ ] **Combo availability** – Solo Spaghetti and Double Penne
- [ ] **Dough Workz** next session dates and price; **catering** packages
- [ ] **PickMe Food** direct store links (currently links to pickme.lk)
- [ ] Allergen, vegetarian and halal information

## Roadmap

1. **v0.2 – PWA**: service worker for offline use and push notifications (weekly FridayMania alerts)
2. **v0.3 – Backend**: move `src/data` into a database, customer sign-up, workshop and catering bookings
3. **v0.4 – Loyalty**: points, birthday rewards and digital vouchers
4. **v1.0 – Native app**: wrap with Capacitor for the Play Store and App Store; direct pickup ordering
