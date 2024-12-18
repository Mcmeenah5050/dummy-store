import { createContext, useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { getAllProducts, getAuthenticatedUser, logoutUser } from "../api/api";
import { toast } from "sonner";
import useFetch from "../hooks/useFetch";

export const AuthStore = createContext({});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", null);
  const [cartItems, setCartItems] = useLocalStorage("cart", []);
  const [user, setUser] = useState({
    isError: null,
    data: null,
    isAuthenticated: false,
  });

  const { error, data, loading, setData } = useFetch(getAllProducts);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    const checkAuth = async () => {
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
        setAccessToken(null)
      }
    };
    checkAuth();
  }, [accessToken, data, setAccessToken]);

  const logout = async () => {
    localStorage.removeItem("accessToken");
    await logoutUser();
    setUser({
      isError: null,
      data: null,
      isAuthenticated: false,
    });
    toast.success("Logged out");
    window.location.replace("/");
  };
  console.log(user);

  const addToCart = (product) => {
    setCartItems((currItems) => {
      if (currItems.find((item) => item._id === product._id) == null) {
        return [...currItems, { ...product, qty: 1 }];
      } else {
        return currItems.map((item) => {
          if (item._id === product._id) {
            return { ...item, qty: item.qty + 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const decreaseCartQty = (product) => {
    setCartItems((currItems) => {
      if (cartItems.find((item) => item._id === product._id)?.qty === 1) {
        return currItems.filter((item) => item._id !== product._id);
      } else {
        return currItems.map((item) => {
          if (item._id === product._id) {
            return { ...item, qty: item.qty - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const priceTotal = cartItems.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  const removeFromCart = (id) => {
    setCartItems((currItems) => {
      return currItems.filter((item) => item._id !== id);
    });
  };

  const cartQuantity = cartItems?.reduce((qty, item) => item.qty + qty, 0);

  const contextData = {
    accessToken,
    setAccessToken,
    user,
    logout,
    setUser,
    error,
    data,
    loading,
    setData,
    addToCart,
    cartQuantity,
    cartItems,
    decreaseCartQty,
    priceTotal,
    removeFromCart,
    setCartItems,
  };
  return (
    <AuthStore.Provider value={contextData}>{children}</AuthStore.Provider>
  );
};
