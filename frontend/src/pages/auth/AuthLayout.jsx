import React from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useAuth } from "../../context/AuthContext";
import { ButtonBase, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function AuthLayout() {
  const { form, setForm } = useAuth();

  if (!form) return null; // ✅ Đóng layout khi form = null

  const toggleForm = () => {
    setForm(form === "login" ? "register" : "login");
  };

  const renderForm = () => {
    switch (form) {
      case "login":
        return <LoginForm />;
      case "register":
        return <RegisterForm />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => setForm("")}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
      >
        {/* Nút Đóng */}
        <div className="absolute top-2 right-2">
          <IconButton onClick={() => setForm(null)}>
            <CloseIcon />
          </IconButton>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
          {form}
        </h2>

        {renderForm()}

        <p className="mt-6 text-center text-sm text-gray-600">
          {form === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="text-blue-600 hover:underline font-medium"
          >
            {form === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;
