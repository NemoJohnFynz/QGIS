import api from "./apiSetup";

const getUserByName = async (name) => {
  if (!name) return;
  try {
    const response = await api.get(`/auth/getUserByName/${name}`);
    return response;
  } catch (error) {
    console.error("Error get user:", error);
  }
};
export { getUserByName };
