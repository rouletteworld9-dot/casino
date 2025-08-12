import GameTabs from "../components/ui/GameTabs";
import GameCategories from "../components/ui/GameCategories";
import CasinoDashboardContent from "../components/CasinoDashboardContent";
import CasinoDashSidebar from "../components/CasinoDashSidebar";
import Header from "../components/header";

const CasinoDashboard = () => {
  return (
    <>
      <div className="h-screen w-full mx-auto flex flex-col text-white overflow-hidden">
        <Header />
        {/* Fixed Game Tabs */}
        <div className="overflow-x-auto sm:overflow-visible custom-scroll z-50  px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-3">
          <div className="flex flex-nowrap gap-3 sm:gap-4">
            <GameTabs className="text-lg sm:text-2xl flex-shrink-0" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* Sidebar */}
          <div className="overflow-x-auto sm:overflow-y-auto min-h-[60px] sm:min-w-[100px] custom-scroll">
            <div className="flex flex-nowrap sm:flex-col gap-2 sm:gap-6 px-2 sm:px-4 pt-4 sm:pt-6">
              <GameCategories
                className="flex flex-nowrap sm:flex-col gap-2 sm:gap-6"
                buttonClassName="min-w-[70px] sm:min-w-[90px] hover:bg-gray-900 flex-shrink-0"
              />
            </div>
          </div>

          {/* Main Scrollable Area */}
          <div className="flex-1 overflow-auto custom-scroll">
            <CasinoDashboardContent />
          </div>

          {/* Right Sidebar (hidden on small screens) */}
          <div className="hidden lg:block">
            <CasinoDashSidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default CasinoDashboard;
