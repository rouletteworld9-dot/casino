import React, { useState } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";

const DepositInterface = () => {
  const [activeTab, setActiveTab] = useState("deposit");
  const [selectedMethod, setSelectedMethod] = useState("upi-safepay");
  const [amount, setAmount] = useState(3000);

  const tabs = [
    { id: "deposit", label: "Deposit" },
    { id: "withdrawal", label: "Withdrawal" },
    { id: "requests", label: "Your requests" },
  ];

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI",
      logo: "🔺",
      minAmount: 300,
      colors: "bg-gradient-to-r from-blue-600 to-green-600",
    },
    {
      id: "upi-baterybet",
      name: "Card",
      logo: "🔺",
      minAmount: 300,
      colors: "bg-gradient-to-r from-blue-600 to-green-600",
    },
    {
      id: "bank-transfer",
      name: "Netbanking",
      logo: "🔺",
      minAmount: 500,
      colors: "bg-gradient-to-r from-orange-600 to-red-600",
    },
    {
      id: "usdt-trc20",
      name: "Cash",
      logo: "💎",
      minAmount: 300,
      colors: "bg-gradient-to-r from-teal-600 to-green-600",
    },
  ];

  const quickAmounts = [5000, 7500, 10000, 12500, 15000];

  const decreaseAmount = () => {
    if (amount > 300) {
      setAmount(Math.max(300, amount - 100));
    }
  };

  const increaseAmount = () => {
    if (amount < 50000) {
      setAmount(Math.min(50000, amount + 100));
    }
  };

  return (
    <div
      className="w-full min-h-screen text-white p-6"
      style={{ backgroundColor: "var(--color-deepPurple)" }}
    >
      {/* Header Tabs */}
      <div
        className="flex space-x-8 mb-8 border-b border-deepPurple"
        // style={{ borderColor: "var(--color-deepBorder)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 text-lg font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "text-yellow-500"
                : "text-gray-400 hover:text-white"
            }`}
            style={{
              borderBottomColor:
                activeTab === tab.id
                  ? "var(--color-casinoGold)"
                  : "transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
        {/* Left Panel - Payment Methods */}
        <div>
          <h2 className="text-xl font-bold mb-6">Choose a method</h2>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`relative p-4 rounded-lg cursor-pointer transition-all border-2 ${
                  selectedMethod === method.id
                    ? "border-yellow-500"
                    : "border-transparent hover:border-gray-600"
                }`}
                style={{ backgroundColor: "var(--color-lightPurple)" }}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${method.colors}`}
                  >
                    {method.logo}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold">
                        {method.name}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      from ₹{method.minAmount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Payment Details */}
        <div
          className="p-6 rounded-lg"
          style={{ backgroundColor: "var(--color-lightPurple)" }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded flex items-center justify-center text-lg">
              🔺
            </div>
            <h3 className="text-xl font-bold">UPI</h3>
          </div>

          {/* Payment Method Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              PAYMENT METHOD
            </label>
            <div
              className="w-full p-4 rounded-lg flex items-center justify-between cursor-pointer"
              style={{
                backgroundColor: "var(--color-darkViolet)",
                border: "1px solid var(--color-deepBorder)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-green-600 rounded flex items-center justify-center text-sm">
                  🔺
                </div>
                <div>
                  <span className="text-white font-medium">UPI SafePay</span>
                  <div className="text-gray-400 text-sm">from ₹300</div>
                </div>
              </div>
              <ChevronDown size={20} className="text-gray-400" />
            </div>
          </div>

          {/* Amount Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                AMOUNT
              </label>
              <span className="text-sm text-gray-400">
                from ₹300 to ₹50,000
              </span>
            </div>

            <div
              className="flex items-center rounded-lg p-1"
              style={{
                backgroundColor: "var(--color-darkViolet)",
                border: "1px solid var(--color-deepBorder)",
              }}
            >
              <button
                onClick={decreaseAmount}
                className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Minus size={18} className="text-gray-400" />
              </button>

              <div className="flex-1 text-center">
                <span className="text-2xl font-bold">
                  ₹ {amount.toLocaleString()}
                </span>
              </div>

              <button
                onClick={increaseAmount}
                className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Plus size={18} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor:
                      amount === quickAmount
                        ? "var(--color-casinoGold)"
                        : "var(--color-darkViolet)",
                    color:
                      amount === quickAmount
                        ? "black"
                        : "var(--color-casinoGold)",
                    border: "1px solid var(--color-deepBorder)",
                  }}
                >
                  ₹{quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Deposit Bonus Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-4">
              GET YOUR DEPOSIT BONUS
            </label>

            <button
              className="w-full p-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--color-brandRed)" }}
            >
              <Plus size={20} />
              <span>Add ₹{amount.toLocaleString()}</span>
            </button>

            <div className="text-center mt-3">
              <span className="text-gray-400">BONUS: </span>
              <span className="font-bold">₹{amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositInterface;
