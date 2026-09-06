import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function CartDrawer({ onCheckout, placing, shop, table }) {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    decFromCart,
    removeFromCart,
    clearCart,
    session,
    openAuthModal,
  } = useApp();

  const [notes, setNotes] = useState("");

  if (!isCartOpen) return null;

  const handlePlaceOrderClick = () => {
    if (!session) {
      openAuthModal();
      return;
    }
    if (onCheckout) {
      onCheckout();
      closeCart();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 md:pl-0">
        <aside
          className="w-screen max-w-md bg-surface-container-lowest text-on-surface shadow-2xl flex flex-col h-full z-10 border-l border-outline-variant/30 animate-in slide-in-from-right duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary grid place-items-center">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              </div>
              <div>
                <h2
                  className="font-headline-md text-headline-md text-primary font-bold text-lg"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Your Bag
                </h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  {cartCount} {cartCount === 1 ? "item" : "items"} • Table {table || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartCount > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-label-md text-on-surface-variant hover:text-error px-2 py-1 rounded transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors"
                aria-label="Close cart"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Cart Content */}
          {cartCount === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-5 text-on-surface-variant/70 border border-outline-variant/40">
                <span className="material-symbols-outlined text-5xl">shopping_bag</span>
              </div>
              <h3
                className="font-headline-md text-headline-md text-primary text-xl font-bold mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Your bag is empty
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mb-6 text-sm">
                Explore our menu and add items to place your order.
              </p>
              <button
                onClick={closeCart}
                className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-primary/90 active:scale-95 transition shadow-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
                <span>Browse Menu</span>
              </button>
            </div>
          ) : (
            /* Items List */
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-outline-variant/20">
              {/* Items */}
              <div className="space-y-4 pb-4">
                {cartItems.map(({ item, qty }) => (
                  <div key={item.id} className="flex gap-4 items-center pt-2">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-outline-variant/30 bg-surface-container">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=400&fit=crop";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4
                          className="font-headline-md text-headline-md text-on-surface font-semibold text-sm truncate"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-outline-variant hover:text-error p-1 transition-colors"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-on-surface-variant font-caption mt-0.5">
                        <span className="font-semibold text-primary">₹{item.price}</span>
                        {item.badge && (
                          <span className="bg-surface-container px-1.5 py-0.5 rounded text-[10px] text-secondary font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Quantity row */}
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center bg-surface-container rounded-full p-0.5 border border-outline-variant/40">
                          <button
                            onClick={() => decFromCart(item.id)}
                            className="w-7 h-7 grid place-items-center rounded-full hover:bg-surface-variant active:scale-90 transition font-bold text-on-surface text-sm"
                            aria-label={`Decrease ${item.name}`}
                          >
                            −
                          </button>
                          <span className="w-7 text-center font-label-md text-xs font-semibold text-on-surface">
                            {qty}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-7 h-7 grid place-items-center rounded-full bg-primary text-on-primary active:scale-90 transition font-bold text-sm"
                            aria-label={`Increase ${item.name}`}
                          >
                            +
                          </button>
                        </div>

                        <span className="font-label-md text-sm font-bold text-primary">
                          ₹{item.price * qty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Instructions */}
              <div className="pt-4 pb-2">
                <label className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5 font-semibold">
                  Kitchen Notes / Special Requests
                </label>
                <input
                  type="text"
                  placeholder="e.g., Less sugar, extra ice, oat milk..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-surface-container text-xs rounded-xl px-3.5 py-2.5 border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                />
              </div>

              {/* Order Total (No payment/tax complexity) */}
              <div className="pt-4 space-y-2 text-xs font-body-md text-on-surface-variant">
                <div className="flex justify-between items-center text-sm font-bold text-primary pt-2 border-t border-outline-variant/30">
                  <span>Total Order Amount</span>
                  <span className="text-base text-secondary font-bold">₹{cartTotal}</span>
                </div>
              </div>

              {/* Auth Prompt if guest */}
              {!session && (
                <div className="pt-3">
                  <div className="bg-secondary-fixed/40 border border-secondary-fixed-dim rounded-xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-on-secondary-fixed">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      <span>Mobile login needed to place order</span>
                    </div>
                    <button
                      onClick={openAuthModal}
                      className="font-bold text-secondary underline hover:opacity-80"
                    >
                      Login
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Place Order CTA */}
          {cartCount > 0 && (
            <div className="p-6 border-t border-outline-variant/30 bg-surface-container-lowest space-y-3">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">table_restaurant</span>
                  Table {table || "—"} • Dine-in
                </span>
                <span className="font-bold text-primary text-sm">
                  Total: ₹{cartTotal}
                </span>
              </div>

              <button
                disabled={placing}
                onClick={handlePlaceOrderClick}
                className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition shadow-level-2 disabled:opacity-50 flex items-center justify-center gap-2 text-base font-semibold cursor-pointer"
              >
                {placing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Order...</span>
                  </>
                ) : (
                  <>
                    <span>{session ? `Place Order • ₹${cartTotal}` : "Login & Place Order"}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
