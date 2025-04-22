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
const addFriend = async (id) => {
  if (!id) return;
  try {
    const response = await api.post(`/auth/friendrequest/${id}`);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};
const unFriend = async (id) => {
  if (!id) return;
  try {
    const response = await api.delete(`/auth/unfriend/${id}`);
    return response;
  } catch (error) {
    console.error("Error get user:", error);
  }
};

const getMyFriend = async () => {
  try {
    const response = await api.get(`/auth/getMyFriend`);
    return response;
  } catch (error) {
    console.error("Error get user:", error);
  }
};
const getMyFriendRequest = async () => {
  try {
    const response = await api.get(`/auth/getMyFriendRequest`);
    return response;
  } catch (error) {
    console.error("Error get user:", error);
  }
};
const acceptFriend = async (idRequest) => {
  if (!idRequest) return;
  try {
    const response = await api.post(`/auth/acceptfriend/${idRequest}`);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};

const rejectFriend = async (idRequest) => {
  if (!idRequest) return;
  try {
    const response = await api.post(`/auth/rejectFriendRequest/${idRequest}`);
    return response;
  } catch (error) {
    console.error("Error get user:", error);
  }
};
export {
  getUserByName,
  rejectFriend,
  addFriend,
  acceptFriend,
  unFriend,
  getMyFriend,
  getMyFriendRequest,
};
