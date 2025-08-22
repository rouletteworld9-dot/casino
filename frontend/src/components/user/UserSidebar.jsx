import { User, CreditCard, BarChart3, Notebook, Menu, X , DollarSign } from "lucide-react";
import BalanceCards from "../ui/BalanceCards";
import { useAuth } from "../../hooks/useAuth";
import SidebarLink from "../ui/SideBarLink";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserSidebar = ({ isOpen, setIsOpen }) => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Toggle Button - works on all screen sizes */}
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-14 z-50 p-2 bg-midnightPurple rounded-lg text-white hover:bg-[#3a2044] transition cursor-pointer"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar - AnimatePresence handles both mobile & desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.3 }}
            className="fixed md:sticky top-10 left-0 w-60 h-screen bg-deepPurple text-white py-6 sm:pt-10 px-4 z-40 border-r border-midnightPurple overflow-hidden"
          >
            <BalanceCards />
            <div className="space-y-2 mt-4">
              <SidebarLink to="/user" exact icon={User} label="My profile" />
              <SidebarLink
                to="/user/deposits-withdrawals"
                icon={CreditCard}
                label="Deposits and withdrawals"
              />
              <SidebarLink
                to="/user/bet-history"
                icon={DollarSign}
                label="Bet Transaction history"
              />
              <SidebarLink
                to="/user/history"
                icon={BarChart3}
                label="Transaction history"
              />
              <SidebarLink
                to="/user/requests"
                icon={Notebook}
                label="Requests"
              />
              <div className="w-full flex items-center mt-4">
                <button
                  onClick={handleLogout}
                  className="border border-yellow-600 rounded px-4 py-1 flex items-center space-x-3 transition-colors cursor-pointer"
                >
                  <span className="text-yellow-600 text-sm">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserSidebar;
