import { useApp } from "../context/AppContext";

export default function CartBar({ onCheckout, placing }) {
  const { cartCount, cartTotal, openCart } = useApp();
  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-[90px] md:bottom-6 inset-x-0 z-40 px-margin-mobile md:px-0 pointer-events-none">
      <div className="max-w-container-max-width mx-auto md:ml-64 md:mr-margin-desktop pointer-events-auto">
        <div className="bg-primary text-on-primary rounded-2xl px-4 py-3 flex items-center justify-between shadow-level-2 gap-3 border border-primary-container">
          {/* Clickable summary opens cart drawer */}
          <button
            onClick={openCart}
            className="flex items-center gap-3 text-left hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
            aria-label="View items in bag"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            </div>
            <div className="leading-tight">
              <div className="font-caption text-caption text-inverse-primary">
                {cartCount} {cartCount === 1 ? "item" : "items"} • ₹{cartTotal}
              </div>
              <div className="font-label-md text-label-md font-bold flex items-center gap-1">
                <span>View Bag</span>
                <span className="material-symbols-outlined text-[14px]">expand_less</span>
              </div>
            </div>
          </button>

          <button
            disabled={placing}
            onClick={onCheckout}
            className="bg-surface text-primary font-label-md text-label-md px-5 sm:px-6 py-3 rounded-full hover:bg-surface-bright active:scale-[0.98] transition disabled:opacity-60 flex items-center gap-2 shadow-sm shrink-0"
          >
            {placing ? "Placing..." : "Place order"}
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
