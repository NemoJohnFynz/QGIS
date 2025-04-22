import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { getLocationById } from "../../service/location";
import { getWeatherByCoordinates } from "../../service/weather";
import { useLocation } from "../../context/LocationContext";
import { Directions } from "@mui/icons-material";

const DetailLocationModal = () => {
  const { toggleModel, idStore, setLocationShare } = useMenu();
  const { chaneLocation, setChaneLocation, setRouteTarget } = useLocation();

  const [weather, setWeather] = useState(null);
  useEffect(() => {
    const fetchStore = async () => {
      if (!idStore) return;
      try {
        const res = await getLocationById(idStore);
        setChaneLocation(res.data); //  dùng context setter
      } catch (err) {
        console.error("Failed to fetch store info", err);
      }
    };
    fetchStore();
  }, [idStore, setChaneLocation]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (chaneLocation) {
        try {
          const res = await getWeatherByCoordinates(
            chaneLocation[1],
            chaneLocation[0]
          );

          setWeather(res);
        } catch (err) {
          console.error("Failed to fetch weather info:", err);
        }
      }
    };
    fetchWeather();
  }, [chaneLocation]);
  console.log(chaneLocation);
  return (
    <div className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-white shadow-xl rounded-2xl w-full sm:w-80 max-w-xs sm:max-w-sm md:w-96 lg:w-96 max-h-[70vh] h-auto z-40 flex flex-col">
      {/* Header */}
      <div className="flex flex-row w-full justify-between px-4 py-2">
        {" "}
        <button
          className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 text-left font-medium py-1 px-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
          onClick={() => {
            setRouteTarget([chaneLocation[0], chaneLocation[1]]);
            toggleModel("");
          }}
        >
          <Directions />
          <span>Chỉ đường đến đây</span>
        </button>
        <button
          onClick={() => {
            setLocationShare([chaneLocation[0], chaneLocation[1]]);
            toggleModel("friend");
          }}
          className="bg-blue-400 rounded-md p-1"
        >
          Share
        </button>
      </div>
      {/* Weather Section */}
      <div className="flex-1 overflow-y-auto p-4">
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
      </div>
    </div>
  );
};

export default DetailLocationModal;
