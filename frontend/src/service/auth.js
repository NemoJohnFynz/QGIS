import axios from "axios";
import api from "./apiSetup.js";

async function register(formData) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/register`,
      formData,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

async function login(formData) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/login`,
      formData,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}
const current = async () => {
  try {
    const response = await api.get("/auth/current");
    return response;
  } catch (error) {
    console.error("Error get user:", error);
  }
};

async function update(formData) {
  try {
    const response = await api.put(`/auth/update`, formData); // Pass formData as the second argument
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}
export { register, login, current, update };
