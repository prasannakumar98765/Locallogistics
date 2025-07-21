import { useEffect } from "react";
import socket from "../socket";

const trackRealLocation = (execId) => {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by this browser.");
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
    },
    (error) => {
      console.error("Error getting location:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );

  // Optional: Clear watch when needed
  return () => navigator.geolocation.clearWatch(watchId);
};

const RealLocationTracker = () => {
  useEffect(() => {
    const EXEC_ID = " ";

    const stopTracking = trackRealLocation(EXEC_ID);

    return () => {
      if (stopTracking) stopTracking(); // Clean up on unmount
    };
  }, []);

  return <div>Tracking real GPS location...</div>;
};

export default RealLocationTracker;
