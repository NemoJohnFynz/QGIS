import { useMapEvents } from "react-leaflet";
import { useLocation } from "../../context/LocationContext";

const LocationSetter = () => {
  const { setChaneLocation } = useLocation();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setChaneLocation([lat, lng]);
    },
  });

  return null;
};
export default LocationSetter;
