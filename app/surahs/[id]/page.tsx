// app/surahs/[id]/page.tsx

import SurahPageClient from "./SurahPageClient";

export const dynamic = "force-dynamic";

async function getSurahData(id: string) {
  const res = await fetch(
    `https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`
  );
  const data = await res.json();
  if (data.code === 200 && data.data) {
    return { surah: data.data };
  }
  throw new Error("Failed to fetch surah data");
}

export default async function SurahPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // now this lines up with Next.js’ PageProps.params
  const { id } = await params;

  try {
    const { surah } = await getSurahData(id);
    return <SurahPageClient surah={surah} />;
  } catch (error) {
    console.error("Error loading surah:", error);
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

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const res = await fetch("https://api.alquran.cloud/v1/surah");
  const data = await res.json();
  return data.data.map((s: any) => ({
    id: s.number.toString(),
  }));
}
