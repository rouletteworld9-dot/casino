import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {ChevronDown, CircleUser, LogOut, Search} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {};

  return (
    <div className="bg-deepPurple backdrop-blur border-b border-midnightPurple p-4 flex justify-between items-center sticky top-0 z-20">
      <h1 className="text-lg md:text-2xl font-bold text-white ">
        Casino Admin
      </h1>
      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden md:flex items-center gap-2 rounded-md border border-deepPurple bg-midnightPurple px-3 py-1.5">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-slate-100 placeholder:text-white w-48"
          />
        </div>
        {/* <button
          className="relative rounded-full p-2 hover:bg-slate-800 text-slate-200"
          aria-label="Notifications"
        >
          <FaBell />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400"></span>
        </button> */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((p) => !p)}
            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-midnightPurple text-white"
          >
            <CircleUser size={18} />
            <span className="hidden md:inline text-sm">Admin</span>
            <ChevronDown size={18} />
          </button>
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-44 rounded-md border border-midnightPurple bg-deepPurple shadow-xl"
              >
                <button
                  onClick={() => navigate("/admin/settings")}
                  className="w-full text-left rounded px-2 py-1.5 text-sm text-slate-200 hover:bg-midnightPurple"
                >
                  Profile & Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-1 text-left rounded px-2 py-1.5 text-sm text-red-300 hover:bg-red-500/10"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
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
