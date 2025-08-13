import { useQuery } from "@tanstack/react-query"
import transactionApi from "../api/admin/transactionApi"

export const useTransactions = ()=>{
    const fetchAllTransactions = useQuery({
        queryKey: ["transactions"],
        queryFn: () => transactionApi.getAllTransactions(),
    })

    return {
        allTransactions: fetchAllTransactions.data
    }
}