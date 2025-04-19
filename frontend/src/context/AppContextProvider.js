import { AuthContext } from "./AuthContext";

// Gói tất cả các provider con
export const AppContextProvider = ({ children }) => {
  return <AuthContext>{children}</AuthContext>;
};
