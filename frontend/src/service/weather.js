import axios from "axios";

const API_KEY = "165d3ba917ca9c9d8de93def5cb00ac3";
export const getWeatherByCoordinates = async (lon, lat) => {
  try {
    console.log("Requesting weather data...", API_KEY);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=vi&appid=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching weather data:",
      error.response?.data || error.message
    );
    throw error;
  }
};
