import React, { useState } from "react";
import { X } from "lucide-react";
import { useMenu } from "../../context/MenuContext";

const tabList = [
  {
    key: "overview",
    label: "Tổng quang",
    title: "Tổng quang",
    content:
      "Đây là tổng quan của vị trí đã chọn. Thông tin địa lý, địa danh hoặc thông tin liên quan sẽ hiển thị tại đây.",
  },
  {
    key: "reviews",
    label: "Đánh giá",
    title: "Đánh giá",
    content:
      "Các đánh giá của người dùng hoặc dữ liệu phản hồi về vị trí sẽ hiển thị ở đây.",
  },
  {
    key: "introduction",
    label: "Giới thiệu",
    title: "Giới thiệu",
    content:
      "Một phần giới thiệu ngắn gọn về khu vực, lịch sử hoặc đặc điểm nổi bật.",
  },
];

const LocationModal = () => {
  const { toggleModel } = useMenu();
  const [activeTab, setActiveTab] = useState("overview");

  const currentTab = tabList.find((tab) => tab.key === activeTab);

  return (
    <div className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-white shadow-xl rounded-2xl w-full sm:w-80 max-w-xs sm:max-w-sm md:w-96 lg:w-96 max-h-[60vh] h-auto z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Thông tin vị trí</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => toggleModel("")}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-between px-4 py-2 border-b text-sm font-medium text-gray-600">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 py-1 text-center ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : ""
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-700">
        {currentTab && (
          <div>
            <h3 className="font-semibold text-base mb-2">{currentTab.title}</h3>
            <p>{currentTab.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationModal;
