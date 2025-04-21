import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  MenuList,
  Popover,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../context/AuthContext";
import { useMenu } from "../../context/MenuContext";

const genreOptions = [
  "Tất cả",
  "Thời trang",
  "Ẩm thực",
  "Điện máy",
  "Nội thất",
  "Sách",
  "Thể thao",
  "Đồ chơi",
  "Sức khỏe",
  "Mỹ phẩm",
  "Du lịch",
  "Công nghệ",
  "Văn phòng phẩm",
  "Giày dép",
  "Phụ kiện",
  "Nhạc cụ",
];

const SearchInput = ({ value, onChange, placeholder }) => {
  const { handleMenuToggle } = useMenu();
  const { form, setForm, userData, isProfile } = useAuth();
  const [selectedGenre, setSelectedGenre] = useState("Tất cả");
  const [genreAnchor, setGenreAnchor] = useState(null);
  const [genreSearch, setGenreSearch] = useState("");

  const handleAvatar = () => {
    if (isProfile && userData) {
      handleMenuToggle();
    } else {
      setForm("login");
    }
  };

  const filteredGenres = genreOptions.filter((genre) =>
    genre.toLowerCase().includes(genreSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto pointer-events-auto flex gap-2 items-center">
      {/* Dropdown thể loại */}
      <div>
        <Button
          variant="outlined"
          onClick={(e) => setGenreAnchor(e.currentTarget)}
          sx={{
            height: "40px",
            textTransform: "none",
            borderRadius: "9999px",
            fontSize: "0.85rem",
            maxWidth: "150px", // giới hạn chiều rộng
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "start",
          }}
        >
          {selectedGenre}
        </Button>

        <Popover
          open={Boolean(genreAnchor)}
          anchorEl={genreAnchor}
          onClose={() => setGenreAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <div className="p-2 w-60">
            <TextField
              placeholder="Tìm thể loại..."
              value={genreSearch}
              onChange={(e) => setGenreSearch(e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: 1 }}
            />
            <MenuList dense>
              {filteredGenres.map((genre) => (
                <MenuItem
                  key={genre}
                  onClick={() => {
                    setSelectedGenre(genre);
                    setGenreAnchor(null);
                  }}
                >
                  {genre}
                </MenuItem>
              ))}
              {filteredGenres.length === 0 && (
                <MenuItem disabled>Không tìm thấy</MenuItem>
              )}
            </MenuList>
          </div>
        </Popover>
      </div>

      {/* Ô tìm kiếm */}
      <TextField
        fullWidth
        size="medium"
        placeholder={placeholder || "Tìm kiếm..."}
        value={value}
        className="flex justify-center items-center"
        onChange={onChange}
        sx={InputStyler}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{ cursor: "pointer" }}
                className="text-gray-500"
                fontSize="large"
              />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleAvatar} sx={{ padding: "0px" }}>
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
    paddingRight: "8px",
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
      padding: "14px 14px",
      fontSize: "0.9rem",
    },
  },
};

export default SearchInput;
