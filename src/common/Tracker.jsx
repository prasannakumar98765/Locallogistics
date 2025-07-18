import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import socket from "../socket";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapView = () => {
  const [executives, setExecutives] = useState({});

  useEffect(() => {
  socket.on("executiveLocationUpdated", (data) => {
    console.log("📍 Live update received:", data); // ✅ Add this

    setExecutives((prev) => ({
      ...prev,
      [data.executiveId]: {
        ...prev[data.executiveId],
        ...data,
      lastUpdated: new Date().toISOString(),
            
      },
    }));
  });


    fetch("http://localhost:8000/api/delivery/executives")
      .then((res) => res.json())
      .then((data) => {
        const execMap = {};
        data.forEach((exec) => {
          execMap[exec._id] = {
            ...exec,
            lastUpdated: new Date(exec.lastUpdated).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };
        });
        setExecutives(execMap);
      });

    return () => {
      socket.off("executiveLocationUpdated");
    };
  }, []);

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.values(executives).map((exec) =>
  exec.currentLocation?.lat && exec.currentLocation?.lan ? (
   <Marker
  key={`${exec._id}-${exec.lastUpdated}`} // ✅ Unique key to force re-render
  position={[exec.currentLocation.lat, exec.currentLocation.lan]}
>
      <Popup>
        <strong>{exec.name}</strong> <br />
        Status: {exec.status} <br />
        Updated at: {exec.lastUpdated}
      </Popup>
    </Marker>
  ) : null
)}
    </MapContainer>
  );
};

export default MapView;
