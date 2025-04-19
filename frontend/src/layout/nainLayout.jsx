import React from "react";
import { Link, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TopBar from "../pages/Bar/TopBar";
import LeftBar from "../pages/Bar/LeftBar";
const MainLayout = () => {
  return (
    <>
      <main className="w-screen h-screen bg-black">
        <TopBar />
        <LeftBar />
        <Outlet />
      </main>
      <ToastContainer position="top-left" />
    </>
  );
};

export default MainLayout;
