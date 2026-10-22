# PastaMania Club – Sri Lanka (v0.6)

A loyalty app for PastaMania Sri Lanka, built the way the Chatime Loyal Tea app works.
The promise is one line: **eat pasta, earn free pasta** – join and your first Garlic Bread is free.

Built with React + Vite as a phone-first web app; add it to the home screen to open it full-screen like an app.

## How it works

1. **Earn** – the member shows *My code* when paying in store; the counter scans it and enters the bill (1 point per LKR 100).
2. **Get free food** – in *Rewards* the member taps *Get* on a reward. A sheet shows their points, the cost and
   what's left; after *Get it for … points* the voucher sits under *Ready to use* in Rewards, with its own QR code.
3. **Get it free** – the counter scans the voucher QR (or finds the member and taps *Mark as used*). The member's
   voucher turns to *Enjoy!* and moves to *Used & expired*.

Delivery orders (Uber Eats, PickMe) **don't earn points**, as with Chatime. The app links to both and says so. The
links are in each platform's own colours (`src/components/DeliveryLinks.jsx`): Uber Eats black with a green *Eats*,
PickMe with a yellow *Me*, so people know them at a glance.

## Screens

Four equal tabs: **Home · Menu · Rewards · Me**. Each tab has one job, and each thing lives in one place. My code is
not a tab: it opens from the big *Show my code* button on Home and the gold QR button at the top of Rewards.

- **Home** – guests get the welcome screen: one plate, *Eat pasta. Earn free pasta.* and *Join free*. Members see
  their points (counting up) beside a photo of the next reward in a ring that fills as they earn (tap it for
  Rewards), *Show my code*, a voucher that's ready to use, this Friday's FridayMania with when it starts,
  *Favourites* (a sideways row of six dishes from their branch: the Sri Lankan fusion dishes, the FridayMania dish,
  Pasta Favourites, then one from each main course) and the next kids workshop – or, if they've booked one,
  *You're booked*, which opens their ticket.
- **Menu** (`/menu`) – *~~Plain Italian~~ Italian, Colombo style*, search, branch pill, *Order delivery* (Uber Eats /
  PickMe), then the whole menu in one scroll, like a delivery app: the category bar sticks to the top, follows the
  section you're reading and jumps to a section when tapped. Dishes are red, gold and cream cards with the points
  each earns in store.
- **Dish** (`/menu/<dish>`) – the plate spins in on a red header (with a *Local fave!* or *Fridays 1+1* sticker;
  steam rises only over hot food, not drinks or salads), price, points, branches that serve it, *Goes well with*,
  Uber Eats / PickMe buttons. *Goes well with* fits the dish (`goesWellWith` in `src/data/menu.js`): a side and a
  drink for a main (pizza gets wings or wedges and a cola, pasta gets garlic bread or cheese sticks and an Italian
  soda), a main and a drink for a starter or salad, a main and a side for a drink, just a drink for a meal set –
  never the dish itself, its own course, or something it already comes with.
- **Join** (`/join`) – wine header *Join the Club*, the welcome gift as a gold ticket, then name, mobile and an
  optional birthday
- **My code** (`/card`) – full screen QR (logo in the middle) in gold scanner corners, member number, and the voucher
  that's ready
- **Rewards** – points and progress, *Ready to use* vouchers, *Get with your points* (a ring per reward shows how close
  you are; *Get* opens a sheet: confirm → *It's yours!*), points history, how points work, used & expired vouchers
- **Voucher** (`/wallet/<id>`) – full screen ticket with its QR; stamped *Enjoy!* once used. `/wallet` itself now
  opens Rewards.
- **Me** (`/me`) – profile (tap the member number to copy it), *My bookings*, *Book with us* (two big tiles: the kids
  pizza workshop with the next date, and event catering), one *Branches & hours* row, call / email / Instagram, sign
  out (asks first)
- **Kids workshop** (`/book`) – Dough Workz: pick a session, add the children, book; **ticket** at `/book/ticket/<ref>`
- **Branches** – today's restaurant hours, all hours, Call / Directions / Uber Eats
- **Counter** (`/staff`) – for staff only, so it isn't linked from the customer screens; open the address directly

### Motion

Small animations make the app feel alive without getting in the way: points count up, progress bars and reward rings
fill in, blocks ease in one after another, buttons sink a little when pressed, sheets slide up and back down, plates
spin in, starburst stickers turn slowly (their words stay still), a tick draws itself and an
*It's yours!* stamp lands when you get a reward, and the scan line sweeps the QR code twice when My code opens. Everything is in `src/styles.css` (*Motion*) and `src/lib/motion.js`, and it all
switches off for people who turn on *Reduce motion* on their phone. Cards don't move while you scroll: a press only
shows after a short hold, and plates only turn under a mouse.

### Light and dark

The app is **light only** for now. Dark mode is built but switched off: set `DARK_MODE` to `true` in
`src/lib/theme.jsx` and `darkMode` in the script in `index.html` to follow the phone's light/dark setting again
(the old Light / Dark / System control can be brought back from git history).

Colours are CSS variables in `src/styles.css`: `:root` holds the light theme and `:root[data-theme='dark']` the
dark one. `src/lib/theme.jsx` keeps the choice on the device, and the script in `index.html` applies it before the
first paint so the app never flashes the wrong theme.

### Counter screen (`/staff`)

Follows a sale like Chatime's: **scan their code** (camera) or type the member number / mobile → see their points and
vouchers, each with *Mark as used* → enter the order total → *Give N points* → done, with *Undo* (30 minutes, once,
only if the points haven't been spent) and *Next customer*. Scanning a voucher QR on its own marks it used straight away.

## Website on computers

The same link shows a website on a computer and the app on a phone or tablet (`src/lib/view.js`):

- Phones and tablets – and the app opened from a home screen – always get the app.
- On a computer, `/`, `/menu`, `/rewards`, `/join`, `/branches` and `/book` open the website at the matching section.
  Everything else (My code, vouchers, booking tickets, `/staff`) stays the app.
- Anyone can switch: *Open the app view* in the website footer, *Open the website* on the app's welcome and Me
  screens (computers only), or `?view=app` / `?view=site` on any link. The choice is kept on the device.

The website lives in `src/website/` – one file per section, styles in `website.css` (every class starts `w-` so
nothing reaches the app). It loads only on computers, so phones never download it. It reads the same `src/data/`
files as the app, so prices, branches and hours, rewards, FridayMania and workshop dates update both at once. Its
menu shows Havelock City Mall's prices. The QR code in *Get the app* opens this same link, which a phone opens as
the app.

Sections: floating red nav · *Eat pasta. Earn free pasta.* with floating dishes · scrolling FridayMania tapes ·
FridayMania with a live countdown to Friday · menu slider with category tabs and the points each dish earns ·
Club with a phone that plays the app's three steps and the rewards ladder · branches with live *Open now* status
and a sketch map · Dough Workz sessions · FAQ · *Get the app* QR · footer. Motion (load sequence, hovers, scroll
reveals, marquee) switches off for *Reduce motion*.

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

The app and the website share one look, taken from PastaMania's FridayMania posters: wine-red headers with a
grain texture, narrow heavy capitals for headings, gold *Ultra* slab accents, gold ticket vouchers, starburst
stickers and the running-chef logo. The tab bar is a calm cream bar with a red marker on the current tab, so the
screen itself stays the focus. Both were designed first as canvases and built to match.

- **Fonts** – Archivo (text; its narrow heavy cut for headings and buttons, its wide cut for small caps labels) and
  Ultra (slab accents), both from Google Fonts.
- **Colours** – sampled from the logo and posters: wine `#3F0A0D`, poster red `#9E2022`, red `#C8161E`, gold `#FBB516`,
  ink `#231F20`, cream `#FFF6EA`; dark theme on espresso `#1A1110` with gold headings.

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

1. **v0.7 – Backend**: accounts shared across devices, points ledger, staff logins for the counter screen, offers managed online, real bookings with branch notifications
2. **v0.8 – Engagement**: push notifications for FridayMania and booking reminders, birthday treats
3. **v1.0 – Store apps**: wrap with Capacitor for the Play Store and App Store
