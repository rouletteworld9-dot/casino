import { AnimatePresence,motion } from "framer-motion";
import React from "react";
import BetPlacedAnimation from "../components/ui/BetPlacedAnimation";
import { useDelay } from "../hooks/useDelay";
import { useGameStore } from "../stores/useGameStore";
// import { transform } from "typescript";

const numbers = [
  { num: 0, color: "green" },
  { num: 32, color: "red" },
  { num: 15, color: "black" },
  { num: 19, color: "red" },
  { num: 4, color: "black" },
  { num: 21, color: "red" },
  { num: 2, color: "black" },
  { num: 25, color: "red" },
  { num: 17, color: "black" },
  { num: 34, color: "red" },
  { num: 6, color: "black" },
  { num: 27, color: "red" },
  { num: 13, color: "black" },
  { num: 36, color: "red" },
  { num: 11, color: "black" },
  { num: 30, color: "red" },
  { num: 8, color: "black" },
  { num: 23, color: "red" },
  { num: 10, color: "black" },
  { num: 5, color: "red" },
  { num: 24, color: "black" },
  { num: 16, color: "red" },
  { num: 33, color: "black" },
  { num: 1, color: "red" },
  { num: 20, color: "black" },
  { num: 14, color: "red" },
  { num: 31, color: "black" },
  { num: 9, color: "red" },
  { num: 22, color: "black" },
  { num: 18, color: "red" },
  { num: 29, color: "black" },
  { num: 7, color: "red" },
  { num: 28, color: "black" },
  { num: 12, color: "red" },
  { num: 35, color: "black" },
  { num: 3, color: "red" },
  { num: 26, color: "black" },
];

// bets: { [cellId: string]: denomination[] }, cellTotals: { [cellId: string]: number }

const RouletteBoard = ({
  // lastResults,
  bets = {},
  onCellClick = () => {},
  onCellDrop = () => {},
  cellTotals = {},
}) => {
  const { phase, lastResults } = useGameStore();
  const rows = 3;
  const cols = 12;

  // map row/col to roulette number
  const getNumberAtPosition = (row, col) => {
    const num = col * rows + (rows - row);
    return numbers.find((n) => n.num === num);
  };

  // === Overlay Bets ===
  const renderOverlayBets = () => {
    const hitboxes = [];

    // Splits
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const num = getNumberAtPosition(r, c)?.num;

        if (c < cols - 1) {
          const numRight = getNumberAtPosition(r, c + 1)?.num;

          hitboxes.push(
            renderHitbox("split", [num, numRight], r, c, "horizontal")
          );
        }
        if (r < rows - 1) {
          const numDown = getNumberAtPosition(r + 1, c)?.num;
          hitboxes.push(
            renderHitbox("split", [num, numDown], r, c, "vertical")
          );
        }
      }
    }
    // Zero splits
    hitboxes.push(
      renderZeroHitbox("split", [0, 1], { top: "70%", left: "-1%" })
    );
    hitboxes.push(
      renderZeroHitbox("split", [0, 2], { top: "35%", left: "-1%" })
    );
    hitboxes.push(
      renderZeroHitbox("split", [0, 3], { top: "0%", left: "-1%" })
    );

    // Corners
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const a = getNumberAtPosition(r, c)?.num;
        const b = getNumberAtPosition(r, c + 1)?.num;
        const d = getNumberAtPosition(r + 1, c)?.num;
        const e = getNumberAtPosition(r + 1, c + 1)?.num;
        hitboxes.push(renderHitbox("corner", [a, b, d, e], r, c, "corner"));
      }
    }
    // First four (0-1-2-3)
    hitboxes.push(
      renderZeroHitbox("corner", [0, 1, 2, 3], {
        top: "0%",
        left: "0%",
        width: "32px",
        height: "0px",
      })
    );

    // Streets
    for (let c = 0; c < cols; c++) {
      const base = getNumberAtPosition(0, c)?.num;
      const nums = [base, base - 1, base - 2];
      hitboxes.push(renderRailHitbox("street", nums, c));
    }

    // Lines
    for (let c = 0; c < cols - 1; c++) {
      const base = getNumberAtPosition(0, c)?.num;
      const nums = [base, base - 1, base - 2, base + 3, base + 2, base + 1];
      hitboxes.push(renderRailHitbox("line", nums, c));
    }

    return hitboxes;
  };

  // Fixed renderHitbox function with proper sizing and positioning
  const renderHitbox = (type, numbers, r, c, orientation) => {
    const validNumbers = numbers
      .filter((n) => n != null)
      .map((n) => (typeof n === "object" ? n.num : n))
      .sort((a, b) => a - b);

    const id = `${type}-${validNumbers.join("-")}`;

    const baseStyle = {
      position: "absolute",
      // backgroundColor: "rgba(255, 255, 0, 0.3)", // More visible for debugging
      border: "1px solid transparent",
      cursor: "pointer",
      zIndex: 15, // Higher z-index
      pointerEvents: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    let specificStyle = {};

    if (orientation === "horizontal") {
      // Split bet between horizontally adjacent numbers
      specificStyle = {
        width: "8px", // Increased from 2px
        height: `${100 / rows}%`,
        left: `${((c + 1) * 100) / cols}%`,
        top: `${(r * 100) / rows}%`,
        transform: "translateX(-50%)",
        border: "2px solid transparent",
      };
    } else if (orientation === "vertical") {
      // Split bet between vertically adjacent numbers
      specificStyle = {
        width: `${100 / cols}%`,
        height: "8px", // Increased from 2px
        left: `${(c * 100) / cols}%`,
        top: `${((r + 1) * 100) / rows}%`,
        transform: "translateY(-50%)",
        border: "2px solid transparent",
      };
    } else if (orientation === "corner") {
      // Corner bet at intersection of 4 numbers
      specificStyle = {
        width: "12px", // Increased from 2px
        height: "12px", // Increased from 2px
        left: `${((c + 1) * 100) / cols}%`,
        top: `${((r + 1) * 100) / rows}%`,
        transform: "translate(-50%, -50%)", // Center on intersection
        borderRadius: "50%",
        border: "2px solid transparent",
      };
    }

    const style = { ...baseStyle, ...specificStyle };

    return (
      <div
        key={id}
        className="bet-hitbox"
        data-bet-id={id} // Add this for ChipSelector to find
        style={style}
        onClick={() => onCellClick(id, { type, numbers })}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const value = Number(e.dataTransfer.getData("text/coinValue"));
          if (!Number.isNaN(value)) onCellDrop(id, value);
        }}
        title={`${type}: ${validNumbers.join(", ")}`} // Helpful for debugging
      >
        {renderTotalChip(id)}
      </div>
    );
  };

  // Fixed renderZeroHitbox function
  const renderZeroHitbox = (type, numbers, pos) => {
    const id = `${type}-${numbers.join("-")}`;
    const style = {
      position: "absolute",
      top: pos.top,
      left: pos.left,
      width: pos.width ? pos.width : "0%", // Increased from 10%
      height: pos.height ? pos.height : "30%", // Increased from 20%
      // backgroundColor: "rgba(255, 0, 255, 0.3)", // Different color for zero bets
      border: "2px solid transparent",
      cursor: "pointer",
      zIndex: 15,
      pointerEvents: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    return (
      <div
        key={id}
        className="bet-hitbox"
        style={style}
        data-bet-id={id}
        onClick={() => onCellClick(id, { type, numbers })}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const value = Number(e.dataTransfer.getData("text/coinValue"));
          if (!Number.isNaN(value)) onCellDrop(id, value);
        }}
        title={`${type}: ${numbers.join(", ")}`}
      >
        {renderTotalChip(id)}
      </div>
    );
  };

  // Fixed renderRailHitbox function
  const renderRailHitbox = (type, numbers, c) => {
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const id = `${type}-${sortedNumbers.join("-")}`;
    const isStreet = id.startsWith("street");
    const style = {
      position: "absolute",
      // backgroundColor: "rgba(0, 255, 255, 0.3)", // Different color for rail bets, // Different color for rail bets
      border: "2px solid transparent",
      top: "100%",
      left: isStreet
        ? `${(c * 100) / cols}%`
        : `${(c * 100) / cols + 100 / cols}%`,
      width: isStreet
        ? `${100 / cols}%` // Street: single column width
        : `${20 / cols}% `,
      height: "12px", // Increased from 10%
      cursor: "pointer",
      zIndex: 15,
      pointerEvents: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: "translate(-3px, -3px)",
    };

    return (
      <div
        key={id}
        className="bet-hitbox"
        style={style}
        data-bet-id={id}
        onClick={() => onCellClick(id, { type, numbers })}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const value = Number(e.dataTransfer.getData("text/coinValue"));
          if (!Number.isNaN(value)) onCellDrop(id, value);
        }}
        title={`${type}: ${numbers.join(", ")}`}
      >
        {renderTotalChip(id)}
      </div>
    );
  };

  // Fixed overlay container - remove pointer-events: none
  // === Chips ===
  const colorByDenom = (value) => {
    switch (value) {
      case 10:
        return "#9CA3AF";
      case 20:
        return "#16A34A";
      case 50:
        return "#F59E0B";
      case 100:
        return "#F97316";
      case 500:
        return "#EF4444";
      case 2500:
        return "#22C55E";
      default:
        return "#9CA3AF";
    }
  };

  const winningNumber = phase === "result" && lastResults[0]?.result;
  const delayWinningNumber = useDelay(winningNumber, 5000);

  const renderTotalChip = (cellId) => {
    const total = cellTotals[cellId];
    if (!total) return null;
    const denoms = bets[cellId];
    const lastDenom =
      Array.isArray(denoms) && denoms.length > 0
        ? denoms[denoms.length - 1]
        : 10;
    return (
      <div
        className="absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-2/3 w-6 h-6 rounded-full grid place-items-center text-[10px] cursor-pointer select-none shadow"
        style={{
          background: colorByDenom(lastDenom),
          color: "#111827",
          boxShadow:
            "inset 0 2px 6px rgba(0,0,0,0.25), 0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 2,
        }}
      >
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
        <span
          className="pointer-events-none rounded-full grid place-items-center rotate-[270deg]"
          style={{
            width: 20,
            height: 20,
            background:
              "radial-gradient(circle at 30% 30%, #f8fafc 0%, #e5e7eb 65%, #d1d5db 100%)",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          ₹{total}
        </span>
        <span className="pointer-events-none absolute inset-0 rounded-full border border-white/30" />
      </div>
    );
  };

  const getNumberColor = (color) => {
    if (color === "red") return "bg-[#EC4326] text-white";
    if (color === "black") return "bg-[#0E0E0E] text-white";
    return "bg-[#229264] text-white";
  };

  return (
    <motion.div
  className="sm:items-center sm:mb-10 items-end h-full sm:justify-center justify-start flex flex-col sm:min-h-screen w-full z-90"
  animate={
    phase === "betting"
      ? { y: -50, opacity: 0.7 }
      : { y: 0, opacity: 0.5 }
  }
  transition={{ duration: 0.9, ease: "easeInOut" }}
>
      <div
        className={`sm:max-w-3xl sm:ml-40 sm:mt-30 sm:h-full 
        lg:[transform:perspective(1000px)_rotateX(10deg)_rotateY(0deg)_rotateZ(30deg)_skewX(0deg)]
        [transform:perspective(1000px)_rotateX(0deg)_rotateY(0deg)_rotateZ(90deg)_skewX(0deg)]
        ${phase === "betting" ? " sm:w-lg w-2xl h-140 " : " h-120 sm:h-full w-xl sm:w-lg "}
        transition-all duration-500 ease-in-out
    `}
      >
        <div className="">
          {/* Main table container */}
          <div className="flex ">
            {/* Zero section */}
            <div className="flex flex-col">
              <div
                onClick={() => onCellClick("0")}
                className="
      w-10 h-48 sm:w-20 sm:h-39
      flex items-center justify-center 
      [clip-path:polygon(20%_0%,80%_0%,100%_0%,100%_100%,20%_100%,0%_50%)]
      bg-white 
      p-[2px]
    "
              >
                <div
                  id={`cell-0`}
                  className={`
        ${getNumberColor("green")} 
        w-full h-full flex items-center justify-center 
       sm:text-4xl text-xl  
        [clip-path:polygon(20%_0%,80%_0%,100%_0%,100%_100%,20%_100%,0%_50%)]
        relative
      `}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const value = Number(
                      e.dataTransfer.getData("text/coinValue")
                    );
                    if (!Number.isNaN(value)) onCellDrop("0", value);
                  }}
                >
                  {" "}
                  <span className="block transform rotate-[270deg]">
                    0{renderTotalChip("0")}
                  </span>
                  <AnimatePresence>
                    {delayWinningNumber === 0 && (
                      <>
                        <BetPlacedAnimation
                          phase={phase}
                          trigger={delayWinningNumber}
                        />
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Main number grid */}
            <div className="sm:flex-1 relative">
              <div className="grid grid-cols-12 w-full relative ">
                {Array.from({ length: 3 }, (_, row) =>
                  Array.from({ length: 12 }, (_, col) => {
                    const numberData = getNumberAtPosition(row, col);
                    return (
                      <div
                        id={`cell-${numberData.num}`}
                        key={`${row}-${col}`}
                        className={`${getNumberColor(numberData?.color)}
                                    w-60 sm:w-9   h-16 sm:h-13
                                    flex items-center justify-center 
                                    text-xs sm:text-xl md:text-xl 
                                      border-1 border-white cursor-pointer relative
                                    max-sm:w-full max-sm:aspect-square`}
                        onClick={() =>
                          numberData && onCellClick(String(numberData.num))
                        }
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (!numberData) return;
                          const value = Number(
                            e.dataTransfer.getData("text/coinValue")
                          );
                          if (!Number.isNaN(value))
                            onCellDrop(String(numberData.num), value);
                        }}
                      >
                        {/* number, rotated */}
                        <span className="block transform rotate-[270deg] text-[18px] sm:text-sm">
                          {numberData?.num}
                        </span>

                        {/* chips rendered as overlay inside the div (clickable area = whole div) */}
                        {numberData && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {renderTotalChip(String(numberData.num))}
                          </div>
                        )}

                        <AnimatePresence>
                          {delayWinningNumber === numberData?.num && (
                            <BetPlacedAnimation
                              phase={phase}
                              trigger={bets[numberData?.num]?.length}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    position: "absolute",
                    top: -0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    background: "transparent",
                  }}
                >
                  {renderOverlayBets()}
                </div>
              </div>

              {/* Bottom betting sections */}
              <div className="grid grid-cols-3 ">
                <div
                  id="cell-1st12"
                  className="bg-[#2939A5] text-white sm:text-xl text-xl  sm:h-10 h-13 flex items-center justify-center border border-white cursor-pointer relative"
                  onClick={() => onCellClick("1st12")}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const value = Number(
                      e.dataTransfer.getData("text/coinValue")
                    );
                    if (!Number.isNaN(value)) onCellDrop("1st12", value);
                  }}
                >
                  1 <span className="text-[7px] mr-1">ST </span>
                  12
                  {renderTotalChip("1st12")}
                </div>
                <div
                  id="cell-2nd12"
                  className="bg-[#2939A5] text-white  sm:text-xl text-xl sm:h-10  h-13 flex items-center justify-center border border-white cursor-pointer relative"
                  onClick={() => onCellClick("2nd12")}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const value = Number(
                      e.dataTransfer.getData("text/coinValue")
                    );
                    if (!Number.isNaN(value)) onCellDrop("2nd12", value);
                  }}
                >
                  2 <span className="text-[7px] mr-1">nd </span>
                  12
                  {renderTotalChip("2nd12")}
                </div>
                <div
                  id="cell-3rd12"
                  className="bg-[#2939A5] text-white sm:text-lg text-xl sm:h-10  h-13 flex items-center justify-center border border-white cursor-pointer relative"
                  onClick={() => onCellClick("3rd12")}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const value = Number(
                      e.dataTransfer.getData("text/coinValue")
                    );
                    if (!Number.isNaN(value)) onCellDrop("3rd12", value);
                  }}
                >
                  3 <span className="text-[7px] mr-1">rd </span>
                  12
                  {renderTotalChip("3rd12")}
                </div>
              </div>
            </div>

            {/* Right side betting areas */}
            <div className="flex flex-col  sm:w-14 w-60">
              <div
                id="cell-2to1_top"
                className="w-10 sm:w-full bg-[#2939A5] text-white text-sm  sm:h-13   h-16 flex items-center justify-center border border-white cursor-pointer relative"
                onClick={() => onCellClick("2to1_top")}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const value = Number(
                    e.dataTransfer.getData("text/coinValue")
                  );
                  if (!Number.isNaN(value)) onCellDrop("2to1_top", value);
                }}
              >
                <span className="rotate-270">
                  2 <span className="text-[10px]"> TO</span> 1
                  {renderTotalChip("2to1_top")}
                </span>
              </div>
              <div
                id="cell-2to1_middle"
                className="w-10 sm:w-full bg-[#2939A5] text-white text-sm   sm:h-13   h-16  flex items-center justify-center border border-white cursor-pointer relative"
                onClick={() => onCellClick("2to1_middle")}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const value = Number(
                    e.dataTransfer.getData("text/coinValue")
                  );
                  if (!Number.isNaN(value)) onCellDrop("2to1_middle", value);
                }}
              >
                <span className="rotate-270">
                  2 <span className="text-[10px]"> TO</span> 1
                  {renderTotalChip("2to1_middle")}
                </span>
              </div>
              <div
                id="cell-2to1_bottom"
                className="w-10 sm:w-full bg-[#2939A5] text-white  text-sm     h-16 sm:h-13 flex items-center justify-center border border-white cursor-pointer relative"
                onClick={() => onCellClick("2to1_bottom")}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const value = Number(
                    e.dataTransfer.getData("text/coinValue")
                  );
                  if (!Number.isNaN(value)) onCellDrop("2to1_bottom", value);
                }}
              >
                <span className="rotate-270">
                  2 <span className="text-[10px]"> TO</span> 1
                  {renderTotalChip("2to1_bottom")}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom section with 1-18, EVEN, etc. */}
          <div
            className={`sm:w-94 overflow-hidden sm:ml-20 ml-10 grid grid-cols-6 ${phase === "betting" ? "w-120 " : "w-102"}`}
          >
            <div
              id="cell-1-18"
              className=" bg-[#2939A5] text-white text-lg sm:h-10   h-13 flex items-center justify-center border border-white cursor-pointer relative"
              onClick={() => onCellClick("1-18")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const value = Number(e.dataTransfer.getData("text/coinValue"));
                if (!Number.isNaN(value)) onCellDrop("1-18", value);
              }}
            >
              1-18
              {renderTotalChip("1-18")}
            </div>
            <div
              id="cell-even"
              className="bg-[#2939A5] text-white text-lg sm:h-10 h-13 flex items-center justify-center border border-white cursor-pointer relative"
              onClick={() => onCellClick("even")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const value = Number(e.dataTransfer.getData("text/coinValue"));
                if (!Number.isNaN(value)) onCellDrop("even", value);
              }}
            >
              EVEN
              {renderTotalChip("even")}
            </div>
            <div
              id="cell-red"
              className="bg-[#2939A5] text-white text-lg sm:h-10 h-13 flex items-center justify-center border border-white relative cursor-pointer"
              onClick={() => onCellClick("red")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const value = Number(e.dataTransfer.getData("text/coinValue"));
                if (!Number.isNaN(value)) onCellDrop("red", value);
              }}
            >
              <div
                className="w-10 h-10 bg-white flex items-center justify-center"
                style={{
                  clipPath: "polygon(51% 22%, 100% 50%, 52% 76%, 0% 50%)",
                }}
              >
                <div
                  className="w-8 h-8 bg-red-600"
                  style={{
                    clipPath: "polygon(51% 22%, 100% 50%, 52% 76%, 0% 50%)",
                  }}
                ></div>
                {renderTotalChip("red")}
              </div>
            </div>
            <div
              id="cell-black"
              className="bg-[#2939A5] text-white text-xs sm:h-10  h-13 flex items-center justify-center border border-white relative cursor-pointer"
              onClick={() => onCellClick("black")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const value = Number(e.dataTransfer.getData("text/coinValue"));
                if (!Number.isNaN(value)) onCellDrop("black", value);
              }}
            >
              <div
                className="w-10 h-10 bg-white flex items-center justify-center"
                style={{
                  clipPath: "polygon(51% 22%, 100% 50%, 52% 76%, 0% 50%)",
                }}
              >
                <div
                  className="w-8 h-8 bg-gray-900"
                  style={{
                    clipPath: "polygon(51% 22%, 100% 50%, 52% 76%, 0% 50%)",
                  }}
                ></div>
                {renderTotalChip("black")}
              </div>
            </div>
            <div
              id="cell-odd"
              className="bg-[#2939A5] text-white text-lg  sm:h-10 h-13 flex items-center justify-center border border-white cursor-pointer relative"
              onClick={() => onCellClick("odd")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const value = Number(e.dataTransfer.getData("text/coinValue"));
                if (!Number.isNaN(value)) onCellDrop("odd", value);
              }}
            >
              ODD
              {renderTotalChip("odd")}
            </div>
            <div
              id="cell-19-36"
              className="bg-[#2939A5] text-white text-lg sm:h-10 h-13 flex items-center justify-center border border-white cursor-pointer relative"
              onClick={() => onCellClick("19-36")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const value = Number(e.dataTransfer.getData("text/coinValue"));
                if (!Number.isNaN(value)) onCellDrop("19-36", value);
              }}
            >
              19-36
              {renderTotalChip("19-36")}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RouletteBoard;
