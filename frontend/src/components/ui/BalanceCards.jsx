import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useSingleUser } from "../../hooks/useAdminUsers";

const BalanceCards = () => {
  const user = useAuthStore((state) => state.user);
  const [showBalance, setShowBalance] = useState(true);
  const { singleUser } = useSingleUser(user._id);

  return (
    <>
      <div className="bg-midnightPurple rounded p-4 mt-9 mb-4 relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-gray-400 text-sm font-medium">BALANCE</p>
            <p className="text-white text-2xl font-bold">
              {showBalance ? singleUser?.realBalance : "*****"}
            </p>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-deepPurple rounded transition-colors"
          >
            {showBalance ? (
              <Eye size={16} className="text-gray-400" />
            ) : (
              <EyeOff size={16} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Bonus Account Section */}
      <div className="bg-midnightPurple rounded p-4 mb-6">
        <p className="text-gray-400 text-sm font-medium mb-2">BONUS ACCOUNT</p>
        <p className="text-white text-2xl font-bold">
          {" "}
          {showBalance ? singleUser?.playTokens : "*****"}
        </p>
      </div>
    </>
  );
};

export default BalanceCards;
