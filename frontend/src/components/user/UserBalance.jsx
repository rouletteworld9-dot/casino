import React, { useState } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import UserHeaderTabs from "./UserHeaderTabs";
import UserPaymentMethods from "../ui/UserPaymentMethods";
import PaymentMethodDetails from "./PaymentMethodDetails";

const DepositInterface = () => {




  

  return (
    <div className="w-full bg-deepPurple min-h-screen text-white p-6">
      {/* Header Tabs */}
      <UserHeaderTabs />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
        {/* Left Panel - Payment Methods */}
        <UserPaymentMethods />

        {/* Right Panel - Payment Details */}
        {/* <div className="p-6 rounded-lg bg-lightPurple">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded flex items-center justify-center text-lg">
              🔺
            </div>
            <h3 className="text-xl font-bold">UPI</h3>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              PAYMENT METHOD
            </label>
            <div className="w-full p-4 rounded-lg flex items-center justify-between cursor-pointer bg-darkViolet border border-deepBorder">
              <div
                onClick={() => setShowQR(true)}
                className="flex items-center space-x-3"
              >
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

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                AMOUNT
              </label>
              <span className="text-sm text-gray-400">
                from ₹300 to ₹50,000
              </span>
            </div>

            <div className="flex items-center rounded-lg p-1 bg-darkViolet border border-deepBorder">
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

          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-deepBorder ${
                    amount === quickAmount
                      ? "bg-casinoGold text-black"
                      : "bg-darkViolet text-casinoGold"
                  }`}
                >
                  ₹{quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-4">
              GET YOUR DEPOSIT BONUS
            </label>

            <button className="w-full p-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-colors hover:opacity-90 bg-brandRed">
              <Plus size={20} />
              <span>Add ₹{amount.toLocaleString()}</span>
            </button>

            <div className="text-center mt-3">
              <span className="text-gray-400">BONUS: </span>
              <span className="font-bold">₹{amount.toLocaleString()}</span>
            </div>
          </div>
        </div> */}
        <PaymentMethodDetails/>
      </div>

      {/* QR Modal
      {showQR && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4 text-black">Scan to Pay</h2>
            <img
              src="/qr-code.png"
              alt="UPI QR Code"
              className="w-64 h-64 mx-auto mb-4"
            />
            <button
              onClick={() => setShowQR(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default DepositInterface;
