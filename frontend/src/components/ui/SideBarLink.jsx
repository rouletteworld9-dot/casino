import React from "react";
import { NavLink } from "react-router-dom";

const SidebarLink = ({ to, exact, icon: Icon, label }) => {
  const navClass = ({ isActive }) =>
    `rounded p-2 flex items-center space-x-3 transition-colors cursor-pointer ${
      isActive ? "bg-[#433248]" : "hover:bg-[#433248]"
    }`;

  return (
    <NavLink to={to} end={exact} className={navClass}>
      {({ isActive }) => (
        <>
          <Icon
            size={16}
            className={isActive ? "text-orange-400" : "text-gray-400"}
          />
          <span className={isActive ? "text-white" : "text-gray-300"}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};

export default SidebarLink;
