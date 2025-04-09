import SurahPageClient from "./SurahPageClient";

export const dynamic = 'force-dynamic';

async function getSurahData(id: string, translation: string = 'en.asad') {
  try {
    const [surahRes, translationRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${id}`),
      fetch(`https://api.alquran.cloud/v1/surah/${id}/${translation}`),
    ]);

    const translationData = await translationRes.json();
    if (translationData.code === 200 && translationData.data) {
      return {
        surah: (await surahRes.json()).data,
        translation: translationData.data,
      };
    } else {
      const fallbackRes = await fetch(`https://api.alquran.cloud/v1/surah/${id}/en.asad`);
      return {
        surah: (await surahRes.json()).data,
        translation: (await fallbackRes.json()).data,
      };
    }
  } catch (error) {
    console.error("Error fetching surah data:", error);
    throw error;
  }
}

export default async function SurahPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const translation = Array.isArray(resolvedSearchParams.translation)
    ? resolvedSearchParams.translation[0]
    : resolvedSearchParams.translation || 'en.asad';
  const { id } = resolvedParams;

  try {
    const { surah, translation: translationData } = await getSurahData(id, translation);

    if (!surah || !translationData) {
      throw new Error("Failed to load surah data");
    }

    return <SurahPageClient surah={surah} translation={translationData} />;
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Error Loading Surah</h1>
          <p className="text-muted-foreground">
            Failed to load the requested Surah. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

export async function generateStaticParams() {
  const res = await fetch("https://api.alquran.cloud/v1/surah");
  const data = await res.json();
  return data.data.map((surah: any) => ({
    id: surah.number.toString(),
  }));
}