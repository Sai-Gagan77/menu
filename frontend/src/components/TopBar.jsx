import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function TopBar({ shop, table }) {
  const { session, logout, cartCount, openCart, openAuthModal } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const logoUrl = shop?.logo?.startsWith("http") ? shop.logo : null;
  const shopName = shop?.name || "Brew & Bloom";

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-md shadow-sm flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 h-20 border-b border-outline-variant/20">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-tertiary-fixed-dim/70 shadow-sm">
          {logoUrl ? (
            <img alt={`${shopName} Logo`} className="w-full h-full object-cover" src={logoUrl} />
          ) : (
            <div className="w-full h-full bg-primary-container text-on-primary-container grid place-items-center text-sm font-bold">
              {shop?.logo || "☕"}
            </div>
          )}
        </div>
        <div>
          <h1
            className="font-headline-md text-headline-md font-bold text-primary tracking-tight text-base sm:text-xl"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {shopName}
          </h1>
          {table && (
            <span className="text-[11px] font-caption text-secondary font-semibold sm:hidden block leading-tight">
              Table {table}
            </span>
          )}
        </div>
      </div>

      {/* Right Controls: Bag + User Auth */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Shopping Bag Button */}
        <button
          onClick={openCart}
          id="topbar-bag-btn"
          className="relative p-2 text-on-surface-variant hover:text-primary transition-all active:scale-90 flex items-center justify-center rounded-full hover:bg-surface-container"
          aria-label="View Shopping Bag"
          title="Open Cart"
        >
          <span className="material-symbols-outlined text-[26px]">shopping_bag</span>
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] px-1 bg-secondary text-on-secondary rounded-full border-2 border-surface text-[11px] font-bold flex items-center justify-center shadow-sm animate-in zoom-in-50 duration-150">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Session / Login Button */}
        {session ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-surface-container transition-colors border border-outline-variant/50 focus:outline-none"
              aria-label="User profile menu"
            >
              <div className="hidden sm:flex flex-col items-end leading-none mr-0.5">
                <span className="font-caption text-caption text-on-surface font-semibold text-xs">
                  {session.phone}
                </span>
                <span className="font-caption text-caption text-secondary text-[10px]">
                  Table {table || "—"} • Verified
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm border border-outline-variant/60">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant hidden sm:inline">
                {profileOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-4 flex flex-col gap-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="border-b border-outline-variant/30 pb-3">
                  <div className="font-label-md text-xs font-semibold text-on-surface">
                    {session.phone}
                  </div>
                  <div className="font-caption text-[11px] text-on-surface-variant mt-0.5">
                    {table ? `Table ${table} • Dining in` : "Verified guest"}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left flex items-center gap-2.5 text-xs font-label-md text-error hover:bg-error-container/40 p-2 rounded-xl transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Log out / Switch phone</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary text-on-primary text-xs font-label-md hover:bg-primary/90 active:scale-95 transition shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
