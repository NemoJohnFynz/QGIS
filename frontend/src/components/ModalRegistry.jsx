import React, { useEffect, useRef } from "react";
import { useMenu } from "../context/MenuContext";

// Load tất cả modal trong /pages/menu
const modalsContext = require.context("../pages/menu/", false, /\.jsx$/);

const modalComponents = modalsContext.keys().reduce((acc, path) => {
  const fileName = path.replace("./", ""); // "ProfileModal.jsx"
  const key = fileName.replace("Modal.jsx", "").toLowerCase(); // "profile"
  acc[key] = modalsContext(path).default;
  return acc;
}, {});

const ModalRegistry = () => {
  const { openModel, setOpenModel } = useMenu();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpenModel(null); // Tắt modal nếu click ra ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenModel]);

  if (!openModel || !modalComponents[openModel]) return null;

  const SelectedModal = modalComponents[openModel];

  return (
    // <div className="fixed inset-0 z-40 bg-blue-200">
    //   <div ref={modalRef}>
    <SelectedModal />
    //   </div>
    // </div>
  );
};

export default ModalRegistry;
