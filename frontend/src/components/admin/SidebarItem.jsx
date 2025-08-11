import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const SidebarItem = ({ to, icon, label, collapsed = false, external = false }) => {
  const baseClasses =
    'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors';

  const activeClasses = 'bg-purple-300/20 text-purple-100 font-semibold';
  const hoverClasses = 'hover:bg-slate-700/60 hover:text-white text-slate-300';

  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noreferrer noopener"
        className={`${baseClasses} ${hoverClasses}`}
        title={label}
      >
        <span className="text-lg shrink-0">{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : hoverClasses}`
      }
      title={label}
      end
    >
      <span className="text-lg shrink-0">{icon}</span>
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="truncate"
        >
          {label}
        </motion.span>
      )}

      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-slate-100 shadow-md group-hover:block">
          {label}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarItem;


