import { AnimatePresence } from "framer-motion";
import React from "react";
import BetPlacedAnimation from "../components/ui/BetPlacedAnimation";
import { useAuthStore } from "../stores/useAuthStore";
import { useGameSocket } from "../hooks/useGameSocket";
import { useDelay } from "../hooks/useDelay";
import { useGameStore } from "../stores/useGameStore";

// bets: { [cellId: string]: denomination[] }, cellTotals: { [cellId: string]: number }
const RouletteBoard = ({
  // lastResults,
  bets = {},
  onCellClick = () => {},
  onCellDrop = () => {},
  cellTotals = {},
}) => {
  const { phase, lastResults } = useGameStore();
  // console.log(phase , "phaaaaaase")
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

  // Create the main grid (excluding 0)
  const mainNumbers = numbers.slice(1); // Remove 0 from main grid

  // Arrange numbers in the traditional roulette layout (3 rows, 12 columns)
  const getNumberAtPosition = (row, col) => {
    const num = col * 3 + (3 - row);
    return mainNumbers.find((n) => n.num === num);
  };

  // Helper to render a styled chip on a cell (matches ChipSelector)
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

  const winningNumber = phase === "result" && lastResults[0]?.result;
  const delayWinningNumber = useDelay(winningNumber, 5000);
  // Show only the total amount for a cell (if any)
  const renderTotalChip = (cellId) => {
    const total = cellTotals[cellId];
    if (!total) return null;
    // Use the color of the last denomination for style, or default
    const denoms = bets[cellId];
    const lastDenom =
      Array.isArray(denoms) && denoms.length > 0
        ? denoms[denoms.length - 1]
        : 10;
    return (
      <div
        className="absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-2/3 w-6 h-6 rounded-full grid place-items-center justify-items-center text-[10px]   cursor-pointer select-none shadow"
        style={{
          background: colorByDenom(lastDenom),
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
        {/* outer rim */}
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
    <div
      className={`sm:items-center opacity-70 sm:mb-10 items-end justify-center flex flex-col min-h-screen w-full
    transition-all duration-900 ease-in-out 
    ${phase === "betting" ? "-mt-10 sm:-mt-50 " : ""}
    ${phase !== "betting" ? "sm:-mt-50" : ""}
  `}
    >
      <div
        className={`sm:max-w-4xl  sm:ml-30 sm:mt-10 sm:h-full 
        lg:[transform:perspective(1000px)_rotateX(10deg)_rotateY(0deg)_rotateZ(30deg)_skewX(0deg)]
        [transform:perspective(1000px)_rotateX(0deg)_rotateY(0deg)_rotateZ(90deg)_skewX(0deg)]
        ${phase === "betting" ? "-mt-60  w-lg h-100 " : "mt-20 sm:mt-0 h-110 sm:h-full w-lg "}
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
      w-10 h-42 sm:w-20
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
            <div className="sm:flex-1 ">
              <div className="grid grid-cols-12 w-full">
                {Array.from({ length: 3 }, (_, row) =>
                  Array.from({ length: 12 }, (_, col) => {
                    const numberData = getNumberAtPosition(row, col);
                    return (
                      <div
                        id={`cell-${numberData.num}`}
                        key={`${row}-${col}`}
                        className={`${getNumberColor(numberData?.color)}
            w-60 sm:w-9 h-14 
            flex items-center justify-center 
            text-xs sm:text-xl md:text-xl 
              border border-white cursor-pointer relative
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
              </div>

              {/* Bottom betting sections */}
              <div className="grid grid-cols-3 ">
                <div
                  id="cell-1st12"
                  className="bg-[#2939A5] text-white sm:text-lg text-xl   h-14 flex items-center justify-center border border-white cursor-pointer relative"
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
                  className="bg-[#2939A5] text-white  sm:text-lg text-xl   h-14 flex items-center justify-center border border-white cursor-pointer relative"
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
                  className="bg-[#2939A5] text-white sm:text-lg text-xl   h-14 flex items-center justify-center border border-white cursor-pointer relative"
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
            <div className="flex flex-col  sm:w-16 w-60">
              <div
                id="cell-2to1_top"
                className="w-10 sm:w-full bg-[#2939A5] text-white text-sm   h-14 flex items-center justify-center border border-white cursor-pointer relative"
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
                className="w-10 sm:w-full bg-[#2939A5] text-white text-sm   h-14 flex items-center justify-center border border-white cursor-pointer relative"
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
                className="w-10 sm:w-full bg-[#2939A5] text-white  text-sm   h-14 flex items-center justify-center border border-white cursor-pointer relative"
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
          <div className="sm:w-92 overflow-hidden  w-87 sm:ml-20 ml-10 grid grid-cols-6">
            <div
              id="cell-1-18"
              className=" bg-[#2939A5] text-white text-lg h-10 flex items-center justify-center border border-white cursor-pointer relative"
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
              className="bg-[#2939A5] text-white text-lg   h-10 flex items-center justify-center border border-white cursor-pointer relative"
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
              className="bg-[#2939A5] text-white text-lg   h-10 flex items-center justify-center border border-white relative cursor-pointer"
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
              className="bg-[#2939A5] text-white text-xs   h-10 flex items-center justify-center border border-white relative cursor-pointer"
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
              className="bg-[#2939A5] text-white text-lg   h-10 flex items-center justify-center border border-white cursor-pointer relative"
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
              className="bg-[#2939A5] text-white text-lg   h-10 flex items-center justify-center border border-white cursor-pointer relative"
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
    </div>
  );
};

export default RouletteBoard;
