# PastaMania Club – Sri Lanka (v0.4)

A loyalty app for PastaMania Sri Lanka, built the way the Chatime Loyal Tea app works.
The promise is one line: **eat pasta, earn free pasta** – join and your first Garlic Bread is free.

Built with React + Vite as a phone-first web app; add it to the home screen to open it full-screen like an app.

## How it works

1. **Earn** – the member shows *My code* when paying in store; the counter scans it and enters the bill (1 point per LKR 100).
2. **Redeem** – in *Rewards* the member swaps points for free food. A confirmation shows their points, the cost and
   what's left; the voucher then opens full screen with its own QR code and stays in the *Wallet*.
3. **Get it free** – the counter scans the voucher QR (or finds the member and taps *Mark as used*). The member's
   voucher turns to *Enjoy!* and moves to *Used & expired*.

Delivery orders (Uber Eats, PickMe) **don't earn points**, as with Chatime. The app links to both and says so.

## Screens

Five tabs: **Home · Menu · Rewards · Wallet · Book**

- **Home** – guests see why to join; members see their points, the next free item and *Show my code*; below, the promo banners
- **Menu** – per-branch menu with photos and search; dish details show points earned in store; *Order* opens delivery options
- **Rewards** – points, progress to the next free item, the free-food list with *Redeem*
- **Wallet** – vouchers ready to use (a dot on the tab when one is waiting), used and expired vouchers, delivery links
- **Book** – Dough Workz kids workshops: pick a date, add kids, get a ticket with QR; catering enquiry link
- **My code** and **voucher** screens are full screen (no tab bar) so the counter can scan them
- **Profile** (avatar on Home) – details, branches, points history, and the **Counter screen**

### Counter screen (`/staff`)

Follows a sale like Chatime's: **scan their code** (camera) or type the member number / mobile → see their points and
vouchers, each with *Mark as used* → enter the order total → *Give N points* → done, with *Undo* (30 minutes, once,
only if the points haven't been spent) and *Next customer*. Scanning a voucher QR on its own marks it used straight away.

## Promo banners (running offers)

The Home screen has a swipeable rail of designed artwork – the app's advertising slot, like Chatime's. Banners are
display only (tapping does nothing), so an ad never promises something a screen doesn't have.

**Artwork spec:** 2:1, 1080 × 540 (or larger at 2:1), JPG/PNG/WebP under ~200 KB, keep text and logos 64 px inside the edges.

**Publishing one:** put the file in `public/banners/`, then add a line to `src/data/banners.js` with `title` (read
aloud by screen readers), `image`, and optional `starts` / `ends` dates (YYYY-MM-DD) to schedule it. Remove the line
to stop it. The four current banners (FridayMania, Dough Workz, Christmas menu, Uber Eats combos) are placeholders made
from the brand's photos – replace them with marketing's artwork.

## Loyalty programme (proposed – for the brand to confirm)

Defined in `src/data/club.js`:

- 1 point for every LKR 100 spent in store
- 150 welcome points = a free Garlic Bread on day one
- Free food from 150 points (Garlic Bread) to 900 points (any regular pizza); vouchers last 30 days

## Prototype status

Member, points, vouchers and bookings are saved on the device (`src/context/ClubContext.jsx`) and stay in sync
across open tabs. So the **counter screen only finds members saved in the same browser** – for a demo, open the app
in one tab and `/staff` in another. Going live needs a backend (e.g. Supabase, as the Chatime app uses) for sign-up,
shared accounts, staff logins on the counter screen, and real workshop dates. `ClubContext.jsx` already exposes the
actions it would provide (`join`, `findMember`, `recordPurchase`, `undoAward`, `redeem`, `markVoucherUsed`, `book`,
`cancelBooking`), so the screens don't change when it is connected.

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
| `menu.js` | Menu items and prices per branch |
| `banners.js` | Promo banners on Home, with optional start/end dates |
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
- [ ] **Banner artwork** – replace the four placeholder banners in `public/banners/` with marketing's designs
- [ ] **PickMe Food** direct store links (currently links to pickme.lk)
- [ ] Allergen, vegetarian and halal information

## Roadmap

1. **v0.5 – Backend**: accounts shared across devices, points ledger, staff logins for the counter screen, banners managed online, real bookings with branch notifications
2. **v0.6 – Engagement**: push notifications for FridayMania and booking reminders, birthday treats
3. **v1.0 – Store apps**: wrap with Capacitor for the Play Store and App Store
