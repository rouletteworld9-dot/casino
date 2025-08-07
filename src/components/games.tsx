import GameTabs from "./ui/GameTabs";
import GameCategories from "./ui/GameCategories";
import SearchBar from "./ui/SearchBar";
import GameContainer from "./GameContainer";

const CasinoGamesUI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17071D] via-[#17071D] to-gray-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-[97%] rounded-2xl bg-[#2c023b]">
        <GameTabs />
        <div className="flex gap-8">
          <GameCategories />
          <div className="flex-1">
            {/* Search Bar */}
            <SearchBar />
            <GameContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoGamesUI;
