import { AuthProvider } from "./AuthContext";
import { LocationProvider } from "./LocationContext";

// Gói tất cả các provider con
export const AppContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <LocationProvider>{children}</LocationProvider>
    </AuthProvider>
  );
};
