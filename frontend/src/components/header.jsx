import { motion } from "framer-motion";
import {
  Gift,
  Trophy,
  Search,
  Settings,
  Globe,
  Menu,
  X,
  CircleUser,
  CirclePlus,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import NavButton from "./ui/NavButton";
import UserHeaderDropdown from "./ui/UserHeaderDropdown";
import DesktopNav from "./ui/DekstopNav";
import MobileNav from "./ui/MobileNav";
import { useNavigate } from "react-router-dom";
import { useGameSocket } from "../hooks/useGameSocket";

const IconButton = ({ icon: Icon, ...props }) => (
  <NavButton {...props} className="p-2">
    <Icon size={16} />
  </NavButton>
);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { round, phase, result, bets, placeBet, messages, lastResults  } = useGameSocket(user?._id);


  console.log({ round, phase, result, bets, placeBet, messages, lastResults  })
  

  const navigate = useNavigate();
  const handleNavigate = (path) => {
    // Make sure we have a leading slash
    if (!path.startsWith("/")) {
      path = `/${path}`;
    }
    navigate(path);
  };

  const specials = [
    { name: "PROMOTIONS", key: "promotions", icon: Gift },
    { name: "TOURNAMENTS", key: "tournaments", icon: Trophy },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="border-b sticky top-0 bg-[#1E0E24] z-70 border-[#2A1033]"
    >
      <div className="container mx-auto px-4 py-1 flex justify-between items-center">
        {/* Logo */}
        <NavButton onClick={() => navigate("/")}>Casinoo</NavButton>

        {/* Desktop Nav */}
        <DesktopNav onNavigate={handleNavigate} specials={specials} />

        {/* Right Actions */}
        <div className="flex items-center sm:space-x-3 space-x-1">
          <IconButton icon={Search} />
          <IconButton icon={Settings} />
          <NavButton className="hidden sm:flex items-center space-x-1">
            <Globe size={16} />{" "}
            <span className="font-semibold text-xs">EN</span>
          </NavButton>

          {user ? (
            <>
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
              >
                <span className="text-white flex items-center space-x-2 text-xs cursor-pointer">
                  <CircleUser size={18} />{" "}
                  <span className="font-semibold text-purple-300">
                    {user?.name || "Player"}
                  </span>
                </span>

                {dropdownOpen && (
                  <UserHeaderDropdown
                    onNavigate={handleNavigate}
                    setIsDropdown={setDropdownOpen}
                  />
                )}
              </div>
              {user?.role === "user" && (
                <NavButton
                  onClick={() => navigate("/user/deposits-withdrawals")}
                  className="bg-red-700 hover:bg-red-800 px-2 py-1 rounded font-semibold text-xs uppercase flex space-x-1"
                >
                  <CirclePlus size={16} /> <p>Deposit</p>
                </NavButton>
              )}
            </>
          ) : (
            <NavButton
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-red-500 hover:text-white to-purple-600 px-4 py-1 rounded font-semibold text-xs uppercase"
            >
              Log in
            </NavButton>
          )}

          <div className="lg:hidden">
            <IconButton
              icon={mobileOpen ? X : Menu}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="block lg:hidden"
            />
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <MobileNav
          onNavigate={handleNavigate}
          specials={specials}
          onClose={() => setMobileOpen(false)}
        />
      )}
    </motion.header>
  );
}
