import React from "react";
import { TextField, InputAdornment, Avatar, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={onChange}
        sx={InputStyler}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="text-gray-500" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" sx={{ p: 0 }}>
                <Avatar sx={{ cursor: "pointer" }}>P</Avatar>
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

const InputStyler = {
  borderRadius: "30px",
  backgroundColor: "white",
  boxShadow: 1,
  "& .MuiOutlinedInput-root": {
    borderRadius: "30px",
    padding: "6px",
    "& input": {
      pointerEvents: "auto",
    },
  },
};

export default SearchInput;
