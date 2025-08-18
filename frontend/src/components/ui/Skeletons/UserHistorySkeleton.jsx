import React from "react";

const UserHistorySkeleton = () => {
  return (
    <div className="min-h-screen text-white animate-pulse">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-midnightPurple rounded-full" />
          <div>
            <div className="h-5 w-40 bg-midnightPurple rounded mb-2" />
            <div className="h-4 w-28 bg-midnightPurple rounded" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-midnightPurple">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-28 bg-midnightPurple rounded" />
          ))}
        </div>

        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-darkViolet">
                {[...Array(7)].map((_, i) => (
                  <th key={i} className="px-2 py-3 text-left">
                    <div className="h-4 w-20 bg-midnightPurple rounded" />
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Skeleton Rows */}
            <tbody>
              {[...Array(6)].map((_, rowIdx) => (
                <tr key={rowIdx} className="border-t border-midnightPurple">
                  {[...Array(7)].map((_, colIdx) => (
                    <td key={colIdx} className="px-2 py-3">
                      <div className="h-4 w-24 bg-midnightPurple rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserHistorySkeleton;
