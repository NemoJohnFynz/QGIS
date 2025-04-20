import React, { createContext, useContext, useState, useEffect } from "react";
const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [myLocation, setMyLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [chaneLocation, setChaneLocation] = useState(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
         
          setMyLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          setLocationError("Unable to retrieve location.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);
  
  return (
    <LocationContext.Provider
      value={{
        myLocation,
        setMyLocation,
        locationError,
        chaneLocation,
        setChaneLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
