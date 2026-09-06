# ☕ BrewHaus — Coffee Shop QR Menu (PWA)

Mobile-first responsive web app opened via QR scan — no install required. Solves: scan table QR → branded landing → OTP login → vertical-tab menu → live order status.

> Stack: React + Vite + Tailwind v4 + React Router • Express + mock JSON (shop/menu driven via API) • session in localStorage (12h)

## Demo — how the QR works

QR encodes a unique shop link with params, e.g.:

```
/menu/brewhaus?table=5
/menu/demo?table=12
```

- `shopId` in path (`brewhaus` | `demo`) loads that shop's branding + menu from backend
- `table` query param is optional, shown in top bar + attached to order
- Scan → landing hero (logo/tagline/table badge) → "Continue with mobile" → OTP → menu. Re-scanning same link within 12h skips login (session persisted).

## Quick start

```bash
# 1) install all
npm install
npm install --prefix frontend
npm install --prefix backend

# 2) run both (frontend :5173 proxies /api → :4000)
npm run dev
# or separately:
npm run dev:backend   # http://localhost:4000
npm run dev:frontend  # http://localhost:5173

# prod build (backend serves frontend/dist)
npm run build
npm start  # serves API + static on :4000
```

Open: **http://localhost:5173/menu/brewhaus?table=5** (auto-redirects from `/`).

## Auth — Mobile OTP (mock)

No SMS provider needed for demo:

- `POST /api/auth/send-otp { phone }` → logs OTP, returns `{ devOtp }` + hint to use master code
- `POST /api/auth/verify-otp { phone, otp }` → accepts `123456` for any number (universal dev code) OR the `devOtp`

Flow: input `+91 9876543210` → "Send OTP" → paste `devOtp` or type `123456` → "Verify". Session stored in `localStorage` for 12h, so table re-scan won't force re-login.

To plug a real provider: edit `backend/server.js` `POST /api/auth/send-otp` to call Twilio Verify / Firebase Auth / MSG91 and stop returning `devOtp`.

## Menu — config-driven vertical tabs

`GET /api/shops/:shopId/menu` returns `{ categories, items }`:

- Categories are **not hardcoded** in frontend — e.g. Food, Coffee, Mojitos, Desserts, Cold Bevs come from `backend/data.js` (add a category there, no redeploy of frontend needed except icon)
- Frontend `VerticalTabs` renders a left-edge rail (icon + label, 44px tap targets, sticky, instant client-side tab switch, no reload)
- Images are lazy-loaded; only active tab's items render

Extend: add to `categories` + add items with `category: "newId"` in `backend/data.js`.

## Order + live Status

- `POST /api/orders { shopId, table, phone, items: [{id, qty}] }` → creates order, returns `total`; server simulates kitchen via timers: `placed (0s) → preparing (8s) → ready (23s) → served (33s)`
- `GET /api/orders?phone=&shopId=` lists customer's orders; `GET /api/orders/:id` for polling
- **Status tab** polls every 3s (v1 polling; swap to websocket later) and shows stepper `Placed → Preparing → Ready → Served`
- Cart bar is sticky bottom (`Place order →`); only shows when cart not empty

## Project layout

```
menu/
├── backend/
│   ├── server.js      # Express API: shops, menu, OTP mock, orders + progression
│   └── data.js        # seed shops, categories, items, ORDER_STATUSES
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # / → /menu/:shopId routing + auth gate
│   │   ├── lib/api.js         # fetch wrapper
│   │   ├── lib/session.js     # 12h localStorage session
│   │   ├── context/AppContext.jsx
│   │   ├── components/TopBar, VerticalTabs, ItemCard, StatusStepper, CartBar
│   │   └── pages/Landing.jsx, MenuPage.jsx
│   ├── index.html
│   └── vite.config.js  # /api proxy → :4000
└── package.json        # concurrently runs both
```

## API reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | health |
| `GET` | `/api/shops/:shopId` | shop config |
| `GET` | `/api/shops/:shopId/menu?category=` | menu (categories+items) |
| `POST` | `/api/auth/send-otp` | mock send OTP |
| `POST` | `/api/auth/verify-otp` | verify (accepts 123456) |
| `POST` | `/api/orders` | create order |
| `GET` | `/api/orders?phone=&shopId=` | list my orders |
| `GET` | `/api/orders/:orderId` | poll status |

## UX notes

- Design target 360–430px first, then up. Tested on iPhone SE width.
- Sticky top bar keeps logo + login/phone visible while scrolling.
- Left vertical rail (not horizontal scroll) as requested; icon + short label, instant switch.
- PWA-ready: `manifest.json`, `theme-color`, fast first load (<2s on 4G), lazy images, 44px tappables.

## Replace mock data

Edit `backend/data.js` shops/categories/menuItems — frontend will pick it up automatically (no code change).

## Deploy

- Frontend: `Vercel` / static host (`npm run build` → `frontend/dist`)
- Backend: any Node host (`npm start`); set `PORT`; in prod backend also serves `frontend/dist` as static fallback.

## QR generation (for table)

Generate QR pointing to your deployed URL, e.g. `https://your-domain.com/menu/brewhaus?table=7`. Any QR generator works (e.g. `qrcode` npm, or https://api.qrserver.com/v1/create-qr-code/?data=...).
