import { ChevronDown, Minus, Plus, Triangle } from "lucide-react";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ShowQR from "./ShowQR";
import toast from "react-hot-toast";
import UPI from "../../../public/Assets/UPI image.jpg"
const PaymentMethodDetails = () => {
  const [amount, setAmount] = useState(100);
  const [showQR, setShowQR] = useState(false);

  const quickAmounts = [5000, 7500, 10000, 12500, 15000];

  const decreaseAmount = () => {
    if (amount > 100) setAmount(Math.max(100, amount - 100));
  };

  const increaseAmount = () => {
    if (amount < 50000) setAmount(Math.min(50000, amount + 100));
  };

  return (
    <div className="p-6 rounded-lg bg-lightPurple">
      {/* Payment Method Info */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          PAYMENT METHOD
        </label>
        <div className="w-full p-4 rounded-lg flex items-center justify-between bg-darkViolet border border-deepBorder">
          <div className="flex items-center space-x-3">
            {/* <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center text-white">
              <Triangle size={12} />
            </div>  */}
            <img
              src={UPI}
              alt="UPI"
              className="w-11 h-11 mx-auto mb-4 mr-3 mt-3"  
            />{" "}
            
            <div>
              <p className="text-white font-medium">UPI SafePay</p>
              <p className="text-gray-400 text-sm">from ₹100 to ₹50,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Amount Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-400">AMOUNT</label>
          <span className="text-sm text-gray-400">From ₹100 to ₹50,000</span>
        </div>

        <div className="flex items-center rounded-lg p-1 bg-darkViolet border border-deepBorder">
          <button
            onClick={decreaseAmount}
            className="p-3 rounded-lg transition-colors cursor-pointer"
          >
            <Minus size={18} className="text-gray-400 hover:text-white" />
          </button>

          <input
            type="text"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            className="sm:flex-1 w-full text-center bg-darkViolet text-white text-2xl font-bold outline-none border-none"
          />

          <button
            onClick={increaseAmount}
            className="p-3 rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={18} className="text-gray-400 hover:text-white" />
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-deepBorder cursor-pointer ${
                amount === quickAmount
                  ? "bg-casinoGold text-black"
                  : "bg-darkViolet text-casinoGold"
              }`}
            >
              ₹{quickAmount}
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
          onClick={() => {
            if (amount >= 100) {
              setShowQR(true);
            } else {
              toast.error("Please Deposit Atleast ₹100");
            }
          }}
          className="w-full p-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-colors hover:opacity-90 bg-brandRed"
        >
          <Plus size={20} />
          <span>Deposit ₹{amount.toLocaleString()}</span>
        </button>

        {/* <div className="text-center mt-3">
          <span className="text-gray-400">BONUS: </span>
          <span className="font-bold">₹{amount.toLocaleString()}</span>
        </div> */}
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && <ShowQR setShowQR={setShowQR} amount={amount} />}
      </AnimatePresence>
    </div>
  );
};

export default PaymentMethodDetails;
