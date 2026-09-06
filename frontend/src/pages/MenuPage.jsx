import { useEffect, useState, useRef } from "react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";
import VerticalTabs from "../components/VerticalTabs";
import { MenuCard } from "../components/MenuCards";
import CartBar from "../components/CartBar";
import CartDrawer from "../components/CartDrawer";
import OrderConfirmationModal from "../components/OrderConfirmationModal";

export default function MenuPage({ shop, table }) {
  const { session, cartItems, clearCart, openAuthModal } = useApp();
  const [menu, setMenu] = useState(null);
  const [active, setActive] = useState("food");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [placing, setPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const mainRef = useRef(null);

  useEffect(() => {
    if (!shop) return;
    setLoading(true);
    api.getMenu(shop.id)
      .then((m) => {
        setMenu(m);
        if (m.categories.length && !m.categories.find((c) => c.id === active)) {
          setActive(m.categories[0].id);
        }
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [shop?.id]);

  // Ensure view resets to top whenever active tab changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [active]);

  const handleTabChange = (catId) => {
    setActive(catId);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return;
    if (!session) {
      openAuthModal();
      return;
    }
    setPlacing(true);
    try {
      const order = await api.createOrder({
        shopId: shop.id,
        table,
        phone: session.phone,
        items: cartItems.map((c) => ({ id: c.item.id, qty: c.qty })),
      });
      clearCart();
      setConfirmedOrder(order);
    } catch (e) {
      alert(e.message || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full pt-20">
        <VerticalTabs categories={[]} active={active} onChange={handleTabChange} />
        <main className="flex-1 md:ml-64 bg-background min-h-[60vh] p-8">
          <div className="max-w-container-max-width mx-auto animate-pulse space-y-4">
            <div className="h-8 bg-surface-container rounded w-1/3" />
            <div className="h-64 bg-surface-container rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  if (err) return <div className="p-6 text-center text-error pt-20">{err}</div>;
  if (!menu) return null;

  const filtered = menu.items.filter((i) => i.category === active);

  return (
    <div className="flex h-full pt-20 bg-background min-h-[calc(100vh-80px)]">
      {/* Category Tabs (Food, Coffee, Mojitos) */}
      <VerticalTabs categories={menu.categories} active={active} onChange={handleTabChange} />

      <main ref={mainRef} className="flex-1 overflow-y-auto w-full md:ml-64 bg-background pb-28 md:pb-12">
        {/* Content container keyed by active category with entry animation coming from top */}
        <div key={active} className="animate-from-top max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8">
          {/* Header per category */}
          {active === "food" && (
            <div className="mb-8 flex justify-between items-end">
              <div>
                <span className="inline-block px-3 py-1 bg-secondary text-on-secondary font-label-md text-label-md rounded-full mb-3 shadow-xs text-xs font-semibold">
                  Serving Now
                </span>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Artisanal Food
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-1 max-w-2xl text-sm">
                  Crafted with locally sourced ingredients for a perfect pairing.
                </p>
              </div>
              <span className="hidden md:inline font-caption text-caption text-on-surface-variant font-medium">
                {filtered.length} items
              </span>
            </div>
          )}

          {active === "coffee" && (
            <div className="mb-8 flex justify-between items-end">
              <div>
                <span className="inline-block px-3 py-1 bg-primary text-on-primary font-label-md text-label-md rounded-full mb-3 shadow-xs text-xs font-semibold">
                  Brewed Fresh
                </span>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Coffee Menu
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-1 text-sm">
                  Expertly crafted brews for your daily rhythm.
                </p>
              </div>
              <span className="hidden md:inline font-caption text-caption text-on-surface-variant font-medium">
                {filtered.length} items
              </span>
            </div>
          )}

          {active === "mojitos" && (
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container font-label-md text-label-md rounded-full mb-3 shadow-xs text-xs font-semibold">
                  Chilled & Fresh
                </span>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Signature Mojitos
                </h2>
                <p className="text-on-surface-variant font-body-md text-body-md text-sm mt-1">
                  Freshly muddled, perfectly balanced coolers.
                </p>
              </div>
              <span className="hidden md:inline font-caption text-caption text-on-surface-variant font-medium">
                {filtered.length} items
              </span>
            </div>
          )}

          {/* Cards Grid — Completely consistent across Food, Coffee, Mojitos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filtered.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full bg-surface-container-lowest rounded-[24px] border border-dashed border-outline-variant p-8 text-center font-body-md text-on-surface-variant">
                No items in this section.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating bag/cart bar */}
      <CartBar onCheckout={handlePlaceOrder} placing={placing} />

      {/* Cart Drawer */}
      <CartDrawer onCheckout={handlePlaceOrder} placing={placing} shop={shop} table={table} />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal order={confirmedOrder} onClose={() => setConfirmedOrder(null)} />
    </div>
  );
}
