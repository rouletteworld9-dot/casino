import { MoreHorizontal } from "lucide-react";
import React from "react";

const CasinoDashSidebar = () => {
  return (
    <div className="mr-2 w-[320px] bg-[#231528] rounded-2xl pr-6 pt-6 overflow-y-auto px-3 custom-scroll">
      {/* Bonuses */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Bonuses</h3>
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 relative overflow-hidden cursor-pointer">
          <div className="absolute top-0 right-0 text-6xl opacity-20">🎰</div>
          <div className="relative z-10">
            <div className="text-sm text-purple-200 mb-1">
              BONUS ACCOUNT: ₹1,500
            </div>
            <div className="font-bold text-lg mb-2">
              Claim your bonus: <span className="text-yellow-300">₹1,500</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-200 mb-3">
              <span>🎲</span> <span>💎</span> <span>💍</span>{" "}
              <span>16 days remaining</span>
            </div>
            <div className="text-sm">
              <div className="mb-1">Wager: 0%</div>
              <div className="w-full bg-purple-800/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Promos</h3>
          <MoreHorizontal className="text-gray-400" size={20} />
        </div>

        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-4 relative overflow-hidden cursor-pointer">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-30">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-orange-500" />
          </div>
          <div className="relative z-10">
            <div className="text-sm text-green-200 mb-1">BRING A FRIEND</div>
            <div className="font-bold text-lg mb-2">
              Get ₹300 + 50 FS <br /> for each verified friend
            </div>
            <button className="bg-black/20 hover:bg-black/30 px-4 py-2 rounded-lg text-sm cursor-pointer">
              More
            </button>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-20">
            <div className="w-full h-full bg-gradient-to-t from-white/20 to-transparent rounded-tl-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoDashSidebar;
