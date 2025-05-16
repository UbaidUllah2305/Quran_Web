// app/hijri/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";

export default function HijriCalculator() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [convertedDate, setConvertedDate] = useState<string>("");
  const [conversionDirection, setConversionDirection] = useState<"gregorianToHijri" | "hijriToGregorian">("gregorianToHijri");
  const [hijriInput, setHijriInput] = useState({ day: "", month: "", year: "" });
  const [activeTab, setActiveTab] = useState("converter");
  const [islamicMonths, setIslamicMonths] = useState<any[]>([]);



  // Load Islamic months data
  useEffect(() => {
    const months = [
      { name: "Muharram", isSacred: true, description: "First month of the Islamic calendar" },
      { name: "Safar", isSacred: false, description: "" },
      { name: "Rabi al-Awwal", isSacred: false, description: "Month of the Prophet's birth" },
      { name: "Rabi al-Thani", isSacred: false, description: "" },
      { name: "Jumada al-Awwal", isSacred: false, description: "" },
      { name: "Jumada al-Thani", isSacred: false, description: "" },
      { name: "Rajab", isSacred: true, description: "Month of Isra and Mi'raj" },
      { name: "Sha'ban", isSacred: false, description: "Month preceding Ramadan" },
      { name: "Ramadan", isSacred: false, description: "Month of fasting" },
      { name: "Shawwal", isSacred: false, description: "Month of Eid al-Fitr" },
      { name: "Dhu al-Qi'dah", isSacred: true, description: "" },
      { name: "Dhu al-Hijjah", isSacred: true, description: "Month of Hajj and Eid al-Adha" }
    ];
    setIslamicMonths(months);
  }, []);

  const convertDate = () => {
    try {
      if (conversionDirection === "gregorianToHijri" && date) {
        const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
          day: "numeric",
          month: "long",
          year: "numeric",
          weekday: "long"
        }).format(date);
        setConvertedDate(hijriDate);
      } else if (conversionDirection === "hijriToGregorian") {
        // Simplified conversion - use a library for accurate conversion
        const gregorianDate = new Date(
          parseInt(hijriInput.year) + 579,
          parseInt(hijriInput.month) - 1,
          parseInt(hijriInput.day)
        );
        setConvertedDate(gregorianDate.toLocaleDateString());
      }
    } catch (error) {
      console.error("Error converting date:", error);
      setConvertedDate("Invalid date");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4">
      <Card className="w-full max-w-2xl mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Islamic Date Calculator</CardTitle>
          <CardDescription>
            Convert dates between Gregorian and Hijri calendars with additional Islamic tools
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full max-w-2xl"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="converter">Date Converter</TabsTrigger>
          <TabsTrigger value="months">Islamic Months</TabsTrigger>
        </TabsList>

        <TabsContent value="converter">
          <Card className="mt-4">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <Select 
                  value={conversionDirection}
                  onValueChange={(value: "gregorianToHijri" | "hijriToGregorian") => setConversionDirection(value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Conversion Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gregorianToHijri">Gregorian to Hijri</SelectItem>
                    <SelectItem value="hijriToGregorian">Hijri to Gregorian</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={convertDate}>Convert</Button>
              </div>

              {conversionDirection === "gregorianToHijri" ? (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-center">Select Gregorian Date</p>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border mx-auto"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-center">Enter Hijri Date</p>
                  <div className="flex space-x-2 justify-center">
                    <Input
                      type="number"
                      placeholder="Day"
                      value={hijriInput.day}
                      onChange={(e) => setHijriInput({...hijriInput, day: e.target.value})}
                      min="1"
                      max="30"
                      className="w-20"
                    />
                    <Input
                      type="number"
                      placeholder="Month"
                      value={hijriInput.month}
                      onChange={(e) => setHijriInput({...hijriInput, month: e.target.value})}
                      min="1"
                      max="12"
                      className="w-20"
                    />
                    <Input
                      type="number"
                      placeholder="Year"
                      value={hijriInput.year}
                      onChange={(e) => setHijriInput({...hijriInput, year: e.target.value})}
                      min="1"
                      max="1500"
                      className="w-24"
                    />
                  </div>
                </div>
              )}

              {convertedDate && (
                <Card className="mt-4">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-medium">
                      {conversionDirection === "gregorianToHijri" ? "Hijri Date:" : "Gregorian Date:"}
                    </p>
                    <p className="text-lg mt-1">{convertedDate}</p>
                  </CardContent>
                </Card>
              )}

              <div className="text-center text-sm mt-4">
                <p>Today&apos;s Hijri Date: {new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }).format(new Date())}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="months">
          <Card className="mt-4">
            <CardContent className="p-6">
              <div className="space-y-4">
                {islamicMonths.map((month) => (
                  <Card key={month.name}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{month.name}</p>
                        {month.isSacred && (
                          <span className="text-xs bg-secondary px-2 py-1 rounded">Sacred Month</span>
                        )}
                      </div>
                      {month.description && (
                        <p className="text-sm mt-1">{month.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <footer className="mt-8 text-sm text-muted-foreground text-center">
        <p>Islamic Tools for the Ummah</p>
      </footer>
    </div>
  );
}