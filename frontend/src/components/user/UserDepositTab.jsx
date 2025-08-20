import React from "react";
import UserPaymentMethods from "../ui/UserPaymentMethods";
import PaymentMethodDetails from "./PaymentMethodDetails";

const UserDepositTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
      {/* Left Panel - Payment Methods */}
      <UserPaymentMethods />

      {/* Right Panel - Payment Details */}
      <PaymentMethodDetails />
    </div>
  );
};

export default UserDepositTab;
