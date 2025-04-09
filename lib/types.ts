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


export interface PaginationState {
  currentPage: number;
  totalPages: number;
  versesPerPage: number;
}

// lib/types.ts
export type Bookmark = {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  timestamp: string;
};