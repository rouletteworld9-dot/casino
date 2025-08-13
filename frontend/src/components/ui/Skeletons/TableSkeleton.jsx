import { motion } from "framer-motion";

const TableSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-midnightPurple text-white backdrop-blur-3xl p-6 rounded-lg shadow-lg border border-midnightPurple"
    >
      {/* Skeleton Header */}
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="h-6 w-40 bg-deepPurple animate-pulse rounded"></div>
        <div className="h-10 w-32 bg-deepPurple animate-pulse rounded"></div>
      </div>

      {/* Skeleton Table */}
      <table className="w-full text-left text-sm md:text-base">
        <thead>
          <tr className="bg-deepPurple text-white">
            <th className="p-2">User</th>
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">UTR</th>
            <th className="p-2">Accept/Reject</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, i) => (
            <tr key={i} className="border-b border-deepPurple">
              {Array.from({ length: 7 }).map((__, j) => (
                <td key={j} className="p-2">
                  <div className="h-4 w-full bg-deepPurple animate-pulse rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default TableSkeleton;
