import React, { createContext, useContext, useState, useEffect } from "react";
import { getLocations } from "../service/location";
const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [myLocation, setMyLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationSelect, setLocationSelect] = useState(null);
  const [chaneLocation, setChaneLocation] = useState(null);
  const [routeTarget, setRouteTarget] = useState(null);
  const [stores, setStores] = useState([]);
  const [map, setMap] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getLocations();
      setStores(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
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
        locationSelect,
        setLocationSelect,
        routeTarget,
        setRouteTarget,
        stores,
        setStores,
        fetchData,
        map,
        setMap,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
