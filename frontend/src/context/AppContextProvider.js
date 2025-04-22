import { AuthProvider } from "./AuthContext";
import { LocationProvider } from "./LocationContext";
import { ComponentProvider } from "./ComponentContext";
import { MenuProvider } from "./MenuContext";
import { SocketProvider } from "./SocketContext";
// Gói tất cả các provider con
export const AppContextProvider = ({ children }) => {
  return (
    <SocketProvider>
      <ComponentProvider>
        <AuthProvider>
          <LocationProvider>
            <MenuProvider>{children}</MenuProvider>
          </LocationProvider>
        </AuthProvider>
      </ComponentProvider>
    </SocketProvider>
  );
};
