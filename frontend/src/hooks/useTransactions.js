import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import transactionApi from "../api/admin/transactionApi";
import toast from "react-hot-toast";

export const useTransactions = (transactionStatus , transactionType) => {
  const queryClient = useQueryClient();

  const fetchAllTransactions = useQuery({
    queryKey: ["transactions", transactionStatus, transactionType],
    queryFn: () =>
      transactionApi.getAllTransactions(transactionStatus, transactionType),
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

  return {
    allTransactions: fetchAllTransactions.data,
    allTransactionsLoading: fetchAllTransactions.isLoading,
    approveTransactionFn: approveTransactionRequest.mutate,
    approvetransactionLoading: approveTransactionRequest.isPending,
    rejectTransactionFn: rejectTransactionRequest.mutate,
    rejecttransactionLoading: rejectTransactionRequest.isPending,
   
  };
};
