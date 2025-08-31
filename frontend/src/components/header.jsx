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
  EyeOff,
  Eye,
  Coins,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import NavButton from "./ui/NavButton";
import UserHeaderDropdown from "./ui/UserHeaderDropdown";
import DesktopNav from "./ui/DekstopNav";
import MobileNav from "./ui/MobileNav";
import { useNavigate } from "react-router-dom";
import { useSingleUser } from "../hooks/useAdminUsers";

const IconButton = ({ icon: Icon, ...props }) => (
  <NavButton {...props} className="p-2">
    <Icon size={16} />
  </NavButton>
);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const user = useAuthStore((s) => s.user);
  const { singleUser } = useSingleUser(user?._id);
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
      <div className="md:container mx-auto px-2 sm:px-4 py-1 flex justify-between items-center">
        {/* Logo */}
        <NavButton
          onClick={() => navigate("/")}
          className="text-sm sm:text-base"
        >
          Casinoo
        </NavButton>

        {/* Desktop Nav */}
        <DesktopNav onNavigate={handleNavigate} specials={specials} />

        {/* Right Actions */}
        <div className="flex items-center sm:space-x-3 space-x-1">
          {/* Search & Settings */}
          <IconButton icon={Search} className="sm:p-2 p-1" />
          <IconButton icon={Settings} className="sm:p-2 p-1" />

          {/* Language */}
          <NavButton className="hidden sm:flex items-center space-x-1 text-xs sm:text-sm">
            <Globe size={14} className="sm:w-4 sm:h-4" />
            <span className="font-semibold text-[10px] sm:text-xs">EN</span>
          </NavButton>

          {user ? (
            <>
              {/* User + Balance */}
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
              >
                <span className="text-white flex items-center space-x-1 sm:space-x-2 text-[10px] sm:text-xs cursor-pointer max-w-[90px] sm:max-w-none truncate">
                  <CircleUser size={16} className="sm:w-5 sm:h-5" />
                  <span className="font-semibold flex items-center gap-1 truncate">
                    {showBalance ? (
                      <>
                        <span className="truncate">
                          ₹ {user?.realBalance || singleUser?.realBalance}
                        </span> 
                        <span className="hidden sm:flex text-yellow-400 items-center gap-1">
                          |
                          <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                          {user?.playTokens || singleUser?.playTokens}
                        </span>
                      </>
                    ) : (
                      "**** ****"
                    )}
                  </span>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBalance((prev) => !prev);
                    }}
                    className="focus:outline-none"
                  >
                    <motion.span
                      key={showBalance ? "eyeoff" : "eye"}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showBalance ? (
                        <EyeOff size={14} className="text-gray-400" />
                      ) : (
                        <Eye size={14} className="text-gray-400" />
                      )}
                    </motion.span>
                  </motion.button>
                </span>

                {dropdownOpen && (
                  <UserHeaderDropdown
                    onNavigate={handleNavigate}
                    setIsDropdown={setDropdownOpen}
                  />
                )}
              </div>

              {/* Deposit button (icon only for small screens) */}
              {user?.role === "user" && (
                <NavButton
                  onClick={() => navigate("/user/deposits-withdrawals")}
                  className="bg-red-700 hover:bg-red-800 px-1 sm:px-2 py-1 rounded font-semibold text-[10px] sm:text-xs uppercase flex items-center space-x-1"
                >
                  <CirclePlus size={14} />
                  <p className="hidden sm:block">Deposit</p>
                </NavButton>
              )}
            </>
          ) : (
            <NavButton
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-red-500 to-purple-600 px-2 sm:px-4 py-1 rounded font-semibold text-[10px] sm:text-xs uppercase"
            >
              Log in
            </NavButton>
          )}

          {/* Mobile Menu */}
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
