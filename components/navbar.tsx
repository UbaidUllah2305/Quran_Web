"use client";

import { Book, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Digital Quran</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">
                  Home
                </Button>
              </Link>
              <Link href="/surahs">
                <Button variant="ghost" className="w-full justify-start">
                  Surahs
                </Button>
              </Link>
              <Link href="/bookmarks">
                <Button variant="ghost" className="w-full justify-start">
                  Bookmarks
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <Book className="h-6 w-6" />
          <span className="text-lg font-semibold">Digital Quran</span>
        </div>

        <div className="hidden md:flex items-center space-x-4 mx-6">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/surahs">
            <Button variant="ghost">Surahs</Button>
          </Link>
          <Link href="/bookmarks">
            <Button variant="ghost">Bookmarks</Button>
          </Link>
        </div>

        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </nav>
  );
}