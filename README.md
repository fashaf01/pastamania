# PastaMania Club – Sri Lanka (v0.5)

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

Five tabs: **Home · Menu · My code · Rewards · Wallet**. My code sits in the middle as a raised gold button,
because showing it at the counter is the thing members do most.

- **Home** – guests get the welcome poster (*Join free*); members see their points, the reward track with a photo at
  every free item, *Show my code* / *Redeem*, a ready voucher, their next workshop, the next reward, the
  FridayMania offer, shortcuts (delivery, menu, branches, kids workshops), recent activity and how points work.
- **Menu** (`/menu`) – branch picker, search, category chips, photos, prices and points earned in store
- **Dish** (`/menu/<dish>`) – photo, price, points, FridayMania badge for the week's hero dish, branches that serve it,
  two add-ons, Uber Eats / PickMe buttons
- **My code** (`/card`) – full screen QR (logo in the middle) for the counter, points and treats ready
- **Rewards** – points card, All / Ready / Coming up filter, free-food grid; *Redeem* opens a confirmation sheet
  (points, cost, what's left) and then the voucher
- **Voucher** (`/wallet/<id>`) – full screen ticket with its QR; stamped *Enjoy!* once used
- **Wallet** – vouchers ready to use, workshop tickets, used & expired vouchers, delivery links
- **Kids workshop** (`/book`) – Dough Workz: pick a session, add the children, book; **ticket** at `/book/ticket/<ref>`
- **Profile** (`/me`, from the avatar) – details, points history (`/history`),
  branches, catering, contact and the **Counter screen**
- **Branches** – today's restaurant hours, all hours, Call / Directions / Uber Eats

### Light and dark

The app is **light only** for now. Dark mode is built but switched off: set `DARK_MODE` to `true` in
`src/lib/theme.jsx` and `darkMode` in the script in `index.html` to bring back the moon button on Home and the
Appearance choice (Light / Dark / System) in Profile.

Colours are CSS variables in `src/styles.css`: `:root` holds the light theme and `:root[data-theme='dark']` the
dark one. `src/lib/theme.jsx` keeps the choice on the device, and the script in `index.html` applies it before the
first paint so the app never flashes the wrong theme.

### Counter screen (`/staff`)

Follows a sale like Chatime's: **scan their code** (camera) or type the member number / mobile → see their points and
vouchers, each with *Mark as used* → enter the order total → *Give N points* → done, with *Undo* (30 minutes, once,
only if the points haven't been spent) and *Next customer*. Scanning a voucher QR on its own marks it used straight away.

## FridayMania (the weekly offer)

Home and the dish page carry FridayMania – buy 1, get 1 on the week's hero dish every Friday. Set the dish in
`src/data/offers.js` (`heroDish`, the name exactly as in `menu.js`); the date sticker always shows the coming Friday.

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
gold hatched slab headlines with a dark outline and offset shadow, wide caps, starburst stickers
and the running-chef logo badge. The screens were designed first as a canvas (light and dark) and built to match.

- **Fonts** – Ultra (poster headlines and numbers) and Archivo (text, with its wide cut for caps labels), both from
  Google Fonts.
- **Colours** – sampled from the logo and posters: poster red `#9E2022`, red `#C8161E`, gold `#FBB516`, ink `#231F20`,
  cream `#FFF6EA`; dark theme on espresso `#1A1110` with gold headings.

## Images

| Folder | Contents |
|---|---|
| `public/images/menu/` | Dish photos. Havelock uses the branded white-plate set; One Galle Face uses its own set (files with a hash suffix, e.g. `carbonara-pasta-0308d344.jpg`) |
| `public/images/promo/` | Combo photos and the FridayMania pizza banner (cropped from the 23 Sep poster, without the dated text) |
| `public/images/brand/` | Optimised logo and app icons |
| `design/` | Original uploads kept for reference: full-size logos, the original poster, and the brand's font files (not shipped) |

To add a photo, drop it in `public/images/menu/` and add the file name to the item in `src/data/menu.js`.
Items without a photo show their category icon.

## Updating content

All content lives in `src/data/` – no code changes needed for routine updates:

| File | What it holds |
|---|---|
| `brand.js` | Contacts, socials, optional WhatsApp number |
| `branches.js` | Addresses, phones, hours, Uber Eats links |
| `menu.js` | Menu items and prices per branch |
| `offers.js` | FridayMania hero dish |
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

1. **v0.6 – Backend**: accounts shared across devices, points ledger, staff logins for the counter screen, offers managed online, real bookings with branch notifications
2. **v0.7 – Engagement**: push notifications for FridayMania and booking reminders, birthday treats
3. **v1.0 – Store apps**: wrap with Capacitor for the Play Store and App Store
