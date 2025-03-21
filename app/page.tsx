import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Book, BookMarked, Moon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to Digital Quran
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Read, learn, and reflect on the Holy Quran with a modern digital experience
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Book className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Read Surahs</h2>
                <p className="text-muted-foreground mb-4">
                  Access all 114 surahs with translations
                </p>
                <Link href="/surahs">
                  <Button>Browse Surahs</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BookMarked className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Bookmarks</h2>
                <p className="text-muted-foreground mb-4">
                  Save and manage your reading progress
                </p>
                <Link href="/bookmarks">
                  <Button>View Bookmarks</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Moon className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Dark Mode</h2>
                <p className="text-muted-foreground mb-4">
                  Comfortable reading day and night
                </p>
                <Button variant="outline">Toggle Theme</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">About Digital Quran</h2>
          <p className="text-muted-foreground">
            This application provides a modern, accessible way to read and study the Holy Quran.
            Features include verse-by-verse reading, translations, bookmarking, and a comfortable
            reading experience with both light and dark modes.
          </p>
        </div>
      </div>
    </div>
  );
}