import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const newToken = localStorage.getItem("token");

  // useEffect(() => {
  //   getProfile();
  // }, []);

  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
