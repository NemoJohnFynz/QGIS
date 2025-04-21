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
  const [openAdd, setOpenAdd] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [openingHours, setOpeningHours] = useState("");
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

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          locationX: chaneLocation[0],
          locationY: chaneLocation[1],
          address,
          openingHours,
        }),
      });
      if (res.ok) {
        alert("Tạo cửa hàng thành công!");
      } else {
        alert("Tạo cửa hàng thất bại!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
                        setLocationSelect(chaneLocation);
                        handleOpenAdd();
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

      {/* Modal tạo cửa hàng */}
      <Modal open={openAdd} onClose={handleCloseAdd}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Thêm cửa hàng mới
          </Typography>
          <form
            onSubmit={(e) => {
              handleSubmit(e);
              handleCloseAdd();
            }}
          >
            <TextField
              fullWidth
              label="Tên cửa hàng"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Giờ mở cửa"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              fullWidth
            >
              Xác nhận
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

// const RoutingMachine = ({ start, end }) => {
//   const map = useMap();
//   const routingControlRef = useRef();

//   useEffect(() => {
//     if (!start || !end || routingControlRef.current) return;

//     const routingControl = L.Routing.control({
//       waypoints: [L.latLng(start), L.latLng(end)],
//       routeWhileDragging: true,
//       showAlternatives: true,
//       altLineOptions: {
//         styles: [{ color: "black", opacity: 0.15, weight: 9 }],
//       },
//       collapsible: true,
//       addWaypoints: false,
//     });

//     routingControl.addTo(map);
//     routingControlRef.current = routingControl;

//     return () => {
//       if (routingControlRef.current) {
//         map.removeControl(routingControlRef.current);
//       }
//     };
//   }, [start, end, map]);

//   return null;
// };
