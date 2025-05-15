import { useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";

interface PrayerTimesProps {
  latitude: number;
  longitude: number;
}

interface PrayerTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export default function PrayerTimes({ latitude, longitude }: PrayerTimesProps) {
  const [times, setTimes] = useState<PrayerTimings | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState<string>("");

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.aladhan.com/v1/timings/${Math.floor(Date.now()/1000)}?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        setTimes(response.data.data.timings);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [latitude, longitude]);

  useEffect(() => {
    if (!times) return;

    const now = DateTime.now();
    const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    
    for (const prayer of prayerOrder) {
      const prayerTime = DateTime.fromFormat(times[prayer], "HH:mm");
      if (now < prayerTime) {
        setNextPrayer(prayer);
        return;
      }
    }
    setNextPrayer("Fajr"); // Default to Fajr if all prayers passed
  }, [times]);

  if (loading) return (
    <div className="p-4 text-center text-blue-600">
      Loading Prayer Times...
    </div>
  );

  if (!times) return (
    <div className="p-4 text-center text-red-600">
      Could not load prayer times
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-lg font-semibold text-center">Today&apos;s Prayer Times</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((prayer) => (
          <div 
            key={prayer} 
            className={`flex justify-between p-3 ${nextPrayer === prayer ? "bg-blue-50 font-medium" : ""}`}
          >
            <span className={nextPrayer === prayer ? "text-blue-600" : ""}>{prayer}</span>
            <span className={nextPrayer === prayer ? "text-blue-600 font-semibold" : ""}>
              {times[prayer]}
            </span>
          </div>
        ))}
      </div>
      <div className="p-3 bg-gray-50 text-center text-sm">
        Next prayer: <span className="font-semibold text-blue-600">{nextPrayer}</span>
      </div>
    </div>
  );
}