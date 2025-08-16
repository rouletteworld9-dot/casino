// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { FaCheck, FaTimes } from "react-icons/fa";
// import RejectPopup from "./RejectPopup";
// import ActionButton from "./ActionButton";
// import Pagination from "../ui/Pagination";
// import {
//   getCoreRowModel,
//   useReactTable,
//   flexRender,
//   createColumnHelper,
// } from "@tanstack/react-table"

// const Withdrawals = () => {
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [activeTab, setActiveTab] = useState("BANK CARD");
//   const [viewingRow, setViewingRow] = useState(null);
//   const [loadingAction, setLoadingAction] = useState(null);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
//   const [page, setPage] = useState(1);
//   const pageSize = 10;

//   useEffect(() => {
//     const fetchWithdrawals = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const { data } = await axios.get(`/api/admin/withdrawals`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });
//         const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
//         const normalized = items.map((w, index) => ({
//           id: w._id || w.id || String(index),
//           serial: w.serial || String(index + 1),
//           phoneNumber: w.phoneNumber || w.userId?.phone || w.user?.phone || "-",
//           bankName: w.bankName || w.bank?.name || "-",
//           recipientName: w.recipientName || w.accountHolder || w.name || "-",
//           accountNumber: w.bankAccountNumber || w.accountNumber || "-",
//           ifsc: w.ifsc || w.ifscCode || "-",
//           upiId: w.upiId || w.upi || "--",
//           amount: w.amount ?? 0,
//           date: w.createdAt || w.date || new Date().toISOString(),
//           status: w.status || "pending",
//         }));
//         setWithdrawals(normalized);
//       } catch (error) {
//         console.error("Error fetching withdrawals:", error);
//         // Mock minimal data if API not ready
//         const now = new Date();
//         setWithdrawals([
//           {
//             id: "mock-1",
//             serial: "491",
//             phoneNumber: "8814005097",
//             bankName: "State Bank of India",
//             recipientName: "Jheni devi",
//             accountNumber: "61317994523",
//             ifsc: "SBIN0031184",
//             upiId: "--",
//             amount: 7000,
//             date: now.toISOString(),
//             status: "pending",
//           },
//         ]);
//       }
//     };
//     fetchWithdrawals();
//   }, []);

//   const handleAction = async (id, action, reason) => {
//     setLoadingAction({ id, action });
//     try {
//       const token = localStorage.getItem("token");
//       const body = action === "reject" && reason ? { adminNote: reason } : {};
//       await axios.post(`/api/admin/transactions/${id}/${action}`, body, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       setWithdrawals((prev) =>
//         prev.map((w) =>
//           w.id === id ? { ...w, status: action === "approve" ? "approved" : "rejected" } : w
//         )
//       );
//     } catch (error) {
//       console.error(`Error ${action} withdrawal:`, error);
//     } finally {
//       setLoadingAction(null);
//     }
//   };

//   const columnHelper = useMemo(() => createColumnHelper(), []);
//   const columns = useMemo(
//     () => [
//       columnHelper.accessor("serial", {
//         header: () => "#",
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor("phoneNumber", {
//         header: () => "Phone Number",
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor("bankName", {
//         header: () => "Bank Name",
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor("recipientName", {
//         header: () => "Recipient Name",
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor("accountNumber", {
//         header: () => "Bank Account Number",
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor("ifsc", {
//         header: () => "IFSC",
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor("upiId", {
//         header: () => "UPI Id",
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor("amount", {
//         header: () => "Amount",
//         cell: (info) => (
//           <span className="tabular-nums font-semibold">
//             ₹{Number(info.getValue() || 0).toLocaleString("en-IN")}
//           </span>
//         ),
//       }),
//       columnHelper.accessor("date", {
//         header: () => "Date",
//         cell: (info) => new Date(info.getValue()).toLocaleString(),
//       }),
//       columnHelper.accessor("status", {
//         header: () => "Status",
//         cell: (info) => {
//           const status = String(info.getValue() || "pending").toLowerCase();
//           const styles =
//             status === "approved"
//               ? "bg-green-100 text-green-800"
//               : status === "rejected"
//               ? "bg-red-100 text-red-800"
//               : "bg-yellow-100 text-yellow-800";
//           const label =
//             status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Pending";
//           return (
//             <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles}`}>
//               {label}
//             </span>
//           );
//         },
//       }),
//       columnHelper.display({
//         id: "actions",
//         header: () => "Approve / Reject",
//         cell: ({ row }) => {
//           const currentStatus = String(row.original.status || "pending").toLowerCase();
//           const isPending = currentStatus === "pending";
//           if (!isPending) {
//             return <div className="text-center">-</div>;
//           }
//           return (
//             <div className="flex gap-2 ">
//               <ActionButton
//                 label="Approve"
//                 color="green"
//                 onClick={() => handleAction(row.original.id, "approve")}
//                 loading={
//                   loadingAction?.id === row.original.id &&
//                   loadingAction?.action === "approve"
//                 }
//                 disabled={loadingAction?.id === row.original.id}
//               />
//               <ActionButton
//                 label="Reject"
//                 color="red"
//                 onClick={() => {
//                   setSelectedWithdrawal(row.original);
//                   setShowRejectModal(true);
//                 }}
//                 loading={
//                   loadingAction?.id === row.original.id &&
//                   loadingAction?.action === "reject"
//                 }
//                 disabled={loadingAction?.id === row.original.id}
//               />
//             </div>
//           );
//         },
//       }),
//     ],
//     [columnHelper]
//   );

//   const table = useReactTable({
//     data: withdrawals,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   const totalPages = Math.ceil(withdrawals.length / pageSize) || 1;
//   const start = (page - 1) * pageSize;
//   const paginated = withdrawals.slice(start, start + pageSize);

//   return (
//     <motion.div className="bg-midnightPurple text-white p-4 sm:p-6 rounded-lg shadow-lg border border-midnightPurple overflow-x-auto">
//       <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
//         <h2 className="text-xl sm:text-2xl font-bold">Withdrawals</h2>
//       </div>

//       <div className="overflow-x-auto pb-2">
//         <table className="min-w-[1100px] w-full text-left text-xs sm:text-sm md:text-base">
//           <thead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id} className="bg-deepPurple text-white">
//                 {headerGroup.headers.map((header) => (
//                   <th key={header.id} className="p-2">
//                     {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table
//               .getRowModel()
//               .rows.slice(start, start + pageSize)
//               .map((row) => (
//                 <tr key={row.id} className="border-b border-deepPurple">
//                   {row.getVisibleCells().map((cell) => (
//                     <td key={cell.id} className="p-2 whitespace-nowrap">
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>

//       <Pagination
//         page={page}
//         totalPages={totalPages}
//         onPrev={() => setPage(page > 1 ? page - 1 : 1)}
//         onNext={() => setPage(page < totalPages ? page + 1 : totalPages)}
//       />

//       <RejectPopup
//         isOpen={showRejectModal}
//         onClose={() => setShowRejectModal(false)}
//         onConfirm={(reason) => {
//           if (selectedWithdrawal) {
//             handleAction(selectedWithdrawal.id, "reject", reason);
//           }
//           setShowRejectModal(false);
//         }}
//       />
//     </motion.div>
//   );
// };

// export default Withdrawals;

import { useState } from "react";
import { motion } from "framer-motion";
import RejectPopup from "./RejectPopup";
import { useTransactions } from "../../hooks/useTransactions";
import TableSkeleton from "../ui/Skeletons/TableSkeleton";
import ActionButton from "./ActionButton";
import Pagination from "../ui/Pagination";
const Withdrawals = () => {
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
  } = useTransactions(type === "all" ? undefined : type, "withdraw");

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
          <h2 className="text-xl sm:text-2xl font-bold">Withdrawals</h2>
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
                <th className="p-2">Serial</th>
                <th className="p-2">Phone Number</th>
                <th className="p-2">Bank Name</th>
                <th className="p-2">Receipient name</th>
                <th className="p-2">Bank Account Number</th>
                <th className="p-2">IFSC</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Approve / Reject</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((t) => (
                <tr key={t._id} className="border-b border-deepPurple">
                  <td className="p-2">{"N/A"}</td>
                  <td className="p-2">{t.user?.phone || "N/A"}</td>
                  <td className="p-2 capitalize">{"N/A"}</td>
                  <td className="p-2">{t.recipientName}</td>
                  <td className="p-2">{t?.bankAccountNumber}</td>
                  <td className="p-2 capitalize">{t.ifscCode || "N/A"}</td>
                  <td className="p-2">{t.amount || "-"}</td>
                  <td className="p-2 text-xs">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>

                  <td>{t.transactionStatus || "N/A"}</td>
                  <td>
                    {" "}
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

export default Withdrawals;
