import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { loadSession, saveSession, clearSession } from "../lib/session";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [session, setSession] = useState(() => loadSession());
  const [cart, setCart] = useState({}); // id -> { item, qty }
  const [activeCategory, setActiveCategory] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [table, setTable] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => !loadSession());

  // derived
  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartCount = useMemo(() => cartItems.reduce((s, c) => s + c.qty, 0), [cartItems]);
  const cartTotal = useMemo(() => cartItems.reduce((s, c) => s + c.item.price * c.qty, 0), [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  function login({ phone, token, shopId }) {
    saveSession({ phone, token, shopId });
    setSession({ phone, token, shopId, exp: Date.now() + 12*3600*1000 });
    setIsAuthModalOpen(false);
  }
  function logout() {
    clearSession();
    setSession(null);
    setCart({});
    setIsAuthModalOpen(true);
  }
  function addToCart(item) {
    setCart(prev => {
      const cur = prev[item.id];
      const qty = cur ? cur.qty + 1 : 1;
      return { ...prev, [item.id]: { item, qty } };
    });
  }
  function decFromCart(itemId) {
    setCart(prev => {
      const cur = prev[itemId];
      if (!cur) return prev;
      if (cur.qty <= 1) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: { ...cur, qty: cur.qty - 1 } };
    });
  }
  function removeFromCart(itemId) {
    setCart(prev => {
      const { [itemId]: _, ...rest } = prev;
      return rest;
    });
  }
  function clearCart() { setCart({}); }

  // persist shop/table from URL
  useEffect(() => {
    // keep session in sync if shop changes? session is shop-scoped
  }, []);

  return (
    <Ctx.Provider value={{
      session, login, logout,
      cart, cartItems, cartCount, cartTotal, addToCart, decFromCart, removeFromCart, clearCart,
      isCartOpen, setIsCartOpen, openCart, closeCart, toggleCart,
      isAuthModalOpen, setIsAuthModalOpen, openAuthModal, closeAuthModal,
      activeCategory, setActiveCategory,
      shopId, setShopId, table, setTable,
    }}>
      {children}
    </Ctx.Provider>
  );
}
