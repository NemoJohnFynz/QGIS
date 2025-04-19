import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchInput from "../search/SearchInput";

const TopBar = () => {
  return (
    <>
      <div
        className="absolute w-full z-50 pointer-events-none" // Ensure it's interactive but won't block others
        style={{ top: 0 }}
      >
        <div className="p-2">
          <SearchInput />
        </div>
      </div>
    </>
  );
};

export default TopBar;
