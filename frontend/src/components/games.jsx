import GameTabs from "./ui/GameTabs";
import GameContainer from "./GameContainer";
import GameCategories from "./ui/GameCategories";

const CasinoGamesUI = () => {
  return (
    <div className="min-h-screen  text-white">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[97%] rounded-2xl bg-[#231528]">
        {/* Game Tabs */}
        <div className="overflow-x-auto sm:overflow-visible custom-scroll ">
          <GameTabs className="text-lg sm:text-xl md:text-3xl" />
        </div>

        <div>
          {/* Categories - Scrollable on small screens */}
          <div className="overflow-x-auto sm:overflow-visible custom-scroll">
            <GameCategories
              className="flex flex-row gap-3 sm:gap-1 pt-4 sm:pt-6 sm:x-0 px-2"
              buttonClassName="min-w-[50px] sm:min-w-[70px]"
            />
          </div>

          {/* Game Grid */}
          <div className="flex-1 mt-4">
            {/* Example SearchBar Placeholder */}
            {/* <SearchBar /> */}

            <GameContainer
              className="
                grid grid-cols-7
                
                gap-3 sm:gap-4
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoGamesUI;
