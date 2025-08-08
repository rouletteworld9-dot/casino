import { useState } from "react";
import { motion } from "framer-motion";
import { FaToggleOn, FaToggleOff, FaTrash, FaEdit } from "react-icons/fa";

const initialGames = [
  { id: "1", name: "Aviator", status: true },
  { id: "2", name: "Roulette", status: false },
  { id: "3", name: "Blackjack", status: true },
  { id: "4", name: "Crash", status: true },
];

const Games = () => {
  const [games, setGames] = useState(initialGames);

  const toggleStatus = (id) => {
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: !g.status } : g))
    );
  };

  //  const handleDeleteGame = (id) => {
  //   setConfirmId(id);
  //   setShowConfirm(true);
  // };

  const handleDeleteGame = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this game?"
    );
    if (!confirmDelete) return;

    setLoading(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white text-gray-900 opacity-10 rounded-xl backdrop-blur-3xl p-6 shadow-md shadow-gray-30 border-2 border-slate-800"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Games Management
      </h2>
      <table className="w-full text-left text-sm md:text-base rounded-lg">
        <thead>
          <tr className="bg-slate-800/80 text-slate-200 rounded-2xl">
            <th className="p-2">Game</th>
            <th className="p-2">Status</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr key={g.id} className="border-b border-slate-800/80">
              <td className="p-2">{g.name}</td>
              <td className="p-2">{g.status ? "Active" : "Disabled"}</td>
              <td className="p-2">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => toggleStatus(g.id)}
                    className="rounded bg-slate-800 px-2 py-1 text-slate-200 hover:bg-slate-700"
                    title="Toggle status"
                  >
                    {g.status ? (
                      <FaToggleOn className="text-gray-100" />
                    ) : (
                      <FaToggleOff className="text-slate-400" />
                    )}
                  </button>
                  <button
                    className="rounded bg-gray-700/90 px-2 py-1 text-white hover:bg-gray-400"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteGame(g.id)}
                    className="rounded bg-red-600/90 px-2 py-1 text-white hover:bg-red-400"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default Games;
