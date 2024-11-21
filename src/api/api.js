import axiosInstance from "../utils/http";

export const getProductCategories = async () => {
  return await axiosInstance.get("/products/category-list");
};

export const getAllProducts = async () => {
  return await axiosInstance.get("/products");
};

export const getAllProductsByCategory = async (categoryName) => {
  return await axiosInstance.get(`/products/category/${categoryName}`);
};

export const getASingleProduct = async (productId) => {
  return await axiosInstance.get(`/products/${productId}`);
};

export const searchProducts = async (searchQuery) => {
  return await axiosInstance.get(`/products/search?q=${searchQuery}`);
};

export const login = async (formData) => {
  return await axiosInstance.post("/auth/login", formData);
};

export const getAuthenticatedUser = async (token) => {
  return await axiosInstance.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
