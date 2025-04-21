import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LeftBar from "../pages/Bar/LeftBar";
import AuthLayout from "../pages/auth/AuthLayout";
import TopBar from "../pages/Bar/TopBar";

const sidebarWidth = 208; // 52 * 4

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); 
  return (
    <>
      {/* <LeftBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} /> */}
      <main
        className={`transition-all duration-300 ease-in-out
          h-screen w-full   ${isCollapsed ? "pl-0" : `pl-[${sidebarWidth}px]`}
        `}
      >
        <div className="w-full h-full relative   bg-black overflow-y-auto">
          <TopBar />
          <Outlet />
        </div>
      </main>

      <AuthLayout />
      <ToastContainer position="top-left" />
    </>
  );
};

export default MainLayout;
