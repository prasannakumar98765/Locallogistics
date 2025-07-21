import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import socket from "../socket";

const ExecutiveTracker = () => {
  const [searchParams] = useSearchParams();
  const execId = searchParams.get("eid");
  const [status, setStatus] = useState("⏳ Waiting for GPS permission...");

  useEffect(() => {
    if (!execId) {
      setStatus("❌ Missing executive ID in URL");
      return;
    }

    if (!navigator.geolocation) {
      setStatus("❌ Geolocation not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        socket.emit("locationUpdate", {
          executiveId: execId,
          lat: latitude,
          lan: longitude,
        });

        console.log("📡 Sent real location:", { executiveId: execId, latitude, longitude });
        setStatus("✅ Sharing location with admin...");
      },
      (error) => {
        console.error("Error getting location:", error);
        setStatus("❌ Location permission denied or error occurred.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [execId]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>📍 Executive Location Tracker</h2>
      <p>{status}</p>
    </div>
  );
};

export default ExecutiveTracker;
