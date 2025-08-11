import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `/api/admin/transactions?type=withdrawal`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        // Always set an array, even if backend sends null or undefined
        setWithdrawals(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
        setWithdrawals([]); // fallback to empty
      }
    };
    fetchWithdrawals();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/admin/transactions/${id}/${action}`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setWithdrawals(
        withdrawals.map((w) =>
          w._id === id
            ? { ...w, status: action === "approve" ? "approved" : "rejected" }
            : w
        )
      );
    } catch (error) {
      console.error(`Error ${action} withdrawal:`, error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white text-gray-900 backdrop-blur p-6 rounded-lg shadow-lg border border-slate-800"
    >
      <h2 className="text-2xl font-bold text-neon-pink mb-4">Withdrawals</h2>
      <table className="w-full text-left text-sm md:text-base">
        <thead>
          <tr className="bg-slate-800/80 text-slate-200">
            <th className="p-2">User</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(withdrawals || []).map((w) => (
            <tr key={w._id} className="border-b border-slate-800/80 text-gray-900">
              <td className="p-2">{w.userId?.name || "Unknown User"}</td>
              <td className="p-2">{w.amount} INR</td>
              <td className="p-2">{w.status}</td>
              <td className="p-2">
                {w.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction(w._id, "approve")}
                      className="inline-flex items-center gap-1 bg-gray-600/90 text-white px-2 py-1 rounded mr-2 hover:bg-gray-600"
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(w._id, "reject")}
                      className="inline-flex items-center gap-1 bg-red-600/90 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      <FaTimes /> Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default Withdrawals;
