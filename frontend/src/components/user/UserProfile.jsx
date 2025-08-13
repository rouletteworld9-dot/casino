import { User, Edit } from "lucide-react";
import React, { useState } from "react";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal details" },
    { id: "phone", label: "Change phone number" },
    { id: "email", label: "Set email" },
    { id: "password", label: "Change password" },
    { id: "keys", label: "Access keys" },
  ];

  return (
    <div
      className="w-full min-h-screen text-white"
      style={{ backgroundColor: "var(--color-deepPurple)" }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-8">
          <div className=" rounded-full ">
            <User size={26} className="text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold">My profile</h1>
        </div>

        {/* Navigation Tabs */}
        <div
          className="flex space-x-8 mb-8 border-b"
          style={{ borderColor: "var(--color-deepBorder)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="">
          {/* Personal Data Section */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 mb-6">
              PERSONAL DATA
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Account number:</span>
                <span className="text-white font-medium">67038631</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Currency:</span>
                <span className="text-white font-medium">₹</span>
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 mb-6">
              CONTACTS
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Phone:</span>
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">+918871713199</span>
                  <button
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors"
                    style={{
                      backgroundColor: "var(--color-lightPurple)",
                      border: "1px solid var(--color-deepBorder)",
                    }}
                  >
                    <Edit size={14} />
                    <span>Change</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Email:</span>
                <button
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors"
                  style={{
                    backgroundColor: "var(--color-lightPurple)",
                    border: "1px solid var(--color-deepBorder)",
                  }}
                >
                  <Edit size={14} />
                  <span>Set</span>
                </button>
              </div>
            </div>
          </div>

          {/* Marketing Preferences Section */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-6">
              MARKETING PREFERENCES
            </h2>

            <div className="mb-6">
              <p className="text-white mb-6">
                Get notifications about promotions and news:
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Email</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only"
                      id="email-toggle"
                    />
                    <label
                      htmlFor="email-toggle"
                      className="flex items-center cursor-pointer"
                    >
                      <div
                        className="w-12 h-6 rounded-full p-1 transition-colors"
                        style={{ backgroundColor: "var(--color-casinoGold)" }}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-6 transition-transform"></div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">SMS</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only"
                      id="sms-toggle"
                    />
                    <label
                      htmlFor="sms-toggle"
                      className="flex items-center cursor-pointer"
                    >
                      <div
                        className="w-12 h-6 rounded-full p-1 transition-colors"
                        style={{ backgroundColor: "var(--color-casinoGold)" }}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-6 transition-transform"></div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Push notifications</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only"
                      id="push-toggle"
                    />
                    <label
                      htmlFor="push-toggle"
                      className="flex items-center cursor-pointer"
                    >
                      <div
                        className="w-12 h-6 rounded-full p-1 transition-colors"
                        style={{ backgroundColor: "var(--color-casinoGold)" }}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-6 transition-transform"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
