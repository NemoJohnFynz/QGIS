import React, { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { getLocations } from "../../service/location";
import L from "leaflet";
import { ClickAwayListener } from "@mui/material";
import { useMenu } from "../../context/MenuContext";
import { useLocation } from "../../context/LocationContext";
import imgPoint from '../../img/icons8-location(1).gif'
const StoreMap = () => {
  const { toggleModel, setIdStore } = useMenu();
  const { stores, setStores, fetchData } = useLocation();
  const [fetchStore, setFetchStore] = useState(null);
  useEffect(() => {
    setFetchStore(stores);
  }, [stores]);
  // Tạo custom icon với mũi nhọn dưới ảnh
  const createCustomIcon = (imageUrl) => {
    return new L.DivIcon({
      className: "custom-icon",
      html: `
        <div style="position: relative; display: inline-block; width: 50px; height: 50px; background-image: url(${imageUrl}); background-size: cover; border-radius: 12px; border: 2px solid #fff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
          <div style="position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 12px solid #3498db;"></div>
        </div>
      `,
      iconSize: [50, 70], // Kích thước của icon + mũi nhọn
      iconAnchor: [25, 60], // Điều chỉnh cho vị trí chính xác
      popupAnchor: [0, -60], // Điều chỉnh cho popup
    });
  };
  if (!fetchStore) {
    return;
  }
  return fetchStore.map((store) => {
    const storeIcon = createCustomIcon(
      store?.images?.[0] || imgPoint
    );
    

    return (
      <Marker
        key={store._id}
        position={[
          store.location.coordinates[1],
          store.location.coordinates[0],
        ]}
        icon={storeIcon} // Sử dụng icon tùy chỉnh với mũi nhọn
        eventHandlers={{
          mousedown: (e) => {
            toggleModel("location");
            setIdStore(store._id);
            console.log("click");
          },
          mouseover: (e) => {
            e.target.openPopup(); // Mở popup khi hover
          },
          mouseout: (e) => {
            e.target.closePopup(); // Đóng popup khi không hover
          },
        }}
      >
        <Popup>
          <div className="flex flex-col sm:flex-row items-center p-4 max-w-xs">
            <div className="flex flex-col sm:w-2/3 space-y-2">
              <h3 className="text-xl font-semibold">{store.name}</h3>
              <p>
                <strong>Địa chỉ:</strong> {store.address}
              </p>
              <p>
                <strong>Website:</strong>
                <a
                  href={`http://${store.contact.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {store.contact.website}
                </a>
              </p>
              <div>
                <strong>Giờ mở cửa:</strong>
                <ul>
                  {store.openingHours.map((hour, index) => (
                    <li className="text-nowrap text-ellipsis" key={index}>
                      {hour.day}:{" "}
                      {hour.isClosed
                        ? "Đóng cửa"
                        : `${hour.open}h - ${hour.close}h`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="sm:w-1/3 sm:ml-4 mt-4 sm:mt-0">
              <div className="flex flex-wrap flex-col gap-2">
                {store.images.slice(0, 2).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${store.name} ${index + 1}`}
                    className="w-1/3 min-w-24 h-auto rounded-lg shadow-lg"
                  />
                ))}
                {store.images.length > 2 && (
                  <div className="w-1/3 h-auto min-w-24 flex items-center justify-center rounded-lg bg-gray-300 shadow-lg">
                    <span className="text-xl text-white">
                      +{store.images.length - 2}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  });
};

export default StoreMap;
