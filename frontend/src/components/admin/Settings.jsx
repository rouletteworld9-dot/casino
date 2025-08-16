import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePaymentSettings } from "../../hooks/usePaymentSettings";
import UpdateSettings from "./UpdateSettings";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const imageFade = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

const Settings = () => {
  const [editMode, setEditMode] = useState(false);

  const {
    paymentSettings,
    paymentSettingsLoading,
    isFetching,
    isError,
    error,
    refetch,
    updateSettings,
    updateSettingsLoading,
  } = usePaymentSettings();

  const currentPayment = useMemo(
    () => ({
      qrCodeUrl: paymentSettings?.qrCodeUrl || "",
      upiId: paymentSettings?.upiId || "",
    }),
    [paymentSettings]
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.35 }}
      className="bg-midnightPurple text-white p-3 rounded-md"
    >
      <h2 className="text-2xl font-bold mb-7">Settings</h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.45 }}
        className="shadow-sm shadow-white p-7 rounded-lg max-w-3xl mx-auto"
      >
        <h3 className="mb-6 text-center  font-bold text-lg">
          Account Settings
        </h3>

        {paymentSettingsLoading || isFetching ? (
          <div className="text-center  py-8">Loading payment details...</div>
        ) : isError ? (
          <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            <span>
              {error?.response?.data?.message ||
                "Failed to load payment details."}
            </span>
            <button
              onClick={() => refetch()}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {!editMode ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-sm mb-2">Current QR Code</span>
                    {currentPayment.qrCodeUrl ? (
                      <motion.img
                        key={currentPayment.qrCodeUrl}
                        src={currentPayment.qrCodeUrl}
                        alt="QR Code"
                        className="w-40 h-40 object-contain rounded border border-white bg-white shadow"
                        initial="hidden"
                        animate="visible"
                        variants={imageFade}
                        transition={{ duration: 0.5 }}
                      />
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm  mb-2">Current UPI ID</span>
                    <div className="px-4 py-2 rounded bg-slate-100 border slate-3border-00 text-slate-900 font-mono text-lg break-all">
                      {currentPayment.upiId || "—"}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition cursor-pointer"
                >
                  Edit
                </button>
              </motion.div>
            ) : (
              <UpdateSettings
                currentPayment={currentPayment}
                updateSettings={updateSettings}
                updateSettingsLoading={updateSettingsLoading}
                refetch={refetch}
                onCancel={() => setEditMode(false)}
              />
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Settings;
