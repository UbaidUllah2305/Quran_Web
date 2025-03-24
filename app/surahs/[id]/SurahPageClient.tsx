"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookmarkPlus, Volume2, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

const VERSES_PER_PAGE = 15;

export default function SurahPageClient({
  surah,
  translation,
}: {
  surah: any;
  translation: any;
}) {
  if (!surah || !translation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Surah Not Found</h1>
          <p className="text-muted-foreground">
            The requested Surah data could not be loaded. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const [showTranslation, setShowTranslation] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayMode, setDisplayMode] = useState<'arabic' | 'arabic-with-translation'>('arabic-with-translation');
  const [paragraphMode, setParagraphMode] = useState(false);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const { toast } = useToast();

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const fullSurahAudioQueue = useRef<number[]>([]);

  const totalPages = Math.ceil(surah?.numberOfAyahs / VERSES_PER_PAGE);
  const startIndex = (currentPage - 1) * VERSES_PER_PAGE;
  const endIndex = Math.min(startIndex + VERSES_PER_PAGE, surah?.numberOfAyahs || 0);
  const currentVerses = surah?.ayahs?.slice(startIndex, endIndex) || [];
  const currentTranslations = translation?.ayahs?.slice(startIndex, endIndex) || [];

  const formatVerseKey = (surahNumber: number, ayahNumber: number) => {
    const surahStr = surahNumber.toString().padStart(3, "0");
    const ayahStr = ayahNumber.toString().padStart(3, "0");
    return `${surahStr}${ayahStr}`;
  };

  const getAudioUrl = (ayahNumber: number) => {
    const verseKey = formatVerseKey(surah.number, ayahNumber);
    return `https://everyayah.com/data/Alafasy_128kbps/${verseKey}.mp3`;
  };

  const handlePlayAudio = (ayahNumber: number) => {
    const audioUrl = getAudioUrl(ayahNumber);

    // Stop previous audio if playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    // Play new audio
    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;
    audio.play().catch(() => {
      toast({ title: "Audio unavailable", description: "Unable to play the audio." });
    });

    toast({
      title: "Playing audio",
      description: `Playing verse ${ayahNumber} of Surah ${surah.englishName}`,
    });
  };

  const handlePlayFullSurah = () => {
    if (isPlayingFullSurah) {
      // Stop full Surah playback
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      }
      setIsPlayingFullSurah(false);
      fullSurahAudioQueue.current = [];
      toast({ title: "Playback stopped", description: "Full Surah playback stopped." });
      return;
    }

    // Start full Surah playback
    setIsPlayingFullSurah(true);
    fullSurahAudioQueue.current = surah.ayahs.map((ayah: any) => ayah.numberInSurah);

    playNextVerseInQueue();
  };

  const playNextVerseInQueue = () => {
    if (fullSurahAudioQueue.current.length === 0) {
      setIsPlayingFullSurah(false);
      toast({ title: "Playback completed", description: "Full Surah playback completed." });
      return;
    }

    const nextAyahNumber = fullSurahAudioQueue.current.shift();
    if (nextAyahNumber === undefined) return;
    
    const audioUrl = getAudioUrl(nextAyahNumber);

    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;
    audio.play().catch(() => {
      toast({ title: "Audio unavailable", description: "Unable to play the audio." });
    });

    audio.onended = () => {
      playNextVerseInQueue();
    };

    toast({
      title: "Playing audio",
      description: `Playing verse ${nextAyahNumber} of Surah ${surah.englishName}`,
    });
  };
  const addBookmark = (ayahNumber: number) => {
    const bookmarks = JSON.parse(localStorage.getItem("quran-bookmarks") || "[]");
    const newBookmark = {
      surahNumber: parseInt(surah.number),
      ayahNumber,
      surahName: surah.englishName,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("quran-bookmarks", JSON.stringify([...bookmarks, newBookmark]));

    toast({
      title: "Bookmark added",
      description: `Added bookmark for Surah ${surah.englishName}, Verse ${ayahNumber}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{surah.englishName}</h1>
          <p className="text-xl font-arabic mb-2">{surah.name}</p>
          <p className="text-muted-foreground">
            {surah.englishNameTranslation} • {surah.numberOfAyahs} verses
          </p>

          <div className="flex items-center justify-center gap-4 mt-4">
            <Switch
              checked={displayMode === 'arabic-with-translation'}
              onCheckedChange={() => setDisplayMode(displayMode === 'arabic' ? 'arabic-with-translation' : 'arabic')}
              id="display-mode"
            />
            <label htmlFor="display-mode">Show Arabic {displayMode === 'arabic' ? '' : 'with Translation'}</label>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <Switch
              checked={paragraphMode}
              onCheckedChange={() => setParagraphMode(!paragraphMode)}
              id="paragraph-mode"
            />
            <label htmlFor="paragraph-mode">Paragraph Mode</label>
          </div>

          <div className="mt-4">
            <Button
              variant={isPlayingFullSurah ? "destructive" : "default"}
              onClick={handlePlayFullSurah}
            >
              <Play className="h-4 w-4 mr-2" />
              {isPlayingFullSurah ? "Stop Full Surah" : "Play Full Surah"}
            </Button>
          </div>
        </div>

        {paragraphMode ? (
          <Card className="p-6">
            <div className="text-xl font-arabic text-right">
              {surah.ayahs.map((ayah: any) => ayah.text).join(' ')}
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {currentVerses.map((ayah: any, index: number) => (
              <Card key={ayah.number} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-muted-foreground">Verse {ayah.numberInSurah}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePlayAudio(ayah.numberInSurah)}
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => addBookmark(ayah.numberInSurah)}>
                      <BookmarkPlus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {displayMode === 'arabic' ? (
                  <p className="text-xl font-arabic text-right mb-4">{ayah.text}</p>
                ) : (
                  <>
                    <p className="text-xl font-arabic text-right mb-4">{ayah.text}</p>
                    <p className="text-muted-foreground">{currentTranslations[index].text}</p>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}

        {!paragraphMode && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <span className="text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}