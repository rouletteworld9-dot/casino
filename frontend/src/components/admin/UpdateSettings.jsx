import { motion } from "framer-motion";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const UpdateSettings = ({
  currentPayment,
  updateSettings,
  updateSettingsLoading,
  onCancel,
  refetch,
}) => {
  const [upiId, setUpiId] = useState(currentPayment.upiId || "");
  const [qrFile, setQrFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentPayment.qrCodeUrl && !qrFile) {
      toast.error("Please select a QR image (PNG/JPG) for first-time setup.");
      return;
    }

    const formData = new FormData();
    formData.append("upiId", upiId);
    if (qrFile) formData.append("qrCode", qrFile);

    updateSettings(formData, {
      onSuccess: () => {
        refetch();
        setQrFile(null);
        setPreviewUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        onCancel();
      },
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Only PNG/JPG images are allowed");
      setQrFile(null);
      setPreviewUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setQrFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <motion.form
      onSubmit={handleSave}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 items-center"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* QR Upload */}
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">New QR Code</span>
          <input
            type="file"
            accept="image/png, image/jpeg"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="w-full md:w-72 mb-3 rounded border  bg-slate-100 p-2 text-slate-900"
          />
          <div className="w-40 h-40 flex items-center justify-center border border-gray-300 rounded bg-white">
            {previewUrl || currentPayment.qrCodeUrl ? (
              <img
                src={previewUrl || currentPayment.qrCodeUrl}
                alt="QR Code"
                className="w-full h-full object-contain rounded"
              />
            ) : (
              <span className="text-xs ">No image selected</span>
            )}
          </div>
        </div>

        {/* UPI Input */}
        <div className="flex flex-col items-center w-full">
          <span className="text-sm mb-2">UPI ID</span>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="Enter UPI ID"
            className="w-full md:w-72 px-4 py-2 rounded border border-slate-700 bg-slate-100 text-slate-900 font-mono text-lg"
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mt-2">
        <button
          type="submit"
          disabled={updateSettingsLoading}
          className="rounded bg-green-600 px-5 py-2 text-white hover:bg-green-700 transition disabled:opacity-60 cursor-pointer"
        >
          {updateSettingsLoading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-gray-400 px-5 py-2 text-white hover:bg-gray-500 transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
};

export default UpdateSettings;
