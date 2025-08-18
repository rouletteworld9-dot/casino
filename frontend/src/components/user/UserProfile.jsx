import React, { useState } from "react";
import { User, Coins, Edit2, Save } from "lucide-react";
import { useSingleUser } from "../../hooks/useAdminUsers";
import { useAuthStore } from "../../stores/useAuthStore";

const UserProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const { singleUser } = useSingleUser(user?._id);

  const [editedStatus, setEditedStatus] = useState(singleUser?.status);
  const [activeTab, setActiveTab] = useState("Personal Info");

  const handleStatusUpdate = () =>
    setUser({ ...singleUser, status: editedStatus });

  const tabs = ["Personal Info", "Balance", "Status"];

  const InfoRow = ({ label, value }) => (
    <div className="flex space-x-10 items-center border-b border-midnightPurple py-2">
      <p className="text-xs text-gray-400">{label}:</p>
      <p className="text-sm font-medium text-gray-200">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#17071d] to-[#201126] text-white">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 ">
          <div className="w-16 h-16 text-yellow-600 rounded-full flex items-center justify-center">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{singleUser?.name}</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition ${
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
          {activeTab === "Personal Info" && (
            <div className="space-y-4">
              <div className="bg-darkViolet  p-4 shadow-md">
                <h2 className="text-gray-200 font-semibold mb-3">
                  Personal Data
                </h2>
                <InfoRow label="Account Number" value={singleUser?._id} />
                <InfoRow label="Phone" value={singleUser?.phone} />
                <InfoRow
                  label="Verified"
                  value={singleUser?.isVerified ? "Yes" : "No"}
                />
              </div>

              <div className="bg-darkViolet p-4 shadow-md">
                <h2 className="text-gray-200 font-semibold mb-3">
                  Contact Details
                </h2>
                <InfoRow label="Phone Number" value={singleUser?.phone} />
              </div>
            </div>
          )}

          {activeTab === "Balance" && (
            <div className="bg-darkViolet p-4 shadow-md">
              <h2 className="flex items-center gap-2 text-gray-200 font-semibold mb-3">
                <Coins size={18} /> Balance
              </h2>
              <InfoRow label="Bonus Tokens" value={singleUser?.playTokens} />
              <InfoRow label="Balance" value={`₹${singleUser?.realBalance}`} />
            </div>
          )}

          {activeTab === "Status" && (
            <div className="bg-darkViolet p-4 shadow-md">
              <h2 className="flex items-center gap-2 text-gray-200 font-semibold mb-3">
                <Edit2 size={18} /> Status
              </h2>
              <div className="space-y-3">
                <div>
                  <InfoRow label="Current Status:" value={singleUser?.status} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
