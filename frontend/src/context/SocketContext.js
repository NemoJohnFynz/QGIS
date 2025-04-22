// src/context/SocketContext.js hoặc .tsx nếu dùng TypeScript
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import authToken from "../storage/authToken";
const SOCKET_URL = "ws://localhost:3001";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isNewMess, setIsNewMess] = useState(false);
  const token = authToken.getToken();

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      // transports: ["websocket"],
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

    // Thông báo khi kết nối thành công
    socket.on("connect", () => {
      console.log(" Socket kết nối thành công:", socket.id);
    });

    socket.emit("locationUpdate", { lat: 21.0278, lng: 105.8342 });

    socket.on("userLocationChanged", (data) => {
      console.log(" Đã nhận vị trí mới:", data);
    });

    socket.on("newmessage", (data) => {
      setIsNewMess(!isNewMess);
      console.log(" Thông báo:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("userLocationChanged");
      socket.off("newmessage");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isNewMess, setIsNewMess }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
