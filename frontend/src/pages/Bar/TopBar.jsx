import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchInput from "../search/SearchInput";

const TopBar = () => {
  return (
    <>
      <div className="bg-white w-full ">
        <SearchInput />
      </div>
    </>
  );
};

export default TopBar;
