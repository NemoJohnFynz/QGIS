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
import { X } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
const friends = [
  { id: 1, name: "John Doe", avatar: "" },
  { id: 2, name: "Jane Smith", avatar: "" },
  { id: 3, name: "Alice Johnson", avatar: "" },
  { id: 4, name: "Bob Brown", avatar: "" },
  { id: 5, name: "Charlie Green", avatar: "" },
  { id: 6, name: "Daisy White", avatar: "" },
  { id: 1, name: "John Doe", avatar: "" },
  { id: 2, name: "Jane Smith", avatar: "" },
  { id: 3, name: "Alice Johnson", avatar: "" },
  { id: 4, name: "Bob Brown", avatar: "" },
  { id: 5, name: "Charlie Green", avatar: "" },
  { id: 6, name: "Daisy White", avatar: "" },
];

const FriendModel = () => {
  const { toggleModel } = useMenu();
  return (
    <Paper
      className="fixed bottom-5 right-5 p-0 rounded-xl w-80 z-50 shadow-xl"
      sx={{ boxShadow: 3 }}
    >
      {/* Sticky Header */}
      <Box
        className="bg-white border-b px-4 py-3 flex items-center justify-between"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      >
        <Typography variant="h6" className="font-semibold text-gray-800">
          Danh sách bạn bè
        </Typography>
        <IconButton
          size="small"
          className="text-gray-500 hover:text-gray-700"
          onClick={() => toggleModel("")} //daaaaaaaaaaaaaaaaaaaaaaa
        >
          <X size={20} />
        </IconButton>
      </Box>

      {/* Scrollable Friend List */}
      <Box sx={{ maxHeight: "60vh", overflowY: "auto", p: 1 }}>
        {friends.length > 0 ? (
          <List>
            {friends.map((friend) => (
              <Button
                key={friend.id + friend.name}
                sx={{
                  width: "100%",
                  justifyContent: "start",
                  textAlign: "left",
                  padding: 0,
                  borderRadius: "8px",
                  marginBottom: "8px",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={friend.name} src={friend.avatar || ""} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={friend.name}
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
            Chưa có bạn bè nào.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default FriendModel;
