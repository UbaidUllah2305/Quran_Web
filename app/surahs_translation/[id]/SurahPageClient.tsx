"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookmarkPlus, Volume2, ChevronLeft, ChevronRight, Pause } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useSearchParams, useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const VERSES_PER_PAGE = 15;
const BASE_FONT_SIZE = 96;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;

const SUPPORTED_TRANSLATIONS = [
  { code: 'en.asad', name: 'English (Asad)', available: true },
  { code: 'ur.maududi', name: 'Urdu (Maududi)', available: true },
  { code: 'fa.makarem', name: 'Farsi (Makarem)', available: true },
  { code: 'fr.hamidullah', name: 'French (Hamidullah)', available: true },
  { code: 'es.bornez', name: 'Spanish (Bornez)', available: true },
];

export default function SurahPageClient({
  surah,
  translation,
}: {
  surah: any;
  translation: any;
}) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [displayMode, setDisplayMode] = useState<'arabic' | 'arabic-with-translation'>('arabic-with-translation');
  const [isPlayingVerse, setIsPlayingVerse] = useState<number | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState('en.asad');
  const [fontSize, setFontSize] = useState(BASE_FONT_SIZE);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState('');
  const searchParams = useSearchParams();
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup effects
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Handle zoom level changes
  useEffect(() => {
    const handleZoom = () => {
      const zoomLevel = window.visualViewport?.scale || 1;
      const newFontSize = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, BASE_FONT_SIZE / zoomLevel));
      setFontSize(newFontSize);
    };

    window.visualViewport?.addEventListener('resize', handleZoom);
    handleZoom();

    return () => {
      window.visualViewport?.removeEventListener('resize', handleZoom);
    };
  }, []);

  // Handle verse navigation
  useEffect(() => {
    const verseParam = searchParams?.get('verse');
    if (verseParam) {
      const verseNumber = parseInt(verseParam);
      setTimeout(() => {
        const verseElement = document.getElementById(`verse-${verseNumber}`);
        if (verseElement) {
          verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          verseElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900');
          setTimeout(() => {
            verseElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900');
          }, 3000);
        }
      }, 500);
    }
  }, [searchParams]);

  const formatVerseKey = (surahNumber: number, ayahNumber: number) => {
    const surahStr = surahNumber.toString().padStart(3, "0");
    const ayahStr = ayahNumber.toString().padStart(3, "0");
    return `${surahStr}${ayahStr}`;
  };

  const getAudioUrl = (ayahNumber: number) => {
    const verseKey = formatVerseKey(surah.number, ayahNumber);
    return `https://everyayah.com/data/Alafasy_128kbps/${verseKey}.mp3`;
  };

  const handlePlayAudio = async (ayahNumber: number) => {
    if (isPlayingVerse === ayahNumber) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        setIsPlayingVerse(null);
        setPlaybackStatus('Paused');
        setTimeout(() => setPlaybackStatus(''), 1000);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
      return;
    }

    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    const audioUrl = getAudioUrl(ayahNumber);
    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;
    setIsPlayingVerse(ayahNumber);
    setPlaybackProgress(0);
    setCurrentTime(0);
    setPlaybackStatus(`Playing Verse ${ayahNumber}`);

    // Setup progress tracking
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    progressIntervalRef.current = setInterval(() => {
      if (audio.currentTime && audio.duration) {
        setCurrentTime(audio.currentTime);
        setPlaybackProgress((audio.currentTime / audio.duration) * 100);
      }
    }, 100);

    audio.addEventListener('ended', () => {
      setIsPlayingVerse(null);
      setPlaybackProgress(100);
      setPlaybackStatus('Playback completed');
      setTimeout(() => setPlaybackStatus(''), 100);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    });

    try {
      await audio.play();
    } catch (error) {
      setIsPlayingVerse(null);
      setPlaybackStatus('Audio unavailable');
      setTimeout(() => setPlaybackStatus(''), 2000);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const addBookmark = (ayahNumber: number) => {
    const bookmarks = JSON.parse(localStorage.getItem("quran-bookmarks") || "[]");
    const newBookmark = {
      surahNumber: surah.number,
      ayahNumber,
      surahName: surah.englishName,
      timestamp: new Date().toISOString(),
    };

    const updatedBookmarks = [...bookmarks, newBookmark];
    localStorage.setItem("quran-bookmarks", JSON.stringify(updatedBookmarks));
    window.dispatchEvent(new Event('bookmark-updated'));
    setPlaybackStatus('Bookmark added');
    setTimeout(() => setPlaybackStatus(''), 2000);
  };

  const handleTranslationChange = async (value: string) => {
    setIsLoading(true);
    setSelectedTranslation(value);
    router.push(`/surahs_translation/${surah.number}?translation=${value}`);
    setIsLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderArabicTextWithLines = (text: string) => {
    const verseSeparator = "۞";

    return (
      <div className="text-right leading-loose space-y-4" style={{ fontSize: `${fontSize}px` }}>
        {text.split(verseSeparator).map((verseText, index, array) => (
          <div
            key={index}
            className={index < array.length - 1 ? "pb-4 border-b border-gray-200 dark:border-gray-700" : ""}
          >
            <span>
              {verseText.trim()}
              {index < array.length - 1 && (
                <span className="text-2xl text-primary mx-2">{verseSeparator}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    );
  };

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

  const totalPages = Math.ceil(surah.numberOfAyahs / VERSES_PER_PAGE);
  const startIndex = (currentPage - 1) * VERSES_PER_PAGE;
  const endIndex = Math.min(startIndex + VERSES_PER_PAGE, surah.numberOfAyahs);
  const currentVerses = surah.ayahs.slice(startIndex, endIndex);
  const currentTranslations = translation.ayahs.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Fixed position playback indicator */}
      {(isPlayingVerse !== null || playbackStatus) && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 truncate">
                {isPlayingVerse !== null && (
                  <>
                    <Volume2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate font-medium">
                      {playbackStatus || `Playing Verse ${isPlayingVerse}`}
                    </span>
                  </>
                )}
                {playbackStatus && !isPlayingVerse && (
                  <span className="truncate">{playbackStatus}</span>
                )}
              </div>
              <span className="text-muted-foreground text-sm shrink-0">
                {isPlayingVerse !== null && `${formatTime(currentTime)} / ${formatTime(duration)}`}
              </span>
            </div>
            {isPlayingVerse !== null && (
              <Progress value={playbackProgress} className="h-1" />
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto pt-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{surah.englishName}</h1>
          <p className="text-xl font-arabic mb-2" style={{ fontSize: `${fontSize + 4}px` }}>{surah.name}</p>
          <p className="text-muted-foreground">
            {surah.englishNameTranslation} • {surah.numberOfAyahs} verses • {surah.revelationType}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={displayMode === 'arabic-with-translation'}
                onCheckedChange={() => setDisplayMode(displayMode === 'arabic' ? 'arabic-with-translation' : 'arabic')}
                id="display-mode"
              />
              <label htmlFor="display-mode">Translation</label>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={selectedTranslation}
                onValueChange={handleTranslationChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[160px]">
                  {isLoading ? (
                    <Skeleton className="h-4 w-[100px]" />
                  ) : (
                    <SelectValue placeholder="Translation" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_TRANSLATIONS.filter(t => t.available).map((translation) => (
                    <SelectItem key={translation.code} value={translation.code}>
                      {translation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-6">
          {currentVerses.map((ayah: any, index: number) => (
            <Card
              key={ayah.number}
              id={`verse-${ayah.numberInSurah}`}
              className="p-6 transition-colors duration-300 hover:bg-muted/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    {ayah.numberInSurah}
                  </span>
                  {isPlayingVerse === ayah.numberInSurah && (
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={isPlayingVerse === ayah.numberInSurah ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePlayAudio(ayah.numberInSurah)}
                    className="rounded-full"
                  >
                    {isPlayingVerse === ayah.numberInSurah ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => addBookmark(ayah.numberInSurah)}
                    className="rounded-full"
                  >
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {displayMode === 'arabic' ? (
                renderArabicTextWithLines(ayah.text)
              ) : (
                <>
                  {renderArabicTextWithLines(ayah.text)}
                  <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-4"></div>
                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: `${fontSize - 2}px` }}
                  >
                    {currentTranslations[index]?.text || 'Translation not available'}
                  </p>
                </>
              )}
            </Card>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="gap-2"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}