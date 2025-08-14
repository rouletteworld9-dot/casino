import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import transactionApi from "../api/admin/transactionApi";

export const useTransactions = (transactionStatus) => {
  const queryClient = useQueryClient();

  const fetchAllTransactions = useQuery({
    queryKey: ["transactions", transactionStatus],
    queryFn: () => transactionApi.getAllTransactions(transactionStatus),
  });
  const approveTransactionRequest = useMutation({
    mutationFn: transactionApi.approveTransaction,
    onSuccess: () => {
      toast.success("Trasaction Appproved Successfully!");
      queryClient.invalidateQueries(["transactions"]);
    },
    onError: (error) => {
      toast.error(error.message || "Something Went Wrong!!");
    },
  });

  const rejectTransactionRequest = useMutation({
    mutationFn: transactionApi.rejectTransaction,
    onSuccess: () => {
      toast.success("Trasaction Rejected Successfully!");
      queryClient.invalidateQueries(["transactions"]);
    },
    onError: (error) => {
      toast.error(error.message || "Something Went Wrong!!");
    },
  });
  const depositRequestMutation = useMutation({
    mutationFn: transactionApi.depositRequest,
    onSuccess: () => {
      toast.success("Deposit Request Sent!");
    },
  });

  return {
    allTransactions: fetchAllTransactions.data,
    allTransactionsLoading: fetchAllTransactions.isLoading,
    approveTransactionFn: approveTransactionRequest.mutate,
    approvetransactionLoading: approveTransactionRequest.isPending,
    rejectTransactionFn: rejectTransactionRequest.mutate,
    rejecttransactionLoading: rejectTransactionRequest.isPending,
    depositRequestFn: depositRequestMutation.mutate,
    depositRequestLoading: depositRequestMutation.isPending,
  };
};
