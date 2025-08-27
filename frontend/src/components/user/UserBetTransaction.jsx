import React, { useState } from "react";
import { DollarSign } from "lucide-react";
import { FaFilter } from "react-icons/fa";
import { usebetHistory } from "../../hooks/useAdminUsers";

function UserBetTransaction() {
 const {betHistory} = usebetHistory()

  // Format date to DD.MM format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}.${month}`;
  };

  // Format time to HH:MM:SS format
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Get transaction description based on bet type and status
  const getTransactionDescription = (type, status) => {
    if (status === "lost") {
      return "Casino. Bet settled";
    } else if (status === "won") {
      return "Casino. Bet settled";
    }
    return `Casino ${type} bet`;
  };

  // Get result display
  const getResult = (status) => {
    return status === "lost" ? "Loss" : status === "won" ? "Win" : status;
  };



  return (
    <div className="overflow-x-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 text-yellow-600 flex items-center justify-center">
          <DollarSign size={28} />
        </div>
        <h1 className="text-3xl font-bold text-white">
          Bet Transaction history
        </h1>
      </div>
      <div className="border-b border-[#2D2342] mb-4 mt-2" />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-darkViolet text-gray-200">
            <tr className="bg-darkViolet text-gray-200">
              <th className="px-2 py-2 text-left">DATE</th>
              <th className="px-2 py-2 text-left">TIME</th>
              <th className="px-2 py-2 text-left">ROUND ID</th>
              <th className="px-2 py-2 text-left">TRANSACTION</th>
              <th className="px-2 py-2 text-left">BET RESULT</th>
              <th className="px-2 py-2 text-left">NUMBERS</th>
              <th className="px-2 py-2 text-left">BET TYPE</th>
              <th className="px-2 py-2 text-left">AMOUNT</th>
              <th className="px-2 py-2 text-left">PAYOUT</th>
            </tr>
          </thead>
          <tbody>
            {betHistory ? (
              betHistory.map((bet, idx) => (
                <tr
                  key={bet._id || idx}
                  className="border-t text-white border-midnightPurple hover:bg-darkViolet transition"
                >
                  <td className="px-4 py-2 font-bold text-white">
                    {formatDate(bet.createdAt)}
                  </td>
                  <td className="px-2 py-2">{formatTime(bet.createdAt)}</td>
                  <td className="px-2 py-2 text-xs">{bet.roundId}</td>
                  <td className="px-2 py-2">
                    {getTransactionDescription(bet.type, bet.status)}
                  </td>
                  <td className="px-2 py-2">
                    <span
                      className={
                        bet.status === "won"
                          ? "text-green-400 font-semibold"
                          : bet.status === "lost"
                            ? "text-red-400 font-semibold"
                            : "text-yellow-400 font-semibold"
                      }
                    >
                      {getResult(bet.status)}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <span className="bg-midnightPurple px-2 py-1 rounded text-xs">
                      {bet.numbers ? bet.numbers.join(", ") : "N/A"}
                    </span>
                  </td>
                  <td className="px-2 py-2 capitalize">
                    <span className="bg-midnightPurple px-2 py-1 rounded text-xs">
                      {bet.type}
                    </span>
                  </td>
                  <td className="px-2 py-2 font-semibold">
                    <span className="text-white">₹{bet.amount}</span>
                  </td>
                  <td className="px-2 py-2 font-semibold">
                    <span
                      className={
                        bet.payout > 0 ? "text-green-400" : "text-gray-400"
                      }
                    >
                      ₹{bet.payout}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-400">
                  No bet history available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserBetTransaction;
