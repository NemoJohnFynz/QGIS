import React, { useState, useEffect } from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Paper,
  Button,
  IconButton,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { X, Users, UserPlus } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { AnimatePresence, motion } from "framer-motion";
import { getUserByName } from "../../service/friend";

const friends = [
  { id: 1, name: "John Doe", avatar: "" },
  { id: 2, name: "Jane Smith", avatar: "" },
  { id: 3, name: "Alice Johnson", avatar: "" },
  { id: 4, name: "Bob Brown", avatar: "" },
];

const FriendModel = () => {
  const { toggleModel } = useMenu();
  const [tab, setTab] = useState("friends");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (tab === "users" && search.trim()) {
        try {
          const result = await getUserByName(search.trim());
          setSearchResults(result?.data || []);
        } catch (err) {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };
    fetch();
  }, [search, tab]);

  const handleFriendClick = (item) => {
    if (tab === "friends") {
      setSelectedFriend(item);
      setOpenDialog(true);
    } else {
      console.log("Gửi lời mời kết bạn tới:", item?.id);
    }
  };

  const handleAction = (action) => {
    if (action === "chat") {
      toggleModel("chat");
    } else if (action === "remove") {
      console.log("Xóa bạn:", selectedFriend?.id);
    }
    setOpenDialog(false);
  };

  const activeList = tab === "friends" ? friends : searchResults;
  const title = tab === "friends" ? "Danh sách bạn bè" : "Tìm người dùng";

  return (
    <>
      <Paper
        className="fixed bottom-5 right-5 p-0 rounded-xl w-80 shadow-xl z-50"
        sx={{
          boxShadow: 3,
          borderRadius: "15px",
          backgroundColor: "#f5f5f5",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          className="bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-3 flex items-center justify-between"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
          }}
        >
          <Typography
            variant="h6"
            className="font-semibold text-white"
            sx={{
              fontSize: "18px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              size="large"
              variant="text"
              onClick={() =>
                setTab((prev) => (prev === "friends" ? "users" : "friends"))
              }
              sx={{
                minWidth: 0,
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "none",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              {tab === "friends" ? <UserPlus size={16} /> : <Users size={16} />}
              {tab === "friends" ? "Thêm" : "Bạn bè"}
            </Button>
            <IconButton
              size="small"
              className="text-white"
              onClick={() => toggleModel("")}
            >
              <X size={20} />
            </IconButton>
          </Box>
        </Box>

        {/* Search Input */}
        {tab === "users" && (
          <Box px={2} py={1}>
            <TextField
              fullWidth
              placeholder="Nhập tên người dùng..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9999px",
                  backgroundColor: "white",
                },
                fontSize: "14px",
              }}
            />
          </Box>
        )}

        {/* Content */}
        <Box sx={{ maxHeight: "60vh", overflowY: "auto", p: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab + search}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeList.length > 0 ? (
                <List>
                  {activeList.map((item) => {
                    const fullName =
                      `${item?.firstName || ""} ${item?.lastName || ""}`.trim() ||
                      item.name;
                    return (
                      <Button
                        onClick={() => handleFriendClick(item)}
                        key={item.id + fullName}
                        sx={{
                          width: "100%",
                          justifyContent: "start",
                          textAlign: "left",
                          padding: 0,
                          borderRadius: "12px",
                          marginBottom: "8px",
                          backgroundColor: "#ffffff",
                          "&:hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                      >
                        <ListItem sx={{ padding: "8px 12px" }}>
                          <ListItemAvatar>
                            <Avatar alt={fullName} src={item.avatar || ""} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={fullName}
                            primaryTypographyProps={{
                              fontWeight: 500,
                              fontSize: "16px",
                              color: "#333",
                            }}
                          />
                          {tab === "users" && (
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                ml: 1,
                                textTransform: "none",
                                borderRadius: "8px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Kết bạn với:", item.id);
                              }}
                            >
                              Kết bạn
                            </Button>
                          )}
                        </ListItem>
                      </Button>
                    );
                  })}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="text-center py-4"
                >
                  {tab === "friends"
                    ? "Chưa có bạn bè nào."
                    : "Không tìm thấy người dùng nào."}
                </Typography>
              )}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Paper>

      {/* Friend Action Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Chọn hành động</DialogTitle>
        <DialogActions
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            px: 3,
            pb: 2,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleAction("chat")}
          >
            Nhắn tin
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => handleAction("remove")}
          >
            Xóa bạn
          </Button>
          <Button onClick={() => setOpenDialog(false)} fullWidth>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FriendModel;
