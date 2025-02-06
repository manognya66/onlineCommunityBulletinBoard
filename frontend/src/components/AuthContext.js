import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedValue = localStorage.getItem("isLoggedIn");
    console.log("Initial isLoggedIn value from localStorage:", storedValue); // Log initial value
    return storedValue === "true";
  });

  useEffect(() => {
    console.log("isLoggedIn updated:", isLoggedIn); // Log every update to isLoggedIn
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const login = () => {
    console.log("User logged in"); // Log login action
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log("User logged out"); // Log logout action
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
