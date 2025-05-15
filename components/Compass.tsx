import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

interface CompassProps {
    latitude: number;
    longitude: number;
}

// Calculate Qibla Bearing (degrees from North)
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
        // iOS (Safari): webkitCompassHeading is reliable (0 = North)
        if (typeof event.webkitCompassHeading === "number") {
            setHeading(event.webkitCompassHeading);
        }
        // Standard: alpha is compass direction if absolute, otherwise not always correct
        else if (event.absolute === true && typeof event.alpha === "number") {
            setHeading(360 - event.alpha);
        }
        // Fallback: just use alpha (may be relative, so may be wrong, but better than nothing)
        else if (typeof event.alpha === "number") {
            setHeading(360 - event.alpha);
        }
    }, []);

    // Device orientation permission (iOS)
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
            // If iOS, wait for permission
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

    // Rotation angle for the Qibla arrow relative to North
    const rotation =
        heading === null ? qibla : ((qibla - heading + 360) % 360);

    return (
        <div className="flex flex-col items-center mb-6">
            <div className="relative w-64 h-64 rounded-full bg-white shadow-lg border-4 border-blue-200 flex items-center justify-center">
                {/* Compass Rose */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/9/99/Compass_rose_simple.svg"
                        alt="Compass Rose"
                        width={256}
                        height={256}
                        className="opacity-30"
                    />
                </div>

                {/* Qibla Arrow */}
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

                {/* Center dot */}
                <div className="absolute w-3 h-3 bg-blue-600 rounded-full z-10"></div>
            </div>

            <div className="mt-4 text-center">
                <p className="text-xl font-semibold text-blue-700">
                    Qibla Direction: {Math.round(qibla)}°
                </p>
                {!supported && (
                    <p className="text-sm text-gray-600 mt-1">
                        Compass not supported. Point device North, turn {Math.round(qibla)}°
                    </p>
                )}
            </div>

            {/* iOS "Enable Compass" */}
            {typeof window !== "undefined" &&
                window.DeviceOrientationEvent &&
                typeof window.DeviceOrientationEvent.requestPermission === "function" &&
                !permissionGranted && (
                    <button
                        onClick={enableCompass}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Enable Compass
                    </button>
                )}
        </div>
    );
}
