import React, { useEffect, useState, useRef } from "react";
import { Send, MapPin, Smile, X } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { Avatar } from "@mui/material";
import { getMess, sendMess, deleteMess } from "../../service/mess";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "../../context/LocationContext";
const ChatModal = () => {
  const { userData } = useAuth();
  const { map } = useLocation();
  const { socket, isNewMess, setIsNewMess } = useSocket();
  const { toggleModel, idMess, locationShare, setLocationShare } = useMenu();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  // ✅ Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Fetch messages when idMess changes
  const fetchMessages = async () => {
    // if (!idMess) return;
    try {
      const res = await getMess(idMess);
      setMessages(res?.data || []);
    } catch (error) {
      console.error("Lỗi khi tải tin nhắn:", error);
    }
    setIsNewMess(false);
  };
  useEffect(() => {
    fetchMessages();
  }, [idMess, isNewMess]);

  const handleSend = async () => {
    if (!newMessage.trim() && !locationShare) return;

    try {
      const messageData = {
        content: newMessage,
        ...(locationShare && { location: locationShare }),
      };

      const res = await sendMess(idMess, messageData);
      fetchMessages();
      setNewMessage("");
      if (locationShare) setLocationShare(null);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-8 sm:right-8 bg-white shadow-xl rounded-2xl w-full sm:w-80 max-w-xs sm:max-w-sm md:w-96 lg:w-96 max-h-[60vh] h-auto z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Avatar />
        <h2 className="text-lg font-bold">Trò chuyện</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => toggleModel("")}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-600">Chưa có tin nhắn nào!</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg text-sm max-w-[75%] ${
                msg.sender === userData?._id
                  ? "bg-blue-100 self-end ml-auto"
                  : "bg-gray-100 self-start"
              }`}
            >
              <div>
                <div>{msg.content}</div>
                {msg.location && (
                  <button
                    onClick={() => {
                      if (map && msg.location) {
                        const [lat, lng] = msg.location.split(",").map(Number);
                        if (!isNaN(lat) && !isNaN(lng)) {
                          map.flyTo([lat, lng], 18, {
                            duration: 1.5,
                          });
                        }
                      }
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs hover:underline flex items-center gap-1 mt-1"
                  >
                    <MapPin className="w-4 h-4 inline-block" />
                    Xem trên bản đồ
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t">
        {locationShare && (
          <div className="flex items-center justify-between px-4 py-2 text-sm bg-yellow-50 border border-yellow-200 rounded-md mx-4 mb-2">
            <span>
              Đang ghim tọa độ: ({locationShare.lat}, {locationShare.lng})
            </span>
            <button
              onClick={() => setLocationShare(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-blue-500">
            <MapPin className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-yellow-500">
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            onClick={handleSend}
            className="text-blue-500 hover:text-blue-700"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
