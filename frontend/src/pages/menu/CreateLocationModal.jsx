import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { Button, TextField, CircularProgress } from "@mui/material";
import {
  createLocation,
  uploadImageToCloudinary,
} from "../../service/location";
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
    menu: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!chaneLocation || chaneLocation.length !== 2) {
      toast.error("Chưa có vị trí hợp lệ");
      return;
    }

    setIsLoading(true);
    const uploadedUrls = await Promise.all(
      imageFiles.map((file) => uploadImageToCloudinary(file))
    );
    console.log(uploadedUrls);
    const payload = {
      name: formData.name,
      description: formData.description,
      images: JSON.stringify(uploadedUrls.flat()),

      location: JSON.stringify({
        type: "Point",
        coordinates: [chaneLocation[1], chaneLocation[0]],
      }),
      categories: JSON.stringify(
        formData.categories
          .split(",")
          .map((cat) => cat.trim())
          .filter((cat) => cat)
      ),
      address: formData.address,
      contact: JSON.stringify({
        phone: formData.phone,
        website: formData.website,
      }),
      openingHours: JSON.stringify(defaultOpeningHours),
      menu: JSON.stringify([
        {
          name: formData.menu || "Sản phẩm mẫu",
          price: 0,
          image: "",
          description: "",
        },
      ]),
    };

    try {
      await createLocation(payload);
      toast.success("Tạo cửa hàng thành công!");
      toggleModel("");
    } catch (error) {
      console.error("Lỗi tạo cửa hàng:", error);
      toast.error("Tạo cửa hàng thất bại.");
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
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
          label="Danh mục (phân cách bằng dấu phẩy)"
          size="small"
          value={formData.categories}
          onChange={handleInput("categories")}
          disabled={isLoading}
        />

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Chọn ảnh cửa hàng
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={isLoading}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {imageFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="w-16 h-16 object-cover rounded border"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                  onClick={() => handleRemoveImage(index)}
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <TextField
          fullWidth
          label="Tên sản phẩm mẫu"
          size="small"
          value={formData.menu}
          onChange={handleInput("menu")}
          disabled={isLoading}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Tạo cửa hàng"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateLocationModal;
