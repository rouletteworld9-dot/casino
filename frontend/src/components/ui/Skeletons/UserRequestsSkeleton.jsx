import React from "react";

const UserRequestsSkeleton = () => {
  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-darkViolet rounded-full animate-pulse" />
          <div>
            <div className="h-5 w-40 bg-darkViolet rounded animate-pulse mb-2"></div>
            <div className="h-3 w-28 bg-darkViolet rounded animate-pulse"></div>
          </div>
        </div>

        {/* Transactions List Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-4 border animate-pulse"
              style={{
                backgroundColor: "#231528",
                borderColor: "#2a1033",
              }}
            >
              <div className="flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-darkViolet rounded-full"></div>
                  <div>
                    <div className="h-4 w-24 bg-darkViolet rounded mb-2"></div>
                    <div className="h-3 w-32 bg-darkViolet rounded mb-1"></div>
                    <div className="h-3 w-20 bg-darkViolet rounded"></div>
                  </div>
                </div>

                {/* Right side */}
                <div className="text-right">
                  <div className="h-4 w-16 bg-darkViolet rounded mb-2"></div>
                  <div className="h-3 w-12 bg-darkViolet rounded ml-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRequestsSkeleton;
