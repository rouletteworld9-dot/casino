import React from "react";
import { useGameSocket } from "../../hooks/useGameSocket";
import { useAuthStore } from "../../stores/useAuthStore";

const LastResults = () => {
  const user = useAuthStore((state) => state.user);
  const { lastResults } = useGameSocket(user?._id);

  return (
    <div className="z-60 flex bg-transaparent  items-center justify-center ">
      {lastResults?.map((res, idx) => (
        <div
          key={res.roundId || idx}
          className={`w-5 h-5 flex items-center p-5 border-[0.1px] border-white justify-center text-xs font-bold ${
            idx % 2 === 0 ? "bg-black/70 text-red-600" : "bg-black/70 text-white"
          }`}
        >
          {res.result}
        </div>
      ))}
    </div>
  );
};

export default LastResults;
