import React from "react";
import {
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <TextField
        fullWidth
        size="medium"
        variant="outlined"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={onChange}
        sx={InputStyler}
        className="hover:bg-blue-50"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="text-gray-500 " fontSize="large" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <Avatar sx={{ cursor: "pointer" }}>P</Avatar>
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};
const Radius = "34px";
const InputStyler = {
  borderRadius: Radius,
  backgroundColor: "white",
  boxShadow: 1,
  "& .MuiOutlinedInput-root": {
    borderRadius: Radius,
    padding: "0px 2px 0px 10px",
    "& input": {
      pointerEvents: "auto",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent", // hoặc "gray" nếu muốn nhạt đi
    boxShadow: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent", // mặc định
  },
};

export default SearchInput;
