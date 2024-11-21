import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useStore";

export const PrivateRoutes = ({ children }) => {
  const { user } = useAuth();
  if (!user.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export const PublicRoutes = ({ children }) => {
  const { user } = useAuth();
  if (user.isAuthenticated) {
    return <Navigate to="/"/>;
  }
  return children;
};
