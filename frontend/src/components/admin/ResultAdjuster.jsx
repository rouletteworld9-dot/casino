import React, { useState } from "react";
import { motion } from "framer-motion";
const ResultAdjuster = () => {
  const [nextResult, setNextResult] = useState("");

    const handleSubmitResult = () => {
      if (nextResult.trim()) {
        // Add logic to submit the result
        console.log("Submitting result:", nextResult);
        setNextResult("");
      }
    };

  return (
    <div className="bg-purple-100 text-gray-900 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Adjusting the result
      </h3>
      <div className="text-gray-900 text-sm mb-4">
        <p>
          0 (Red and Purple) | 5 (Blue and Purple) | 1, 3, 7, 9 (Blue) | 2, 4,
          6, 8 (Red)
        </p>
      </div>
      <div className="mb-4">
        <span className="text-gray-900">Next Result: </span>
        <span className="text-blue-400 font-semibold">Random</span>
      </div>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-gray-900 text-sm mb-2">
            Enter the result (e.g., 1)
          </label>
          <input
            type="text"
            value={nextResult}
            onChange={(e) => setNextResult(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter result..."
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmitResult}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Submit
        </motion.button>
      </div>
    </div>
  );
};

export default ResultAdjuster;
