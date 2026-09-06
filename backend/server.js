import express from "express";
import cors from "cors";
import { shops, categories, menuItems, ORDER_STATUSES } from "./data.js";

const app = express();
const PORT = process.env.PORT || 4000;
// Reloaded with Indian Rupees config

app.use(cors());
app.use(express.json());

// Normalize URLs so routes match whether called with /api or rewritten without
app.use((req, res, next) => {
  if (!req.url.startsWith("/api")) {
    req.url = "/api" + req.url;
  }
  next();
});

// In-memory stores (restart resets)
const otpStore = new Map(); // phone -> { otp, expiresAt }
const orders = new Map(); // orderId -> order
let orderSeq = 1001;

function genOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, 6);
}

// Health
app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Shop config
app.get("/api/shops/:shopId", (req, res) => {
  const shop = shops[req.params.shopId];
  if (!shop) return res.status(404).json({ error: "Shop not found" });
  res.json(shop);
});

// Menu - config-driven categories + items
app.get("/api/shops/:shopId/menu", (req, res) => {
  const shop = shops[req.params.shopId];
  if (!shop) return res.status(404).json({ error: "Shop not found" });
  // allow ?category=coffee to filter, otherwise return all
  const { category } = req.query;
  let items = menuItems;
  if (category) items = items.filter((i) => i.category === category);
  res.json({
    shopId: shop.id,
    categories: categories.slice().sort((a, b) => a.sort - b.sort),
    items,
  });
});

// Auth: send OTP (mock - logs OTP, returns it in dev)
app.post("/api/auth/send-otp", (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    return res.status(400).json({ error: "Valid mobile number required" });
  }
  const otp = genOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min
  otpStore.set(phone, { otp, expiresAt });
  console.log(`[OTP] ${phone} -> ${otp} (expires in 5m)`);
  // In dev, return OTP so tester can proceed without SMS provider
  // In prod, integrate Twilio/MSG91 here and DO NOT return OTP.
  res.json({
    ok: true,
    message: "OTP sent",
    // dev helper:
    devOtp: otp,
    hint: "Use 123456 as universal dev OTP, or the devOtp above",
  });
});

// Accept universal dev OTPs 123456 and 1234 for any phone (matches 4-box and 6-box UIs)
function isValidOtp(phone, otp) {
  if (otp === "123456" || otp === "1234") return true;
  const rec = otpStore.get(phone);
  if (!rec) return false;
  if (Date.now() > rec.expiresAt) {
    otpStore.delete(phone);
    return false;
  }
  // allow 4-digit suffix of generated 6-digit to ease 4-box UI
  if (otp.length === 4 && rec.otp.endsWith(otp)) return true;
  return rec.otp === otp;
}

app.post("/api/auth/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP required" });
  if (!isValidOtp(phone, otp)) {
    return res.status(401).json({ error: "Invalid or expired OTP" });
  }
  otpStore.delete(phone);
  // Simple token: base64(phone:timestamp)
  const token = Buffer.from(`${phone}:${Date.now()}`).toString("base64");
  res.json({
    ok: true,
    token,
    phone,
    expiresInHours: 12,
  });
});

// Create order
app.post("/api/orders", (req, res) => {
  const { shopId, table, phone, items } = req.body;
  if (!shopId || !phone || !items || !items.length) {
    return res.status(400).json({ error: "shopId, phone and items required" });
  }
  const orderId = `ORD-${orderSeq++}`;
  const now = Date.now();
  const order = {
    id: orderId,
    shopId,
    table: table || null,
    phone,
    items: items.map((it) => {
      const menu = menuItems.find((m) => m.id === it.id);
      return {
        id: it.id,
        name: menu?.name || it.name,
        price: menu?.price || it.price,
        qty: it.qty || 1,
        image: menu?.image,
      };
    }),
    status: "placed",
    statusIndex: 0,
    createdAt: new Date(now).toISOString(),
    updatedAt: new Date(now).toISOString(),
    estimatedMins: 12,
  };
  order.total = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  orders.set(orderId, order);

  // Simulate kitchen progression: placed -> preparing -> ready -> served
  const timers = [8000, 15000, 10000]; // ms between steps (short for demo)
  let step = 0;
  function advance() {
    if (step >= timers.length) return;
    setTimeout(() => {
      const o = orders.get(orderId);
      if (!o) return;
      step += 1;
      o.status = ORDER_STATUSES[step];
      o.statusIndex = step;
      o.updatedAt = new Date().toISOString();
      orders.set(orderId, o);
      console.log(`[ORDER] ${orderId} -> ${o.status}`);
      advance();
    }, timers[step]);
  }
  advance();

  res.status(201).json(order);
});

// Get order by id (for polling)
app.get("/api/orders/:orderId", (req, res) => {
  const o = orders.get(req.params.orderId);
  if (!o) return res.status(404).json({ error: "Order not found" });
  res.json(o);
});

// List orders for a phone+shop (for Status tab)
app.get("/api/orders", (req, res) => {
  const { phone, shopId } = req.query;
  if (!phone) return res.status(400).json({ error: "phone required" });
  let list = [...orders.values()].filter((o) => o.phone === phone);
  if (shopId) list = list.filter((o) => o.shopId === shopId);
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(list);
});

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve frontend build in production when running standalone (if present)
if (!process.env.VERCEL) {
  const frontendDist = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendDist));
  // SPA fallback for non-API routes
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"), (err) => {
      if (err) next();
    });
  });

  app.listen(PORT, () => {
    console.log(`☕ Coffee QR backend running at http://localhost:${PORT}`);
    console.log(`   Try: curl http://localhost:${PORT}/api/shops/brewhaus/menu`);
  });
}

export default app;