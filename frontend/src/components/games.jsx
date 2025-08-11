import GameTabs from "./ui/GameTabs";
import GameContainer from "./GameContainer";
import GameCategories from "./ui/GameCategories";

const CasinoGamesUI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17071D] via-[#17071D] to-gray-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-[97%] rounded-2xl bg-[#2c023b]">
        <GameTabs className="text-3xl" />
        <div className="">
          <GameCategories
            className="flex-row pt-6 px-6"
            buttonClassName="min-w-[50px]"
          />
          <div className="flex-1">
            {/* <SearchBar /> */}
            <GameContainer className="md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoGamesUI;
