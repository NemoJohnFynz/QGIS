import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import MapIcon from "../../img/icons8-location.gif"; // Đảm bảo ảnh được import đúng
import { useLocation } from "../../context/LocationContext"; 

const RoutingMachine = ({ start, end }) => {
  const map = useMap();
  const routingControlRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const { routeTarget, setRouteTarget } = useLocation();
  useEffect(() => {
    if (!start || !end || routingControlRef.current) return;

    // Tạo icon Leaflet từ ảnh
    const customIcon = L.icon({
      iconUrl: MapIcon,
      iconSize: [32, 32], // Kích thước icon
      iconAnchor: [16, 32], // Điểm neo (góc dưới giữa)
      popupAnchor: [0, -32],
    });

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start), L.latLng(end)],
      routeWhileDragging: true,
      showAlternatives: true,
      altLineOptions: {
        styles: [{ color: "black", opacity: 0.15, weight: 9 }],
      },
      lineOptions: {
        styles: [{ color: "#2563eb", weight: 4, opacity: 1 }],
      },
      collapsible: true,
      addWaypoints: true,
      position: "bottomleft",
      createMarker: (i, wp, nWps) => {
        return L.marker(wp.latLng, {
          icon: customIcon,
        });
      },
      router: L.Routing.osrmv1({
        language: 'vi', // ⚠️ thêm dòng này để cố gắng lấy chỉ dẫn bằng tiếng Việt
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      }),
    }).addTo(map);
    
    const container = routingControl.getContainer();
    if (container) {
      const button = L.DomUtil.create("button", "leaflet-routing-button");
      button.innerHTML = "Thoát";
      L.DomUtil.addClass(button, "leaflet-bar");
      container.appendChild(button);
      button.onclick = () => {
        setRouteTarget(null);
      };
    }
    if (container) {
      L.DomUtil.addClass(container, "leaflet-routing-drag");
      const draggable = new L.Draggable(container);
      draggable.enable();

      L.DomEvent.on(container, "mousedown", L.DomEvent.stopPropagation);
      L.DomEvent.on(container, "touchstart", L.DomEvent.stopPropagation);
      L.DomEvent.on(container, "dblclick", L.DomEvent.stopPropagation);
      L.DomEvent.on(container, "wheel", L.DomEvent.stopPropagation);

      draggable.on("dragstart", () => {
        setIsDragging(true);
        L.DomUtil.addClass(container, "dragging");
      });

      draggable.on("dragend", () => {
        setIsDragging(false);
        L.DomUtil.removeClass(container, "dragging");
      });
    }

    routingControlRef.current = routingControl;

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [start, end, map]);

  return null;
};

export default RoutingMachine;
