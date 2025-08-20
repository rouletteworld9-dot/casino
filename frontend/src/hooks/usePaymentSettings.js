import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import paymentSettingsApi from "../api/admin/paymentSettingsApi";
import toast from "react-hot-toast";

export const usePaymentSettings = () => {
  const queryClient = useQueryClient();
  const getPaymentSettings = useQuery({
    queryKey: ["paymentDetails"],
    queryFn: () => paymentSettingsApi.getPaymentSettings(),
  });

  const updatePaymentSettings = useMutation({
    mutationFn: paymentSettingsApi.updatePaymentSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(["paymentDetails"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!!");
    },
  });

  return {
    paymentSettings: getPaymentSettings.data,
    paymentSettingsLoading: getPaymentSettings.isLoading,
    isFetching: getPaymentSettings.isFetching,
    isError: getPaymentSettings.isError,
    error: getPaymentSettings.error,
    refetch: getPaymentSettings.refetch,

    updateSettings: updatePaymentSettings.mutate,
    updateSettingsLoading: updatePaymentSettings.isPending,
  };
};
