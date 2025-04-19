import React, { createContext, useState } from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const openLogin = (form) => {
    setForm(form || "login");
  };
  return (
    <AuthContext.Provider value={{ user, openLogin, form, setForm }}>
      {children}
    </AuthContext.Provider>
  );
};
