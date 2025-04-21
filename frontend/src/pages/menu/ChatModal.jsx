import React from "react";
import { Send, MapPin, Smile, X } from "lucide-react";

const ChatModal = () => {
  return (
    <div className="fixed bottom-0 right-0 sm:bottom-8 sm:right-8 bg-white shadow-xl rounded-2xl w-full sm:w-80 max-w-xs sm:max-w-sm md:w-96 lg:w-96 max-h-[60vh] h-auto z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Trò chuyện</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-sm text-gray-600">
          Đây là khu vực hiển thị tin nhắn!
        </p>
      </div>

      {/* Input area */}
      <div className="p-3 border-t">
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
            className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button className="text-blue-500 hover:text-blue-700">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
