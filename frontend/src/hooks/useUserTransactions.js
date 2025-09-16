import toast from "react-hot-toast";
import transactionApi from "../api/admin/transactionApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUserTransactions = (transactionStatus, transactionType) => {
  const fetchUserTransactions = useQuery({
    queryKey: ["transactions", transactionStatus, transactionType],
    queryFn: () =>
      transactionApi.getUserTransactions(transactionStatus, transactionType),
  });

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
      toast.success("Your withdrawal request has been sent to us!")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!");
    },
  });
  return {
    depositRequestFn: depositRequestMutation.mutateAsync,
    depositRequestLoading: depositRequestMutation.isPending,
    withdrawlRequestFn: withdrawlRequestMutation.mutate,
    withdrawlRequestLoading: withdrawlRequestMutation.isPending,
    userTransactions: fetchUserTransactions.data,
    userTransactionLoading: fetchUserTransactions.isLoading,
  };
};
