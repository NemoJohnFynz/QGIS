import React, { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import {
  Button,
  TextField,
  CircularProgress,
  ButtonGroup,
  ButtonBase,
} from "@mui/material";
import { deleteLocations, updateLocation } from "../../service/location";
import { useLocation } from "../../context/LocationContext";
import { toast } from "react-toastify";
import { RemoveCircle } from "@mui/icons-material";
import { useMenu } from "../../context/MenuContext";

const UpdateLocationModal = ({ open, onClose, locationData }) => {
  const { fetchData, stores, setStores } = useLocation();
  const { toggleModel } = useMenu();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    categories: "",
    phone: "",
    website: "",
    email: "",
  });

  const [openingHours, setOpeningHours] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (locationData) {
      setFormData({
        name: locationData.name || "",
        address: locationData.address || "",
        description: locationData.description || "",
        phone: locationData.contact?.phone || "",
        website: locationData.contact?.website || "",
        categories: Array.isArray(locationData.categories)
          ? locationData.categories.join(", ")
          : locationData.categories || "",
      });
      setOpeningHours(locationData.openingHours || []);
    }
  }, [locationData, updateLocation]);

  const handleInput = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTimeChange = (index, field, value) => {
    const updated = [...openingHours];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setOpeningHours(updated);
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa không?");

    if (confirmDelete) {
      try {
        // Giả sử deleteLocations trả về Promise
        await deleteLocations(locationData?._id);

        // Cập nhật lại danh sách sau khi xóa
        setStores((prevStores) =>
          prevStores.filter((store) => store._id !== locationData?._id)
        );

        toast.success("Đã xóa!");
        toggleModel("");
      } catch (err) {
        console.error("Lỗi khi xóa cửa hàng:", err);
        toast.error("Xóa không thành công.");
      }
    } else {
      toast.error("Hủy bỏ xóa.");
    }
  };

  console.log(locationData);
  const handleUpdate = async () => {
    if (!formData.name || typeof formData.name !== "string") {
      toast.error("Tên cửa hàng không hợp lệ.");
      return;
    }

    if (!formData.description || typeof formData.description !== "string") {
      toast.error("Mô tả cửa hàng không hợp lệ.");
      return;
    }

    if (
      !locationData ||
      !locationData.location ||
      typeof locationData.location !== "object"
    ) {
      toast.error("Vị trí không hợp lệ.");
      return;
    }
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      if (formData.address) form.append("address", formData.address);



      // ✅ Chuyển categories string -> array
      const categoryArray = formData.categories
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c);
      // form.append("categories", JSON.stringify(categoryArray));

      // ✅ contact
      const contact = {
        phone: formData.phone,
        website: formData.website,
        email: formData.email,
      };
      // form.append("contact", JSON.stringify(contact));

      // ✅ openingHours là array
      // form.append("openingHours", JSON.stringify(openingHours));

      await updateLocation(locationData._id, form);
      toast.success("Cập nhật cửa hàng thành công!");
      fetchData();
      onClose();
    } catch (err) {
      console.error("Lỗi cập nhật cửa hàng:", err);
      toast.error("Cập nhật cửa hàng thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-1/2 mt-6 left-0 transform -translate-y-1/2 bg-white shadow-xl rounded-2xl w-full sm:w-80 max-w-xs sm:max-w-sm md:w-96 lg:w-96 max-h-[90vh] h-auto z-40 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Cập nhật cửa hàng</h2>
        <div className="flex items-center gap-6">
          <ButtonBase
            onClick={() => {
              handleDelete();
            }}
          >
            <Trash2 className="w-10 h-10 text-red-500 hover:text-red-600" />
          </ButtonBase>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-700 space-y-4">
        <TextField
          fullWidth
          label="Tên cửa hàng"
          size="small"
          value={formData.name}
          onChange={handleInput("name")}
          disabled={isLoading}
        />
        <TextField
          fullWidth
          label="Mô tả"
          size="small"
          value={formData.description}
          onChange={handleInput("description")}
          disabled={isLoading}
        />
        <TextField
          fullWidth
          label="Địa chỉ"
          size="small"
          value={formData.address}
          onChange={handleInput("address")}
          disabled={isLoading}
        />
        <TextField
          fullWidth
          label="Số điện thoại"
          size="small"
          value={formData.phone}
          onChange={handleInput("phone")}
          disabled={isLoading}
        />
        <TextField
          fullWidth
          label="Website"
          size="small"
          value={formData.website}
          onChange={handleInput("website")}
          disabled={isLoading}
        />
        <TextField
          fullWidth
          label="Danh mục (phân cách dấu phẩy)"
          size="small"
          value={formData.categories}
          onChange={handleInput("categories")}
          disabled={isLoading}
        />

        <div className="space-y-2">
          <label className="font-semibold">Giờ mở cửa</label>
          {openingHours.map((item, index) => (
            <div key={index} className="flex gap-2 items-center text-xs">
              <span className="w-16">{item.day}</span>
              <input
                type="time"
                value={item.open + ":00"}
                onChange={(e) =>
                  handleTimeChange(index, "open", e.target.value)
                }
                className="border px-1 rounded"
              />
              <input
                type="time"
                value={item.close + ":00"}
                onChange={(e) =>
                  handleTimeChange(index, "close", e.target.value)
                }
                className="border px-1 rounded"
              />
              <label className="flex items-center gap-1 text-[10px]">
                <input
                  type="checkbox"
                  checked={item.isClosed}
                  onChange={(e) =>
                    handleTimeChange(index, "isClosed", e.target.checked)
                  }
                />
                Đóng
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end p-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Cập nhật"}
        </Button>
      </div>
    </div>
  );
};

export default UpdateLocationModal;
