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
      // toast.success("Withdrawl Request Sent!");
      toast.success("Your withdrawal request has been sent to us!", {
        duration: 7000, // 7 seconds
        position: "bottom-right",
        style: {
          background:
            "linear-gradient(to bottom, rgba(88, 28, 135, 0.9), rgba(0, 0, 0, 0.8))",
          color: "white",
          border: "1px solid rgba(236, 72, 153, 0.3)",
          boxShadow: "0 0 20px rgba(236, 72, 153, 0.6)",
          fontSize: "0.875rem",
          fontWeight: "600",
        },
        iconTheme: {
          primary: "green", // Pink icon to match theme
          secondary: "#ffffff",
        },
      });
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
