import { motion } from "framer-motion";
import NavButton from "./NavButton";


export default function MobileNav({ onNavigate, specials, onClose }) {
  const navItems = ["CASINO", "SPORT", "STATISTICS", "RESULTS", "APPS"];

  return (
    <motion.nav
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="lg:hidden mt-4 py-4 border-t border-purple-800"
    >
      <div className="flex flex-col px-2 space-y-3">
        {navItems.map((name) => (
          <NavButton
            key={name}
            onClick={() => {
              onNavigate(name.toLowerCase());
              onClose();
            }}
            className="font-semibold w-40 text-start text-sm uppercase"
          >
            {name}
          </NavButton>
        ))}
        {specials.map(({ name, key, icon: Icon }) => (
          <NavButton
            key={key}
            onClick={() => {
              onNavigate(key);
              onClose();
            }}
            className="flex w-40 space-x-2 font-semibold text-sm uppercase"
          >
            <Icon size={18} /> <span>{name}</span>
          </NavButton>
        ))}
      </div>
    </motion.nav>
  );
}
