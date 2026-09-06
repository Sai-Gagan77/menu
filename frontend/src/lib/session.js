const KEY = "qr_menu_session";
const EXPIRY_HOURS = 12;

export function saveSession({ phone, token, shopId }) {
  const exp = Date.now() + EXPIRY_HOURS * 3600 * 1000;
  localStorage.setItem(KEY, JSON.stringify({ phone, token, shopId, exp }));
}
export function loadSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (Date.now() > s.exp) {
      localStorage.removeItem(KEY);
      return null;
    }
    return s;
  } catch { return null; }
}
export function clearSession() {
  localStorage.removeItem(KEY);
}
export function isLoggedInForShop(shopId) {
  const s = loadSession();
  return s && s.shopId === shopId ? s : null;
}
