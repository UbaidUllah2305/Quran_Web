// app/surahs/page.tsx
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
          Quran Surahs
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Explore the 114 Surahs of the Holy Quran in Arabic text
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surahs.map((surah: any) => (
          <Link href={`/surahs/${surah.number}`} key={surah.number}>
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group border-border/50 hover:border-primary/30">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {surah.englishName}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {surah.englishNameTranslation}
                  </p>
                </div>
                <div className="text-right">
                  <span 
                    className="text-2xl font-arabic group-hover:text-primary transition-colors"
                    style={{ fontFamily: 'UthmanicHafs, "Traditional Arabic", sans-serif' }}
                  >
                    {surah.name}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {surah.numberOfAyahs} verses • {surah.revelationType}
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