import { Eye } from 'lucide-react';
import React from 'react'

const BalanceCards = () => {
  return (
    <>
      <div className="bg-[#322735] rounded p-4 mb-4 relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-gray-400 text-sm font-medium">BALANCE</p>
            <p className="text-white text-2xl font-bold">₹2.30</p>
          </div>
          <button className="p-2 hover:bg-[#433248] rounded transition-colors">
            <Eye size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Bonus Account Section */}
      <div className="bg-[#322735] rounded p-4 mb-6">
        <p className="text-gray-400 text-sm font-medium mb-2">BONUS ACCOUNT</p>
        <p className="text-white text-2xl font-bold">₹1,500</p>
      </div>
    </>
  );
}

export default BalanceCards
