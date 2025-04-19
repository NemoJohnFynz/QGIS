import React from "react";
import { Link, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TopBar from "../pages/Bar/TopBar";
import LeftBar from "../pages/Bar/LeftBar";
import AuthLayout from "../pages/auth/AuthLayout";
const MainLayout = () => {
  return (
    <>
      <main className="w-screen h-screen bg-black">
        <TopBar />
        <LeftBar />
        <Outlet />
      </main>
      <AuthLayout />
      <ToastContainer position="top-left" />
    </>
  );
};

export default MainLayout;
