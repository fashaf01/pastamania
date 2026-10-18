# PastaMania Club – Sri Lanka (v0.2)

Mobile loyalty app for PastaMania Sri Lanka, in the style of the Chatime rewards app: member card, Mania Points,
rewards and vouchers, the menu, and Dough Workz workshop booking. Built with React + Vite as an installable
web app (PWA) – add it to the home screen and it opens full-screen like a native app, with offline support.

## Screens

Bottom tabs: **Home · Menu · My Card · Rewards · Bookings**

- **Home** – greeting, points card with tier progress, quick actions (Order, Dough Workz, Offers, Branches), next booking, FridayMania, rewards to unlock, signature dishes
- **Menu** – per-branch menu with photos, search, categories and points per dish; tap a dish for details and Uber Eats ordering
- **My Card** – member QR code for staff to scan at the till, member number, tier and balance
- **Rewards** – redeem points for food vouchers (each with its own QR code), voucher wallet, points history, tier benefits
- **Bookings** – Dough Workz sessions with seats left, booking form (children, ages, allergies), ticket with QR, add-to-calendar, send-to-PastaMania; event catering enquiry
- **Join / Profile** – sign-up with 100 welcome points; profile, links, contact details

## Loyalty programme (proposed – for the brand to confirm)

Defined in `src/data/club.js`:

- 1 Mania Point per LKR 100 spent; 100 welcome points; 200 birthday points
- Tiers by points earned per year: **Al Dente** (on joining) → **Bella** (1,500, 1.25× points) → **Maestro** (4,000, 1.5× points)
- Rewards from 150 points (Garlic Bread) to 900 points (any regular pizza); vouchers valid 30 days

## Prototype status

This version runs entirely on the phone: member, points, vouchers and bookings are saved on the device
(`src/context/ClubContext.jsx`). The Profile screen has a **Demo: earn points** box that simulates a staff scan.
To go live it needs a backend (e.g. Supabase) for:

- sign-up with SMS one-time code, and member accounts shared across devices
- a points ledger, plus a simple staff scanner screen at each till to add points and redeem vouchers
- real Dough Workz sessions and seat counts, booking notifications to the branch, and online payment if wanted
- push notifications (weekly FridayMania, booking reminders)

`ClubContext.jsx` already exposes the actions a backend would provide (`join`, `recordPurchase`, `redeem`, `book`,
`cancelBooking`), so the screens don't change when it is connected. For the Play Store / App Store, the same code
can be wrapped with Capacitor.

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
| `club.js` | Loyalty programme: earn rate, tiers, rewards catalogue |
| `workshops.js` | Dough Workz details and session dates (**sample dates – replace**) |
| `events.js` | Christmas teaser and catering copy |

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
- [ ] **Loyalty programme** – earn rate, tiers, rewards and voucher rules in `club.js`
- [ ] **PickMe Food** direct store links (currently links to pickme.lk)
- [ ] Allergen, vegetarian and halal information

## Roadmap

1. ~~**v0.2 – Loyalty app prototype**~~: member card, points, rewards, vouchers, Dough Workz booking, PWA with offline support
2. **v0.3 – Backend**: SMS sign-up, shared accounts, points ledger, staff scanner screen, real bookings with branch notifications
3. **v0.4 – Engagement**: push notifications, birthday rewards, monthly tier perks
4. **v1.0 – Store apps**: wrap with Capacitor for the Play Store and App Store; pickup ordering
