import api from "../utils/axios";

const login = async(credentials)=>{
    try {
        const response = await api.post("/auth/login" , credentials)
        console.log(response.data , "response from api")
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
        
    }
}

const register = async(userData)=>{
    try {
        const response = await api.post("Url" , userData)
        return response.data;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
}

export const authApi = {
    login,  register}