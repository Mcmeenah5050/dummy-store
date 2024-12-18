import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useStore";

export const PrivateRoutes = ({ children }) => {
  const { accessToken} = useAuth();
  if (!accessToken) {
    return <Navigate to="/login" />;
  }
  return children;
};

export const PublicRoutes = ({ children }) => {
  const { accessToken}  = useAuth();
  if (accessToken) {
    return <Navigate to="/"/>;
  }
  return children;
};
