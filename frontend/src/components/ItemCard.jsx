import { useApp } from "../context/AppContext";

export default function ItemCard({ item }) {
  const { cart, addToCart, decFromCart } = useApp();
  const entry = cart[item.id];
  const qty = entry?.qty || 0;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden flex gap-3 p-3 ${!item.available ? "opacity-60" : "border-stone-200 shadow-sm hover:shadow-md transition-shadow"}`}>
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        className="w-[92px] h-[92px] sm:w-[112px] sm:h-[112px] rounded-xl object-cover shrink-0 bg-stone-100"
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[14px] sm:text-[15px] leading-tight line-clamp-2">{item.name}</h3>
          {item.popular && <span className="shrink-0 text-[9px] font-bold tracking-widest bg-amber-500 text-white px-1.5 py-0.5 rounded-full">POPULAR</span>}
        </div>
        <p className="text-xs text-stone-500 leading-snug line-clamp-2 mt-0.5">{item.description}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          {item.veg !== undefined && (
            <span className={`w-4 h-4 rounded-[3px] border grid place-items-center ${item.veg ? "border-green-600" : "border-red-600"}`}>
              <span className={`w-2 h-2 rounded-full ${item.veg ? "bg-green-600" : "bg-red-600"}`} />
            </span>
          )}
          {item.spice > 0 && <span className="text-[11px]">🌶️</span>}
          {!item.available && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">Out of stock</span>}
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 gap-2">
          <span className="font-bold text-sm">₹{item.price}</span>
          {!item.available ? (
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100 text-stone-500">Unavailable</span>
          ) : qty === 0 ? (
            <button
              onClick={() => addToCart(item)}
              className="text-xs font-bold px-5 py-2.5 rounded-full bg-stone-900 text-white hover:bg-black active:scale-95 transition min-h-[44px] min-w-[72px]"
            >
              Add +
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-stone-900 text-white rounded-full p-1">
              <button onClick={() => decFromCart(item.id)} className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/20 active:scale-90 transition text-sm font-bold">−</button>
              <span className="w-7 text-center text-sm font-bold">{qty}</span>
              <button onClick={() => addToCart(item)} className="w-8 h-8 grid place-items-center rounded-full bg-white text-stone-900 font-bold active:scale-90 transition">+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
