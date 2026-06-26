import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth", // through the API Gateway
  withCredentials: true, // sends/receives the httpOnly JWT cookie
});

export const registerUser = async (name, email, password) => {
  const response = await api.post("/register", { name, email, password });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/me");
  return response.data;
};
