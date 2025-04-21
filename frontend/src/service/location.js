import api from "./apiSetup";

const createLocation = async (data) => {
  try {
    const response = await api.post(`/location/createLocation`, data);
    return response;
  } catch (error) {
    console.error("Error get user:", error);
  }
};
const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("files", file);

  const response = await api.post("/cloudinary/img", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export { createLocation, uploadImageToCloudinary };
