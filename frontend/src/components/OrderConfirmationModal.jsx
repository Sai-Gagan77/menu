export default function OrderConfirmationModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-[28px] p-6 sm:p-8 shadow-2xl border border-outline-variant/30 flex flex-col items-center text-center gap-5 relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Order Confirmation"
      >
        {/* Animated Success Badge */}
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-700 flex items-center justify-center shadow-inner border border-green-200 mt-2">
          <span className="material-symbols-outlined text-4xl">check_circle</span>
        </div>

        <div>
          <h2
            className="font-headline-md text-headline-md text-primary font-bold text-2xl"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Order Confirmed!
          </h2>
          <p className="font-body-md text-on-surface-variant text-sm mt-1">
            Sent to the kitchen for preparation
          </p>
        </div>

        {/* Order Details Card */}
        <div className="w-full bg-surface-container rounded-2xl p-4 border border-outline-variant/30 text-left space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20 text-xs">
            <span className="font-caption text-on-surface-variant font-medium">
              Order ID: <strong className="text-on-surface font-semibold">{order.id}</strong>
            </span>
            <span className="bg-secondary text-on-secondary px-2.5 py-0.5 rounded-full font-label-md font-semibold text-[11px]">
              Table {order.table || "—"}
            </span>
          </div>

          {/* Ordered items */}
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-on-surface">
                <span className="truncate max-w-[200px]">
                  {item.name} <span className="text-on-surface-variant font-semibold">×{item.qty}</span>
                </span>
                <span className="font-semibold text-primary">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-outline-variant/20 flex justify-between items-center text-sm font-bold text-primary">
            <span>Total</span>
            <span className="text-base text-secondary font-bold">₹{order.total}</span>
          </div>
        </div>

        <p className="font-caption text-xs text-on-surface-variant max-w-xs">
          Your items will be freshly prepared and brought to your table.
        </p>

        {/* Dismiss / Browse more */}
        <button
          onClick={onClose}
          className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-full hover:bg-primary/90 active:scale-98 transition shadow-sm font-semibold text-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
          <span>Order More / Back to Menu</span>
        </button>
      </div>
    </div>
  );
}
