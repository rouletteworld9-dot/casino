import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Play,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import GameTabs from '../components/ui/GameTabs';
import GameCategories from '../components/ui/GameCategories';
import HeroSlider from '../components/ui/HeroSlider';
import GameCards from '../components/gameCards';
import GameContainer from '../components/GameContainer';
import SearchBar from '../components/ui/SearchBar';
import IconButton from '../components/ui/IconButton';
import CasinoDashboardContent from '../components/CasinoDashboardContent';
import CasinoDashSidebar from '../components/CasinoDashSidebar';

const CasinoDashboard = () => {
  const [activeTab, setActiveTab] = useState('Slots');

  const gameCards = [
    { id: 1, title: 'Aviator', image: '🛩️', tag: 'TOP', info: true },
    { id: 2, title: 'Sweet Bonanza', image: '🍭', tag: 'TOP', info: true },
    { id: 3, title: 'Santa vs Rudolf', image: '🎅', tag: 'TOP', info: true },
    { id: 4, title: 'Rocket Stars', image: '🚀', tag: 'TOP', info: true },
    { id: 5, title: 'Lucky 7', image: '🎰', tag: 'TOP', info: true }
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-[#17071D] text-white overflow-hidden">
      {/* Fixed Game Tabs */}
      <div className="flex-none z-50 bg-[#17071D] px-6 pt-6 pb-3 ">
        <GameTabs className='text-2xl' />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="flex-none px-4 pt-6 overflow-y-auto  min-w-[100px] custom-scroll">
          <GameCategories className='flex-col gap-6' buttonClassName="min-w-[90px] hover:bg-gray-900" />
        </div>

        {/* Main Scrollable Area */}
        <CasinoDashboardContent/>
        
        {/* Right Sidebar */}
        <CasinoDashSidebar/>
      </div>

      {/* Scrollbar styling */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #3A2D40;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #17071D;
        }
      `}</style>
    </div>
  );
};

export default CasinoDashboard;
