import { useState, useEffect } from "react";
import L from "leaflet"; // Import Leaflet
import { useMap } from "react-leaflet"; // Import useMap hook

const iconForType = {
  Straight: "⬆",
  TurnRight: "↱",
  TurnLeft: "↰",
  SlightRight: "➡️",
  SlightLeft: "⬅️",
  SharpRight: "↪",
  SharpLeft: "↩",
  Continue: "⬇",
  UTurn: "🔄",
  Arrive: "🏁",
  Depart: "🚶",
};

function translateInstruction(instr) {
  let text = instr.text;

  text = text
    .replace("Head", "Đi về phía")
    .replace("Go straight", "Đi thẳng")
    .replace("Turn right", "Rẽ phải")
    .replace("Turn left", "Rẽ trái")
    .replace("Continue onto", "Tiếp tục vào")
    .replace("Make a U-turn", "Quay đầu")
    .replace("You have arrived", "Bạn đã đến nơi")
    .replace("onto", "vào")
    .replace("and continue", "và tiếp tục");

  return text;
}

export default function RouteInfo({ route }) {
  const [highlightedStep, setHighlightedStep] = useState(null);
  const [highlightedRoute, setHighlightedRoute] = useState(null);
  const map = useMap(); // Get the map instance

  useEffect(() => {
    if (!route || !highlightedStep || !map) return;

    // Remove previous highlighted route
    if (highlightedRoute) {
      highlightedRoute.setStyle({ color: "#38bdf8", weight: 6 });
    }

    // Get the current step
    const step = route.steps[highlightedStep];

    // Ensure latLng exists and has the expected length
    if (step && step.latLng && step.latLng.length >= 4) {
      const waypoints = [
        L.latLng(step.latLng[0], step.latLng[1]), // Start point
        L.latLng(step.latLng[2], step.latLng[3]), // End point
      ];

      // Create and add a new highlighted route
      const newRoute = L.Routing.control({
        waypoints,
        lineOptions: {
          styles: [{ color: "yellow", weight: 8 }],
        },
        addWaypoints: false,
        routeWhileDragging: false,
      }).addTo(map);

      setHighlightedRoute(newRoute);

      return () => {
        if (newRoute) {
          newRoute.remove();
        }
      };
    } else {
      console.error("LatLng not available or invalid in step", step);
    }
  }, [highlightedStep, route, map, highlightedRoute]);

  if (!route) return null;

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg max-w-sm space-y-3 text-sm">
      <h3 className="text-base font-semibold mb-1">
        📍 Lộ trình: {(route.summary.distance / 1000).toFixed(1)} km,{" "}
        {Math.round(route.summary.time / 60)} phút
      </h3>
      <ul className="space-y-1">
        {route.steps.map((step, index) => (
          <li
            key={index}
            className={`hover:bg-yellow-100 transition px-2 py-1 rounded cursor-pointer ${
              highlightedStep === index ? "bg-yellow-300" : ""
            }`}
            onMouseEnter={() => setHighlightedStep(index)}
            onMouseLeave={() => setHighlightedStep(null)}
          >
            {iconForType[step.type] || "▶"} {translateInstruction(step)} (
            {Math.round(step.distance)} m)
          </li>
        ))}
      </ul>
    </div>
  );
}
