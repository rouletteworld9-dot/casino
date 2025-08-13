import { useState } from "react";
import { motion } from "framer-motion";
import RejectPopup from "./RejectPopup";
import { useTransactions } from "../../hooks/useTransactions";
import TableSkeleton from "../ui/Skeletons/TableSkeleton";
import ActionButton from "./ActionButton";
import Pagination from "../ui/Pagination";
const Transactions = () => {
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [loadingAction, setLoadingAction] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const pageSize = 10;

  const {
    allTransactions = [],
    allTransactionsLoading,
    approveTransactionFn,
    rejectTransactionFn,
    rejecttransactionLoading,
    approvetransactionLoading,
  } = useTransactions(type === "all" ? undefined : type);

  const totalPages = Math.ceil(allTransactions.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const paginated = allTransactions.slice(start, start + pageSize);

  const handleAction = async (transactionId, action, reason) => {
    console.log("handleAction called with:", transactionId, action, reason);
    setLoadingAction({ id: transactionId, action });
    try {
      if (action === "approve") {
        console.log("aprove called");
        await approveTransactionFn(transactionId);
      } else if (action === "reject") {
        console.log("reject called");
        await rejectTransactionFn({ id: transactionId, adminNote: reason });
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const openRejectModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowRejectModal(true);
  };

  if (allTransactionsLoading) return <TableSkeleton />;

  return (
    <>
      <motion.div className="bg-midnightPurple text-white p-4 sm:p-6 rounded-lg shadow-lg border border-midnightPurple overflow-x-auto">
        {/* Header & Filter */}
        <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-bold">Transactions</h2>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="rounded border border-midnightPurple bg-deepPurple p-2 text-white text-sm sm:text-base"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="bg-deepPurple text-white">
                <th className="p-2">User</th>
                <th className="p-2">Type</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">UTR</th>
                <th className="p-2">Approve / Reject</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((t) => (
                <tr key={t._id} className="border-b border-deepPurple">
                  <td className="p-2">
                    {t.user?.name || t.user?.phone || "N/A"}
                  </td>
                  <td className="p-2 capitalize">{t.transactionType}</td>
                  <td className="p-2">{t.amount}</td>
                  <td className="p-2">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2 capitalize">
                    {t.transactionStatus || "N/A"}
                  </td>
                  <td className="p-2">{t.utr || "-"}</td>
                  <td className="p-2">
                    {t.transactionStatus === "pending" ? (
                      <div className="flex gap-2 flex-wrap">
                        <ActionButton
                          label="Approve"
                          color="green"
                          onClick={() => handleAction(t._id, "approve")}
                          loading={
                            loadingAction?.id === t._id &&
                            loadingAction?.action === "approve"
                          }
                          disabled={loadingAction?.id === t._id}
                        />
                        <ActionButton
                          label="Reject"
                          color="red"
                          onClick={() => openRejectModal(t)}
                          loading={
                            loadingAction?.id === t._id &&
                            loadingAction?.action === "reject"
                          }
                          disabled={loadingAction?.id === t._id}
                        />
                      </div>
                    ) : (
                      <div className="text-center">-</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage(page > 1 ? page - 1 : 1)}
          onNext={() => setPage(page < totalPages ? page + 1 : totalPages)}
        />
      </motion.div>

      {/* Reject Reason Modal */}
      <RejectPopup
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={(reason) => {
          handleAction(selectedTransaction._id, "reject", reason);
          setShowRejectModal(false);
        }}
      />
    </>
  );
};

export default Transactions;
