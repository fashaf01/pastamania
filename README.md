# PastaMania Club – Sri Lanka (v0.3)

A simple loyalty app for PastaMania Sri Lanka, in the spirit of the Chatime rewards app.
The promise is one line: **eat pasta, earn free pasta** – join and your first Garlic Bread is free.

Built with React + Vite as a phone-first web app; add it to the home screen to open it full-screen like an app.

## Screens

Four tabs: **Home · Menu · Rewards · Book**

- **Home** – guests see why to join (free Garlic Bread, how points work); members see their points, the next free item and a *Show my card* button
- **Menu** – per-branch menu with photos and search; tap a dish for details and Uber Eats; *Order* opens delivery options
- **Rewards** – points, free-food list, vouchers ready to use (each with a QR code)
- **Book** – Dough Workz kids workshops: pick a date, add kids, get a ticket with QR; catering enquiry link
- **My card** (from Home) – member QR code to show at the till; **Profile** (avatar) – details, branches, points history

## Loyalty programme (proposed – for the brand to confirm)

Defined in `src/data/club.js`:

- 1 point for every LKR 100 spent
- 150 welcome points = a free Garlic Bread on day one
- Free food from 150 points (Garlic Bread) to 900 points (any regular pizza); vouchers last 30 days

## Prototype status

Member, points, vouchers and bookings are saved on the device (`src/context/ClubContext.jsx`) and stay in sync
across open tabs. The *My card* screen has a **Demo** box that simulates the till scanning the card.
To go live it needs a backend (e.g. Supabase) for SMS sign-up, shared accounts, a staff scanner screen,
and real workshop dates with bookings sent to the branch. `ClubContext.jsx` already exposes the actions a
backend would provide (`join`, `recordPurchase`, `redeem`, `book`, `cancelBooking`).

The app does not use a service worker. `public/sw.js` only removes the one shipped in v0.2, which could keep
an open app on an old version until a manual refresh.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Deploy

Any static host works. `vercel.json` is included so client-side routes (`/menu`, `/card`, …) resolve on Vercel. Live at https://pastamania-srilanka.vercel.app – every push to the production branch redeploys. For Netlify, add a `public/_redirects` file containing `/* /index.html 200`.

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
| `club.js` | Loyalty programme: earn rate, welcome points, rewards |
| `workshops.js` | Dough Workz details and session dates (**sample dates – replace**) |

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
- [ ] **Dough Workz** real session dates, capacity and price (sample dates are in `workshops.js`); **catering** packages
- [ ] **Loyalty programme** – earn rate, welcome points, rewards and voucher rules in `club.js`
- [ ] **PickMe Food** direct store links (currently links to pickme.lk)
- [ ] Allergen, vegetarian and halal information

## Roadmap

1. **v0.4 – Backend**: SMS sign-up, shared accounts, points ledger, staff scanner screen, real bookings with branch notifications
2. **v0.5 – Engagement**: push notifications for FridayMania and booking reminders, birthday treats
3. **v1.0 – Store apps**: wrap with Capacitor for the Play Store and App Store
