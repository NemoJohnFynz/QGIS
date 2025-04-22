import api from "./apiSetup";
const sendMess = async (id, data) => {
  try {
    const formData = new FormData(); 
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    } 
    const response = await api.post(`/chat/sendmessageToUser/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }); 
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const getMess = async (id) => {
  try {
    const response = await api.get(`/chat/getmessagestouser/${id}`);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};
const deleteMess = async (messageId) => {
  try {
    const response = await api.put(`/chat/revokedMesage/${messageId}`);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};
export { getMess, sendMess, deleteMess };
