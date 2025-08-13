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
  console.log(id, "id from api");
  try {
    const response = await api.put(`/transactions/${id}/reject` , {adminNote});
    console.log("✅ Transaction rejected", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const transactionApi = {
  getAllTransactions,
  approveTransaction,
  rejectTransaction,
};

export default transactionApi;
