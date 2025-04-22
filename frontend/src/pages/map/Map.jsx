import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useLocation } from "../../context/LocationContext";
import createCustomIcon from "./CreateCustomIcon";
import LocationSetter from "./LocationSetter";
import { useMenu } from "../../context/MenuContext";
import { Directions, Storefront, Search } from "@mui/icons-material";
import RoutingMachine from "./RoutingMachine";
import StoreMap from "./StoreMap";
import { useAuth } from "../../context/AuthContext";

export const Map = () => {
  const { toggleModel } = useMenu();
  const {
    myLocation,
    locationError,
    chaneLocation,
    routeTarget,
    setRouteTarget,
    map,
    setMap,
  } = useLocation();
  const { userData } = useAuth();

  const selectedMarkerRef = useRef(null);
  const mapRef = useRef(null); // Thêm ref cho MapContainer

  const myLocationIcon = useMemo(() => createCustomIcon("Ô NÔ"), []);
  const selectedLocationIcon = useMemo(
    () => createCustomIcon("Đã chọn"),
    [chaneLocation]
  );

  // Sử dụng useCallback để tạo hàm ổn định cho whenCreated
  const handleMapCreated = useCallback(
    (mapInstance) => {
      setMap(mapInstance);
      mapRef.current = mapInstance; // Lưu trữ instance vào ref nếu cần
    },
    [setMap]
  );

  useEffect(() => {
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.on("mouseover", function () {
        selectedMarkerRef.current.openPopup();
      });
      selectedMarkerRef.current.on("mouseout", function () {
        selectedMarkerRef.current.closePopup();
      });
    }
  }, [chaneLocation]);
  // Trong component Map
  useEffect(() => {
    if (mapRef.current) {
      setMap(mapRef.current); 
    }
  }, [mapRef.current, setMap]);

  if (locationError) {
    return <div>{locationError}</div>;
  }

  if (!myLocation) {
    return <div>Loading your location...</div>;
  }

  return (
    <>
      <div className="w-full h-screen">
        <MapContainer
          ref={mapRef}
          className="h-full w-full max-w-screen max-h-[100dvh]"
          center={myLocation}
          zoom={13}
          // Sử dụng whenCreated với hàm handleMapCreated
          whenCreated={handleMapCreated}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={myLocation} icon={myLocationIcon}>
            <Popup>Đây là vị trí của bạn</Popup>
          </Marker>

          {/* Marker người dùng chọn */}
          {chaneLocation && (
            <Marker position={chaneLocation} icon={selectedLocationIcon}>
              <Popup className="popup-container">
                <div className="space-y-3 text-sm">
                  <div className="font-semibold text-lg text-gray-800">
                    Vị trí đã chọn
                  </div>
                  <div className="flex flex-col space-y-3">
                    {/* Directions Button */}
                    <button
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-left font-medium py-1 px-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
                      onClick={() => {
                        setRouteTarget(chaneLocation);
                      }}
                    >
                      <Directions /> {/* MUI Icon for directions */}
                      <span>Chỉ đường đến đây</span>
                    </button>

                    {/* Create Store Button (Only for Users with Role) */}
                    {userData && userData.role && (
                      <button
                        className="flex items-center space-x-2 text-green-600 hover:text-green-800 text-left font-medium py-1 px-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
                        onClick={() => {
                          toggleModel("createlocation");
                        }}
                      >
                        <Storefront /> {/* MUI Icon for store */}
                        <span>Tạo cửa hàng tại đây</span>
                      </button>
                    )}

                    {/* Area Information Button */}
                    <button
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-left font-medium py-1 px-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
                      onClick={() => {
                        console.log("Xem thông tin khu vực:", chaneLocation);
                      }}
                    >
                      <Search /> {/* MUI Icon for search */}
                      <span>Xem thông tin khu vực</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
          <StoreMap />
          <LocationSetter />
          {routeTarget && (
            <RoutingMachine start={myLocation} end={routeTarget} />
          )}
        </MapContainer>
      </div>
    </>
  );
};
