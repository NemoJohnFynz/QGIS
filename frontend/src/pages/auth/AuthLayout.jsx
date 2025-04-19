import React, { useContext } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { AuthContext } from "../../context/AuthContext";

function AuthLayout() {
  const { form, setForm } = useContext(AuthContext);

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
        return <LoginForm />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
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
