import React, { useState } from "react";
import { motion } from "framer-motion";
import { useResultAdjuster } from "../../hooks/useResultAdjuster";
import { useGameSocket } from "../../hooks/useGameSocket";
const ResultAdjuster = () => {
  console.log("console")
  const [number, setNumber] = useState("");
  const { resultAdjustFn } = useResultAdjuster(number);
  const {forceResult}=useGameSocket()

  const handleSubmitResult = () => {
    forceResult(number)
    
    // if (number.trim()) {
    //   resultAdjustFn(number, {
    //     onSuccess: () => {
    //       setNumber("");
    //     },
    //     onError: () => {
    //       setNumber("");
    //     },
    //   });
    // }
  };

  return (
    <div className="bg-deepPurple text-white rounded-lg p-4 border border-midnightPurple">
      <h3 className="text-lg font-semibold  mb-4">Adjusting the result</h3>
      <div className=" text-sm mb-4"></div>
      <div className="mb-4">
        <span className="">Next Result: </span>
        <span className="text-blue-400 font-semibold">Random</span>
      </div>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm mb-2">
            Enter the result (e.g., 1 , 2 , ... 36)
          </label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full px-3 py-2 bg-midnightPurple border rounded-xs border-deepPurple text-white "
            placeholder="Enter result..."
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmitResult}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xs transition-colors cursor-pointer"
        >
          Submit
        </motion.button>
      </div>
    </div>
  );
};

export default ResultAdjuster;
