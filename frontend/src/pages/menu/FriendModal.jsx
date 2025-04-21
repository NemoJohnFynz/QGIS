import React, { useState } from "react";
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
} from "@mui/material";
import { X, Users, UserPlus } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { AnimatePresence, motion } from "framer-motion";

// Sample data for friends and users
const friends = [
  { id: 1, name: "John Doe", avatar: "" },
  { id: 2, name: "Jane Smith", avatar: "" },
  { id: 3, name: "Alice Johnson", avatar: "" },
  { id: 4, name: "Bob Brown", avatar: "" },
];

const users = [
  { id: 101, name: "Luffy", avatar: "" },
  { id: 102, name: "Zoro", avatar: "" },
  { id: 103, name: "Nami", avatar: "" },
];

const FriendModel = () => {
  const { toggleModel } = useMenu();
  const [tab, setTab] = useState("friends");

  // Determine the active list and the title based on the selected tab
  const activeList = tab === "friends" ? friends : users;
  const title = tab === "friends" ? "Danh sách bạn bè" : "Tìm người dùng";

  return (
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              className="font-semibold text-white"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "18px",
              }}
            >
              {title}
            </Typography>
          </motion.div>
        </Box>

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
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            {tab === "friends" ? <UserPlus size={16} /> : <Users size={16} />}
            {tab === "friends" ? "Thêm  " : "Bạn bè"}
          </Button>
          <IconButton
            size="small"
            className="text-white hover:text-gray-200"
            onClick={() => toggleModel("")}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ maxHeight: "60vh", overflowY: "auto", p: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeList.length > 0 ? (
              <List>
                {activeList.map((item) => (
                  <Button
                    key={item.id + item.name}
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
                        <Avatar alt={item.name} src={item.avatar || ""} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "#333",
                        }}
                      />
                    </ListItem>
                  </Button>
                ))}
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
  );
};

export default FriendModel;
