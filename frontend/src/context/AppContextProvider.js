import { AuthProvider } from "./AuthContext";
import { LocationProvider } from "./LocationContext";
import { ComponentProvider } from "./ComponentContext";
// Gói tất cả các provider con
export const AppContextProvider = ({ children }) => {
  return (
    <ComponentProvider>
      <AuthProvider>
        <LocationProvider>{children}</LocationProvider>
      </AuthProvider>
    </ComponentProvider>
  );
};
