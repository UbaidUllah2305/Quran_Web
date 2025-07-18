// app/qiblaDirection/page.tsx
"use client";

import { useState, useEffect } from "react";
import Compass from "@/components/Compass";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      <Card className="w-full max-w-md mb-6 text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Qibla Finder</CardTitle>
          <CardDescription>Find your Qibla direction</CardDescription>
        </CardHeader>
      </Card>


      {coords ? (
        <div className="w-full max-w-md space-y-6">
          <Compass latitude={coords.latitude} longitude={coords.longitude} />
          {/* <PrayerTimes latitude={coords.latitude} longitude={coords.longitude} /> */}
        </div>
      ) : (
        <Alert variant={geoError ? "destructive" : "default"} className="max-w-md">
          <AlertDescription>
            {geoError || "Locating your position..."}
          </AlertDescription>
        </Alert>
      )}

      <footer className="mt-12 text-sm text-muted-foreground text-center">
        Islamic Tools &middot; Built for the Ummah
      </footer>
    </div>
  );
}