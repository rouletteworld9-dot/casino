import React from "react";
import { useGameSocket } from "../hooks/useGameSocket";
import { useAuthStore } from "../stores/useAuthStore";
import { AnimatePresence } from "framer-motion";
import BetPlacedAnimation from "../components/ui/BetPlacedAnimation";
import RenderChip from "../components/ui/RenderChip";
// bets: { [cellId: string]: denomination }
const RouletteBoard = ({
  bets = {},
  onCellClick = () => {},
  onCellDrop = () => {},
}) => {
  const user = useAuthStore((state) => state.user);
  const { lastResults, phase, placeBet, updateBetData } = useGameSocket(
    user?._id
  );

  const winningNumber = phase === "result" && lastResults[0]?.result;
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

  const chipFor = (cellId) => <RenderChip denomination={bets[cellId]} />;
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

  const getNumberColor = (color) => {
    if (color === "red") return "bg-[#EC4326] text-white";
    if (color === "black") return "bg-[#0E0E0E] text-white";
    return "bg-[#229264] text-white";
  };

  return (
    <div
      className="items-center justify-center flex flex-col min-h-screen w-full"
      // style={{
      //   backgroundImage: "url('/game/roulettetable.webp')",
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
    >
      <div
        className="max-w-3xl ml-25 -mt-35 shadow-2xl transform"
        style={{
          background: "linear-gradient(125deg, #1e40af 0%, #3730a3 100%)",
          transform:
            "perspective(1000px) rotateX(10deg) rotateY(0deg) rotateZ(30deg) skewx(0deg)",
        }}
      >
        <div className="">
          {/* Main table container */}
          <div className="flex ">
            {/* Zero section */}
            <div className="flex flex-col">
              <div
                className="
      w-20 h-50 
      flex items-center justify-center 
      [clip-path:polygon(20%_0%,80%_0%,100%_0%,100%_100%,20%_100%,0%_50%)]
      bg-white 
      p-[2px]
    "
              >
                <div
                  className={`
        ${getNumberColor("green")} 
        w-full h-full flex items-center justify-center 
        text-4xl font-bold 
        [clip-path:polygon(20%_0%,80%_0%,100%_0%,100%_100%,20%_100%,0%_50%)]
        relative
      `}
                  onClick={() => onCellClick("0")}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const value = Number(
                      e.dataTransfer.getData("text/coinValue")
                    );
                    if (!Number.isNaN(value)) onCellDrop("0", value);
                  }}
                >
                  <span style={{ transform: "rotate(270deg)" }}>0</span>
                  {chipFor("0")}
                  <AnimatePresence>
                    {winningNumber === 0 && <BetPlacedAnimation />}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Main number grid */}
            <div className="flex-1 ">
              {/* Numbers grid */}
              <div className="grid grid-cols-12">
                {Array.from({ length: 3 }, (_, row) =>
                  Array.from({ length: 12 }, (_, col) => {
                    const numberData = getNumberAtPosition(row, col);
                    return (
                      <div
                        key={`${row}-${col}`}
                        className={`${getNumberColor(
                          numberData?.color
                        )} relative w-9 h-12 flex items-center justify-center text-lg font-bold border border-white cursor-pointer`}
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
                        {/* Rotated number only */}
                        <span
                          style={{
                            transform: "rotate(270deg)",
                            display: "block", // so it doesn't stretch
                          }}
                        >
                          {numberData?.num}
                        </span>

                        {/* Chip absolutely positioned against parent cell (relative) */}
                        {numberData && chipFor(String(numberData.num))}

                        {/* Animation if win */}
                        <AnimatePresence>
                          {winningNumber === numberData?.num && (
                            <BetPlacedAnimation />
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom betting sections */}
              <div className="grid grid-cols-12 bg-[#2939A5]">
                <div
                  className="col-span-4 text-white text-xs font-bold h-14 flex items-center justify-center border border-white cursor-pointer relative"
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
                  1ST 12
                  {chipFor("1st12")}
                </div>
                <div
                  className="col-span-4 text-white text-xs font-bold h-14 flex items-center justify-center border border-white cursor-pointer relative"
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
                  2ND 12
                  {chipFor("2nd12")}
                </div>
                <div
                  className="col-span-4 text-white text-xs font-bold h-14 flex items-center justify-center border border-white cursor-pointer relative"
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
                  3RD 12
                  {chipFor("3rd12")}
                </div>
              </div>
            </div>

            {/* Right side betting areas */}
            <div className="flex flex-col bg-[#2939A5] w-16">
              <div
                className="bg-[#2939A5] text-white text-lg font-bold h-12 flex items-center justify-center border border-white cursor-pointer relative"
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
                2 TO 1{chipFor("2to1_top")}
              </div>
              <div
                className="bg-[#2939A5] text-white text-lg font-bold h-12 flex items-center justify-center border border-white cursor-pointer relative"
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
                2 TO 1{chipFor("2to1_top")}
              </div>
              <div
                className="bg-[#2939A5] text-white text-lg font-bold h-12 flex items-center justify-center border border-white cursor-pointer relative"
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
                2 TO 1{chipFor("2to1_bottom")}
              </div>
            </div>
          </div>

          {/* Bottom section with 1-18, EVEN, etc. */}
          <div className="ml-4 grid grid-cols-6">
            <div
              className="bg-[#2939A5] text-white text-lg font-bold h-10 flex items-center justify-center border border-white cursor-pointer relative"
              onClick={() => onCellClick("1-18")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const value = Number(e.dataTransfer.getData("text/coinValue"));
                if (!Number.isNaN(value)) onCellDrop("1-18", value);
              }}
            >
              1-18
              {chipFor("1-18")}
            </div>
            <div
              className="bg-[#2939A5] text-white text-lg font-bold h-10 flex items-center justify-center border border-white cursor-pointer relative"
              onClick={() => onCellClick("even")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const value = Number(e.dataTransfer.getData("text/coinValue"));
                if (!Number.isNaN(value)) onCellDrop("even", value);
              }}
            >
              EVEN
              {chipFor("even")}
            </div>
            <div className="bg-[#2939A5] text-white text-xs font-bold h-10 flex items-center justify-center border border-white relative">
              <div
                className="w-10 h-10 bg-white flex items-center justify-center cursor-pointer"
                style={{
                  clipPath: "polygon(51% 22%, 100% 50%, 52% 76%, 0% 50%)",
                }}
                onClick={() => onCellClick("red")}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const value = Number(
                    e.dataTransfer.getData("text/coinValue")
                  );
                  if (!Number.isNaN(value)) onCellDrop("red", value);
                }}
              >
                <div
                  className="w-8 h-8 bg-red-600"
                  style={{
                    clipPath: "polygon(51% 22%, 100% 50%, 52% 76%, 0% 50%)",
                  }}
                ></div>
                {chipFor("red")}
              </div>
            </div>
            <div className="bg-[#2939A5] text-white text-xs font-bold h-10 flex items-center justify-center border border-white relative">
              <div
                className="w-10 h-10 bg-white flex items-center justify-center cursor-pointer"
                style={{
                  clipPath: "polygon(51% 22%, 100% 50%, 52% 76%, 0% 50%)",
                }}
                onClick={() => onCellClick("black")}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const value = Number(
                    e.dataTransfer.getData("text/coinValue")
                  );
                  if (!Number.isNaN(value)) onCellDrop("black", value);
                }}
              >
                <div
                  className="w-8 h-8 bg-gray-900"
                  style={{
                    clipPath: "polygon(51% 22%, 100% 50%, 52% 76%, 0% 50%)",
                  }}
                ></div>
                {chipFor("black")}
              </div>
            </div>
            <div
              className="bg-[#2939A5] text-white text-lg font-bold h-10 flex items-center justify-center border border-white cursor-pointer relative"
              onClick={() => onCellClick("odd")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const value = Number(e.dataTransfer.getData("text/coinValue"));
                if (!Number.isNaN(value)) onCellDrop("odd", value);
              }}
            >
              ODD
              {chipFor("odd")}
            </div>
            <div
              className="bg-[#2939A5] text-white text-lg font-bold h-10 flex items-center justify-center border border-white cursor-pointer relative"
              onClick={() => onCellClick("19-36")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const value = Number(e.dataTransfer.getData("text/coinValue"));
                if (!Number.isNaN(value)) onCellDrop("19-36", value);
              }}
            >
              19-36
              {chipFor("19-36")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouletteBoard;
