import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "../../img/location.png";

// Custom Marker component
const CustomIcon = ({ name, iconSrc }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
      }}
    >
      <img src={iconSrc} style={{ width: "32px", height: "32px" }} />
      <div
        style={{
          background: "transparent",
          position: "absolute",
          marginLeft: "35px", // Position the text to the right of the icon
          fontSize: "10px",
          transition: "opacity 0.3s ease-in-out",
        }}
        className="icon-name"
      >
        {name}
      </div>
    </div>
  );
};

export const Map = () => {
  const [myLocation, setMyLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

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

  const createCustomIcon = (name, icon) => {
    return L.divIcon({
      className: "custom-icon",
      html: `
        <div style="display: flex; flex-direction: row; align-items: center; position: relative;">
          <img src="${icon}" style="width: 100%; height: 100%;" />
          <Strong style="background: transparent; position: absolute; margin-left: 37px; font-size: 10px; transition: opacity 0.3s ease-in-out;">
            ${name}
          </Strong>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
    });
  };

  if (locationError) {
    return <div>{locationError}</div>;
  }

  if (!myLocation) {
    return <div>Loading your location...</div>;
  }

  return (
    <div className="w-screen h-screen  " >
      <MapContainer
        className="h-full w-full max-w-screen max-h-[100dvh]"
        center={myLocation}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={myLocation} icon={createCustomIcon(" Ô Nô", icon)}>
          <Popup>this, my point</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
