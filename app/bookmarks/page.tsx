"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import type { Bookmark as BookmarkType } from "@/lib/types";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('quran-bookmarks');
    if (stored) {
      setBookmarks(JSON.parse(stored));
    }
  }, []);

  const removeBookmark = (surahNumber: number, ayahNumber: number) => {
    const newBookmarks = bookmarks.filter(
      b => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
    );
    setBookmarks(newBookmarks);
    localStorage.setItem('quran-bookmarks', JSON.stringify(newBookmarks));
    
    toast({
      title: "Bookmark removed",
      description: "The bookmark has been removed successfully",
    });
  };

  if (bookmarks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">No bookmarks yet</h1>
          <p className="text-muted-foreground mb-4">
            Start reading the Quran and bookmark verses to save them for later.
          </p>
          <Link href="/surahs">
            <Button>Browse Surahs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Bookmarks</h1>
      <div className="space-y-4">
        {bookmarks.map((bookmark) => (
          <Card key={`${bookmark.surahNumber}-${bookmark.ayahNumber}`} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Surah {bookmark.surahName}
                </h2>
                <p className="text-muted-foreground">
                  Verse {bookmark.ayahNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  Saved on {new Date(bookmark.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/surahs/${bookmark.surahNumber}`}>
                  <Button variant="outline">Read</Button>
                </Link>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeBookmark(bookmark.surahNumber, bookmark.ayahNumber)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}