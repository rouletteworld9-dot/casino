import React from "react";

const UserProfileSkeleton = () => {
  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-darkViolet rounded-full" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-darkViolet rounded" />
            <div className="h-4 w-28 bg-darkViolet rounded" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-darkViolet rounded" />
          ))}
        </div>

        {/* Panels Skeleton */}
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-darkViolet p-4 shadow-md rounded-lg space-y-3"
            >
              <div className="h-4 w-32 bg-midnightPurple rounded" />
              <div className="h-3 w-40 bg-midnightPurple rounded" />
              <div className="h-3 w-36 bg-midnightPurple rounded" />
              <div className="h-3 w-28 bg-midnightPurple rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
    