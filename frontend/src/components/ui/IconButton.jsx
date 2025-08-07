import { ChevronRight } from "lucide-react";

const IconButton = ({
  label,
  icon = <ChevronRight size={16} className="rotate-90" />,
  onClick,
  className = "",
  iconPosition = "right", 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between bg-[#231528] rounded-lg px-4 py-2 text-sm ${className}`}
    >
      {iconPosition === "left" && icon}
      {label && <span className="mx-2">{label}</span>}
      {iconPosition === "right" && icon}
    </button>
  );
};

export default IconButton;
