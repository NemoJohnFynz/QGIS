// context/MenuContext.jsx
import React, { createContext, useContext, useState } from "react";
import FloatingMenu from "../pages/Bar/FloatingMenu";
import ModalRegistry from "../components/ModalRegistry";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [openModel, setOpenModel] = useState(null);
  const [locationShare, setLocationShare] = useState(null);
  const [showMenu, setShowMenu] = useState(false); // NEW: state để bật/tắt menu list
  const [idStore, setIdStore] = useState(null); // NEW: state để bật/tắt menu list
  const [idMess, setIdMess] = useState(null); // NEW: state để bật/tắt menu list
  const toggleModel = (modelName) => {
    setOpenModel((prev) => (prev === modelName ? null : modelName));
  };
  const handleMenuToggle = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    <MenuContext.Provider
      value={{
        openModel,
        setOpenModel,
        toggleModel,
        handleMenuToggle,
        showMenu,
        setShowMenu,
        idStore,
        setIdStore,
        idMess,
        setIdMess,
        locationShare,
        setLocationShare,
      }}
    >
      {children}
      <FloatingMenu />
      <ModalRegistry />
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
