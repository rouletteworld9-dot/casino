import React, { useState } from "react";
import { useGameStore } from "../../stores/useGameStore";

const ResultHistory = () => {

  const lastResults = useGameStore((state) => state.lastResults);
 
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRoundId = (roundId) => {
    if (!roundId) return 'N/A';
    return roundId.slice(-8); // Show last 8 characters
  };

  const isJackpot = (winningAmount) => winningAmount > 10000;

  return (
    <div className="bg-deepPurple text-white rounded-lg p-4 border border-midnightPurple">
      <h3 className="text-lg font-semibold mb-4">Result History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-midnightPurple">
              <th className="text-left py-2 px-2">Result</th>
              <th className="text-left py-2 px-2">Round ID</th>
              <th className="text-left py-2 px-2">Date & Time</th>
              <th className="text-left py-2 px-2">Bet Amount</th>
              <th className="text-left py-2 px-2">Winning Amount</th>
              <th className="text-left py-2 px-2">User ID</th>
              <th className="text-left py-2 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {lastResults && lastResults.length > 0 ? (
              lastResults.map((result, index) => (
                <tr key={index} className="border-b border-midnightPurple hover:bg-midnightPurple/30">
                  {/* Result Number */}
                  <td className="py-2 px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${
                      result.result === 0 ? 'bg-green-600' : 
                      result.result % 2 === 0 ? 'bg-red-600' : 'bg-black'
                    }`}>
                      {result.result}
                    </div>
                  </td>
                  
                  {/* Round ID */}
                  <td className="py-2 px-2 text-xs font-mono">
                    {formatRoundId(result.roundId)}
                  </td>
                  
                  {/* Date & Time */}
                  <td className="py-2 px-2">
                    <div className="text-xs">
                      <div className="font-semibold">{formatDate(result.timestamp)}</div>
                      <div className="text-gray-400">{formatTime(result.timestamp)}</div>
                    </div>
                  </td>
                  
                  {/* Bet Amount */}
                  <td className="py-2 px-2">
                    <div className={`font-semibold ${result.betAmount > 0 ? 'text-blue-400' : 'text-gray-400'}`}>
                      ₹{result.betAmount?.toLocaleString() || '0'}
                    </div>
                  </td>
                  
                  {/* Winning Amount */}
                  <td className="py-2 px-2">
                    <div className={`font-semibold ${isJackpot(result.winningAmount) ? 'text-yellow-400' : result.winningAmount > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                      ₹{result.winningAmount?.toLocaleString() || '0'}
                      {isJackpot(result.winningAmount) && <span className="ml-1">🎉</span>}
                    </div>
                  </td>
                  
                  {/* User ID */}
                  <td className="py-2 px-2">
                    <div className="text-xs">
                      {result.userId ? (
                        <span className="bg-purple-600 px-2 py-1 rounded text-xs">
                          {result.userId.slice(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No Player</span>
                      )}
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="py-2 px-2">
                    <div className="text-xs">
                      {result.winningAmount > 0 ? (
                        <span className={`px-2 py-1 rounded ${
                          isJackpot(result.winningAmount) 
                            ? 'bg-yellow-600 text-black font-bold' 
                            : 'bg-green-600 text-white'
                        }`}>
                          {isJackpot(result.winningAmount) ? 'JACKPOT!' : 'WIN'}
                        </span>
                      ) : result.betAmount > 0 ? (
                        <span className="bg-red-600 px-2 py-1 rounded text-xs">
                          LOSS
                        </span>
                      ) : (
                        <span className="bg-gray-600 px-2 py-1 rounded text-xs">
                          NO BET
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-400">
                  <div className="text-2xl mb-2">🎲</div>
                  <p>No results available</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultHistory;
