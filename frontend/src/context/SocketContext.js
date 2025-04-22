// src/context/SocketContext.js hoặc .tsx nếu dùng TypeScript
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import authToken from "../storage/authToken";

// Backend socket URL
const SOCKET_URL = "http://localhost:3001"; // hoặc IP server nếu deploy

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const token = authToken.getToken();

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [token]);
  useEffect(() => {
    if (!socket) return;
    socket.emit("locationUpdate", { lat: 21.0278, lng: 105.8342 }); 
    socket.on("userLocationChanged", (data) => {
      console.log("Đã nhận vị trí mới:", data);
    }); 
    socket.on("all_send", (data) => {
      console.log("📩 Thông báo:", data);
    });

    return () => {
      socket.off("userLocationChanged");
      socket.off("all_send");
    };
  }, [socket]);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
