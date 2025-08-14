import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authApi from "../../api/authApi";
import { useAuthStore } from "../../stores/useAuthStore";
import { toast } from "react-hot-toast";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const imageFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Settings = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isRefreshing = useAuthStore((s) => s.isRefreshing);
  const isAuthLoading = useAuthStore((s) => s.isLoading);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  const [editMode, setEditMode] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [qrFile, setQrFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  // Fetch current payment details
  const { data, isLoading, isError, refetch, isFetching, error } = useQuery({
    queryKey: ["paymentDetails"],
    queryFn: async () => {
      return await authApi.getPaymentSettings();
    },
    enabled: !!accessToken && !isRefreshing,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const currentPayment = useMemo(
    () => ({ qrCodeUrl: data?.qrCodeUrl || "", upiId: data?.upiId || "" }),
    [data]
  );

  // Mutation for updating payment details
  const { mutate, isLoading: isSaving } = useMutation({
    mutationFn: async (formData) => authApi.updatePaymentSettings(formData),
    onSuccess: () => {
      toast.success("Account setting updated successfully");
      setEditMode(false);
      setQrFile(null);
      setPreviewUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["paymentDetails"] });
    },
    onError: (err) => {
      toast.error("Failed to update payment details");
    },
  });

  // Ensure we try to restore session on mount if no token
  useEffect(() => {
    if (!accessToken) {
      checkAuth().catch(() => {});
    }
  }, [accessToken, checkAuth]);

  // When entering edit mode, seed inputs with current values
  const handleEnterEdit = () => {
    setUpiId(currentPayment.upiId || "");
    setQrFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setEditMode(true);
  };

  // File change handler with preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setQrFile(null);
      setPreviewUrl("");
      return;
    }
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.warn("Only PNG/JPG images are allowed");
      setQrFile(null);
      setPreviewUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setQrFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Save handler
  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("upiId", upiId);
    // If there is no existing QR on server and no new file selected, block to avoid possible backend 500s
    if (!currentPayment.qrCodeUrl && !qrFile) {
      toast.warn("Please select a QR image (PNG/JPG) for first-time setup.");
      return;
    }
    if (qrFile) formData.append("qrCode", qrFile);
    mutate(formData);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditMode(false);
    setUpiId(currentPayment.upiId || "");
    setQrFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.35 }}
      className="bg-white/80 text-gray-900 p-3 rounded-md"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-7">Settings</h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.45 }}
        className="shadow-sm shadow-black p-7 rounded-lg max-w-3xl mx-auto"
      >
        <h3 className="mb-6 text-center text-gray-800 font-bold text-lg">
          Account Settings
        </h3>

        {!accessToken ? (
          <div className="text-center text-gray-600 py-8">
            {isAuthLoading || isRefreshing
              ? "Checking session..."
              : "Please log in to view settings."}
          </div>
        ) : isLoading || isFetching ? (
          <div className="text-center text-gray-500 py-8">
            Loading payment details...
          </div>
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
                    <span className="text-sm text-gray-600 mb-2">
                      Current QR Code
                    </span>
                    {currentPayment.qrCodeUrl ? (
                      <motion.img
                        key={currentPayment.qrCodeUrl}
                        src={currentPayment.qrCodeUrl}
                        alt="QR Code"
                        className="w-40 h-40 object-contain rounded border border-gray-300 bg-white shadow"
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
                    <span className="text-sm text-gray-600 mb-2">
                      Current UPI ID
                    </span>
                    <div className="px-4 py-2 rounded bg-slate-100 border border-slate-300 text-slate-900 font-mono text-lg break-all">
                      {currentPayment.upiId || "—"}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleEnterEdit}
                  className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition cursor-pointer"
                >
                  Edit
                </button>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSave}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-6 items-center"
              >
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-600 mb-2">
                      New QR Code
                    </span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="w-full md:w-72 mb-3 rounded border border-slate-700 bg-slate-100 p-2 text-slate-900 focus:outline-1 focus:outline-blue-500"
                    />
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={imageFade}
                      transition={{ duration: 0.5 }}
                      className="w-40 h-40 flex items-center justify-center border border-gray-300 rounded bg-white"
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-contain rounded"
                        />
                      ) : currentPayment.qrCodeUrl ? (
                        <img
                          src={currentPayment.qrCodeUrl}
                          alt="Current QR"
                          className="w-full h-full object-contain rounded"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">
                          No image selected
                        </span>
                      )}
                    </motion.div>
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <span className="text-sm text-gray-600 mb-2">UPI ID</span>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter UPI ID"
                      className="w-full md:w-72 px-4 py-2 rounded border border-slate-700 bg-slate-100 text-slate-900 font-mono text-lg focus:outline-1 focus:outline-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded bg-green-600 px-5 py-2 text-white hover:bg-green-700 transition disabled:opacity-60 cursor-pointer"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded bg-gray-400 px-5 py-2 text-white hover:bg-gray-500 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Settings;
