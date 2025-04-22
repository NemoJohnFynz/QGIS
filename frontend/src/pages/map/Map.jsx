import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import icon from "../../img/location.png";
import { useLocation } from "../../context/LocationContext";
import createCustomIcon from "./CreateCustomIcon";
import LocationSetter from "./LocationSetter";
import { useMenu } from "../../context/MenuContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import RoutingMachine from "./RoutingMachine";

export const Map = () => {
  const { toggleModel } = useMenu();
  const {
    myLocation,
    setMyLocation,
    locationError,
    chaneLocation,
    setLocationSelect,
    locationSelect,
  } = useLocation();
  const [routeTarget, setRouteTarget] = useState(null);
  const selectedMarkerRef = useRef(null);

  const myLocationIcon = useMemo(() => createCustomIcon("Ô NÔ"), []);
  const selectedLocationIcon = useMemo(
    () => createCustomIcon("Đã chọn"),
    [chaneLocation]
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
          className="h-full w-full max-w-screen max-h-[100dvh]"
          center={myLocation}
          zoom={13}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={myLocation} icon={myLocationIcon}>
            <Popup>Đây là vị trí của bạn</Popup>
          </Marker>

          {/* Marker người dùng chọn */}
          {chaneLocation && (
            <Marker position={chaneLocation} icon={createCustomIcon("")}>
              <Popup>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold">Vị trí đã chọn</div>
                  <div className="flex flex-col space-y-2">
                    <button
                      className="text-blue-600 hover:underline text-left"
                      onClick={() => {
                        setRouteTarget(chaneLocation);
                      }}
                    >
                      📍 Chỉ đường đến đây
                    </button>
                    <button
                      className="text-green-600 hover:underline text-left"
                      onClick={() => {
                        toggleModel("createlocation");
                      }}
                    >
                      🏪 Tạo cửa hàng tại đây
                    </button>
                    <button
                      className="text-gray-600 hover:underline text-left"
                      onClick={() => {
                        console.log("Xem thông tin khu vực:", chaneLocation);
                      }}
                    >
                      🔍 Xem thông tin khu vực
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
          <LocationSetter />
          {routeTarget && (
            <RoutingMachine start={myLocation} end={routeTarget} />
          )}
        </MapContainer>
      </div>
    </>
  );
};
