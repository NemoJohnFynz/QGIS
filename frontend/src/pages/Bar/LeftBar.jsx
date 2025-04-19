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

const LeftBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // trigger animation
  const [isFullyCollapsed, setIsFullyCollapsed] = useState(true); // dùng để style

  useEffect(() => {
    let timeout;
    if (isCollapsed) {
      timeout = setTimeout(
        () => setIsFullyCollapsed(true), 
      ); // sau khi animation kết thúc
    } else {
      setIsFullyCollapsed(false); // ngay lập tức khi expand
    }
    return () => clearTimeout(timeout);
  }, [isCollapsed]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <aside
      className={`h-screen ${
        isCollapsed ? "w-20" : "w-52"
      } bg-white border-r shadow-sm p-4 flex flex-col gap-4 fixed top-0 left-0 z-50 transition-[width] duration-${timeAnimation} ease-in-out`}
    >
      <div
        className={`flex items-center justify-${isCollapsed ? "center" : "between"} mb-6 w-full`}
      >
        {!isFullyCollapsed && (
          <span className="text-2xl font-bold text-blue-600">Map GIS</span>
        )}
        <button
          onClick={toggleSidebar}
          className="text-lg text-blue-600 hover:bg-blue-100 p-1 aspect-square rounded-full transition"
        >
          {isCollapsed ? <ArrowRightCircle /> : <ArrowLeftCircle />}
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item, idx) => (
          <ButtonBase key={idx}>
            <button
              className={`flex items-center ${
                isFullyCollapsed ? "justify-center" : "justify-start"
              } gap-3 px-2 py-2 w-full rounded-lg hover:bg-blue-100 transition duration-200`}
            >
              <div className="w-5 h-5 flex items-center justify-center text-blue-600">
                {item.icon}
              </div>
              {!isFullyCollapsed && (
                <span className="text-sm font-medium text-gray-800">
                  {item.label}
                </span>
              )}
            </button>
          </ButtonBase>
        ))}
      </nav>
    </aside>
  );
};

export default LeftBar;
