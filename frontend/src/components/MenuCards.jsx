import { useApp } from "../context/AppContext";

const FALLBACK_FOOD_IMG = "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=600&h=400&fit=crop";
const FALLBACK_COFFEE_IMG = "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop";
const FALLBACK_MOJITO_IMG = "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=400&fit=crop";

function getFallback(category) {
  if (category === "coffee") return FALLBACK_COFFEE_IMG;
  if (category === "mojitos") return FALLBACK_MOJITO_IMG;
  return FALLBACK_FOOD_IMG;
}

export function AddButton({ item }) {
  const { cart, addToCart, decFromCart } = useApp();
  const entry = cart[item.id];
  const qty = entry?.qty || 0;

  if (!item.available) {
    return (
      <span className="font-caption text-caption text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-md text-xs">
        Unavailable
      </span>
    );
  }

  if (qty === 0) {
    return (
      <button
        onClick={() => addToCart(item)}
        className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary/90 transition-colors active:scale-95 shadow-sm cursor-pointer"
        aria-label={`Add ${item.name} to bag`}
      >
        <span className="material-symbols-outlined text-lg">add</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-primary text-on-primary rounded-full p-1 shadow-sm">
      <button
        onClick={() => decFromCart(item.id)}
        className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/20 active:scale-90 transition text-sm font-bold cursor-pointer"
        aria-label={`Decrease quantity of ${item.name}`}
      >
        −
      </button>
      <span className="w-6 text-center font-label-md text-label-md font-semibold text-sm select-none">
        {qty}
      </span>
      <button
        onClick={() => addToCart(item)}
        className="w-8 h-8 grid place-items-center rounded-full bg-surface text-primary font-bold active:scale-90 transition cursor-pointer"
        aria-label={`Increase quantity of ${item.name}`}
      >
        +
      </button>
    </div>
  );
}

// Unified Menu Card for all sections (Food, Coffee, Mojitos)
export function MenuCard({ item }) {
  return (
    <article className="group bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-level-1 border border-tertiary-fixed-dim hover:shadow-level-2 transition-all duration-300 flex flex-col h-full relative">
      {/* Badge on Top Left of Image */}
      {item.badge && (
        <div className="absolute top-3.5 left-3.5 z-10">
          <span
            className={`px-3 py-1 font-caption text-caption rounded-full shadow-sm font-semibold tracking-wide text-xs ${
              item.badge === "Popular"
                ? "bg-secondary text-on-secondary"
                : item.badge === "Spicy"
                ? "bg-secondary-container text-on-secondary-container"
                : item.badge === "Best Seller"
                ? "bg-secondary text-on-secondary"
                : "bg-primary text-on-primary"
            }`}
          >
            {item.badge}
          </span>
        </div>
      )}

      {/* Hero Image Section */}
      <div className="h-52 sm:h-56 overflow-hidden relative shrink-0 bg-surface-container">
        <img
          alt={item.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          src={item.image}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = getFallback(item.category);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Card Content Section */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow relative">
        <div className="flex justify-between items-start mb-1.5 gap-2">
          <h3
            className="font-headline-md text-headline-md text-on-surface group-hover:text-secondary transition-colors font-bold text-lg leading-snug"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {item.name}
          </h3>
          <span className="font-headline-md text-headline-md text-secondary font-bold shrink-0 text-base sm:text-lg">
            ₹{item.price}
          </span>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-5 text-sm leading-relaxed">
          {item.description}
        </p>

        {/* Bottom Bar: Veg/Category Info + Add Button */}
        <div className="mt-auto flex justify-between items-center pt-3.5 border-t border-tertiary-fixed-dim/40">
          <div className="flex items-center gap-1.5">
            {item.veg !== undefined && (
              <span
                className={`w-4 h-4 rounded-[3px] border grid place-items-center mr-1 ${
                  item.veg ? "border-green-600" : "border-red-600"
                }`}
                title={item.veg ? "Vegetarian" : "Non-Vegetarian"}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.veg ? "bg-green-600" : "bg-red-600"
                  }`}
                />
              </span>
            )}
            <span className="font-caption text-xs text-on-surface-variant font-medium capitalize">
              {item.category}
            </span>
          </div>

          <AddButton item={item} />
        </div>
      </div>
    </article>
  );
}

// Backward-compatible named exports for FoodCard, CoffeeCard, MojitoCard
export const FoodCard = MenuCard;
export const CoffeeCard = MenuCard;
export const MojitoCard = MenuCard;
