// components/HijriMonthInfo.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";

export function HijriMonthInfo() {
  const [month, setMonth] = useState("Ramadan");

  const monthInfo: Record<string, { description: string; virtues: string[] }> = {
    "Ramadan": {
      description: "The month of fasting, Quran revelation, and Laylat al-Qadr",
      virtues: [
        "Fasting during Ramadan is one of the Five Pillars of Islam",
        "The Quran was first revealed in this month",
        "Contains Laylat al-Qadr (Night of Power) which is better than 1000 months",
        "Gates of Paradise are opened and gates of Hell are closed"
      ]
    },
    "Muharram": {
      description: "The first month of the Islamic calendar, a sacred month",
      virtues: [
        "One of the four sacred months in Islam",
        "The day of Ashura (10th Muharram) is a significant day of fasting",
        "Fasting on Ashura expiates the sins of the previous year"
      ]
    },
    "Rajab": {
      description: "One of the sacred months, the month of Isra and Mi'raj",
      virtues: [
        "One of the four sacred months in Islam",
        "The Isra and Mi'raj (Prophet's night journey) occurred in this month",
        "Recommended to increase worship and good deeds"
      ]
    },
    "Shawwal": {
      description: "The month following Ramadan containing Eid al-Fitr",
      virtues: [
        "First day is Eid al-Fitr, a celebration after Ramadan",
        "Fasting six days in Shawwal (after Eid) brings the reward of fasting the whole year",
        "A time to continue good habits developed in Ramadan"
      ]
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-center">Hijri Month Information</CardTitle>
        <div className="flex justify-center">
          <select 
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="p-2 border rounded-md"
          >
            {Object.keys(monthInfo).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg font-medium">{month}</p>
          <p>{monthInfo[month].description}</p>
          
          <div className="mt-4">
            <p className="font-medium mb-2">Virtues and Significance:</p>
            <ul className="list-disc pl-5 space-y-2">
              {monthInfo[month].virtues.map((virtue, index) => (
                <li key={index}>{virtue}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}