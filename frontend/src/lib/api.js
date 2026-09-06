const BASE = "/api";

async function j(fetchPromise) {
  const r = await fetchPromise;
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
  return data;
}

export const api = {
  getShop: (shopId) => j(fetch(`${BASE}/shops/${shopId}`)),
  getMenu: (shopId) => j(fetch(`${BASE}/shops/${shopId}/menu`)),
  sendOtp: (phone) => j(fetch(`${BASE}/auth/send-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) })),
  verifyOtp: (phone, otp) => j(fetch(`${BASE}/auth/verify-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, otp }) })),
  createOrder: (payload) => j(fetch(`${BASE}/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })),
  getOrder: (id) => j(fetch(`${BASE}/orders/${id}`)),
  listOrders: (phone, shopId) => j(fetch(`${BASE}/orders?phone=${encodeURIComponent(phone)}&shopId=${encodeURIComponent(shopId)}`)),
};
