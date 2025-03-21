import SurahPageClient from "./SurahPageClient/page";

async function getSurahData(id: string) {
  const [surahRes, translationRes, audioRes] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/surah/${id}`),
    fetch(`https://api.alquran.cloud/v1/surah/${id}/en.asad`),
    fetch(`https://api.quran.com/api/v4/verses/by_chapter/${id}?language=en&words=true&audio=7`)
  ]);

  const surahData = await surahRes.json();
  const translationData = await translationRes.json();
  const audioData = await audioRes.json();

  const verseAudios = audioData.verses.map((verse: any) => ({
    numberInSurah: verse.verse_number,
    audioUrl: verse.audio.url,
  }));

  return {
    surah: surahData.data,
    translation: translationData.data,
    verseAudios,
  };
}

export default async function SurahPage({ params }: { params: { id: string } }) {
  const { surah, translation, verseAudios } = await getSurahData(params.id);

  return <SurahPageClient surah={surah} translation={translation} />;
}

export async function generateStaticParams() {
  const res = await fetch("https://api.alquran.cloud/v1/surah");
  const data = await res.json();
  const surahs = data.data;

  return surahs.map((surah: any) => ({
    id: surah.number.toString(),
  }));
}