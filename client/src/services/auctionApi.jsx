import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auctions", // through the API Gateway
  withCredentials: true, // sends/receives the httpOnly JWT cookie
});

export const getAllAuctions = async () => {
  const response = await api.get("/");
  return response.data;
};

export const getAuctionById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createAuction = async (formData) => {
  const response = await api.post("/", formData);
  return response.data;
};

export const updateAuction = async (id, title, description) => {
  const response = await api.put(`/${id}`, { title, description });
  return response.data;
};

export const cancelAuction = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export const placeBid = async (auctionId, amount) => {
  const response = await api.post(`/${auctionId}/bids`, { amount });
  return response.data;
};

export const getBidsForAuction = async (auctionId) => {
  const response = await api.get(`/${auctionId}/bids`);
  return response.data;
};

export const getMyAuctions = async () => {
  const response = await api.get("/mine");
  return response.data;
};
