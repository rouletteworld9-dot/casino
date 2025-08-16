import toast from "react-hot-toast";
import transactionApi from "../api/admin/transactionApi";
import { useMutation } from "@tanstack/react-query";

export const useUserTransactions = () => {
  const depositRequestMutation = useMutation({
    mutationFn: transactionApi.depositRequest,
    onSuccess: () => {
      toast.success("Deposit Request Sent!");
    },
    onError: (error) => {
      toast.error(error?.respons?.data?.message || "Something Went Wrong!");
    },
  });

  const withdrawlRequestMutation = useMutation({
    mutationFn: transactionApi.withdrawlRequest,
    onSuccess: () => {
      toast.success("Withdrawl Request Sent!");
    },
    onError: (error) => {
      toast.error(error?.respons?.data?.message || "Something Went Wrong!");
    },
  });
  return {
    depositRequestFn: depositRequestMutation.mutateAsync,
    depositRequestLoading: depositRequestMutation.isPending,
    withdrawlRequestFn: withdrawlRequestMutation.mutate,
    withdrawlRequestLoading: withdrawlRequestMutation.isPending,
  };
};
