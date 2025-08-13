import React, { useState } from "react";

const ResultHistory = () => {
  const [resultHistory, setResultHistory] = useState([
    {
      period: "20250808010401",
      number: "3",
      bigSmall: "Small",
      color: "green",
    },
    { period: "20250808010400", number: "0", bigSmall: "Small", color: "red" },
    { period: "20250808010399", number: "9", bigSmall: "Big", color: "green" },
  ]);

  const getColorClass = (color) => {
    switch (color) {
      case "red":
        return "text-red-500";
      case "green":
        return "text-green-500";
      case "purple":
        return "text-purple-500";
      default:
        return "text-white";
    }
  };

  const getColorDot = (color) => {
    const colorMap = {
      red: "bg-red-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
    };
    return (
      <div
        className={`w-3 h-3 rounded-full ${colorMap[color] || "bg-gray-500"}`}
      ></div>
    );
  };
  return (
    <div className="bg-deepPurple text-white rounded-lg p-4 border border-midnightPurple">
      <h3 className="text-lg font-semibold mb-4">Result History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-midnightPurple ">
              <th className="text-left py-2">Periods</th>
              <th className="text-left py-2">Number</th>
              <th className="text-left py-2">Big/Small</th>
              <th className="text-left py-2">Colour</th>
            </tr>
          </thead>
          <tbody>
            {resultHistory.map((result, index) => (
              <tr key={index} className="border-b border-midnightPurple">
                <td className="py-2 ">{result.period}</td>
                <td
                  className={`py-2 font-semibold ${getColorClass(result.color)}`}
                >
                  {result.number}
                </td>
                <td className="py-2 ">{result.bigSmall}</td>
                <td className="py-2">{getColorDot(result.color)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultHistory;
