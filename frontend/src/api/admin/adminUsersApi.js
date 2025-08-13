import api from "../../utils/axios"

const getAllUsers = async()=>{
    const response = await api.get("/users")
    console.log(response.data , "response from api")
    return response.data
}


const adminUsersApi = {
  getAllUsers,
};
export default adminUsersApi