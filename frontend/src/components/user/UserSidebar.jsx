import React from "react";
import { User, CreditCard, BarChart3 } from "lucide-react";
import BalanceCards from "../ui/BalanceCards";
import { useAuth } from "../../hooks/useAuth";
import SidebarLink from "../ui/SideBarLink";

const UserSidebar = () => {
  const { logoutUser } = useAuth();

  return (
    <div className="fixed top-0 w-60 bg-[#1E0E24] text-white min-h-screen py-15 px-4">
      <BalanceCards />
      <div className="space-y-2">
        <SidebarLink to="/user" exact icon={User} label="My profile" />
        <SidebarLink
          to="/user/deposits-withdrawals"
          icon={CreditCard}
          label="Deposits and withdrawals"
        />
        <SidebarLink
          to="/user/history"
          icon={BarChart3}
          label="Bet and transaction history"
        />

        <div className="w-full flex items-center mt-4">
          <button
            onClick={logoutUser}
            className="border border-yellow-600 rounded px-4 py-1 flex items-center space-x-3 transition-colors cursor-pointer"
          >
            <span className="text-yellow-600 text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
