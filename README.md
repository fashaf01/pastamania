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

## Design

The look follows PastaMania's own Instagram posts (FridayMania posters): textured poster-red backgrounds,
gold hatched retro serif headlines with a dark outline and offset shadow, wide white caps, starburst stickers
and the running-chef logo badge.

- **Fonts** – Fraunces (soft, heavy) from Google Fonts for retro headlines; the brand-supplied Oswald (labels,
  buttons) and Inter (body) are self-hosted from `src/assets/fonts/` as Latin-subset WOFF2 files.
- **Colours** – sampled from the logo and posters: poster red `#9E2022`, logo red `#ED1C25`, gold `#FBB516`, ink `#231F20`.

## Images

| Folder | Contents |
|---|---|
| `public/images/menu/` | Dish photos. Havelock uses the branded white-plate set; One Galle Face uses its own set (files with a hash suffix, e.g. `carbonara-pasta-0308d344.jpg`) |
| `public/images/promo/` | Combo photos and the FridayMania pizza banner (cropped from the 23 Sep poster, without the dated text) |
| `public/images/brand/` | Optimised logo and app icons |
| `design/` | Original uploads kept for reference: full-size logos, the original poster, and all font files (not shipped) |

To add a photo, drop it in `public/images/menu/` and add the file name to the item in `src/data/menu.js`.
Items without a photo show their category icon.

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

- [x] **Logo and food photos** – added
- [ ] **Missing photos** – Stroganoff Baked Rice, Five Bean Salad, the three tea carafes, Mountain Dew
- [ ] **Brand colour codes** – current palette is sampled from the logo and posters; swap in official codes if they have a brand guide
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
