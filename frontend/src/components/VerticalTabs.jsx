// Renders both desktop side drawer and mobile bottom nav
const ICON_MAP = {
  food: "restaurant",
  coffee: "coffee",
  mojitos: "local_bar",
  desserts: "cake",
  cold: "ac_unit",
};

export default function VerticalTabs({ categories, active, onChange }) {
  return (
    <>
      {/* Desktop NavigationDrawer */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 z-40 bg-surface-container-low border-r border-tertiary-fixed-dim flex-col gap-3 pt-28 pb-8">
        <div className="px-6 mb-2">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs font-bold">
            Categories
          </h2>
        </div>
        {categories.map((c) => {
          const isActive = active === c.id;
          const icon = ICON_MAP[c.id] || "restaurant";
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={`mx-4 flex items-center gap-3 p-4 transition-all duration-200 rounded-2xl text-left relative
                ${isActive
                  ? "bg-primary text-on-primary shadow-level-1 font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-highest active:scale-[0.98]"}
              `}
            >
              <span className={`material-symbols-outlined ${isActive ? "fill text-on-primary" : "text-on-surface-variant"}`}>
                {icon}
              </span>
              <span className="font-label-md text-label-md">{c.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-6 pt-3 md:hidden bg-surface/95 backdrop-blur-xl border-t border-outline-variant/40 shadow-lg rounded-t-2xl">
        {categories.map((c) => {
          const isActive = active === c.id;
          const icon = ICON_MAP[c.id] || "restaurant";
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-150 relative py-1 px-4 rounded-xl
                ${isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-primary"}
              `}
            >
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
              <span className="font-label-md text-[11px] font-medium mt-0.5">{c.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
