import { motion } from "framer-motion";
import { Gift, Trophy, Search, Settings, Globe, Menu, X, CircleUser } from "lucide-react";
import { useState } from "react";
import NavButton from "./ui/NavButton";
// import IconButton from "./ui/IconButton";
import { useAuthStore } from "../stores/useAuthStore";

const IconButton = ({ icon: Icon, onClick, className = "" }) => (
  <NavButton onClick={onClick} className={`p-2 ${className}`}>
    <Icon size={16} />
  </NavButton>
);

export default function Header({ onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "CASINO", key: "casino" },
    { name: "SPORT", key: "sport" },
    { name: "STATISTICS", key: "statistics" },
    { name: "RESULTS", key: "results" },
    { name: "APPS", key: "apps" },
  ];

  const specialNavItems = [
    { name: "PROMOTIONS", key: "promotions", icon: Gift },
    { name: "TOURNAMENTS", key: "tournaments", icon: Trophy },
  ];
  const user = useAuthStore((state) => state.user);
  console.log(user, "user from header");

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{ backgroundColor: "#17071D" }}
      className="border-b sticky top-0 z-50 border-[#2A1033]"
    >
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavButton
            onClick={() => onNavigate("/")}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8  rounded flex items-center justify-center">
              Casinoo
            </div>
          </NavButton>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavButton
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className="font-semibold text-xs uppercase tracking-wide"
              >
                {item.name}
              </NavButton>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Special Nav Items */}
            {specialNavItems.map((item) => (
              <NavButton
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className="hidden md:flex items-center space-x-2"
              >
                <item.icon size={18} />
                <span className="font-semibold text-xs uppercase">
                  {item.name}
                </span>
              </NavButton>
            ))}

            {/* Action Icons */}
            <IconButton icon={Search} onClick={() => {}} />
            <IconButton icon={Settings} onClick={() => {}} />

            <NavButton className="hidden sm:flex items-center space-x-1">
              <Globe size={16} />
              <span className="font-semibold text-xs">EN</span>
            </NavButton>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-white flex space-x-2 text-xs">
                  <CircleUser size={18} />
                  <span className="font-semibold text-purple-300">
                    {user?.name || "Player"}
                  </span>
                </span>
                <NavButton
                  // onClick={onLogout}
                  className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded font-semibold text-xs"
                >
                  Logout
                </NavButton>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <NavButton
                  onClick={() => onNavigate("login")}
                  className="bg-purple-700 hover:bg-purple-800 px-4 py-1 rounded font-semibold text-xs uppercase"
                >
                  Log in
                </NavButton>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <IconButton
              icon={mobileMenuOpen ? X : Menu}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="lg:hidden mt-4 pt-4 border-t border-purple-800"
          >
            <div className="flex flex-col space-y-3">
              {[...navItems, ...specialNavItems].map((item) => (
                <NavButton
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-left font-semibold text-sm uppercase"
                >
                  {"icon" in item && <item.icon size={18} />}
                  <span>{item.name}</span>
                </NavButton>
              ))}
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
