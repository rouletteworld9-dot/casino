import React from "react";
import { useUserTransactions } from "../../hooks/useUserTransactions";
import { Clock, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import UserRequestsSkeleton from "../ui/Skeletons/UserRequestsSkeleton";

const UserRequests = () => {
  const { userTransactions , userTransactionLoading} = useUserTransactions("pending");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getTransactionIcon = (type) => {
    return type === "deposit" ? (
      <ArrowDownLeft size={18} className="text-green-400" />
    ) : (
      <ArrowUpRight size={18} className="text-red-400" />
    );
  };

  if(userTransactionLoading){
    return <UserRequestsSkeleton/>
  }

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto">
        {/* Header */}

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 text-yellow-600  flex items-center justify-center ">
            <Clock size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Pending Requests</h1>
            <p className="text-gray-400 text-sm">
              {userTransactions?.length} pending transaction
              {userTransactions?.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Transactions List */}
        {userTransactions?.length === 0 ? (
          <div
            className="text-center py-12 rounded-xl"
            style={{ backgroundColor: "#231528" }}
          >
            <Clock size={48} className="text-white mx-auto mb-4" />
            <p className=" text-lg">No pending requests</p>
            <p className=" text-sm">All transactions have been processed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userTransactions?.map((transaction) => (
              <div
                key={transaction._id}
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: "#231528",
                  borderColor: "#2a1033",
                }}
              >
                <div className="flex items-center justify-between">
                  {/* Left side - Transaction info */}
                  <div className="flex items-center gap-4">
                    {getTransactionIcon(transaction.transactionType)}
                    <div>
                      <h3 className="text-white font-semibold capitalize">
                        {transaction.transactionType}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {transaction.paymentMethod.toUpperCase()}
                        {transaction.recipientName &&
                          ` • ${transaction.recipientName}`}
                      </p>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <Calendar size={12} />
                        {formatDate(transaction.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Right side - Amount and status */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">
                      {formatAmount(transaction.amount)}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <Clock size={14} className="text-yellow-500" />
                      <span className="text-yellow-500 text-sm font-medium">
                        PENDING
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRequests;
