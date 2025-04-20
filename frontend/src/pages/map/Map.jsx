import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "../../img/location.png";
import { useLocation } from "../../context/LocationContext";
import createCustomIcon from "./CreateCustomIcon";
import LocationSetter from "./LocationSetter";

export const Map = () => {
  const { myLocation, setMyLocation, locationError, chaneLocation } =
    useLocation();

  const myLocationIcon = useMemo(() => createCustomIcon("Ô NÔ"), []);
  const selectedLocationIcon = useMemo(
    () => createCustomIcon("Đã chọn"),
    [chaneLocation]
  );

  useEffect(() => {
    console.log(chaneLocation);
  }, [chaneLocation]);
  if (locationError) {
    return <div>{locationError}</div>;
  }
  if (!myLocation) {
    return <div>Loading your location...</div>;
  }
  return (
    <div className="w-full h-screen  ">
      <MapContainer
        className="h-full w-full max-w-screen max-h-[100dvh]"
        center={myLocation}
        zoom={13}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={myLocation} icon={myLocationIcon}>
          <Popup>this, my point</Popup>
        </Marker>
        {/* Marker khi người dùng chọn */}
        {chaneLocation && (
          <Marker position={chaneLocation} icon={selectedLocationIcon}>
            <Popup>Bạn đã chọn vị trí này</Popup>
          </Marker>
        )}
        <LocationSetter />
      </MapContainer>
    </div>
  );
};
