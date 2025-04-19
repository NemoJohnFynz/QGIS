import React, { createContext, useContext, useState } from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [form, setForm] = useState("login");
  const openLogin = (form) => {
    setForm(form || "login");
  };
  return (
    <AuthContext.Provider value={{ openLogin, form, setForm }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
