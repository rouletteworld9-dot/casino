import React, { useState } from "react";

const DEFAULT_DENOMINATIONS = [10, 20, 50, 100, 500, 2500];

const ChipSelector = ({
  denominations = DEFAULT_DENOMINATIONS,
  selectedCoin,
  betLocked,
  onSelect,
  handlePlaceBet,
  hasBets,
}) => {
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

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center">
      {denominations.map((value) => {
        const isActive = selectedCoin === value;
        return (
          <div
            key={value}
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(value)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/coinValue", String(value));
              // visual drag image can be improved; default is okay
            }}
            className={
              "w-10 h-10 rounded-full relative grid place-items-center text-[9px] font-bold cursor-pointer transition select-none " +
              (isActive
                ? "scale-125 shadow-[0_0_0_3px_rgba(255,255,211,0.7),0_0_18px_rgba(234,179,128,0.65)]"
                : "shadow-md hover:scale-115")
            }
            style={{
              background: colorByDenom(value),
              color: "#111827",
              boxShadow:
                "inset 0 2px 6px rgba(0,0,0,0.25), 0 4px 10px rgba(0,0,0,0.3)",
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
                width: 30,
                height: 30,
                background:
                  "radial-gradient(circle at 30% 30%, #f8fafc 0%, #e5e7eb 65%, #d1d5db 100%)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              ₹{value}
            </span>
            {/* outer rim */}
            <span className="pointer-events-none absolute inset-0 rounded-full border borde r-white/30" />
          </div>
        );
      })}
      <div className="">
        <button
          className={`px-8 py-1 rounded-full font-bold text-lg shadow-lg transition bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-2 border-yellow-700 ${!hasBets || betLocked ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}`}
          onClick={handlePlaceBet}
          disabled={betLocked || !hasBets}
        >
          Place Bet
        </button>
      </div>
    </div>
  );
};

export default ChipSelector;
