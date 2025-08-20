import React, { useState } from "react";
import { DollarSign } from "lucide-react";
import { FaFilter } from "react-icons/fa";

const mockTransactions = [
  {
    date: "24.07",
    time: "22:32:46",
    number: "1384023778-0002",
    transaction: "Bonus account income",
    result:"Loss",
    amount: "₹0 / ₹1,500",
    balance: "₹2.30 / ₹1,500",
    highlight: true,
    amountColor: "text-white",
    balanceColor: "text-white",
  },
  {
    date: "24.07",
    time: "22:32:40",
    number: "1384023778-0001",
    transaction: "Bonus account closure",
    result:"Win",
    amount: "₹0 / -₹3,000",
    balance: "₹2.30",
    highlight: false,
    amountColor: "text-pink-400",
    balanceColor: "text-white",
  },
  {
    date: "26.06",
    time: "21:32:43",
    number: "1357712564-0007",
    transaction: "Casino. Bet settled",
    result:"Loss",
    amount: "₹0",
    balance: "₹2.30 / ₹3,000",
    highlight: true,
    amountColor: "text-white",
    balanceColor: "text-white",
  },
  {
    date: "26.06",
    time: "21:32:30",
    number: "1357712564-0006",
    transaction: "Casino bet placed",
    result:"Win",
    amount: "-₹50",
    balance: "₹2.30 / ₹3,000",
    highlight: false,
    amountColor: "text-pink-400",
    balanceColor: "text-white",
  },
  {
    date: "26.06",
    time: "21:32:12",
    number: "1357712564-0005",
    transaction: "Casino. Bet settled",
    result:"Loss",
    amount: "₹0",
    balance: "₹52.30 / ₹3,000",
    highlight: false,
    amountColor: "text-white",
    balanceColor: "text-white",
  },
  {
    date: "26.06",
    time: "21:31:53",
    number: "1357712564-0004",
    transaction: "Casino bet placed",
    result:"Loss",
    amount: "-₹120",
    balance: "₹52.30 / ₹3,000",
    highlight: false,
    amountColor: "text-pink-400",
    balanceColor: "text-white",
  },
  {
    date: "26.06",
    time: "21:31:28",
    number: "1357712564-0003",
    transaction: "Casino. Bet settled",
    result:"Win",
    amount: "₹0",
    balance: "₹172.30 / ₹3,000",
    highlight: false,
    amountColor: "text-white",
    balanceColor: "text-white",
  },
  {
    date: "26.06",
    time: "21:31:15",
    number: "1357712564-0002",
    transaction: "Casino bet placed",
    result:"Loss",
    amount: "-₹100",
    balance: "₹172.30 / ₹3,000",
    highlight: false,
    amountColor: "text-pink-400",
    balanceColor: "text-white",
  },
  {
    date: "26.06",
    time: "21:30:50",
    number: "1357712564-0001",
    transaction: "Casino. Bet settled",
    result:"Loss",
    amount: "₹0",
    balance: "₹272.30 / ₹3,000",
    highlight: false,
    amountColor: "text-white",
    balanceColor: "text-white",
  },
  {
    date: "26.06",
    time: "21:30:37",
    number: "1357661216-0100",
    transaction: "Casino bet placed",
    result:"Win",
    amount: "-₹100",
    balance: "₹272.30 / ₹3,000",
    highlight: false,
    amountColor: "text-pink-400",
    balanceColor: "text-white",
  },
  {
    date: "26.06",
    time: "21:30:10",
    number: "1357661216-0099",
    transaction: "Casino. Bet settled",
    result:"Loss",
    amount: "₹0",
    balance: "₹372.30 / ₹3,000",
    highlight: false,
    amountColor: "text-white",
    balanceColor: "text-white",
  },
  {
    date: "25.98",
    time: "21:29:58",
    number: "1357661216-0098",
    transaction: "Casino bet placed",
    result:"Win",
    amount: "-₹100",
    balance: "₹372.30 / ₹3,000",
    highlight: false,
    amountColor: "text-pink-400",
    balanceColor: "text-white",
  },
];

function UserBetTransaction() {
  const [activeTab, setActiveTab] = useState("Transaction history");

  return (
    <div className="overflow-x-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 text-yellow-600  flex items-center justify-center ">
          <DollarSign size={28} />
        </div>
        <h1 className="text-3xl font-bold text-white">Bet Transaction history</h1>
      </div>
      <div className="border-b border-[#2D2342] mb-4 mt-2" />

      {/* Tabs and Filter
      <div className="flex items-center mb-4 gap-6">
       
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded bg-[#2D2342] text-white text-sm font-medium hover:bg-[#3a2e5a] transition">
            <FaFilter className="text-pink-400" />
            <span>Filters</span>
            <span className="w-2 h-2 bg-pink-400 rounded-full ml-1"></span>
          </button>
          <span className="text-lg text-white">▼</span>
        </div>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-darkViolet text-gray-200">
            <tr className="bg-darkViolet text-gray-200 ">
              <th className="px-2 py-2 text-left">DATE</th>
              <th className="px-2 py-2 text-left">TIME</th>
              <th className="px-2 py-2 text-left">NUMBER</th>
              <th className="px-2 py-2 text-left">TRANSACTION</th>
              <th className="px-2 py-2 text-left">BET RESULT</th>
              <th className="px-2 py-2 text-left">AMOUNT / BONUSES</th>
              <th className="px-2 py-2 text-left">BALANCE / BONUSES</th>
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((tx, idx) => (
              <tr
                key={idx}
                className="border-t  text-white border-midnightPurple hover:bg-darkViolet transition"
              >
                <td
                  className={
                    "px-4 py-2 font-bold " +
                    (tx.highlight ? "text-yellow-400" : "text-white")
                  }
                >
                  {tx.date}
                </td>
                <td className="px-2 py-2">{tx.time}</td>
                <td className="px-2 py-2">{tx.number}</td>
                <td className="px-2 py-2">{tx.transaction}</td>
                <td className="px-2 py-2">{tx.result}</td>
                <td className={"px-2 py-2 " + tx.amountColor}>{tx.amount}</td>
                <td className={"px-2 py-2 " + tx.balanceColor}>{tx.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserBetTransaction;
