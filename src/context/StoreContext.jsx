import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addOrUpdateUser, getUsers } from "../utils/userStore";
import { getOrders, addOrder as storeAddOrder, updateOrder as storeUpdateOrder } from "../utils/orderStore";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [storedAccount, setStoredAccount] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem("itechTheme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  useEffect(() => {
    const saved = localStorage.getItem("itechUserAccount");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStoredAccount(parsed);
        setProfileData(parsed);
      } catch (error) {
        localStorage.removeItem("itechUserAccount");
      }
    }
    setOrders(getOrders());
    const wishlistSaved = localStorage.getItem("itechWishlist");
    if (wishlistSaved) {
      try {
        setWishlist(JSON.parse(wishlistSaved));
      } catch (e) {
        setWishlist([]);
      }
    }
    const cartSaved = localStorage.getItem("itechCart");
    if (cartSaved) {
      try {
        setCartItems(JSON.parse(cartSaved));
      } catch (e) {
        setCartItems([]);
      }
    }

    const onOrdersUpdated = () => setOrders(getOrders());
    window.addEventListener("orders-updated", onOrdersUpdated);
    return () => window.removeEventListener("orders-updated", onOrdersUpdated);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("itechTheme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("itechCart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("itechWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("itechOrders", JSON.stringify(orders));
  }, [orders]);

  const login = (profile) => {
    const id = profile.id || `user-${Date.now()}`;
    const role = profile.role || "buyer";
    const account = { ...profile, id, role };
    setStoredAccount(account);
    setProfileData(account);
    localStorage.setItem("itechUserAccount", JSON.stringify(account));
    addOrUpdateUser(account);
  };

  const logout = () => {
    setStoredAccount(null);
    setProfileData(null);
    localStorage.removeItem("itechUserAccount");
  };

  const updateProfile = (updates) => {
    setProfileData((current) => {
      const next = { ...current, ...updates };
      if (storedAccount) {
        const updatedAccount = { ...storedAccount, ...updates };
        localStorage.setItem("itechUserAccount", JSON.stringify(updatedAccount));
        setStoredAccount(updatedAccount);
      }
      return next;
    });
  };

  const addToCart = (product) => {
    setCartItems((current) => {
      const exists = current.find((item) => item.id === product.id);
      if (exists) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((current) => current.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) {
        return current.filter((item) => item.id !== product.id);
      }
      return [...current, product];
    });
  };

  const placeOrder = (order) => {
    const created = storeAddOrder(order);
    setOrders((current) => [created, ...current]);
    return created;
  };

  const updateOrder = (orderId, updates) => {
    const updated = storeUpdateOrder(orderId, updates);
    if (!updated) return null;
    setOrders((current) => current.map((order) => (order.id === orderId ? updated : order)));
    return updated;
  };

  const contextValue = useMemo(() => ({
    storedAccount,
    profileData,
    cartItems,
    wishlist,
    orders,
    theme,
    login,
    logout,
    updateProfile,
    addToCart,
    removeFromCart,
    toggleWishlist,
    placeOrder,
    setTheme,
    users: getUsers()
  }), [storedAccount, profileData, cartItems, wishlist, orders, theme]);

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
