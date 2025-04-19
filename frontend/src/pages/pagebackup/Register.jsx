import { useState } from "react";
import instance from "./apiSetup";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
export default function Register() {
  const [form, setForm] = useState({ name: "", password: "" });
  const { getProfile } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/register", {
        name: form.name,
        password: form.password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      await getProfile();

      toast.success(
        `Đăng ký thành công! Vai trò: ${res.data.role === 0 ? "Admin" : "User"}`
      );

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      toast.error("Tên đã tồn tại!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Đăng ký
        </h2>

        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
