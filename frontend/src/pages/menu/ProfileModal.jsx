import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { ModeEdit, Save, Cancel } from "@mui/icons-material";
import { update } from "../../service/auth";
import { toast } from "react-toastify";
const ProfileModal = () => {
  const [tab, setTab] = React.useState(false);
  const [formData, setFormData] = React.useState({
    // numberPhone: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    gender: "",
  });
  const { userData } = useAuth();
  const [error, setError] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  // Initialize form data with user data when available
  useEffect(() => {
    if (userData) {
      setFormData({
        ...formData,
        // numberPhone: userData.numberPhone || "",
        email: userData.email || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        address: userData.address || "",
        gender: userData.gender !== undefined ? userData.gender.toString() : "",
      });
    }
  }, [userData]);

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        validationErrors.email = "Email không hợp lệ";
      }
    }

    // if (formData.numberPhone) {
    //   const phoneRegex = /^[0-9]{10,11}$/;
    //   if (!phoneRegex.test(formData.numberPhone)) {
    //     validationErrors.numberPhone = "Số điện thoại không hợp lệ";
    //   }
    // }

    return validationErrors;
  };

  const handleRemoveError = (field) => {
    setError((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field];
      return updatedErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    handleRemoveError(name);
  };

  const handleTab = () => {
    setTab(!tab);
    // Reset any errors when toggling the form
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      try {
        // Convert gender string to boolean if needed
        const dataToUpdate = {
          ...formData,
          gender: formData.gender === "true" ? true :
            formData.gender === "false" ? false : undefined
        };

        // Pass the form data to the update function
        const response = await update(dataToUpdate);

        if (response) {
          console.log("Cập nhật thành công:");
          setSuccess(true);
          toast.success('Cập nhật thành công');
        }
      } catch (error) {
        console.error("Error during profile update:", error);
        setError({ server: "Đã xảy ra lỗi trong quá trình cập nhật" });
        toast.error('Cập nhật thất bại');
      } finally {
        setLoading(false);
      }

      setTab(false);
    } else {
      setError(validationErrors);
    }
  };

  return (
    <div className="fixed bottom-20 right-5 bg-white shadow-xl p-4 rounded-xl w-80 z-40">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold mb-2">Profile</h2>
        {!tab ? (
          <button onClick={handleTab}><ModeEdit /></button>
        ) : (
          <button onClick={handleTab}><Cancel /></button>
        )}
      </div>

      {tab ? (
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="flex gap-1">
            <div className="grid gap-1">
              <label className="text-gray-600">Last Name:</label>
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
                value={formData.lastName}
                className="w-full p-2 border rounded-lg"
                required
                maxLength={30}
              />
            </div>

            <div className="grid gap-1">
              <label className="text-gray-600">First Name:</label>
              <input
                type="text"
                name="firstName"
                onChange={handleChange}
                value={formData.firstName}
                className="w-full p-2 border rounded-lg"
                required
                maxLength={30}
              />
            </div>
          </div>

          <div className="grid gap-1">
            <label className="text-gray-600">Email:</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="w-full p-2 border rounded-lg"
              required
            />
            {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
          </div>

          <div className="grid gap-1">
            <label className="text-gray-600">Gender:</label>
            <select
              name="gender"
              onChange={handleChange}
              value={formData.gender}
              className="w-full p-2 border rounded-lg"
            >
              <option disabled value="">Select gender</option>
              <option value={true}>Male</option>
              <option value={false}>Female</option>
            </select>
          </div>

          {/* <div className="grid gap-1">
            <label className="text-gray-600">Phone:</label>
            <input
              type="text"
              name="numberPhone"
              onChange={handleChange}
              value={formData.numberPhone}
              className="w-full p-2 border rounded-lg"
            />
            {error.numberPhone && <p className="text-red-500 text-sm">{error.numberPhone}</p>}
          </div> */}

          <div className="grid gap-1">
            <label className="text-gray-600">Address:</label>
            <input
              type="text"
              name="address"
              onChange={handleChange}
              value={formData.address}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-2 flex items-center justify-center gap-1"
          >
            <Save fontSize="small" /> Save Changes
          </button>
        </form>
      ) : (
        <div className="grid gap-3">
          <p className="text-gray-600">Name: {userData?.lastName} {userData?.firstName}</p>
          <p className="text-gray-600">Email: {userData?.email}</p>
          <p className="text-gray-600">Gender: {userData?.gender === true ? "Male" : "Female"}</p>
          <p className="text-gray-600">Phone: {userData?.numberPhone}</p>
          <p className="text-gray-600">Address: {userData?.address}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;