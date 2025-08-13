import api from "../../utils/axios";

const getAllTransactions = async()=>{
    const response = await api.get("/transactions");
    console.log(response.data, "getAllTransactions response");
    return response.data;
}

const transactionApi = {
    getAllTransactions
}

export default transactionApi