import api from "../../utils/axios";

const getAllUsers = async () => {
  const response = await api.get("/users");
  console.log(response.data, "response from api");
  return response.data;
};

const getSingleUser = async (id) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

const adminUsersApi = {
  getAllUsers,
  getSingleUser,
};
export default adminUsersApi;
