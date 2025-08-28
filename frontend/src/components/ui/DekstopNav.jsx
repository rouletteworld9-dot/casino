import { useNavigate } from "react-router-dom";
import NavButton from "./NavButton";

export default function DesktopNav({ onNavigate, specials }) {
  const navItems = [
    {
      name: "CASINO",
      link: "/casino/game",
    },
    {
      name: "SPORT",
      // link: "/casino/game",
    },
    {
      name: "STATISTICS",
      // link: "/casino/game",
    },
    {
      name: "RESULTS",
      // link: "/casino/game",
    },
    {
      name: "APPS",
      // link: "/casino/game",
    },
  ];

  const navigate = useNavigate();
  return (
    <nav className="hidden lg:flex items-center justify-between w-[60%] space-x-8">
      <div className="flex items-center space-x-4">
        {navItems.map((name) => (
          <NavButton
            key={name}
            onClick={() => navigate(name.link)}
            className="font-semibold text-xs uppercase tracking-wide"
          >
            {name.name}
          </NavButton>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        {specials.map(({ name, key, icon: Icon }) => (
          <NavButton
            key={key}
            // onClick={() => onNavigate(key)}
            className="flex items-center space-x-2 font-semibold text-xs uppercase"
          >
            <Icon size={18} /> <span>{name}</span>
          </NavButton>
        ))}
      </div>
    </nav>
  );
}
