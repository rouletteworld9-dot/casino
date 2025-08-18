import api from "../../utils/axios";

const getAllTransactions = async (transactionStatus, transactionType) => {
  const response = await api.get("/transactions", {
    params: { transactionStatus, transactionType },
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

const rejectTransaction = async ({ id, adminNote }) => {
  try {
    const response = await api.put(`/transactions/${id}/reject`, { adminNote });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const depositRequest = async (formData) => {
  try {
    const response = await api.post("/transactions/deposit", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const withdrawlRequest = async (formData) => {
  try {
    const response = await api.post("/transactions/withdraw", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const transactionApi = {
  getAllTransactions,
  approveTransaction,
  rejectTransaction,
  withdrawlRequest,
  depositRequest,
};

export default transactionApi;
