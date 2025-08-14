import React from "react";
import GameContainer from "./GameContainer";
import SearchBar from "./ui/SearchBar";
import IconButton from "./ui/IconButton";
import { ChevronRight } from "lucide-react";
import HeroSlider from "./ui/HeroSlider";

const CasinoDashboardContent = () => {
  return (
    <div className="flex-1 overflow-y-auto px-2 custom-scroll">
      {/* Hero Slider */}
      <HeroSlider className="h-84 rounded-2xl mb-3" />

      {/* Sticky Search and Filters */}
      <div className="sticky top-0 z-20 pb-2 pt-2 ">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible custom-scroll flex-nowrap">
          <div className="flex-shrink-0 w-[50%] sm:w-auto">
            <SearchBar />
          </div>

          <IconButton
            label="All providers"
            icon={<ChevronRight size={16} className="rotate-90" />}
            className="flex-shrink-0 w-[40%] sm:w-[25%] cursor-pointer"
          />

          <IconButton
            label="Filters"
            icon={<ChevronRight size={16} className="rotate-90" />}
            className="flex-shrink-0 w-[40%] sm:w-[25%] cursor-pointer"
          />

          <IconButton
            label=""
            icon={<span>🍀</span>}
            className="flex-shrink-0 p-2 w-auto"
          />
        </div>
      </div>

      {/* Top Games Section */}
      <div className="bg-[#231528] p-3 rounded-t-lg">
        <h1 className="mb-4 text-2xl font-semibold">TOP</h1>
        <GameContainer className="lg:grid-cols-5 sm:grid-cols-2" />
      </div>
    </div>
  );
};

export default CasinoDashboardContent;
