import axios from "axios";
import api from "./apiSetup.js";

async function getAllUser() {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {});
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
}

async function getAllLocation() {
    try {
        const response = await api.get(`/location/getAllLocations`);
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
}

export { getAllUser, getAllLocation };