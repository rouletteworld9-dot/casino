import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useUserTransactions } from "../../hooks/useUserTransactions";

const UserWithdrawlTab = () => {
  const { withdrawlRequestFn, withdrawlRequestLoading } = useUserTransactions();
  const [formData, setFormData] = useState({
    amount: "",
    bankAccountNumber: "",
    ifscCode: "",
    recipientName: "",
  });

  const resetForm = () =>
    setFormData({
      amount: "",
      bankAccountNumber: "",
      ifscCode: "",
      recipientName: "",
    });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.bankAccountNumber ||
      !formData.ifscCode ||
      !formData.recipientName
    ) {
      toast.error("All withdrawal details are required");
      return;
    }
    withdrawlRequestFn(formData, {
      onSuccess: () => {
        resetForm()
      },
      onError: () => {
        resetForm()
      },
    });
  };

  return (
    <div className="bg-deepPurple p-6 rounded-lg shadow-lg w-full mx-auto border border-deepBorder">
      <h2 className="text-2xl font-bold text-casinoGold mb-6 text-center">
        Withdraw Funds
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 rounded bg-lightPurple border border-deepBorder text-white focus:outline-none focus:ring-2 focus:ring-casinoGold"
            placeholder="Enter amount"
          />
        </div>

        {/* Bank Account Number */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Bank Account Number
          </label>
          <input
            type="text"
            name="bankAccountNumber"
            value={formData.bankAccountNumber}
            onChange={handleChange}
            className="w-full p-2 rounded bg-lightPurple border border-deepBorder text-white focus:outline-none focus:ring-2 focus:ring-casinoGold"
            placeholder="Enter account number"
          />
        </div>

        {/* IFSC Code */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">IFSC Code</label>
          <input
            type="text"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            className="w-full p-2 rounded bg-lightPurple border border-deepBorder text-white focus:outline-none focus:ring-2 focus:ring-casinoGold"
            placeholder="Enter IFSC code"
          />
        </div>

        {/* Recipient Name */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Recipient Name
          </label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-lightPurple border border-deepBorder text-white focus:outline-none focus:ring-2 focus:ring-casinoGold"
            placeholder="Enter recipient name"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={withdrawlRequestLoading}
          className={`w-full py-2 rounded text-white font-semibold transition cursor-pointer ${
            withdrawlRequestLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-brandRed hover:bg-red-600"
          }`}
        >
          {withdrawlRequestLoading ? "Submitting..." : "Submit Withdrawal"}
        </button>
      </form>
    </div>
  );
};

export default UserWithdrawlTab;
