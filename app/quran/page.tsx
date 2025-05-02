"use client";
import { useState, useEffect, useRef } from "react";

async function getQuran() {
    try {
        const res = await fetch('https://api.alquran.cloud/v1/quran/ar.alafasy');
        if (!res.ok) throw new Error('Failed to fetch Quran data');
        const data = await res.json();
        return data.data.surahs || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Complete Juz/Para information
const juzData = [
    { id: 1, name: "Alif Lam Meem", start: { surah: 1, ayah: 1 }, end: { surah: 2, ayah: 141 } },
    { id: 2, name: "Sayaqool", start: { surah: 2, ayah: 142 }, end: { surah: 2, ayah: 252 } },
    { id: 3, name: "Tilkal Rusul", start: { surah: 2, ayah: 253 }, end: { surah: 3, ayah: 92 } },
    { id: 4, name: "Lan Tana Loo", start: { surah: 3, ayah: 93 }, end: { surah: 4, ayah: 23 } },
    { id: 5, name: "Wal Mohsanat", start: { surah: 4, ayah: 24 }, end: { surah: 4, ayah: 147 } },
    { id: 6, name: "La Yuhibbullah", start: { surah: 4, ayah: 148 }, end: { surah: 5, ayah: 81 } },
    { id: 7, name: "Wa Iza Samiu", start: { surah: 5, ayah: 82 }, end: { surah: 6, ayah: 110 } },
    { id: 8, name: "Wa Lau Annana", start: { surah: 6, ayah: 111 }, end: { surah: 7, ayah: 87 } },
    { id: 9, name: "Qalal Malao", start: { surah: 7, ayah: 88 }, end: { surah: 8, ayah: 40 } },
    { id: 10, name: "Wa A'lamu", start: { surah: 8, ayah: 41 }, end: { surah: 9, ayah: 92 } },
    { id: 11, name: "Yatazeroon", start: { surah: 9, ayah: 93 }, end: { surah: 11, ayah: 5 } },
    { id: 12, name: "Wa Mamin Da'abat", start: { surah: 11, ayah: 6 }, end: { surah: 12, ayah: 52 } },
    { id: 13, name: "Wa Ma Ubrioo", start: { surah: 12, ayah: 53 }, end: { surah: 15, ayah: 1 } },
    { id: 14, name: "Rubama", start: { surah: 15, ayah: 2 }, end: { surah: 16, ayah: 128 } },
    { id: 15, name: "Subhanallazi", start: { surah: 17, ayah: 1 }, end: { surah: 18, ayah: 74 } },
    { id: 16, name: "Qal Alam", start: { surah: 18, ayah: 75 }, end: { surah: 20, ayah: 135 } },
    { id: 17, name: "Aqtarabo", start: { surah: 21, ayah: 1 }, end: { surah: 22, ayah: 78 } },
    { id: 18, name: "Qad Aflaha", start: { surah: 23, ayah: 1 }, end: { surah: 25, ayah: 20 } },
    { id: 19, name: "Wa Qalallazina", start: { surah: 25, ayah: 21 }, end: { surah: 27, ayah: 55 } },
    { id: 20, name: "A'man Khalaq", start: { surah: 27, ayah: 56 }, end: { surah: 29, ayah: 45 } },
    { id: 21, name: "Utlu Ma Oohi", start: { surah: 29, ayah: 46 }, end: { surah: 33, ayah: 30 } },
    { id: 22, name: "Wa Manyaqnut", start: { surah: 33, ayah: 31 }, end: { surah: 36, ayah: 27 } },
    { id: 23, name: "Wa Mali", start: { surah: 36, ayah: 28 }, end: { surah: 39, ayah: 31 } },
    { id: 24, name: "Faman Azlam", start: { surah: 39, ayah: 32 }, end: { surah: 41, ayah: 46 } },
    { id: 25, name: "Elahe Yuruddo", start: { surah: 41, ayah: 47 }, end: { surah: 45, ayah: 37 } },
    { id: 26, name: "Haa Meem", start: { surah: 46, ayah: 1 }, end: { surah: 51, ayah: 30 } },
    { id: 27, name: "Qala Fama Khatbukum", start: { surah: 51, ayah: 31 }, end: { surah: 57, ayah: 29 } },
    { id: 28, name: "Qad Sami Allah", start: { surah: 58, ayah: 1 }, end: { surah: 66, ayah: 12 } },
    { id: 29, name: "Tabarakallazi", start: { surah: 67, ayah: 1 }, end: { surah: 77, ayah: 50 } },
    { id: 30, name: "Amma Yatasa'aloon", start: { surah: 78, ayah: 1 }, end: { surah: 114, ayah: 6 } },
];

export default function QuranPage() {
    const [surahs, setSurahs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeJuz, setActiveJuz] = useState(1);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [fontSize, setFontSize] = useState(2); // 1: small, 2: medium (default), 3: large
    const [searchQuery, setSearchQuery] = useState('');
    const [showAllSurahs, setShowAllSurahs] = useState(false); // New state to control whether to show all surahs or just juz surahs
    const mainContentRef = useRef<HTMLDivElement>(null);

    // Close sidebars when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (window.innerWidth <= 768) {
                const target = event.target as HTMLElement;
                if (!target.closest('.sidebar') && !target.closest('.sidebar-toggle')) {
                    setLeftSidebarOpen(false);
                    setRightSidebarOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load saved preferences
    useEffect(() => {
        const savedFontSize = localStorage.getItem('quranFontSize');
        if (savedFontSize) setFontSize(Number(savedFontSize));
    }, []);

    // Save preferences

    useEffect(() => {
        const fetchQuranData = async () => {
            setLoading(true);
            const quranData = await getQuran();
            setSurahs(quranData);
            setLoading(false);
        };
        fetchQuranData();
    }, []);

    // Get surahs for current Juz
    const getSurahsInJuz = (juz: number) => {
        const juzInfo = juzData.find(j => j.id === juz);
        if (!juzInfo) return [];

        return surahs.filter(surah => {
            return surah.number >= juzInfo.start.surah && surah.number <= juzInfo.end.surah;
        });
    };

    // Filter surahs based on search query
    const filteredSurahs = surahs.filter(surah =>
        surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString().includes(searchQuery)
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen -gray-50">
                <div className="text-center py-20 text-2xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
                    Loading Quran...
                </div>
            </div>
        );
    }

    const fontSizeClasses = [
        'text-xl md:text-2xl', // small
        'text-2xl md:text-3xl', // medium
        'text-3xl md:text-4xl'  // large
    ];

    return (
        <div className="flex h-screen -gray-50 overflow-hidden">
            {/* Left Sidebar - Juz/Para */}
            <div className={`sidebar ${leftSidebarOpen ? 'w-64' : 'w-0'} -white shadow-lg transition-all duration-300 flex-shrink-0 overflow-y-auto z-20`}>
                <div className="p-4 sticky top-0 bg-background border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-green-500">Juz/Para</h2>
                    <button
                        onClick={() => setLeftSidebarOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <nav className="p-2">
                    {juzData.map((juz) => (
                        <button
                            key={juz.id}
                            onClick={() => {
                                setActiveJuz(juz.id);
                                setShowAllSurahs(false); // Show only juz surahs when a juz is selected
                                if (window.innerWidth <= 768) setLeftSidebarOpen(false);
                            }}
                            className={`w-full text-left p-3 my-1 rounded-lg flex items-center transition-colors ${activeJuz === juz.id ?
                                '-green-100 text-green-700 font-medium' :
                                'hover:-gray-100'
                                }`}
                        >
                            <span className="-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                {juz.id}
                            </span>
                            <span>{juz.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div
                ref={mainContentRef}
                className={`flex-1 overflow-y-auto transition-all duration-300 ${!leftSidebarOpen && !rightSidebarOpen ? 'mx-0' : !leftSidebarOpen || !rightSidebarOpen ? 'mx-4' : 'mx-2'}`}
            >
                <div className="max-w-4xl mx-auto rounded-lg shadow-md p-4 md:p-6 my-4 -white">
                    {/* Header with toggle buttons and controls */}
                    <div className="flex justify-between items-center mb-6 sticky top-0 bg-background py-2 z-10 space-x-2">
                        <button
                            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                            className="sidebar-toggle p-2 rounded-lg hover:-gray-200 hover:text-gray-800"
                        >
                            {leftSidebarOpen ? '◄' : '►'} Juz
                        </button>

                        <div className="flex-1 flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4">
                            <h1 className="text-xl md:text-2xl font-bold text-green-500 text-center">
                                {showAllSurahs ? 'All Surahs' : `Juz ${activeJuz} - ${juzData.find(j => j.id === activeJuz)?.name}`}
                            </h1>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setFontSize(prev => prev > 1 ? prev - 1 : 1)}
                                    className="px-2 py-1 rounded -gray-200 hover:-gray-300 text-sm"
                                >
                                    A-
                                </button>
                                <button
                                    onClick={() => setFontSize(2)}
                                    className="px-2 py-1 rounded -gray-200 hover:-gray-300 text-sm"
                                >
                                    A
                                </button>
                                <button
                                    onClick={() => setFontSize(prev => prev < 3 ? prev + 1 : 3)}
                                    className="px-2 py-1 rounded -gray-200 hover:-gray-300 text-sm"
                                >
                                    A+
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                            className="sidebar-toggle p-2 rounded-lg hover:-gray-200 hover:text-gray-800"
                        >
                            {rightSidebarOpen ? '►' : '◄'} Surah
                        </button>
                    </div>

                    {(showAllSurahs ? surahs : getSurahsInJuz(activeJuz)).map((surah) => (
                        <div
                            key={surah.number}
                            id={`surah-${surah.number}`}
                            className="mb-8 p-4 rounded-lg hover:-gray-50"
                        >
                            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                                <div className="text-sm text-gray-500">Surah {surah.number}</div>
                                <h2 className="text-xl font-bold text-green-500 text-right">
                                    {surah.englishName} ({surah.name})
                                    <span className="block text-sm font-normal text-gray-500">
                                        {surah.englishNameTranslation}
                                    </span>
                                </h2>
                            </div>
                            <div className={`${fontSizeClasses[fontSize - 1]} font-quran leading-loose mb-6 text-justify`}>
                                {surah.ayahs.map((ayah: any) => (
                                    <span
                                        key={ayah.number}
                                        className="ayah-text hover:-yellow-100 hover:-opacity-50 transition-colors rounded px-1"
                                        data-surah={surah.number}
                                        data-ayah={ayah.numberInSurah}
                                    >
                                        {ayah.text}
                                        <span className="text-sm md:text-base text-gray-400 align-super">
                                            ۝{ayah.numberInSurah}
                                        </span>{' '}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Sidebar - Surah List */}
            <div className={`sidebar ${rightSidebarOpen ? 'w-64' : 'w-0'} bg-background shadow-lg transition-all duration-300 flex-shrink-0 overflow-y-auto z-20`}>
                <div className="p-4 sticky top-0 bg-background border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-green-500">Surahs</h2>
                    <button
                        onClick={() => setRightSidebarOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className="p-2 sticky top-14 z-10 bg-background border-b">
                    <input
                        type="text"
                        placeholder="Search Surah..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 rounded-lg border bg-background border-gray-300"
                    />
                </div>
                <nav className="p-2">
                    {filteredSurahs.map((surah) => (
                        <button
                            key={surah.number}
                            onClick={() => {
                                setShowAllSurahs(true); // Show all surahs when a specific surah is selected
                                document.getElementById(`surah-${surah.number}`)?.scrollIntoView({ behavior: 'smooth' });
                                if (window.innerWidth <= 768) setRightSidebarOpen(false);
                            }}
                            className="w-full text-left p-3 my-1 rounded-lg flex items-center transition-colors hover:-gray-100"
                        >
                            <span className="-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                {surah.number}
                            </span>
                            <div className="text-right flex-1">
                                <div className="font-medium">{surah.englishName}</div>
                                <div className="text-sm text-gray-500">
                                    {surah.name} • {surah.ayahs.length} verses
                                </div>
                            </div>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}