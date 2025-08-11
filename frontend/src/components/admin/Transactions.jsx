import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const mockData = Array.from({ length: 42 }).map((_, i) => ({
  id: i + 1,
  type: ["deposit", "withdrawal", "bet", "win"][i % 4],
  amount: Math.floor(Math.random() * 5000) + 100,
  user: `User ${i + 1}`,
  date: new Date(Date.now() - i * 86400000).toISOString(),
}));

const Transactions = () => {
  const [type, setType] = useState("all");
  const [data, setData] = useState(mockData);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    // TODO: fetch real transactions
  }, []);

  const filtered = useMemo(
    () => (type === "all" ? data : data.filter((t) => t.type === type)),
    [data, type]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white text-gray-900 backdrop-blur-3xl p-6 rounded-lg shadow-lg border border-slate-800"
    >
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1); // reset page when filter changes
          }}
          className="rounded border border-slate-700 bg-slate-800/80 p-2 text-white"
        >
          <option value="all">All</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="bet">Bets</option>
          <option value="win">Winnings</option>
        </select>
      </div>

      <table className="w-full h-full text-left text-sm md:text-base">
        <thead>
          <tr className="bg-slate-800/80 text-slate-200">
            <th className="p-2">User</th>
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((t) => (
            <tr
              key={t.id}
              className="border-b text-gray-900 border-slate-800/80"
            >
              <td className="p-2">{t.user}</td>
              <td className="p-2 capitalize">{t.type}</td>
              <td className="p-2">{t.amount} INR</td>
              <td className="p-2">{new Date(t.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-800">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-slate-700 px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded border border-slate-700 px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Transactions;
