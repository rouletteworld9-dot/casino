import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";

const InsufficientBalanceModal = () => {
  const user = useAuthStore((state) => state.user);
  const [showInsufficient, setShowInsufficient] = useState(false);

  useEffect(() => {
    if ((user && user.realBalance) < 10) { 
      setShowInsufficient(true);
    }
  }, [user]);


  if (!showInsufficient) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-deepPurple p-6 rounded-lg  max-w-xs w-full text-center relative border-2 border-white shadow-sm shadow-deeppurple">
        <h2 className="text-xl font-bold mb-2 text-red-600">Insufficient Balance</h2>
        <p className="mb-4 text-gray-100">Your balance is below ₹10. Please deposit more funds to play Roulette.</p>
        <button
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:scale-105  transition cursor-pointer" 
          onClick={()=>setShowInsufficient(false)}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default InsufficientBalanceModal;
