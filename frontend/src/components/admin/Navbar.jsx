import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaChevronDown, FaSearch, FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-[#2C023B] backdrop-blur border-b border-slate-800 p-4 flex justify-between items-center sticky top-0 z-20">
      <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">Casino Admin</h1>
      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden md:flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5">
          <FaSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-400 w-48"
          />
        </div>
        <button className="relative rounded-full p-2 hover:bg-slate-800 text-slate-200" aria-label="Notifications">
          <FaBell />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400"></span>
        </button>
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((p) => !p)}
            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-800 text-slate-200"
          >
            <FaUserCircle className="text-xl" />
            <span className="hidden md:inline text-sm">Admin</span>
            <FaChevronDown className="text-xs" />
          </button>
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-44 rounded-md border border-slate-700 bg-slate-900 p-2 shadow-xl"
              >
                <button
                  onClick={() => navigate('/admin/settings')}
                  className="w-full text-left rounded px-2 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
                >
                  Profile & Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left rounded px-2 py-1.5 text-sm text-red-300 hover:bg-red-500/10"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Navbar;