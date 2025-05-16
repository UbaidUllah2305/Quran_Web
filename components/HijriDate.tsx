// components/HijriDate.tsx
"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function HijriDate() {
  const [hijriDate, setHijriDate] = useState<string>("");

  useEffect(() => {
    try {
      const date = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date());
      setHijriDate(date);
    } catch (error) {
      console.error("Error formatting Hijri date:", error);
      setHijriDate(DateTime.now().toFormat("dd LLL yyyy"));
    }
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-3 text-center">
        <span className="font-medium">Hijri Date: {hijriDate}</span>
      </CardContent>
    </Card>
  );
}