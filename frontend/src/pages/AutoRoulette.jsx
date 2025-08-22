import React from "react";
import Header from "../components/header";
import RouletteBoard from "./RouletteBoard";
import RouletteGame from "./roulette-game";
import LastResults from "../components/ui/LastResults";

const AutoRoulette = () => {
  return (
    <div className="relative w-full flex flex-col items-">
      <Header />
      
      <div className="bg-black/10 absolute top-11 left-140 flex justify-center items-center"><LastResults/></div>

      {/* Wheel on top */}
      <div className="relative w-full flex justify-center">
        <div className="absolute top-[-30px] left-10 z-20">
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
