import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "../../img/location.png";
import Register from "../Register";

export const Map = () => {
  const [myLocation, setMyLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        setMyLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);
  const createCustomIcon = (name) => {
    return L.divIcon({
      className: "custom-icon",
      html: `
        <div style="text-align: center;">
          <img src="${icon}" style="width: 32px; height: 32px;" />
          <div className="border border-gray-200" style="background: white; border-radius: 4px;font-size: 10px; margin-top: 2px;">
            ${name}
          </div>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
    });
  };
  if (!myLocation) {
    return;
  }
  return (
    <div className=" w-screen h-screen">
      <MapContainer
        className="h-full w-full max-w-screen max-h-[100dvh] z-0"
        center={myLocation}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={myLocation} icon={createCustomIcon("")}>
          <Popup>this, my point</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
