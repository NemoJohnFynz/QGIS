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
  Tabs,
  Tab,
} from "@mui/material";
import { X, Users, UserPlus, UserX2 } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  getUserByName,
  addFriend,
  unFriend,
  getMyFriend,
  getMyFriendRequest,
  acceptFriend,
  rejectFriend,
} from "../../service/friend";
import { toast } from "react-toastify";

const FriendModel = () => {
  const { toggleModel } = useMenu();
  const [tabIndex, setTabIndex] = useState(0); // 0: Friends, 1: Find Users, 2: Friend Requests
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const currentTab = ["friends", "users", "requests"][tabIndex];

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await getMyFriend();
        setFriendList(response?.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bạn bè:", error);
        toast.error("Lỗi khi tải danh sách bạn bè.");
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const response = await getMyFriendRequest();
        console.log("dd", response);
        setFriendRequests(response?.data || []);
      } catch (error) {
        console.error("Lỗi khi tải yêu cầu kết bạn:", error);
        toast.error("Lỗi khi tải yêu cầu kết bạn.");
      }
    };

    fetchFriends();
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const fetchUsersByName = async () => {
      if (currentTab === "users" && search.trim()) {
        try {
          const result = await getUserByName(search.trim());
          setSearchResults(result?.data || []);
        } catch (err) {
          console.error("Lỗi khi tìm kiếm người dùng:", err);
          setSearchResults([]);
          toast.error("Lỗi khi tìm kiếm người dùng.");
        }
      } else {
        setSearchResults([]);
      }
    };
    fetchUsersByName();
  }, [search, currentTab]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setSearch(""); // Reset search khi chuyển tab
  };

  const handleFriendClick = (item) => {
    if (currentTab === "friends") {
      setSelectedFriend(item);
      setOpenDialog(true);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await addFriend(userId);
      toast.success("Đã gửi lời mời kết bạn.");
      // Có thể cập nhật lại danh sách tìm kiếm để ẩn người đã gửi lời mời
    } catch (error) {
      console.error("Lỗi khi gửi lời mời kết bạn:", error);
      toast.error("Không thể gửi lời mời kết bạn.");
    }
  };

  const handleUnfriend = async (friendId) => {
    try {
      await unFriend(friendId);
      toast.success("Đã hủy kết bạn.");
      setFriendList(friendList.filter((friend) => friend._id !== friendId));
      setOpenDialog(false);
    } catch (error) {
      console.error("Lỗi khi hủy kết bạn:", error);
      toast.error("Không thể hủy kết bạn.");
    }
  };

  const handleAcceptFriend = async (requestId) => {
    console.log(requestId);
    try {
      await acceptFriend(requestId);
      toast.success("Đã chấp nhận lời mời kết bạn.");
      // Cập nhật lại danh sách bạn bè và yêu cầu kết bạn
      const updatedRequests = friendRequests.filter(
        (req) => req._id !== requestId
      );
      setFriendRequests(updatedRequests);
      // Có thể cần gọi lại API getMyFriend để cập nhật danh sách bạn bè
    } catch (error) {
      console.error("Lỗi khi chấp nhận lời mời:", error);
      toast.error("Không thể chấp nhận lời mời kết bạn.");
    }
  };

  const handleRejectFriend = async (requestId) => {
    try {
      await rejectFriend(requestId);
      toast.success("Đã từ chối lời mời kết bạn.");
      setFriendRequests(friendRequests.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Lỗi khi từ chối lời mời:", error);
      toast.error("Không thể từ chối lời mời kết bạn.");
    }
  };

  const handleAction = (action) => {
    if (action === "chat") {
      toggleModel("chat");
    } else if (action === "remove") {
      if (selectedFriend?._id) {
        handleUnfriend(selectedFriend._id);
      }
    }
    setOpenDialog(false);
  };

  const activeList =
    currentTab === "friends"
      ? friendList
      : currentTab === "users"
        ? searchResults
        : friendRequests;

  const title =
    currentTab === "friends"
      ? "Danh sách bạn bè"
      : currentTab === "users"
        ? "Tìm người dùng"
        : "Yêu cầu kết bạn";

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

          <IconButton
            size="small"
            className="text-white"
            onClick={() => toggleModel("")}
          >
            <X size={20} />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="friend tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Bạn bè" icon={<Users size={16} />} />
          <Tab label="Thêm bạn" icon={<UserPlus size={16} />} />
          <Tab label="Yêu cầu" icon={<UserX2 size={16} />} />
        </Tabs>

        {/* Search Input */}
        {currentTab === "users" && (
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
              key={currentTab + search}
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
                      <ListItem
                        key={item._id + fullName}
                        sx={{
                          padding: "8px 12px",
                          borderRadius: "12px",
                          marginBottom: "8px",
                          backgroundColor: "#ffffff",
                          "&:hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                      >
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
                        {currentTab === "users" && (
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              ml: 1,
                              textTransform: "none",
                              borderRadius: "8px",
                            }}
                            onClick={() => handleAddFriend(item._id)}
                          >
                            Kết bạn
                          </Button>
                        )}
                        {currentTab === "requests" && (
                          <Box>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                ml: 1,
                                textTransform: "none",
                                borderRadius: "8px",
                              }}
                              onClick={() => handleAcceptFriend(item._id)}
                            >
                              Đồng ý
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              sx={{
                                ml: 1,
                                textTransform: "none",
                                borderRadius: "8px",
                              }}
                              onClick={() => handleRejectFriend(item._id)}
                            >
                              Từ chối
                            </Button>
                          </Box>
                        )}
                        {currentTab === "friends" && (
                          <Button onClick={() => handleFriendClick(item)} />
                        )}
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="text-center py-4"
                >
                  {currentTab === "friends"
                    ? "Chưa có bạn bè nào."
                    : currentTab === "users"
                      ? "Không tìm thấy người dùng nào."
                      : "Không có yêu cầu kết bạn mới."}
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
