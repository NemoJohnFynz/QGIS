import { useState } from "react";
import { login } from "../../service/auth";
import { useAuth } from "../../context/AuthContext";
import authToken from "../../storage/authToken";
import Loading from "../../components/Loading";
import SimpleAlert from "../../components/Alert";
export function LoginForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // New state for success message
  const { setForm } = useAuth()
  //validate 
  const validateForm = () => {
    const validationErrors = {};
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);
    const isPhoneNumber = /^[0-9]{10,15}$/.test(formData.identifier);

    if (!formData.identifier) {
      validationErrors.identifier = 'Vui lòng nhập email hoặc số điện thoại.';
    } else if (!isEmail && !isPhoneNumber) {
      validationErrors.identifier = 'Định dạng không hợp lệ. Vui lòng nhập email hoặc số điện thoại.';
    }

    if (!formData.password) validationErrors.password = 'Vui lòng nhập mật khẩu.';
    return validationErrors;
  };

  //handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //handle submit
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Determine if the identifier is an email or phone number
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);

        // Dynamically construct the request payload
        const requestData = isEmail
          ? { email: formData.identifier, password: formData.password }
          : { numberPhone: formData.identifier, password: formData.password };

        // Send login request
        const response = await login(requestData);
        if (response) {
          authToken.setToken(response.accessToken); // Save the token
          setSuccess(true); // Set success state to true
        }
      } catch (error) {
        console.error('Lỗi:', error.response?.data || error.message);
      }
      finally {
        setLoading(false);
        setTimeout(() => setForm(""), 3000); // Redirect after 2 seconds
      }
    } else {
      setErrors(validationErrors);
    }
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="identifier"
        value={formData.identifier}
        onChange={handleChange}
        placeholder="Email or Phone Number"
        className="w-full p-3 border rounded-lg"
      />
      {errors.identifier && <p className="text-red-500 text-sm mt-2">{errors.identifier}</p>}
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full p-3 border rounded-lg"
      />
      {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
      {success ? (
        <SimpleAlert mess={"Login successful"} />
      ) : (
        loading ? (
          <div className="flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-500"
          >
            Login
          </button>
        )
      )}
    </form>
  );
}
