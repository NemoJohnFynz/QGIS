import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const DynamicRouteProgress = ({ routeLine, currentPos }) => {
  const map = useMap();
  const [polylines, setPolylines] = useState({});

  useEffect(() => {
    if (!routeLine || !currentPos) return;

    // Tìm điểm gần currentPos nhất trong routeLine
    let closestIndex = 0;
    let minDist = Infinity;
    routeLine.forEach((point, index) => {
      const dist = map.distance(point, currentPos);
      if (dist < minDist) {
        closestIndex = index;
        minDist = dist;
      }
    });

    const pastSegment = routeLine.slice(0, closestIndex + 1);
    const futureSegment = routeLine.slice(closestIndex);

    // Xóa polyline cũ nếu có
    if (polylines.past) map.removeLayer(polylines.past);
    if (polylines.future) map.removeLayer(polylines.future);

    const past = L.polyline(pastSegment, {
      color: "gray",
      weight: 5,
      opacity: 0.4,
    }).addTo(map);
    const future = L.polyline(futureSegment, {
      color: "#2563eb",
      weight: 5,
      opacity: 1,
    }).addTo(map);

    setPolylines({ past, future });

    return () => {
      map.removeLayer(past);
      map.removeLayer(future);
    };
  }, [routeLine, currentPos, map]);

  return null;
};
export default DynamicRouteProgress;
