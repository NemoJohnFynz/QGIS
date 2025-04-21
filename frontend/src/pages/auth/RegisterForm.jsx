import { useState } from "react";
import { register } from "../../service/auth";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Loading from "../../components/Loading";
import SimpleAlert from "../../components/Alert";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
export function RegisterForm() {
  const [formData, setFormData] = useState({
    numberPhone: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    gender: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });
  const { setForm } = useAuth();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // New state for success message
  const validateForm = () => {
    const validationErrors = {};
    const today = new Date();
    const birthDate = new Date(formData.birthday);

    if (birthDate > today) {
      validationErrors.birthday = "Ngày sinh không được lớn hơn ngày hiện tại";
    }

    if (!formData.password) {
      validationErrors.password = "Bắt buộc nhập mật khẩu";
    } else if (formData.password.length < 8) {
      validationErrors.password = "Mật khẩu quá ngắn";
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Mật khẩu không khớp nhau";
    }

    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(formData.numberPhone)) {
      validationErrors.numberPhone = "Số điện thoại không hợp lệ";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Email không hợp lệ";
    }

    return validationErrors;
  };

  const handleRemoveError = (field) => {
    setError((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field];
      return updatedErrors;
    });
  };

  const { confirmPassword, ...dataToSend } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    handleRemoveError(name);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setLoading(false);
      return;
    }
    try {
      const response = await register(dataToSend);
      if (response) {
        console.log("Đăng ký thành công:");
        setSuccess(true); // Set success state to true
      }
      toast.success('Đăng ký thành công')
            // setTimeout(() => {
      //   setForm(""); // Reset success state after 3 seconds
      // }, 3000);
    } catch (error) {
      console.error("Error during registration:", error);
      setError({ server: "Đã xảy ra lỗi trong quá trình đăng ký" });
    } finally {
      setLoading(false);

    }
  };

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            onChange={handleChange}
            value={formData.lastName}
            className="w-full p-3 border rounded-lg"
            required
            maxLength={30}
          />
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            onChange={handleChange}
            value={formData.firstName}
            className="w-full p-3 border rounded-lg"
            required
            maxLength={20}
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          className="w-full p-3 border rounded-lg"
          required
        />
        {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
        <input
          type="text"
          placeholder="Number Phone"
          name="numberPhone"
          onChange={handleChange}
          value={formData.numberPhone}
          className="w-full p-3 border rounded-lg"
          maxLength={11}
          required
        />
        {error.numberPhone && (
          <p className="text-red-500 text-sm">{error.numberPhone}</p>
        )}
        <input
          type="text"
          placeholder="Address"
          name="address"
          onChange={handleChange}
          value={formData.address}
          className="w-full p-3 border rounded-lg"
          required
          maxLength={100}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formData.gender}
            onChange={(e) =>
              handleChange({
                target: { name: "gender", value: e.target.value },
              })
            }
            label="Gender"
          >
            <MenuItem value={true}>Male</MenuItem>
            <MenuItem value={false}>Female</MenuItem>
          </Select>
        </FormControl>
        <input
          type="date"
          name="birthday"
          onChange={handleChange}
          value={formData.birthday}
          className="w-full p-3 border rounded-lg"
          required
        />
        {error.birthday && (
          <p className="text-red-500 text-sm">{error.birthday}</p>
        )}
        <div className="flex gap-3">
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            className="w-full p-3 border rounded-lg"
            required
          />
          {error.password && (
            <p className="text-red-500 text-sm">{error.password}</p>
          )}
          <input
            type="password"
            placeholder="Comfirm Password"
            name="confirmPassword"
            onChange={handleChange}
            value={formData.confirmPassword}
            className="w-full p-3 border rounded-lg"
            required
          />
          {error.confirmPassword && (
            <p className="text-red-500 text-sm ">{error.confirmPassword}</p>
          )}
        </div>
        {success ? (
          <SimpleAlert mess={"Register successful"} />
        ) : loading ? (
          <div className="flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
        )}
      </form>
    </div>
  );
}
