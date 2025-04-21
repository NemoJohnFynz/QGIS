import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "../../img/location.png";
import { useLocation } from "../../context/LocationContext";
import createCustomIcon from "./CreateCustomIcon";
import LocationSetter from "./LocationSetter";
import LocationModal from "../menu/LocationModal"; // import modal
import { useMenu } from "../../context/MenuContext";

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

  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="w-full h-screen">
      <MapContainer
        className="h-full w-full max-w-screen max-h-[100dvh]"
        center={myLocation}
        zoom={13}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={myLocation} icon={myLocationIcon}>
          <Popup>This is my point</Popup>
        </Marker>

        {/* Marker người dùng chọn */}
        {chaneLocation && (
          <Marker
            position={chaneLocation}
            icon={selectedLocationIcon}
            ref={selectedMarkerRef}
            eventHandlers={{
              click: () => (
                toggleModel("location"), setLocationSelect(chaneLocation)
              ),
            }}
          >
            <Popup>Bạn đã chọn vị trí này</Popup>
          </Marker>
        )}

        <LocationSetter />
      </MapContainer>
    </div>
  );
};
