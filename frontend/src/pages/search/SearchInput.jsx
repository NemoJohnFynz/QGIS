import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  ButtonBase,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, Chat, Person } from "@mui/icons-material";
import { useMenu } from "../../context/MenuContext";

const menuItems = [
  { icon: <Chat />, label: "Chat" },
  { icon: <Person />, label: "Profile" },
];

const SearchInput = ({ value, onChange, placeholder }) => {
  const { handleMenuToggle } = useMenu();
  const { form, setForm, userData, isProfile } = useAuth();
  const handleAvatar = () => {
    if (isProfile && userData) {
      handleMenuToggle();
    } else {
      setForm("login");
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto pointer-events-auto">
      <TextField
        fullWidth
        size="medium"
        placeholder={placeholder || "Search..."}
        value={value}
        className="flex justify-center items-center"
        onChange={onChange}
        sx={InputStyler}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{ cursor: "pointer" }}
                className="text-gray-500 "
                fontSize="large"
              />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  handleAvatar();
                }}
                sx={{ padding: "0px" }}
              >
                {isProfile && userData ? (
                  <Avatar sx={{ cursor: "pointer" }}>P</Avatar>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleAvatar}
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      fontSize: "0.8rem",
                      padding: "2px 12px",
                      height: "32px",
                      color: "#1976d2",
                      borderColor: "#1976d2",
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                        borderColor: "#1976d2",
                      },
                    }}
                  >
                    Login
                  </Button>
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};
const Radius = "9999px";
/** @type {React.CSSProperties} */
const InputStyler = {
  "& .MuiOutlinedInput-root": {
    borderRadius: Radius,
    backgroundColor: "white",
    boxShadow: 1,
    paddingRight: "8px", // tạo khoảng cách cho avatar
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px white inset",
      WebkitTextFillColor: "#000",
      transition: "background-color 5000s ease-in-out 0s",
    },
    "& .MuiInputBase-input": {
      padding: "14px 14px", // hoặc 4px nếu muốn nhỏ hơn
      fontSize: "0.9rem", // tuỳ chọn nếu muốn chữ nhỏ lại
    },
  },
};

export default SearchInput;
