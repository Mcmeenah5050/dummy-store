import { createContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { getAuthenticatedUser } from "../api/api";
import { toast } from "sonner";

export const AuthStore = createContext({});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", null);
  const [user, setUser] = useState({
    isLoading: false,
    isError: null,
    data: null,
    isAuthenticated: false,
  });

  const checkAuth = async () => {
    setUser({ isError: null, isLoading: true });
    try {
      const res = await getAuthenticatedUser(accessToken);
      setUser({
        data: res.data,
        isAuthenticated: true,
      });
    } catch (error) {
      setUser({
        isError: error,
        isAuthenticated: false,
      });
    }
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser({
      isLoading: false,
      isError: null,
      data: null,
      isAuthenticated: false,
    });
    toast.success("Logged out");
  };

  const contextData = { accessToken, setAccessToken, checkAuth, user, logout };
  return (
    <AuthStore.Provider value={contextData}>{children}</AuthStore.Provider>
  );
};
