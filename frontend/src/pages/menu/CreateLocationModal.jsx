import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import {
  Button,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { createLocation } from "../../service/location";
import { useLocation } from "../../context/LocationContext";
import { toast } from "react-toastify";
import {
  createCategory as createCategoryAPI,
  getCategory as getCategoryAPI,
} from "../../service/category";

const weekdays = [
  "thứ 2",
  "thứ 3",
  "thứ 4",
  "thứ 5",
  "thứ 6",
  "thứ 7",
  "chủ nhật",
];

const defaultOpeningHours = weekdays.map((day) => ({
  day,
  open: "08:00",
  close: "22:00",
  isClosed: false,
}));

const CreateLocationModal = () => {
  const { toggleModel } = useMenu();
  const { chaneLocation } = useLocation();
  const { fetchData } = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    website: "",
    categories: "", // This will now store the selected category ID
    menu: [{ name: "Sản phẩm mẫu", price: 15000, description: "cà phê đá" }],
  });

  const [openingHours, setOpeningHours] = useState(defaultOpeningHours);
  const [imageFiles, setImageFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoryAPI();
        if (response && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        toast.error("Không thể tải danh mục.");
      }
    };

    fetchCategories();
  }, []);

  const handleInput = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 10 - imageFiles.length);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMenuChange = (index, field, value) => {
    const updatedMenu = [...formData.menu];
    updatedMenu[index][field] = value;
    setFormData((prev) => ({ ...prev, menu: updatedMenu }));
  };

  const addMenuItem = () => {
    setFormData((prev) => ({
      ...prev,
      menu: [...prev.menu, { name: "", price: 0, description: "" }],
    }));
  };

  const removeMenuItem = (index) => {
    const newMenu = [...formData.menu];
    newMenu.splice(index, 1);
    setFormData((prev) => ({ ...prev, menu: newMenu }));
  };

  const handleTimeChange = (index, field, value) => {
    const updated = [...openingHours];
    updated[index][field] = value;
    setOpeningHours(updated);
  };

  const handleCreateCategory = async () => {
    if (!categoryName) {
      toast.error("Vui lòng nhập tên danh mục.");
      return;
    }

    setIsCreatingCategory(true);
    try {
      const response = await createCategoryAPI(
        categoryName,
        categoryDescription
      );
      if (response && response.status === 201) {
        toast.success("Tạo danh mục thành công!");
        // Fetch categories again to update the list
        const categoriesResponse = await getCategoryAPI();
        if (categoriesResponse && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        setCategoryName("");
        setCategoryDescription("");
      } else {
        toast.error("Tạo danh mục thất bại.");
      }
    } catch (error) {
      console.error("Lỗi tạo danh mục:", error);
      toast.error("Có lỗi xảy ra khi tạo danh mục.");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleCreate = async () => {
    if (!chaneLocation || chaneLocation.length !== 2) {
      toast.error("Chưa có vị trí hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("address", formData.address);
      form.append("categories", formData.categories); // Appending selected category ID

      if (formData.phone) form.append("contact", `phone:${formData.phone}`);
      if (formData.website)
        form.append("contact", `website:${formData.website}`);

      openingHours.forEach((item) => {
        form.append(
          "openingHours",
          `day:${item.day},open:${item.open},close:${item.close},isClosed:${item.isClosed}`
        );
      });

      formData.menu.forEach((item) => {
        form.append(
          "menu",
          `name:${item.name},price:${item.price},description:${item.description}`
        );
      });
      form.append(
        "location",
        JSON.stringify({
          type: "Point",
          coordinates: [chaneLocation[1], chaneLocation[0]],
        })
      );
      imageFiles.forEach((file) => form.append("files", file));
      try {
        const response = await createLocation(form);
        if (response.status === 201 || response.status === 200) {
          fetchData();
          toast.success("Tạo cửa hàng thành công!");
        } else {
          toast.error(`Thất bại với mã lỗi: ${response.status}`);
        }
      } catch (error) {
        const status = error.response?.status || "Không xác định";
        const message =
          error.response?.data?.message || "Đã xảy ra lỗi khi tạo cửa hàng.";
        toast.error(`Lỗi (${status}): ${message}`);
      }

      toggleModel("");
    } catch (error) {
      console.error("Lỗi tạo cửa hàng:", error);
      toast.error("Tạo cửa hàng thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-1/2 mt-6 left-0 transform -translate-y-1/2 bg-white shadow-xl rounded-2xl w-full sm:w-80 max-w-xs sm:max-w-sm md:w-96 lg:w-96 max-h-[90vh] h-auto z-40 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Tạo mới cửa hàng</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => toggleModel("")}
          disabled={isLoading || isCreatingCategory}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-700 space-y-4">
        <TextField
          fullWidth
          label="Tên cửa hàng"
          size="small"
          value={formData.name}
          onChange={handleInput("name")}
          disabled={isLoading || isCreatingCategory}
        />
        <TextField
          fullWidth
          label="Mô tả"
          size="small"
          value={formData.description}
          onChange={handleInput("description")}
          disabled={isLoading || isCreatingCategory}
        />
        <TextField
          fullWidth
          label="Địa chỉ"
          size="small"
          value={formData.address}
          onChange={handleInput("address")}
          disabled={isLoading || isCreatingCategory}
        />
        <TextField
          fullWidth
          label="Số điện thoại"
          size="small"
          value={formData.phone}
          onChange={handleInput("phone")}
          disabled={isLoading || isCreatingCategory}
        />
        <TextField
          fullWidth
          label="Website"
          size="small"
          value={formData.website}
          onChange={handleInput("website")}
          disabled={isLoading || isCreatingCategory}
        />

        {/* Danh mục Select */}
        <div>
          <FormControl fullWidth size="small">
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={formData.categories}
              onChange={handleInput("categories")}
              disabled={isLoading || isCreatingCategory}
              label="Danh mục"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Thêm mới danh mục */}
        <div className="border rounded p-2 space-y-2">
          <label className="font-semibold block">Thêm mới danh mục</label>
          <TextField
            fullWidth
            label="Tên danh mục mới"
            size="small"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            disabled={isLoading || isCreatingCategory}
          />
          <TextField
            fullWidth
            label="Mô tả danh mục mới (tùy chọn)"
            size="small"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            disabled={isLoading || isCreatingCategory}
          />
          <Button
            fullWidth
            size="small"
            variant="outlined"
            color="primary"
            onClick={handleCreateCategory}
            disabled={isLoading || isCreatingCategory}
          >
            {isCreatingCategory ? (
              <CircularProgress size={24} />
            ) : (
              "Thêm danh mục"
            )}
          </Button>
        </div>

        {/* Giờ mở cửa */}
        <div className="space-y-2">
          <label className="font-semibold">Giờ mở cửa</label>
          {openingHours.map((item, index) => (
            <div key={index} className="flex gap-2 items-center text-xs">
              <span className="w-16">{item.day}</span>
              <input
                type="time"
                value={item.open}
                onChange={(e) =>
                  handleTimeChange(index, "open", e.target.value)
                }
                className="border px-1 rounded"
                disabled={isLoading || isCreatingCategory}
              />
              <input
                type="time"
                value={item.close}
                onChange={(e) =>
                  handleTimeChange(index, "close", e.target.value)
                }
                className="border px-1 rounded"
                disabled={isLoading || isCreatingCategory}
              />
              <label className="flex items-center gap-1 text-[10px]">
                <input
                  type="checkbox"
                  checked={item.isClosed}
                  onChange={(e) =>
                    handleTimeChange(index, "isClosed", e.target.checked)
                  }
                  disabled={isLoading || isCreatingCategory}
                />
                Đóng
              </label>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="space-y-2">
          <label className="font-semibold">Danh sách món</label>
          {formData.menu.map((item, index) => (
            <div key={index} className="flex flex-col gap-1 border p-2 rounded">
              <TextField
                size="small"
                label="Tên món"
                value={item.name}
                onChange={(e) =>
                  handleMenuChange(index, "name", e.target.value)
                }
                disabled={isLoading || isCreatingCategory}
              />
              <TextField
                size="small"
                label="Giá"
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleMenuChange(index, "price", e.target.value)
                }
                disabled={isLoading || isCreatingCategory}
              />
              <TextField
                size="small"
                label="Mô tả"
                value={item.description}
                onChange={(e) =>
                  handleMenuChange(index, "description", e.target.value)
                }
                disabled={isLoading || isCreatingCategory}
              />
              {index > 0 && (
                <Button
                  size="small"
                  onClick={() => removeMenuItem(index)}
                  color="error"
                  disabled={isLoading || isCreatingCategory}
                >
                  Xoá
                </Button>
              )}
            </div>
          ))}
          <Button
            onClick={addMenuItem}
            size="small"
            variant="outlined"
            disabled={isLoading || isCreatingCategory}
          >
            Thêm món
          </Button>
        </div>

        {/* Ảnh */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Chọn ảnh (tối đa 10)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={isLoading || isCreatingCategory}
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
                  disabled={isLoading || isCreatingCategory}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCreate}
          disabled={isLoading || isCreatingCategory}
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
