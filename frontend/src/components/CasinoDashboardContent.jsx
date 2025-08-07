import React from 'react';
import GameContainer from './GameContainer';
import SearchBar from './ui/SearchBar';
import IconButton from './ui/IconButton';
import { ChevronRight } from 'lucide-react';
import HeroSlider from './ui/HeroSlider';

const CasinoDashboardContent = () => {
  return (
    <div className="flex-1 overflow-y-auto px-2 custom-scroll">
      {/* Hero Slider */}
      <HeroSlider className="h-84 rounded-2xl mb-3" />

      {/* Sticky Search and Filters */}
      <div className="sticky top-0 z-20 bg-[#17071D] pb-3 pt-2">
        <div className="flex gap-3 ">
          <SearchBar />
          <IconButton
            label="All providers"
            icon={<ChevronRight size={16} className="rotate-90" />}
            className="w-[25%]"
          />
          <IconButton
            label="Filters"
            icon={<ChevronRight size={16} className="rotate-90" />}
            className="w-[25%]"
          />
          <IconButton
            label=""
            icon={<span>🍀</span>}
            className="p-2 w-auto"
          />
        </div>
      </div>

      {/* Top Games Section */}
      <div className="bg-[#231528] p-3 rounded-t-2xl">
        <h1 className="mb-4 text-2xl font-semibold">TOP</h1>
        <GameContainer className="grid-cols-5" />
      </div>
    </div>
  );
};

export default CasinoDashboardContent;
