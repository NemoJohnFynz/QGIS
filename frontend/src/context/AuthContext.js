import React, { createContext, useContext, useState } from "react";
import AuthLayout from "../pages/auth/AuthLayout";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [form, setForm] = useState(null);
  const [user, setUser] = useState(null);

  const openLogin = (formName = "login") => {
    setForm(formName);
  };

  return (
    <AuthContext.Provider value={{ form, setForm, openLogin,user, setUser }}>
      {children}
      <AuthLayout />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
