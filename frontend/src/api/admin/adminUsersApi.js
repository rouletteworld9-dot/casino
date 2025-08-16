import api from "../../utils/axios"

const getAllUsers = async()=>{
    const response = await api.get("/users")
    console.log(response.data , "response from api")
    return response.data
}


const deleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`)
    console.log(response.data, "response from api")
    return response.data
}

const adminUsersApi = {
  getAllUsers,
  deleteUser,
};
export default adminUsersApi