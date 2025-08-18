import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import React from "react";

const UserAllTransactions = ({ userTransactions }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

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

  const getTransactionIcon = (type) =>
    type === "deposit" ? (
      <ArrowDownLeft size={20} className="text-green-500" />
    ) : (
      <ArrowUpRight size={20} className="text-red-500" />
    );

  return (
    <div className="overflow-x-auto">
      {userTransactions.length > 0 ? (
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-darkViolet text-gray-200">
            <tr>
              <th className="px-2 py-2 text-left">Transaction ID</th>
              <th className="px-2 py-2 text-left">UTR</th>
              <th className="px-2 py-2 text-left">Amount</th>
              <th className="px-2 py-2 text-left">Type</th>
              <th className="px-2 py-2 text-left">Status</th>
              <th className="px-2 py-2 text-left">Created</th>
              <th className="px-2 py-2 text-left">Updated</th>
            </tr>
          </thead>
          <tbody>
            {userTransactions.map((tx) => (
              <tr
                key={tx._id}
                className="border-t border-midnightPurple hover:bg-darkViolet transition"
              >
                <td className="px-2 py-2 max-w-[120px] truncate">{tx._id}</td>
                <td className="px-2 py-2">{tx.utr || "-"}</td>
                <td className="px-2 py-2 font-semibold text-yellow-500">
                  {formatAmount(tx.amount)}
                </td>
                <td className="px-2 py-2 capitalize">
                  <div className="flex items-center gap-1">
                    {getTransactionIcon(tx.transactionType)}
                    <span>{tx.transactionType}</span>
                  </div>
                </td>
                <td className="px-2 py-2">
                  <span
                    className={`px-2 py-1 capitalize rounded text-xs font-medium ${getStatusColor(
                      tx.transactionStatus
                    )}`}
                  >
                    {tx.transactionStatus}
                  </span>
                </td>
                <td className="px-2 py-2 text-gray-400">
                  {formatDate(tx.createdAt)}
                </td>
                <td className="px-2 py-2 text-gray-400">
                  {formatDate(tx.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-400 py-10">
          No transactions found.
        </div>
      )}
    </div>
  );
};

export default UserAllTransactions;
