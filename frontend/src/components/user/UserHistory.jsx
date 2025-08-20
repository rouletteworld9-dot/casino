import React, { useState } from "react";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { useUserTransactions } from "../../hooks/useUserTransactions";
import UserHistorySkeleton from "../ui/Skeletons/UserHistorySkeleton";
import UserDeposits from "./UserDeposits";
import UserWithdrawal from "./UserWithdrawal";
import UserAllTransactions from "./UserAllTransactions";

const UserHistory = () => {
  const [activeTab, setActiveTab] = useState("All Transactions");
   const transactionType =
     activeTab === "Deposits"
       ? "deposit"
       : activeTab === "Withdrawals"
         ? "withdraw"
         : null;
  const { userTransactions = [], userTransactionLoading } = useUserTransactions(
    null,
    transactionType
  );

  const tabs = ["All Transactions", "Deposits", "Withdrawals"];

  const InfoRow = ({ label, value, isLink = false }) => (
    <div className="flex space-x-10 items-center border-b border-midnightPurple py-2">
      <p className="text-xs text-gray-400 min-w-[120px]">{label}:</p>
      {isLink ? (
        <a
          href={value}
          rel="noopener noreferrer"
          className="text-sm font-medium text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
        >
          View QR Code <ExternalLink size={12} />
        </a>
      ) : (
        <p className="text-sm font-medium text-gray-200">{value}</p>
      )}
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "completed":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getTransactionIcon = (type) =>
    type === "deposit" ? (
      <ArrowDownLeft size={20} className="text-green-500" />
    ) : (
      <ArrowUpRight size={20} className="text-red-500" />
    );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  if (userTransactionLoading) {
    return <UserHistorySkeleton />;
  }
  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 text-yellow-600  flex items-center justify-center ">
            <CreditCard size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Transaction Details</h1>
            <p className="text-gray-400 text-sm">
              Total Transactions: {userTransactions.length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-yellow-500 text-yellow-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div>
          {activeTab === "All Transactions" && (
            <UserAllTransactions userTransactions={userTransactions} />
          )}

          {/* You can filter deposits, withdrawals, etc. in similar way */}
          {activeTab === "Deposits" && (
            <UserDeposits userTransactions={userTransactions} />
          )}

          {activeTab === "Withdrawals" && (
            <UserWithdrawal userTransactions={userTransactions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHistory;
