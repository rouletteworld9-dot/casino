import api from "../../utils/axios"

const resultAdjuster = async(number)=>{
    console.log(number)
    const response = await api.post("/admin/force-result" , {number})
    return response.data
}

const resultApi = {
  resultAdjuster,
};

export default resultApi