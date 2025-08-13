import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTransactions } from "../../hooks/useTransactions";

const Transactions = () => {
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { allTransactions } = useTransactions();
  console.log(allTransactions, "alll transactionss");

  // Filter transactions based on type
  const filtered = useMemo(() => {
    if (!allTransactions) return [];
    if (type === "all") return allTransactions;
    return allTransactions.filter(
      (t) => t.transactionType.toLowerCase() === type.toLowerCase()
    );
  }, [allTransactions, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Paginate filtered data
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-midnightPurple text-white backdrop-blur-3xl p-6 rounded-lg shadow-lg border border-midnightPurple"
    >
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1); // reset page when filter changes
          }}
          className="rounded border border-midnightPurple bg-deepPurple p-2 text-white"
        >
          <option value="all">All</option>
          <option value="withdraw">Withdrawals</option>
          <option value="deposit">Deposits</option>
          <option value="bet">Bets</option>
          <option value="win">Winnings</option>
        </select>
      </div>

      <table className="w-full not-last: h-full text-left text-sm md:text-base">
        <thead>
          <tr className="bg-deepPurple text-white">
            <th className="p-2">User</th>
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">UTR</th>
            <th className="p-2">UTR</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((t) => (
            <tr key={t._id} className="border-b  border-deepPurple">
              <td className="p-2 text-sm">
                {t.user?.name || t.user?.phone || "N/A"}
              </td>
              <td className="p-2 text-sm capitalize">{t.transactionType}</td>
              <td className="p-2 text-sm">{t.amount}</td>
              <td className="p-2 text-sm">
                {new Date(t.createdAt).toLocaleString()}
              </td>
              <td className="p-2 text-sm capitalize">
                {t.transactionStatus || "N/A"}
              </td>
              <td className="p-2 text-sm">{t.utr || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between text-sm ">
        <span className=" text-sm">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-deepPurple px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded border border-deepPurple px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Transactions;
