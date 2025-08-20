import React from "react";
import Header from "../components/header";
import RouletteBoard from "./RouletteBoard";
import RouletteGame from "./roulette-game";

const AutoRoulette = () => {
  return (
    <div className="relative w-full flex flex-col items-">
      <Header />

      {/* Wheel on top */}
      <div className="relative w-full flex justify-center">
        <div className="absolute  left-0 z-20">
          <RouletteGame />
        </div>
      </div>

      {/* Board below */}
      <div className="w-full z-10">
        <RouletteBoard />
      </div>
    </div>
  );
};

export default AutoRoulette;
