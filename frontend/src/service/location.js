import api from "./apiSetup";

const createLocation = async (data) => {
  try {
    const response = await api.post(`/location/createLocation`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error get user:", error);
  }
};
const getLocations = async () => {
  try {
    const response = await api.get(`/location/getAllLocations`);
    return response;
  } catch (error) {
    console.error("Error getr:", error);
  }
};
const deleteLocations = async (id) => {
  try {
    const response = await api.delete(`/location/deleteLocation/${id}`);
    return response;
  } catch (error) {
    console.error("Error getr:", error);
  }
};

const updateLocation = async (id, data) => {
  for (let pair of data.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }
  try {
    const response = await api.patch(`/location/updatelocation/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating location:", error);
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
const getLocationById = async (id) => {
  try {
    const response = await api.get(`/location/getLocationById/${id}`);
    return response;
  } catch (error) {
    console.error("Error getting location by ID:", error);
  }
};
const commentStore = async (idstore, data) => {
  try {
    const response = await api.post(`/location/createReview:/${idstore}`, data);
    return response;
  } catch (error) {
    console.error("Error cmt by ID:", error);
  }
};
const getCommentStore = async (idstore) => {
  try {
    const response = await api.get(
      `/location/getReviewByLocationId/${idstore}`
    );
    return response;
  } catch (error) {
    console.error("Error getting location by ID:", error);
  }
};

export {
  createLocation,
  uploadImageToCloudinary,
  updateLocation,
  getLocations,
  getLocationById,
  deleteLocations,
  commentStore,
  getCommentStore,
};
