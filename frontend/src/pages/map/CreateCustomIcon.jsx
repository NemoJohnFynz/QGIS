import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "../../img/location.png"; // Đảm bảo ảnh này là ảnh marker như .png

const createCustomIcon = (name) => {
  return L.divIcon({
    className: "leaflet-google-marker", // dùng cho hiệu ứng CSS
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <img src="${icon}" style="width: 30px; height: 40px; object-fit: contain; animation: drop-slime 0.5s ease-out;" />
        <h1 style="margin-top: 4px; font-size: 10px; text-transform: uppercase;  background: transparent;  border-radius: 4px;">
        <strong> ${name}</strong>
        </h1>
      </div>
    `,
    iconSize: [40, 60],
    iconAnchor: [20, 50], // đáy của hình ảnh
    popupAnchor: [0, -50],
  });
};

export default createCustomIcon;
