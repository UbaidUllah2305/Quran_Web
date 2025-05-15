import { DateTime } from "luxon";
import { useEffect, useState } from "react";

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
    <div className="mb-6 p-3 bg-blue-100 text-blue-800 rounded-lg text-center">
      <span className="font-medium">Hijri Date: {hijriDate}</span>
    </div>
  );
}