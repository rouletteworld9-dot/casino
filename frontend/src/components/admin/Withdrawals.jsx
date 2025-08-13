import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { Banknote } from "lucide-react";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [activeTab, setActiveTab] = useState("BANK CARD");
  const [viewingRow, setViewingRow] = useState(null);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`/api/admin/withdrawals`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const normalized = items.map((w, index) => ({
          id: w._id || w.id || String(index),
          serial: w.serial || String(index + 1),
          phoneNumber: w.phoneNumber || w.userId?.phone || w.user?.phone || "-",
          bankName: w.bankName || w.bank?.name || "-",
          recipientName: w.recipientName || w.accountHolder || w.name || "-",
          accountNumber: w.bankAccountNumber || w.accountNumber || "-",
          ifsc: w.ifsc || w.ifscCode || "-",
          upiId: w.upiId || w.upi || "--",
          amount: w.amount ?? 0,
          date: w.createdAt || w.date || new Date().toISOString(),
          status: w.status || "pending",
        }));
        setWithdrawals(normalized);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
        // Mock minimal data if API not ready
        const now = new Date();
        setWithdrawals([
          {
            id: "mock-1",
            serial: "491",
            phoneNumber: "8814005097",
            bankName: "State Bank of India",
            recipientName: "Jheni devi",
            accountNumber: "61317994523",
            ifsc: "SBIN0031184",
            upiId: "--",
            amount: 7000,
            date: now.toISOString(),
            status: "pending",
          },
        ]);
      }
    };
    fetchWithdrawals();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/api/admin/transactions/${id}/${action}`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setWithdrawals((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, status: action === "approve" ? "approved" : "rejected" } : w
        )
      );
    } catch (error) {
      console.error(`Error ${action} withdrawal:`, error);
    }
  };

  const columnHelper = useMemo(() => createColumnHelper(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("serial", {
        header: () => "#",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("phoneNumber", {
        header: () => "Phone Number",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("bankName", {
        header: () => "Bank Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("recipientName", {
        header: () => "Recipient Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("accountNumber", {
        header: () => "Bank Account Number",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("ifsc", {
        header: () => "IFSC",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("upiId", {
        header: () => "UPI Id",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("amount", {
        header: () => "Amount",
        cell: (info) => <span>{info.getValue()} </span>,
      }),
      columnHelper.accessor("date", {
        header: () => "Date",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      }),
      columnHelper.accessor("status", {
        header: () => "Status",
        cell: (info) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-400 text-gray-900 text-xs font-medium">
            Waiting...
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => "Accept/Reject",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
          
            <button
              onClick={() => handleAction(row.original.id, "approve")}
              className="inline-flex items-center justify-center w-8 h-8 rounded bg-green-500 text-white hover:bg-green-600"
              aria-label="Approve"
            >
              <FaCheck />
            </button>
            <button
              onClick={() => handleAction(row.original.id, "reject")}
              className="inline-flex items-center justify-center w-8 h-8 rounded bg-red-500 text-white hover:bg-red-600"
              aria-label="Reject"
            >
              <FaTimes />
            </button>
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: withdrawals,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white text-gray-900 backdrop-blur p-4 md:p-8 rounded-2xl shadow-xl border border-slate-200 max-w-full"
    >
      <div className="flex items-center gap-2 mb-4">
        
        <h2 className="text-2xl md:text-2xl font-bold tracking-tight">Withdrawal Requests</h2>
      </div>

      <div className="overflow-x-auto w-full max-w-full scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-100 rounded-lg shadow border border-slate-200">
        <table className="min-w-[900px] w-full text-left text-sm md:text-base bg-white rounded-lg">
          <thead className="bg-slate-100 text-gray-900 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 border-b border-slate-200 font-semibold bg-slate-100 sticky top-0 z-10 text-xs md:text-sm uppercase tracking-wider">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50 even:bg-slate-50/60 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-xs md:text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>)
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingRow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Withdrawal Details</h3>
              <button
                onClick={() => setViewingRow(null)}
                className="px-3 py-1 text-sm rounded-lg bg-slate-200 hover:bg-slate-300 font-semibold"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="font-sm">Phone:</span> {viewingRow.phoneNumber}</div>
              <div><span className="font-sm">Bank:</span> {viewingRow.bankName}</div>
              <div><span className="font-sm">Recipient:</span> {viewingRow.recipientName}</div>
              <div><span className="font-sm">Account No:</span> {viewingRow.accountNumber}</div>
              <div><span className="font-sm">IFSC:</span> {viewingRow.ifsc}</div>
              <div><span className="font-sm">UPI Id:</span> {viewingRow.upiId}</div>
              <div><span className="font-sm">Amount:</span> {viewingRow.amount}</div>
              <div><span className="font-sm">Date:</span> {new Date(viewingRow.date).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Withdrawals;