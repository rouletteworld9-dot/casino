import UserHeaderTabs from "./UserHeaderTabs";
import UserDepositTab from "./UserDepositTab";
import UserwithdrawlTab from "./UserwithdrawlTab";
import { useState } from "react";

const DepositInterface = () => {
  const [activeTab, setActiveTab] = useState("deposit");
  return (
    <div className="w-full bg-deepPurple min-h-screen text-white p-3 sm:p-6">
      {/* Header Tabs */}
      <UserHeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "deposit" ? <UserDepositTab /> : <UserwithdrawlTab />}
    </div>
  );
};

export default DepositInterface;
