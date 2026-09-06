const STEPS = [
  { id: "placed", label: "Order Placed", icon: "receipt_long", timeFallback: "10:42 AM" },
  { id: "preparing", label: "Preparing", icon: "local_cafe", timeFallback: "10:45 AM", note: "Crafting your order with care." },
  { id: "ready", label: "Ready for Pickup", icon: "check_circle", timeFallback: "Pending" },
  { id: "served", label: "Served", icon: "done_all", timeFallback: "Pending" },
];

export default function StatusStepper({ status, createdAt, updatedAt }) {
  const idx = STEPS.findIndex((s) => s.id === status);
  const formatTime = (iso) => {
    if (!iso) return null;
    try { return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); } catch { return null; }
  };
  return (
    <div className="bg-surface-container-low rounded-[24px] p-6 md:p-10 border border-tertiary shadow-level-1 relative overflow-hidden">
      <div className="relative z-10 space-y-8">
        {STEPS.map((step, i) => {
          const isDone = i < idx;
          const isActive = i === idx;
          const isPending = i > idx;
          const isFirst = i === 0;
          const time = isFirst ? (formatTime(createdAt) || step.timeFallback) : isActive ? (formatTime(updatedAt) || step.timeFallback) : isDone ? step.timeFallback : "Pending";
          // styling per state matching template
          let circleClass = "";
          let labelClass = "";
          let lineClass = "";
          if (isDone) {
            circleClass = "bg-secondary text-on-secondary shadow-md";
            labelClass = "text-primary";
            lineClass = "bg-secondary";
          } else if (isActive) {
            // preparing style: primary-container with ring
            if (step.id === "preparing") {
              circleClass = "bg-primary-container text-on-primary-container shadow-md ring-4 ring-primary-container/20";
            } else {
              circleClass = "bg-secondary text-on-secondary shadow-md";
            }
            labelClass = "text-primary";
            lineClass = isDone ? "bg-secondary" : "bg-outline-variant";
          } else {
            circleClass = "bg-surface-container-highest text-on-surface-variant border border-outline-variant";
            labelClass = "text-on-surface-variant";
            lineClass = "bg-outline-variant";
          }
          const opacity = isPending ? "opacity-50" : "";
          return (
            <div key={step.id} className={`flex gap-6 relative group ${opacity}`}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${circleClass}`}>
                  <span className={`material-symbols-outlined ${isActive || isDone ? "fill" : ""} ${isActive && step.id === "preparing" ? "animate-pulse" : ""}`}>{step.icon}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 h-full absolute top-12 left-6 -ml-px ${isDone ? "bg-secondary" : "bg-outline-variant"} ${i < idx ? "bg-secondary" : "bg-outline-variant"}`}></div>
                )}
              </div>
              <div className={`${isActive ? "pb-8 pt-2" : isDone ? "pb-8 pt-2" : "pb-8 pt-2"}`}>
                <h3 className={`font-headline-md text-headline-md ${labelClass}`} style={{ fontFamily: "Montserrat, sans-serif" }}>{step.label}</h3>
                <p className="text-on-surface-variant font-caption text-caption mt-1">{time}</p>
                {isActive && step.note && (
                  <div className="mt-4 bg-surface rounded-xl p-4 border border-tertiary text-sm text-on-surface max-w-md">
                    <p className="font-label-md text-label-md text-secondary mb-1">Barista Note:</p>
                    <p>{step.note}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
