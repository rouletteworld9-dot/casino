import { useMutation } from "@tanstack/react-query";
import resultApi from "../api/admin/resultApi";
import toast from "react-hot-toast";

export const useResultAdjuster = (number) => {
  const adjustResults = useMutation({
    mutationFn: () => resultApi.resultAdjuster(number),
    onSuccess: (data) => {
      toast.success(data?.message || "Next Result Decided.");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
  return {
    resultAdjustFn: adjustResults.mutate
  };
};
