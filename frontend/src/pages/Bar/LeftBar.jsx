import React, { useState, useEffect } from "react";
import {
  Home,
  Settings,
  MessageCircle,
  Bell,
  User,
  ArrowRightCircle,
  ArrowLeftCircle,
} from "lucide-react";
import { ButtonBase } from "@mui/material";

const timeAnimation = 300;
const menuItems = [
  { icon: <Home size={20} />, label: "Home" },
  { icon: <MessageCircle size={20} />, label: "Messages" },
  { icon: <Bell size={20} />, label: "Notifications" },
  { icon: <User size={20} />, label: "Profile" },
  { icon: <Settings size={20} />, label: "Settings" },
];

const LeftBar = ({ isCollapsed, setIsCollapsed }) => {
  const [showCollapsedToggle, setShowCollapsedToggle] = useState(false);

  useEffect(() => {
    let timer;
    if (isCollapsed) {
      timer = setTimeout(() => setShowCollapsedToggle(true), 300);
    } else {
      setShowCollapsedToggle(false);
    }
    return () => clearTimeout(timer);
  }, [isCollapsed]);

  return (
    <>
      {showCollapsedToggle && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-50 bg-white text-blue-600 border shadow p-1 rounded-full hover:bg-blue-100 transition"
        >
          <ArrowRightCircle size={24} />
        </button>
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-52 bg-white border-r shadow-sm p-4 flex flex-col gap-4 z-40
          transform transition-transform duration-300 ease-in-out
          ${isCollapsed ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div className="flex items-center justify-between mb-6 w-full">
          <span className="text-2xl font-bold text-blue-600">Map GIS</span>
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-lg text-blue-600 hover:bg-blue-100 p-1 aspect-square rounded-full transition"
          >
            <ArrowLeftCircle />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item, idx) => (
            <ButtonBase key={idx}>
              <button className="flex items-center justify-start gap-3 px-2 py-2 w-full rounded-lg hover:bg-blue-100 transition duration-200">
                <div className="w-5 h-5 flex items-center justify-center text-blue-600">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {item.label}
                </span>
              </button>
            </ButtonBase>
          ))}
        </nav>
      </div>
    </>
  );
};

export default LeftBar;
