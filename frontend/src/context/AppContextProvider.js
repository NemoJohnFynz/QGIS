import { AuthProvider } from "./AuthContext";

// Gói tất cả các provider con
export const AppContextProvider = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
