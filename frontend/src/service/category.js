import api from "./apiSetup";

const createCategory = async (name, description) => {
  try {
    const response = await api.post(`/category/createCategory`, {
      name: name,
      description: description,
    });
    return response;
  } catch (error) {
    console.error("Error get user:", error);
  }
};
const getCategory = async () => {
  try {
    const response = await api.get(`/category/getAllCategory`);
    return response;
  } catch (error) {
    console.error("Error get user:", error);
  }
};

export { createCategory, getCategory };
