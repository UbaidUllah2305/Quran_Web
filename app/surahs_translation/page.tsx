import { Card } from "@/components/ui/card";
import Link from "next/link";

async function getSurahs() {
  const res = await fetch('https://api.alquran.cloud/v1/surah');
  const data = await res.json();
  return data.data;
}

export default async function SurahsPage() {
  const surahs = await getSurahs();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Surahs of the Quran</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surahs.map((surah: any) => (
          <Link href={`/surahs_translation/${surah.number}`} key={surah.number}>
            <Card className="p-4 hover:bg-muted transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{surah.englishName}</h2>
                  <p className="text-muted-foreground">{surah.englishNameTranslation}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-arabic">{surah.name}</span>
                  <p className="text-sm text-muted-foreground">
                    {surah.numberOfAyahs} verses
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}