import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { getLocationById } from "../../service/location";
import { getWeatherByCoordinates } from "../../service/weather";
import { useAuth } from "../../context/AuthContext";
import { Avatar, ButtonBase } from "@mui/material";
import { Directions } from "@mui/icons-material";
import { useLocation } from "../../context/LocationContext";
import { commentStore, getCommentStore } from "../../service/location";
import UpdateLocationModal from "./UpdateLocationModal";
import { toast } from "react-toastify";
const tabList = [
  { key: "overview", label: "Tổng quan" },
  { key: "reviews", label: "Đánh giá" },
  { key: "introduction", label: "Giới thiệu" },
  { key: "weather", label: "Thời tiết" },
];

const LocationModal = () => {
  const { toggleModel, idStore, locationShare, setLocationShare } = useMenu();
  const [activeTab, setActiveTab] = useState("overview");
  const [storeData, setStoreData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [weather, setWeather] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { userData } = useAuth();
  const [newReview, setNewReview] = useState({
    user: userData?._id,
    location: storeData?._id,
    rating: 5,
    comment: "",
  });
  const { setRouteTarget } = useLocation();

  useEffect(() => {
    const fetchStore = async () => {
      if (!idStore) return;
      try {
        const res = await getLocationById(idStore);
        setStoreData(res.data);
      } catch (err) {
        console.error("Failed to fetch store info", err);
      }
    };
    fetchStore();
  }, [idStore]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (storeData?.location?.coordinates) {
        try {
          const res = await getWeatherByCoordinates(
            storeData.location.coordinates[0],
            storeData.location.coordinates[1]
          );
          setWeather(res);
        } catch (err) {
          console.error("Failed to fetch weather info:", err);
        }
      }
    };
    fetchWeather();
  }, [storeData]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!idStore) return;
      try {
        const res = await getCommentStore(idStore);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchReviews();
  }, [idStore]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment) {
      toast.info("Vui lòng nhập nội dung đánh giá.");
      return;
    }
    if (!userData?._id || !storeData?._id) {
      toast.error("người dùng thiếu sót");
    }
    const reviewToSubmit = {
      user: userData?._id,
      location: storeData?._id,
      rating: newReview.rating,
      comment: newReview.comment,
    };

    try {
      await commentStore(idStore, reviewToSubmit);
      setNewReview({ rating: 5, comment: "" }); // Reset form
      toast.success("Đánh giá của bạn đã được gửi.");

      // Re-fetch reviews after submitting
      const res = await getCommentStore(idStore);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to submit review", err);
      toast.error("Đã có lỗi xảy ra khi gửi đánh giá.");
    }
  };

  const renderTabContent = () => {
    if (!storeData) return <p>Đang tải...</p>;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{storeData.name}</h3>
            <p>
              <strong>Địa chỉ:</strong> {storeData.address}
            </p>
            <p>
              <strong>Danh mục:</strong> {storeData.categories}
            </p>
            <p>
              <strong>Liên hệ:</strong> {storeData.contact?.phone}
            </p>
            <p>
              <strong>Website:</strong>
              <a
                href={`https://${storeData.contact?.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                {storeData.contact?.website}
              </a>
            </p>
            <p className="mt-2 font-semibold">Giờ mở cửa:</p>
            <ul className="list-disc list-inside">
              {storeData.openingHours?.map((day) => (
                <li key={day._id}>
                  {day.day}:{" "}
                  {day.isClosed ? "Đóng cửa" : `${day.open}h - ${day.close}h`}
                </li>
              ))}
            </ul>
          </div>
        );
      case "reviews":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Đánh giá</h3>

            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div
                  key={index}
                  className="border  relative border-gray-200 p-1 rounded-md shadow-sm bg-white"
                >
                  <div className="flex items-center justify-between mb-1  p-3 pb-0">
                    <div className="flex flex-col">
                      <div className="flex flex-row items-center gap-2">
                        <Avatar className="w-12 h-12" alt="" />
                        <p className="font-medium text-gray-800">
                          {review?.user?.firstName + review?.user?.lastName}
                        </p>
                      </div>
                      <p className="text-yellow-500 text-sm absolute top-1 right-1">
                        {" "}
                        <span className="text-gray-300 text-xs">
                          ({review.rating}/5)
                        </span>
                        {"⭐".repeat(review.rating)}{" "}
                      </p>{" "}
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
            )}

            {userData && (
              <div className="mt-6">
                <h4 className="font-semibold text-base mb-2">
                  Để lại đánh giá của bạn:
                </h4>
                <textarea
                  name="comment"
                  value={newReview.comment}
                  onChange={handleReviewChange}
                  rows="4"
                  className="w-full border border-gray-300 p-3 rounded-md resize-none focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  placeholder="Chia sẻ cảm nhận của bạn..."
                />
                <div className="mt-3 flex items-center space-x-2">
                  <label htmlFor="rating" className="text-sm font-medium">
                    Đánh giá:
                  </label>
                  <select
                    name="rating"
                    value={newReview.rating}
                    onChange={handleReviewChange}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-300"
                  >
                    <option value={1}>1 sao</option>
                    <option value={2}>2 sao</option>
                    <option value={3}>3 sao</option>
                    <option value={4}>4 sao</option>
                    <option value={5}>5 sao</option>
                  </select>
                </div>
                <div className="w-full flex justify-center">
                  <button
                    onClick={handleSubmitReview}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-150 text-sm"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case "weather":
        return (
          <div className="space-y-2">
            {weather ? (
              <div className="p-4 bg-blue-50 rounded-md shadow-sm">
                <p className="font-medium">Thời tiết hiện tại:</p>
                <p>Nhiệt độ: {weather.main.temp}°C</p>
                <p>Mô tả: {weather.weather[0].description}</p>
                <p>Độ ẩm: {weather.main.humidity}%</p>
              </div>
            ) : (
              <p>Không thể tải thông tin thời tiết.</p>
            )}
          </div>
        );
      case "introduction":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Giới thiệu</h3>
            <p>{storeData.description}</p>
            <div className="grid grid-cols-2 gap-2">
              {storeData.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`img-${idx}`}
                  className="w-full h-24 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-white shadow-xl rounded-2xl w-full sm:w-80 max-w-xs sm:max-w-sm md:w-96 lg:w-96 max-h-[70vh] h-auto z-40 flex flex-col">
      <div className="flex flex-row w-full justify-between px-4 py-2">
        {" "}
        <button
          className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 text-left font-medium py-1 px-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
          onClick={() => {
            setRouteTarget([
              storeData?.location?.coordinates[1],
              storeData?.location?.coordinates[0],
            ]);
            toggleModel("");
          }}
        >
          <Directions /> {/* MUI Icon for directions */}
          <span>Chỉ đường đến đây</span>
        </button>
        <button
          onClick={() => {
            setLocationShare([
              storeData?.location?.coordinates[1],
              storeData?.location?.coordinates[0],
            ]);
            toggleModel("friend");
          }}
          className="bg-blue-400 rounded-md p-1"
        >
          Share
        </button>
      </div>
      <div className="flex items-center justify-between p-4 pt-0 border-b">
        <h2 className="text-lg font-bold">Thông tin vị trí</h2>
        <div className="flex items-center gap-2">
          {userData && userData.role && (
            <button
              className="text-blue-600 hover:underline text-sm"
              onClick={() => setShowEditModal(true)}
            >
              Chỉnh sửa
            </button>
          )}
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => toggleModel("")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex justify-between px-4 py-2 border-b text-sm font-medium text-gray-600">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 py-2 text-center ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "hover:text-blue-600"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4">{renderTabContent()}</div>
      {showEditModal && storeData && (
        <UpdateLocationModal
          open={true}
          locationData={storeData}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default LocationModal;
