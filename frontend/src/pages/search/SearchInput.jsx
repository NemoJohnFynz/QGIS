import React, { useContext } from "react";
import { TextField, InputAdornment, Avatar, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../context/AuthContext";
const SearchInput = ({ value, onChange, placeholder }) => {
  const { form, setForm } = useAuth();
  return (
    <div className="w-full max-w-4xl mx-auto">
      <TextField
        fullWidth
        size="medium"
        variant="outlined"
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
                  setForm("login");
                }}
                sx={{ padding: "0px" }}
              >
                <Avatar sx={{ cursor: "pointer" }}>P</Avatar>
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};
const Radius = "9999px";
const InputStyler = {
  "& .MuiOutlinedInput-root": {
    borderRadius: Radius,
    backgroundColor: "white",
    boxShadow: 1,
    paddingRight: "12px", // tạo khoảng cách cho avatar
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
  },
};

export default SearchInput;
