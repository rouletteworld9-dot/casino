import { ArrowUpRight } from "lucide-react";
import React from "react";
import InfoRow from "../ui/InfoRow";

const UserWithdrawal = ({ userTransactions: withdrawals }) => {
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  if (withdrawals.length === 0) {
    return <p className="text-gray-400 text-center">No withdrawals found.</p>;
  }

  return (
    <div className="space-y-4">
      {withdrawals.map((tx) => (
        <div key={tx._id} className="bg-darkViolet p-4 shadow-md rounded-lg">
          <h2 className="flex items-center gap-2 text-gray-200 font-semibold mb-3">
            <ArrowUpRight size={18} className="text-red-500" /> Withdrawal
            Details
          </h2>

          <InfoRow label="Withdrawal Amount" value={formatAmount(tx.amount)} />
          <InfoRow
            label="Payment Method"
            value={tx.paymentMethod.toUpperCase()}
          />
          <InfoRow label="Recipient Name" value={tx.recipientName} />
          <InfoRow label="Bank Account Number" value={tx.bankAccountNumber} />
          <InfoRow label="IFSC Code" value={tx.ifscCode} />
          <InfoRow label="Status" value={tx.transactionStatus} />
          <InfoRow
            label="Requested At"
            value={new Date(tx.createdAt).toLocaleString()}
          />

          {/* UTR only if available */}
          {tx.utr && <InfoRow label="UTR Number" value={tx.utr} />}
        </div>
      ))}
    </div>
  );
};

export default UserWithdrawal;
