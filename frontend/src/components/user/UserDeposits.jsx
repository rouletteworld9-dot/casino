import { ArrowDownLeft } from "lucide-react";
import React from "react";
import InfoRow from "../ui/InfoRow";

const UserDeposits = ({ userTransactions: deposits }) => {
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  if (deposits.length === 0) {
    return <p className="text-gray-400 text-center">No deposits found.</p>;
  }

  return (
    <div className="space-y-4">
      {deposits.map((tx) => (
        <div key={tx._id} className="bg-darkViolet p-4 shadow-md rounded-lg">
          <h2 className="flex items-center gap-2 text-gray-200 font-semibold mb-1">
            <ArrowDownLeft size={18} className="text-green-500" /> Deposit
            Details
          </h2>
          <p className="text-xs text-gray-400 mb-3">
            Date: {new Date(tx.createdAt).toLocaleString()}
          </p>
          <InfoRow label="Deposit Amount" value={formatAmount(tx.amount)} />
          <InfoRow
            label="Payment Method"
            value={tx.paymentMethod.toUpperCase()}
          />
          <InfoRow label="UPI ID" value={tx.upiId} />
          <InfoRow label="UTR Number" value={tx.utr} />
        </div>
      ))}
    </div>
  );
};

export default UserDeposits;
