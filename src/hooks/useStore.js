import { useContext } from "react";
import { AuthStore } from "../store/AuthContext";

export const useAuth = () => useContext(AuthStore);
