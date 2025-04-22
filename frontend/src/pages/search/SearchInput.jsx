import React, { useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Button,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../context/AuthContext";
import { useMenu } from "../../context/MenuContext";
import { getCategory } from "../../service/category";
import { useLocation } from "../../context/LocationContext";
import { useNavigate } from "react-router-dom";

const SearchInput = ({ value, onChange, placeholder }) => {
  const { stores, map } = useLocation();
  const { handleMenuToggle } = useMenu();
  const { form, setForm, userData, isProfile } = useAuth();

  const [selectedGenre, setSelectedGenre] = useState("Tất cả");
  const [genreAnchor, setGenreAnchor] = useState(null);
  const [isShowResult, setIsShowResult] = useState(false);
  const [searchResult, setSearchResult] = useState("");
  const [genreSearch, setGenreSearch] = useState("");
  const [genreOptions, setGenreOptions] = useState([]);
  const [locations, setLocations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategory();
        if (response?.data) {
          const genres = response.data.map((item) => item.name);
          setGenreOptions(["Tất cả", ...genres]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (stores) setLocations(stores);
  }, [stores]);

  useEffect(() => {
    if (searchResult.trim() !== "") {
      setIsShowResult(true);
    }
  }, [searchResult]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-wrapper")) {
        setIsShowResult(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatar = () => {
    if (isProfile && userData) {
      handleMenuToggle();
    } else {
      setForm("login");
    }
  };

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchResult(text);
    onChange?.(e);
  };

  const filteredGenres = genreOptions.filter((genre) =>
    genre.toLowerCase().includes(genreSearch.toLowerCase())
  );

  const filteredLocations = locations.filter((loc) => {
    const name = loc?.name || "";
    const category = Array.isArray(loc?.categories)
      ? loc.categories
      : [loc?.categories];
    const searchValue = searchResult?.toLowerCase?.() || "";

    const matchesName = name.toLowerCase().includes(searchValue);
    const matchesCategory =
      selectedGenre === "Tất cả" || category.includes(selectedGenre);

    return matchesName && matchesCategory;
  });

  return (
    <div className="w-full max-w-4xl mx-auto pointer-events-auto flex flex-col gap-2 relative search-wrapper">
      <div className="flex gap-2 items-center">
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
              maxWidth: "80px",
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
            onClose={() => {
              setGenreAnchor(null);
              setGenreSearch("");
            }}
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
                      setIsShowResult(true);
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
          value={searchResult}
          onChange={handleSearchChange}
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
                      đăng nhập
                    </Button>
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      {/* Kết quả tìm kiếm */}
      {isShowResult && searchResult && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-xl max-h-80 overflow-auto z-50">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc) => (
              <div
                key={loc._id}
                onClick={() => {
                  setIsShowResult(false);
                  navigate(`/`);
                  console.log(loc);
                  if (
                    map &&
                    loc.location?.coordinates[1] &&
                    loc.location?.coordinates[0]
                  ) { 
                    map.flyTo(
                      [
                        loc.location?.coordinates[1],
                        loc.location?.coordinates[0],
                      ],
                      18,
                      {
                        duration: 1.5,
                      }
                    );
                  }
                }}
                className="p-3 border-b hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{loc.name}</div>
                  <div className="text-sm text-gray-500">{loc.address}</div>
                  <div className="text-xs text-gray-400">
                    {Array.isArray(loc.categories)
                      ? loc.categories.join(", ")
                      : loc.categories}
                  </div>
                </div>
                {loc.images && loc.images.length > 0 && (
                  <img
                    src={loc.images[0]}
                    alt={loc.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-sm text-center">
              Không tìm thấy kết quả phù hợp
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Radius = "9999px";

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
