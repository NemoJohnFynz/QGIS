import React, { useEffect, useRef } from "react";
import {
  Menu as MenuIcon,
  Chat,
  Person,
  Group,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useMenu } from "../../context/MenuContext";
import authToken from "../../storage/authToken";

const menuItems = [
  { icon: <Chat />, label: "Trò chuyện", key: "chat" },
  { icon: <Person />, label: "Bản thân", key: "profile" },
  { icon: <Group />, label: "Bạn bè", key: "friend" },
  { icon: <LogoutIcon />, label: "Đăng xuất", key: "logout" },
];

const FloatingMenu = () => {
  const { toggleModel, openModel, handleMenuToggle, showMenu, setShowMenu } = useMenu();
  const menuRef = useRef(null);

  const handleClick = (key) => {
    if (key === "logout") {
      console.log("Logging out...");
      authToken.deleteToken();
      window.location.reload();
      return;
    }

    toggleModel(key);
    setShowMenu(false);
  };

  // 👇 Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showMenu, setShowMenu]);

  return (
    <div className="fixed top-16 right-2 z-50 pointer-events-none space-y-1" ref={menuRef}>
      <AnimatePresence>
        {showMenu &&
          menuItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 10 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-center gap-2 bg-white rounded-xl shadow-md px-6 py-4 w-56 cursor-pointer border pointer-events-auto ${
                openModel === item.key ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handleClick(item.key)}
            >
              <div className="text-blue-600">{item.icon}</div>
              <span className="text-xl font-medium">{item.label}</span>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingMenu;
