import React from "react";
import { Home, Settings, MessageCircle, Bell, User } from "lucide-react"; // hoặc Heroicons nếu bạn dùng Heroicons
import { ButtonBase, ButtonGroup } from "@mui/material";

const menuItems = [
  { icon: <Home size={20} />, label: "Home" },
  { icon: <MessageCircle size={20} />, label: "Messages" },
  { icon: <Bell size={20} />, label: "Notifications" },
  { icon: <User size={20} />, label: "Profile" },
  { icon: <Settings size={20} />, label: "Settings" },
];

const LeftBar = () => {
  return (
    <aside className="h-screen w-52 bg-white border-r shadow-sm p-4 flex flex-col gap-4 fixed top-0 left-0 z-50">
      <div className="text-2xl font-bold text-blue-600 mb-6">Map GIS</div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item, idx) => (
          <ButtonBase>
            <button
              key={idx}
              className="flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-blue-100 transition"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          </ButtonBase>
        ))}
      </nav>
    </aside>
  );
};

export default LeftBar;
