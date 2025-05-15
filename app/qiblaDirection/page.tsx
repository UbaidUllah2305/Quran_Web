"use client";

import { useState, useEffect } from "react";
import Compass from "@/components/Compass";
import PrayerTimes from "@/components/PrayerTimes";
import HijriDate from "@/components/HijriDate";

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [geoError, setGeoError] = useState<string>("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported by browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      (err) => {
        setGeoError("Location access denied or unavailable.");
        console.error(err);
      }
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Qibla Finder & Prayer Times</h1>
        <p className="text-gray-600">Find your Qibla direction and prayer times</p>
      </div>

      <HijriDate />

      {coords ? (
        <div className="w-full max-w-md space-y-6">
          <Compass latitude={coords.latitude} longitude={coords.longitude} />
          <PrayerTimes latitude={coords.latitude} longitude={coords.longitude} />
        </div>
      ) : (
        <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-lg">
          {geoError || "Locating your position..."}
        </div>
      )}

      <footer className="mt-12 text-sm text-gray-500 text-center">
        Islamic Tools &middot; Built for the Ummah
      </footer>
    </div>
  );
}