import api from "../../utils/axios";

const getAllTransactions = async (transactionStatus) => {
  const response = await api.get("/transactions", {
    params: { transactionStatus },
  });
  return response.data;
};

const approveTransaction = async (id) => {
  try {
    const response = await api.put(`/transactions/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const rejectTransaction = async ({id  , adminNote}) => {
  try {
    const response = await api.put(`/transactions/${id}/reject` , {adminNote});
    return response.data;
  } catch (error) {
    throw error;
  }
};

const depositRequest = async(formData)=>{
  try {
    const response = await api.post("/transactions/deposit" , formData);
    console.log(response.data , "response from api")
    return response.data 
  } catch (error) {
    
  }
}
const transactionApi = {
  getAllTransactions,
  approveTransaction,
  rejectTransaction,
  depositRequest,
};

export default transactionApi;
