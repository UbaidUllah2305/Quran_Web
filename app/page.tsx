import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Book, BookMarked, Bookmark, Moon, ListOrdered, Languages } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to Digital Quran
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Read, learn, and reflect on the Holy Quran with a modern digital experience
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="h-full flex flex-col">
            <CardContent className="pt-6 flex-grow flex flex-col">
              <div className="text-center flex-grow">
                <BookMarked className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Complete Quran</h2>
                <p className="text-muted-foreground mb-4">
                  Access the entire Holy Quran
                </p>
              </div>
              <Link href="/quran" className="mt-auto">
                <Button className="w-full">Read Quran</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardContent className="pt-6 flex-grow flex flex-col">
              <div className="text-center flex-grow">
                <ListOrdered className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Surahs</h2>
                <p className="text-muted-foreground mb-4">
                  Explore all 114 Surahs
                </p>
              </div>
              <Link href="/surahs" className="mt-auto">
                <Button className="w-full">Browse Surahs</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardContent className="pt-6 flex-grow flex flex-col">
              <div className="text-center flex-grow">
                <Book className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Paras</h2>
                <p className="text-muted-foreground mb-4">
                  Access all 30 Paras (Juz)
                </p>
              </div>
              <Link href="/paras" className="mt-auto">
                <Button className="w-full">Browse Paras</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardContent className="pt-6 flex-grow flex flex-col">
              <div className="text-center flex-grow">
                <Languages className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Surahs with Translations</h2>
                <p className="text-muted-foreground mb-4">
                  Read with multiple language translations
                </p>
              </div>
              <Link href="/surahs_translation" className="mt-auto">
                <Button className="w-full">View Translations</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardContent className="pt-6 flex-grow flex flex-col">
              <div className="text-center flex-grow">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Bookmarks</h2>
                <p className="text-muted-foreground mb-4">
                  Save and manage your reading progress
                </p>
              </div>
              <Link href="/bookmarks" className="mt-auto">
                <Button className="w-full">View Bookmarks</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardContent className="pt-6 flex-grow flex flex-col">
              <div className="text-center flex-grow">
                <>
                  {/* Show in light mode */}
                  <Image
                    src="images/qibla_dark.png"
                    alt="Dark Image"
                    width={100}
                    height={100}
                    className="w-12 h-12 mx-auto mb-4 text-primary dark:hidden"
                  />

                  {/* Show in dark mode */}
                  <Image
                    src="images/qibla_light.png"
                    alt="Light Image"
                    width={100}
                    height={100}
                    className="w-12 h-12 mx-auto mb-4 text-primary hidden dark:block"
                  />
                </>

                <h2 className="text-xl font-semibold mb-2">Qibla Direction</h2>
                <p className="text-muted-foreground mb-4">
                  Search for the Qibla Direction
                </p>
              </div>
              <Link href="/qiblaDirection" className="mt-auto">
                <Button className="w-full">View Direction</Button>
              </Link>
            </CardContent>
          </Card>

        </div>

        <div className="bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">About Digital Quran</h2>
          <p className="text-muted-foreground">
            This application provides a modern, accessible way to read and study the Holy Quran.
            Features include verse-by-verse reading, multiple translations, bookmarking, and
            a comfortable reading experience with both light and dark modes.
          </p>
        </div>
      </div>
    </div>
  );
}