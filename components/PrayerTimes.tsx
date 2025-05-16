// components/PrayerTimes.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    setNextPrayer("Fajr");
  }, [times]);

  if (loading) return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Today&apos;s Prayer Times</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  if (!times) return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Today&apos;s Prayer Times</CardTitle>
      </CardHeader>
      <CardContent className="text-destructive">
        Could not load prayer times
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-center">Today&apos;s Prayer Times</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((prayer) => (
          <div 
            key={prayer} 
            className={`flex justify-between p-3 ${nextPrayer === prayer ? "bg-primary/10 font-medium" : ""}`}
          >
            <span className={nextPrayer === prayer ? "text-primary" : ""}>{prayer}</span>
            <span className={nextPrayer === prayer ? "text-primary font-semibold" : ""}>
              {times[prayer]}
            </span>
          </div>
        ))}
      </CardContent>
      <CardContent className="bg-muted/50 text-center text-sm p-3">
        Next prayer: <span className="font-semibold text-primary">{nextPrayer}</span>
      </CardContent>
    </Card>
  );
}