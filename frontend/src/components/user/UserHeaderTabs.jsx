import React, { useState } from "react";

const UserHeaderTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "deposit", label: "Deposit" },
    { id: "withdrawal", label: "Withdrawal" },
  ];
  return (
    <div className="flex space-x-8 mb-8 border-b border-gray-600">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`pb-3 px-1 text-lg font-medium transition-colors ${
            activeTab === tab.id
              ? "text-yellow-500 border-b-3 border-yellow-600"
              : "text-gray-400 hover:text-white "
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default UserHeaderTabs;
