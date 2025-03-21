export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  translation: string;
  audioUrl?: string;
}

export interface Bookmark {
  surahNumber: number;
  ayahNumber: number;
  timestamp: string;
  surahName: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  versesPerPage: number;
}