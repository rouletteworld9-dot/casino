import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const SearchBar = () => {
      const [searchTerm, setSearchTerm] = useState("");
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center mb-6"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 w-80"
        />
      </div>
    </motion.div>
  );
}

export default SearchBar
