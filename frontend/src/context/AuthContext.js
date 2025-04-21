import React, { createContext, useContext, useEffect, useState } from "react";
import { current } from "../service/auth";
import authToken from "../storage/authToken";
/**
 * @typedef {Object} AuthContextType
 * @property {string|null} form
 * @property {(formName: string) => void} openLogin
 * @property {(value: string|null) => void} setForm
 * @property {Object|null} userData
 * @property {(value: Object|null) => void} setUserData
 * @property {boolean} isProfile
 */

/** @type {React.Context<AuthContextType>} */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [form, setForm] = useState(null);
  const [isProfile, setIsProfile] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const rs = await current(); // chờ API trả kết quả
        if (rs.status === 200) {
          setUserData(rs.data);
        }
        setIsProfile(true);
      } catch (err) {
        setIsProfile(true);
        console.error("Error fetching current user:", err);
      }
    };
    fetchCurrent();
  }, [authToken.getToken()]);
  const openLogin = (formName = "login") => {
    setForm(formName);
  };

  return (
    <AuthContext.Provider
      value={{ form, setForm, openLogin, userData, setUserData, isProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
