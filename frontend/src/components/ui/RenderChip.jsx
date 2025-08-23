const colorByDenom = (value) => {
  switch (value) {
    case 10:
      return "#9CA3AF"; // gray
    case 20:
      return "#16A34A"; // green
    case 50:
      return "#F59E0B"; // amber/orange
    case 100:
      return "#F97316"; // orange
    case 500:
      return "#EF4444"; // red
    case 2500:
      return "#22C55E"; // green
    default:
      return "#9CA3AF";
  }
};

const RenderChip = ({ denomination }) => {
  if (!denomination) return null;

  return (
    <div
      className="absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-2/3 w-8.5 h-8.5 rounded-full grid place-items-center justify-items-center text-[7px] font-bold cursor-pointer select-none shadow"
      style={{
        background: colorByDenom(denomination),
        color: "#111827",
        boxShadow:
          "inset 0 2px 6px rgba(0,0,0,0.25), 0 4px 10px rgba(0,0,0,0.3)",
        zIndex: 2,
      }}
    >
      {/* stripes ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "repeating-conic-gradient(#ffffff 0 8deg, transparent 8deg 28deg)",
          WebkitMask:
            "radial-gradient(circle at center, transparent 0 60%, black 61% 100%)",
          mask: "radial-gradient(circle at center, transparent 0 60%, black 61% 100%)",
          opacity: 0.9,
        }}
      />
      {/* center */}
      <span
        className="pointer-events-none rounded-full grid place-items-center"
        style={{
          width: 32,
          height: 32,
          background:
            "radial-gradient(circle at 30% 30%, #f8fafc 0%, #e5e7eb 65%, #d1d5db 100%)",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        ₹{denomination}
      </span>
      {/* outer rim */}
      <span className="pointer-events-none absolute inset-0 rounded-full border border-white/30" />
    </div>
  );
};

export default RenderChip;
