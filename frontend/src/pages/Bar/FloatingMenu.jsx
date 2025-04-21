import React from "react";
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
  { icon: <Chat />, label: "Chat", key: "chat" },
  { icon: <Person />, label: "Profile", key: "profile" },
  { icon: <Group />, label: "Friend", key: "friend" },
  { icon: <LogoutIcon />, label: "Logout", key: "logout" },
];

const FloatingMenu = () => {
  const { toggleModel, openModel, handleMenuToggle, showMenu, setShowMenu } =
    useMenu();

  const handleClick = (key) => {
    if (key === "logout") {
      // Xử lý đăng xuất ở đây
      console.log("Logging out...");
      authToken.deleteToken();
      window.location.reload();
      return;
    }

    toggleModel(key);
    setShowMenu(false);
  };

  return (
    <div className="fixed top-2 right-2 flex flex-col items-end gap-2 z-50">
      <button
        onClick={handleMenuToggle}
        className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <MenuIcon />
      </button>

      <AnimatePresence>
        {showMenu &&
          menuItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 10 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-center gap-2 bg-white rounded-xl shadow-md px-6 py-4 w-56 cursor-pointer border ${
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
