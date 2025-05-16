// components/Compass.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

interface CompassProps {
  latitude: number;
  longitude: number;
}

function calculateQiblaBearing(lat: number, lon: number): number {
  const phi = (lat * Math.PI) / 180;
  const lambda = (lon * Math.PI) / 180;
  const phiK = (KAABA_LAT * Math.PI) / 180;
  const lambdaK = (KAABA_LON * Math.PI) / 180;

  const y = Math.sin(lambdaK - lambda);
  const x =
    Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;
  return bearing;
}

declare global {
  interface Window {
    DeviceOrientationEvent?: any;
  }
}

export default function Compass({ latitude, longitude }: CompassProps) {
  const [heading, setHeading] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [supported, setSupported] = useState(true);

  const qibla = calculateQiblaBearing(latitude, longitude);

  const handleOrientation = useCallback((event: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
    if (typeof event.webkitCompassHeading === "number") {
      setHeading(event.webkitCompassHeading);
    }
    else if (event.absolute === true && typeof event.alpha === "number") {
      setHeading(360 - event.alpha);
    }
    else if (typeof event.alpha === "number") {
      setHeading(360 - event.alpha);
    }
  }, []);

  const enableCompass = async () => {
    try {
      if (
        typeof window !== "undefined" &&
        window.DeviceOrientationEvent &&
        typeof window.DeviceOrientationEvent.requestPermission === "function"
      ) {
        const res = await window.DeviceOrientationEvent.requestPermission();
        if (res === "granted") {
          setPermissionGranted(true);
        }
      }
    } catch (err) {
      setSupported(false);
    }
  };

  useEffect(() => {
    let handler: any;
    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      if (
        typeof window.DeviceOrientationEvent.requestPermission === "function"
      ) {
        if (permissionGranted) {
          handler = (e: any) => handleOrientation(e);
          window.addEventListener("deviceorientation", handler, true);
        }
      } else {
        handler = (e: any) => handleOrientation(e);
        window.addEventListener("deviceorientationabsolute", handler, true);
        window.addEventListener("deviceorientation", handler, true);
      }
    } else {
      setSupported(false);
    }
    return () => {
      if (handler) {
        window.removeEventListener("deviceorientation", handler, true);
        window.removeEventListener("deviceorientationabsolute", handler, true);
      }
    };
  }, [handleOrientation, permissionGranted]);

  const rotation =
    heading === null ? qibla : ((qibla - heading + 360) % 360);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Qibla Direction</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-64 h-64 rounded-full bg-background shadow-sm border flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/9/99/Compass_rose_simple.svg"
              alt="Compass Rose"
              width={256}
              height={256}
              className="opacity-30"
            />
          </div>

          <div
            className="absolute w-24 h-24 transition-transform duration-200"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <Image
              src="https://png.pngtree.com/png-clipart/20250130/original/pngtree-qibla-sign-vector-png-image_20338309.png"
              alt="Qibla Direction"
              width={96}
              height={96}
            />
          </div>

          {/* <div className="absolute w-3 h-3 bg-primary rounded-full z-10"></div> */}
        </div>

        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">
            Qibla Direction: {Math.round(qibla)}°
          </p>
          {!supported && (
            <p className="text-sm text-muted-foreground mt-1">
              Compass not supported. Point device North, turn {Math.round(qibla)}°
            </p>
          )}
        </div>

        {typeof window !== "undefined" &&
          window.DeviceOrientationEvent &&
          typeof window.DeviceOrientationEvent.requestPermission === "function" &&
          !permissionGranted && (
            <Button
              onClick={enableCompass}
              className="mt-4"
            >
              Enable Compass
            </Button>
          )}
      </CardContent>
    </Card>
  );
}