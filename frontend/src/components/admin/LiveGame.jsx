import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { motion } from 'framer-motion';

const LiveGame = () => {
  const [gameState, setGameState] = useState({ isSpinning: false, currentResult: null, bets: [] });
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    socketRef.current = io('http://localhost:3000', { auth: { token } });

    socketRef.current.on('gameState', (state) => setGameState(state));
    socketRef.current.on('spinStart', () => setGameState((prev) => ({ ...prev, isSpinning: true })));
    socketRef.current.on('spinResult', (data) => setGameState((prev) => ({ ...prev, isSpinning: false, currentResult: data.result })));
    socketRef.current.on('betPlaced', (bet) => setGameState((prev) => ({ ...prev, bets: [...prev.bets, bet] })));

    return () => {
      socketRef.current?.disconnect(); 
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/60 backdrop-blur p-6 rounded-lg shadow-lg border border-slate-800"
    >
      <h2 className="text-2xl font-bold text-emerald-300 mb-4">Live Ongoing Game</h2>
      <div className="mb-4">
        <p className="text-slate-300">Status: {gameState.isSpinning ? 'Spinning...' : 'Idle'}</p>
        {gameState.currentResult && (
          <p>Result: {gameState.currentResult.number} ({gameState.currentResult.color})</p>
        )}
      </div>
      <h3 className="text-xl text-slate-200 mb-2">Current Bets</h3>
      <table className="w-full text-left text-sm md:text-base">
        <thead>
          <tr className="bg-slate-800/80 text-slate-200">
            <th className="p-2">User ID</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Bet Type</th>
            <th className="p-2">Bet Value</th>
          </tr>
        </thead>
        <tbody>
          {gameState.bets.map((bet, index) => (
            <tr key={index} className="border-b border-slate-800/80">
              <td className="p-2">{bet.userId}</td>
              <td className="p-2">{bet.amount} INR</td>
              <td className="p-2">{bet.betType}</td>
              <td className="p-2">{bet.betValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default LiveGame;