import React from "react";
import { useState } from "react";

const UserPaymentMethods = () => {
      const [selectedMethod, setSelectedMethod] = useState("upi-safepay");
    
  const paymentMethods = [
    {
      id: "upi",
      name: "UPI",
      logo: "🔺",
      minAmount: 300,
      colors: "bg-gradient-to-r from-blue-600 to-green-600",
    },
    {
      id: "upi-baterybet",
      name: "Card",
      logo: "🔺",
      minAmount: 300,
      colors: "bg-gradient-to-r from-blue-600 to-green-600",
    },
    {
      id: "bank-transfer",
      name: "Netbanking",
      logo: "🔺",
      minAmount: 500,
      colors: "bg-gradient-to-r from-orange-600 to-red-600",
    },
    {
      id: "usdt-trc20",
      name: "Cash",
      logo: "💎",
      minAmount: 300,
      colors: "bg-gradient-to-r from-teal-600 to-green-600",
    },
  ];
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Choose a method</h2>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`relative p-4 rounded-lg cursor-pointer transition-all border-2 ${
              selectedMethod === method.id
                ? "border-yellow-500"
                : "border-transparent hover:border-gray-600"
            } bg-lightPurple`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${method.colors}`}
              >
                {method.logo}
              </div>
              <div>
                <h3 className="text-white font-semibold">{method.name}</h3>
                <p className="text-gray-400 text-sm">
                  from ₹{method.minAmount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPaymentMethods;
