// app/surahs/[id]/SurahPageClient.tsx:

"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

const VERSES_PER_PAGE = 10;
const BASE_FONT_SIZE = 30;


export default function SurahPageClient({
    surah,
}: {
    surah: any;
}) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [isPlayingVerse, setIsPlayingVerse] = useState<number | null>(null);
    const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
    const [fontSize, setFontSize] = useState(BASE_FONT_SIZE);
    const [playbackProgress, setPlaybackProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackStatus, setPlaybackStatus] = useState('');
    const [surahProgress, setSurahProgress] = useState(0);
    const searchParams = useSearchParams();
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const currentVerseIndexRef = useRef(0);

    // Cleanup effects
    useEffect(() => {
        return () => {
            stopAudioPlayback();
        };
    }, []);

    // Handle verse navigation
    useEffect(() => {
        const verseParam = searchParams?.get('verse');
        if (verseParam) {
            const verseNumber = parseInt(verseParam);
            const pageForVerse = Math.ceil(verseNumber / VERSES_PER_PAGE);
            setCurrentPage(pageForVerse);

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

    const stopAudioPlayback = () => {
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current = null;
        }
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        setIsPlayingVerse(null);
        setIsPlayingFullSurah(false);
        setPlaybackStatus('');
        setPlaybackProgress(0);
        setCurrentTime(0);
        setDuration(0);
    };

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
            stopAudioPlayback();
            return;
        }

        // Stop any current playback
        stopAudioPlayback();

        const audioUrl = getAudioUrl(ayahNumber);
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        setIsPlayingVerse(ayahNumber);
        setPlaybackStatus(`Playing Verse ${ayahNumber}`);

        // Setup event listeners
        audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime);
            setPlaybackProgress((audio.currentTime / audio.duration) * 100);
        });

        audio.addEventListener('ended', () => {
            setIsPlayingVerse(null);
            setPlaybackProgress(100);
            setPlaybackStatus('Playback completed');
            setTimeout(() => setPlaybackStatus(''), 1000);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        });

        try {
            await audio.play();
        } catch (error) {
            console.error("Error playing audio:", error);
            setIsPlayingVerse(null);
            setPlaybackStatus('Audio unavailable');
            setTimeout(() => setPlaybackStatus(''), 2000);
        }
    };

    const playFullSurah = async () => {
        if (isPlayingFullSurah) {
            stopAudioPlayback();
            return;
        }

        setIsPlayingFullSurah(true);
        currentVerseIndexRef.current = 0;
        setSurahProgress(0);
        await playNextVerseInSurah();
    };

    const playNextVerseInSurah = async () => {
        if (!isPlayingFullSurah) return;

        const verseIndex = currentVerseIndexRef.current;
        if (verseIndex >= surah.ayahs.length) {
            stopAudioPlayback();
            setPlaybackStatus('Surah completed');
            setTimeout(() => setPlaybackStatus(''), 2000);
            return;
        }

        const ayah = surah.ayahs[verseIndex];
        const ayahNumber = ayah.numberInSurah;

        setSurahProgress((verseIndex / surah.ayahs.length) * 100);

        const newPage = Math.ceil(ayahNumber / VERSES_PER_PAGE);
        if (newPage !== currentPage) {
            setCurrentPage(newPage);
            setTimeout(() => handlePlayAudio(ayahNumber), 100);
        } else {
            await handlePlayAudio(ayahNumber);
        }

        if (currentAudioRef.current) {
            currentAudioRef.current.onended = () => {
                currentVerseIndexRef.current++;
                playNextVerseInSurah();
            };
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!surah) {
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

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Fixed position playback indicator */}
            {(isPlayingVerse !== null || playbackStatus || isPlayingFullSurah) && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 truncate">
                                {(isPlayingVerse !== null || isPlayingFullSurah) && (
                                    <>
                                        <Volume2 className="h-4 w-4 text-primary shrink-0" />
                                        <span className="truncate font-medium">
                                            {playbackStatus ||
                                                (isPlayingFullSurah ? `Playing Surah ${surah.englishName}` : `Playing Verse ${isPlayingVerse}`)}
                                        </span>
                                    </>
                                )}
                                {playbackStatus && !isPlayingVerse && !isPlayingFullSurah && (
                                    <span className="truncate">{playbackStatus}</span>
                                )}
                            </div>
                            <span className="text-muted-foreground text-sm shrink-0">
                                {isPlayingVerse !== null && `${formatTime(currentTime)} / ${formatTime(duration)}`}
                            </span>
                        </div>

                        {/* Verse progress bar */}
                        {isPlayingVerse !== null && (
                            <Progress value={playbackProgress} className="h-1 mb-1" />
                        )}

                        {/* Surah progress bar */}
                        {isPlayingFullSurah && (
                            <Progress value={surahProgress} className="h-1" />
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto pt-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                        {surah.englishName}
                    </h1>
                    <p
                        className="text-3xl font-arabic mb-2"
                        style={{
                            fontFamily: 'UthmanicHafs, "Traditional Arabic", sans-serif',
                            fontSize: `${fontSize + 8}px`
                        }}
                    >
                        {surah.name}
                    </p>
                    <p className="text-muted-foreground">
                        {surah.englishNameTranslation} • {surah.numberOfAyahs} verses • {surah.revelationType}
                    </p>

                    {/* Full Surah Play Button */}
                    {/* <div className="mt-4 flex justify-center gap-4">
                        <Button
                            variant={isPlayingFullSurah ? "default" : "outline"}
                            onClick={playFullSurah}
                            className="gap-2"
                        >
                            {isPlayingFullSurah ? (
                                <Pause className="h-4 w-4" />
                            ) : (
                                <Play className="h-4 w-4" />
                            )}
                            {isPlayingFullSurah ? "Stop Playback" : "Play Full Surah"}
                        </Button>
                    </div> */}
                </div>

                <div className="mb-8 p-4 rounded-lg ">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b">
                        <div className="text-sm text-gray-500">Verses {startIndex + 1}-{endIndex}</div>
                        <h2 className="text-xl font-bold text-green-500 text-right">
                            {surah.englishName} ({surah.number})
                        </h2>
                    </div>
                    <div
                        className="text-justify leading-loose mb-6"
                        style={{
                            fontSize: `${fontSize}px`,
                            fontFamily: 'UthmanicHafs, "Traditional Arabic", sans-serif',
                            lineHeight: '2.5'
                        }}
                    >
                        {currentVerses.map((ayah: any) => (
                            <span
                                key={ayah.number}
                                id={`verse-${ayah.numberInSurah}`}
                                className="ayah-text hover:bg-yellow-100 hover:bg-opacity-50 transition-colors rounded px-1 relative group"
                                data-ayah={ayah.numberInSurah}
                            >
                                {ayah.text}
                                <span className="text-sm md:text-base text-gray-400 align-super">
                                    ۝{ayah.numberInSurah}
                                </span>{' '}

                                {/* Playing indicator */}
                                {isPlayingVerse === ayah.numberInSurah && (
                                    <span className="absolute -left-2 -top-2 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
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