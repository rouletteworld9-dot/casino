import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const RechargeApprove = () => {
  const [pendingDeposits, setPendingDeposits] = useState([]);

  useEffect(() => {
    const fetchPendingDeposits = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "/api/admin/transactions?type=deposit&status=pending",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setPendingDeposits(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching pending deposits:", error);
        setPendingDeposits([]); // fallback to empty
      }
    };
    fetchPendingDeposits();
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
      setPendingDeposits(pendingDeposits.filter((d) => d._id !== id));
    } catch (error) {
      console.error(`Error ${action} deposit:`, error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white text-gray-900 backdrop-blur p-6 rounded-lg shadow-lg border border-slate-800"
    >
      <h2 className="text-2xl font-bold text-neon-pink mb-4">
        Recharge Approve
      </h2>
      <table className="w-full text-left text-sm md:text-base">
        <thead>
          <tr className="bg-slate-800/80 text-slate-200">
            <th className="p-2">User</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingDeposits.map((d) => (
            <tr key={d._id} className="border-b border-slate-800/80 text-gray-900">
              <td className="p-2">{d.userId?.name}</td>
              <td className="p-2">{d.amount} INR</td>
              <td className="p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(d._id, "approve")}
                    className="bg-gray-600/90 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(d._id, "reject")}
                    className="bg-red-600/90 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default RechargeApprove;
