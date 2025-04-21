import React, { useState } from "react";
import { X } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { Button, TextField } from "@mui/material";
import { createLocation } from "../../service/location";
import { useLocation } from "../../context/LocationContext";
import { toast } from "react-toastify";
const defaultOpeningHours = [
  {
    day: "Monday",
    open: "08:00",
    close: "22:00",
    isClosed: false,
  },
];

const CreateLocationModal = () => {
  const { toggleModel } = useMenu();
  const { chaneLocation } = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    website: "",
    categories: "",
    images: "",
    menu: "",
  });

  const handleInput = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCreate = async () => {
    if (!chaneLocation || chaneLocation.length !== 2) return alert("Chưa có vị trí hợp lệ");

    const payload = {
      name: formData.name,
      description: formData.description,
      images: formData.images.split(",").map((img) => img.trim()),
      location: {
        type: "Point",
        coordinates: [chaneLocation[1], chaneLocation[0]], // [lng, lat]
      },
      categories: formData.categories.split(",").map((c) => c.trim()),
      address: formData.address,
      contact: {
        phone: formData.phone,
        website: formData.website,
      },
      openingHours: defaultOpeningHours,
      menu: [
        {
          name: formData.menu || "Sản phẩm mẫu",
          price: 0,
          image: "",
          description: "",
        },
      ],
    };

    try {
      const res = await createLocation(payload);
      toast.success('Tạo thành công:' ) 
      toggleModel("");
    } catch (err) {
      console.error("Lỗi tạo:", err);
    }
  };

  return (
    <div className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-white shadow-xl rounded-2xl w-full sm:w-80 max-w-xs sm:max-w-sm md:w-96 lg:w-96 max-h-[90vh] h-auto z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Tạo mới cửa hàng</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => toggleModel("")}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-700 space-y-3">
        <TextField
          fullWidth
          label="Tên cửa hàng"
          size="small"
          value={formData.name}
          onChange={handleInput("name")}
        />
        <TextField
          fullWidth
          label="Mô tả"
          size="small"
          value={formData.description}
          onChange={handleInput("description")}
        />
        <TextField
          fullWidth
          label="Địa chỉ"
          size="small"
          value={formData.address}
          onChange={handleInput("address")}
        />
        <TextField
          fullWidth
          label="Số điện thoại"
          size="small"
          value={formData.phone}
          onChange={handleInput("phone")}
        />
        <TextField
          fullWidth
          label="Website"
          size="small"
          value={formData.website}
          onChange={handleInput("website")}
        />
        <TextField
          fullWidth
          label="Danh mục (phân cách bởi dấu phẩy)"
          size="small"
          value={formData.categories}
          onChange={handleInput("categories")}
        />
        <TextField
          fullWidth
          label="Hình ảnh (URLs, phân cách bởi dấu phẩy)"
          size="small"
          value={formData.images}
          onChange={handleInput("images")}
        />
        <TextField
          fullWidth
          label="Tên sản phẩm mẫu"
          size="small"
          value={formData.menu}
          onChange={handleInput("menu")}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCreate}
        >
          Tạo cửa hàng
        </Button>
      </div>
    </div>
  );
};

export default CreateLocationModal;
