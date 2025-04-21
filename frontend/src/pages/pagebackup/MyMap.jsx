import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import axios from "axios";
import Select from "react-select";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import "leaflet/dist/leaflet.css";import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import imageIcon from "../img/location.png";
import imageOrderLocation from "../img/orderLocation.png";
import { toast } from "react-toastify";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "react-toastify/dist/ReactToastify.css";
import { ButtonBase } from "@mui/material";
import { useAuth } from "./AuthContext";

const initialPosition = [51.505, -0.09];
const createCustomIcon = (name) => {
  return L.divIcon({
    className: "custom-icon",
    html: `
      <div style="text-align: center;">
        <img src="${imageOrderLocation}" style="width: 32px; height: 32px;" />
        <div className="border border-gray-200" style="background: white; border-radius: 4px;font-size: 10px; margin-top: 2px;">
          ${name}
        </div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
  });
};

function LocationMarker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}
const addLocation = async (
  name,
  locationX,
  locationY,
  address,
  openingHours
) => {
  if (!name || !locationX || !locationY) return;
  try {
    const response = await axios.post(
      "http://localhost:3001/items",
      {
        name,
        locationX,
        locationY,
        address,
        openingHours,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const getStores = async () => {
  try {
    const response = await axios.get("http://localhost:3001/items");
    return response.data;
  } catch (error) {
    console.error("Error fetching stores:", error);
    return [];
  }
};

function MyMap() {
  const [position, setPosition] = useState(initialPosition);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [stores, setStores] = useState([]);
  const [store, setStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ]);
  const { user, setUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editData, setEditData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const rs = await getStores();
      setStores(rs);

      // Tạo danh sách category không trùng lặp
      const uniqueCategories = Array.from(
        new Set(rs.map((store) => store.category).filter(Boolean))
      ).map((cat) => ({
        value: cat,
        label: cat,
      }));

      setCategoryFilter(uniqueCategories);
    };
    fetch();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address || !openingHours) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    addLocation(name, position[0], position[1], address, openingHours)
      .then((response) => {
        if (response.status === 200) {
          toast.success(
            `Thêm thành công: ${name}! Vị trí: ${position[0]}, ${position[1]}`
          );
          setStores((prevStores) => [...prevStores, response.data]);
        }
      })
      .catch((error) => {
        toast.error("Đã xảy ra lỗi khi thêm vị trí.", error);
      });
    setPosition(initialPosition);
  };
  const updateStore = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/items/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật cửa hàng:", error);
      throw error;
    }
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const userPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(userPos);
        setUserLocation(userPos);
      });
    }
  }, []);
  const filteredStores = stores.filter((store) => {
    const matchesName = store.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || store.category === selectedCategory.value;
    return matchesName && matchesCategory;
  });

  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [routeTo, setRouteTo] = useState(null);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const iconLocation = L.icon({
    iconUrl: imageIcon,
    iconSize: [32, 32], // tùy chỉnh kích thước
    iconAnchor: [16, 32], // tâm icon nằm ở đáy giữa
    popupAnchor: [0, -32], // vị trí popup so với icon
  });
  function MyMapLogic() {
    const map = useMap();

    useEffect(() => {
      window.LMapInstance = map; // Gắn vào biến toàn cục
    }, [map]);

    return null;
  }

  return (
    <>
      <div className="flex flex-row flex-wrap">
        <div className="w-4/5">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MyMapLogic />

            {position && routeTo && <Routing from={position} to={routeTo} />}

            {filteredStores.map((store) => (
              <Marker
                key={store?._id}
                position={[store.locationX, store.locationY]}
                icon={createCustomIcon(store?.name)}
                onClick={() => setStore(store)}
              >
                <Popup>
                  <br />

                  <strong>Tên cửa hàng: {store?.name}</strong>
                  <p>Địa chỉ: {store?.address}</p>
                  <p>Giờ mở cửa: {store?.openingHours}</p>
                  <ul>
                    <li>Danh sách sản phẩm có sẵn: </li>
                    <li>Hình ảnh cửa hàng:</li>
                  </ul>
                  <div className="flex flex-row">
                    <div className="bg-blue-500 hover:bg-blue-600 rounded-lg m-2 text-white">
                      <ButtonBase
                        className="w-full h-full"
                        onClick={() => {
                          if (userLocation) {
                            setRouteTo([store.locationX, store.locationY]);
                            toast.info(`Đang dẫn đường tới ${store.name}`);
                            const map = window.LMapInstance; // bạn cần tạo biến này để truy cập map ở đây
                            if (map) map.closePopup(); // đóng popup
                          } else {
                            toast.warning(
                              "Không thể lấy vị trí hiện tại của bạn!"
                            );
                          }
                        }}
                      >
                        <div className="p-2 font-medium">Dẫn đường</div>
                      </ButtonBase>
                    </div>
                    {user && user.role === 0 && (
                      <div className="bg-green-500 hover:bg-green-600 rounded-lg m-2 text-white">
                        <ButtonBase
                          className="w-full h-full"
                          onClick={() => {
                            handleOpen();
                            setEditData(store);
                          }}
                        >
                          <div className="p-2 font-medium">Chỉnh sửa</div>
                        </ButtonBase>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

            <Marker position={position} icon={iconLocation}>
              <Popup>
                Vị trí được chọn: {position[0]}, {position[1]}
              </Popup>
            </Marker>
            <LocationMarker setPosition={setPosition} />
            <MyLocationButton userLocation={userLocation} />
          </MapContainer>
        </div>
        <div className="w-1/5 space-y-4 p-2">
          {user && user.role === 0 && (
            <Button variant="contained" color="primary" onClick={handleOpenAdd}>
              + Thêm cửa hàng
            </Button>
          )}
          <div className="z-20 border-y-2 p-2 flex items-center w-full flex-col space-y-4">
            <strong>Tìm kiếm cửa hàng</strong>
            <div className=" flex flex-row justify-center items-center w-full">
              <div className="text-nowrap">{"Lọc thể loại :"}</div>
              <Select
                className="w-full"
                options={categoryFilter}
                value={selectedCategory}
                onChange={(selectedOption) =>
                  setSelectedCategory(selectedOption)
                }
                isClearable
              />
            </div>
            <input
              type="text"
              className="border border-gray-400 shadow-inner rounded-lg"
              placeholder="Nhập tên cửa hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                display: "block",
                margin: "10px auto",
                padding: "5px",
                width: "80%",
                textAlign: "center",
              }}
            />
          </div>
        </div>
      </div>
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
              e.preventDefault();
              handleSubmit(e);
              handleCloseAdd(); // đóng modal sau khi submit
            }}
          >
            <TextField
              fullWidth
              label="Tên cửa hàng"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
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
              color="success"
              sx={{ mt: 2 }}
            >
              Thêm
            </Button>
          </form>
        </Box>
      </Modal>

      <div>
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" component="h2">
              Chỉnh sửa cửa hàng
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Tên cửa hàng"
              value={editData?.name || ""}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Thể loại"
              value={editData?.category || ""}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Địa chỉ"
              value={editData?.address || ""}
              onChange={(e) =>
                setEditData({ ...editData, address: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Giờ mở cửa"
              value={editData?.openingHours || ""}
              onChange={(e) =>
                setEditData({ ...editData, openingHours: e.target.value })
              }
            />
            <Button
              onClick={async () => {
                if (
                  !editData?.name ||
                  !editData?.address ||
                  !editData?.category ||
                  !editData?.openingHours
                ) {
                  toast.error("Vui lòng nhập đầy đủ thông tin!");
                  return;
                }

                try {
                  const updated = await updateStore(editData._id, {
                    name: editData.name,
                    address: editData.address,
                    category: editData.category,
                    openingHours: editData.openingHours,
                  });

                  // Cập nhật lại danh sách stores
                  setStores((prev) =>
                    prev.map((store) =>
                      store._id === updated._id ? updated : store
                    )
                  );

                  toast.success("Cập nhật thành công!");
                  handleClose();
                } catch (error) {
                  toast.error("Đã xảy ra lỗi khi cập nhật!");
                }
              }}
              variant="contained"
              sx={{ mt: 2 }}
            >
              Lưu
            </Button>
          </Box>
        </Modal>
      </div>
      <Huongdan user={user} />
    </>
  );
}

export default MyMap;
function Routing({ from, to }) {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      showAlternatives: false,
      createMarker: () => null,
      lineOptions: {
        styles: [
          {
            color: "green", // 🎨 màu của tuyến đường
            weight: 6, // 📏 độ dày
          },
        ],
      },
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [from, to, map]);

  return null;
}

function MyLocationButton({ userLocation }) {
  const map = useMap();

  const handleClick = () => {
    if (userLocation) {
      map.setView(userLocation, 16); // có thể thay đổi mức zoom nếu cần
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        right: 10,
        zIndex: 1000,
        background: "white",
        borderRadius: "8px",
        padding: "6px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      }}
    >
      <Button variant="outlined" size="small" onClick={handleClick}>
        Vị trí của tôi
      </Button>
    </div>
  );
}
function Huongdan({ user }) {
  return (
    <div className="flex flex-row flex-wrap text-green-700">
      <div className="p-4 max-w-96">
        <div className="">
          bạn có thể xem đường đi đến bằng việc bấm vào nút dẫn đường trong khi
          xem chi tiết cửa hàng tại vị trí cụ thể . khi bạn chưa chọn vị tri bắc
          đầu chúng tôi mặc định vị trí của bạn lúc dẫn đường
        </div>
      </div>
      <div className="p-6 max-w-96">
        <div className="">bạn có thể thêm cửa hàng của mình vào</div>
      </div>
      <div className="p-6 max-w-96">
        <div className="">
          bạn có thể tìm kiếm tên cửa hàng , có thể lọc theo thể loại cửa hàng
        </div>
      </div>
      <div
        className={`p-6 max-w-96 text-${user && user.role === 0 ? "green" : "red"}-500`}
      >
        <div className="">
          chỉ có admin mới có thể thêm , sửa tọa độ và thông tin cửa hàng
        </div>
      </div>
    </div>
  );
}
