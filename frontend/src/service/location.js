import api from "./apiSetup";

const createLocation = async (data) => {
  try {
    const response = await api.post(`/location/createLocation`, data);
    return response;
  } catch (error) {
    console.error("Error get user:", error);
  }
};
export { createLocation };
