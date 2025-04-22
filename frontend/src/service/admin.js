import api from "./apiSetup.js";
async function getAllUser() {
    try {
        const response = await api.get(`/auth/alluseradmin`);
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

async function deleteLocation(id) {
    try {
        const response = await api.delete(`/location/deleteLocation/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
}

async function getAllCategory() {
    try {
        const response = await api.get(`/category/getAllCategory`);
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
}

async function deleteCategory(id) {
    try {
        const response = await api.delete(`/category/deleteCategory/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
}

async function createCategory(data) {
    try {
        const response = await api.post(`/category/createCategory`, data);
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
}

export { getAllUser, getAllLocation, deleteLocation, getAllCategory, deleteCategory, createCategory };