// app/paras/page.tsx
import { Card } from "@/components/ui/card";
import Link from "next/link";

// Juz data structure
interface Juz {
  number: number;
  start: {
    surah: {
      number: number;
      englishName: string;
    };
    ayah: number;
  };
  end: {
    surah: {
      number: number;
      englishName: string;
    };
    ayah: number;
  };
}

// Predefined Juz data since the API doesn't provide complete info
const JUZ_DATA: Juz[] = [
  { number: 1, start: { surah: { number: 1, englishName: "Al-Fatiha" }, ayah: 1 }, end: { surah: { number: 2, englishName: "Al-Baqarah" }, ayah: 141 } },
  { number: 2, start: { surah: { number: 2, englishName: "Al-Baqarah" }, ayah: 142 }, end: { surah: { number: 2, englishName: "Al-Baqarah" }, ayah: 252 } },
  { number: 3, start: { surah: { number: 2, englishName: "Al-Baqarah" }, ayah: 253 }, end: { surah: { number: 3, englishName: "Aal-e-Imran" }, ayah: 92 } },
  { number: 4, start: { surah: { number: 3, englishName: "Aal-e-Imran" }, ayah: 93 }, end: { surah: { number: 4, englishName: "An-Nisa" }, ayah: 23 } },
  { number: 5, start: { surah: { number: 4, englishName: "An-Nisa" }, ayah: 24 }, end: { surah: { number: 4, englishName: "An-Nisa" }, ayah: 147 } },
  { number: 6, start: { surah: { number: 4, englishName: "An-Nisa" }, ayah: 148 }, end: { surah: { number: 5, englishName: "Al-Ma'idah" }, ayah: 81 } },
  { number: 7, start: { surah: { number: 5, englishName: "Al-Ma'idah" }, ayah: 82 }, end: { surah: { number: 6, englishName: "Al-An'am" }, ayah: 110 } },
  { number: 8, start: { surah: { number: 6, englishName: "Al-An'am" }, ayah: 111 }, end: { surah: { number: 7, englishName: "Al-A'raf" }, ayah: 87 } },
  { number: 9, start: { surah: { number: 7, englishName: "Al-A'raf" }, ayah: 88 }, end: { surah: { number: 8, englishName: "Al-Anfal" }, ayah: 40 } },
  { number: 10, start: { surah: { number: 8, englishName: "Al-Anfal" }, ayah: 41 }, end: { surah: { number: 9, englishName: "At-Tawbah" }, ayah: 92 } },
  { number: 11, start: { surah: { number: 9, englishName: "At-Tawbah" }, ayah: 93 }, end: { surah: { number: 11, englishName: "Hud" }, ayah: 5 } },
  { number: 12, start: { surah: { number: 11, englishName: "Hud" }, ayah: 6 }, end: { surah: { number: 12, englishName: "Yusuf" }, ayah: 52 } },
  { number: 13, start: { surah: { number: 12, englishName: "Yusuf" }, ayah: 53 }, end: { surah: { number: 15, englishName: "Al-Hijr" }, ayah: 1 } },
  { number: 14, start: { surah: { number: 15, englishName: "Al-Hijr" }, ayah: 1 }, end: { surah: { number: 16, englishName: "An-Nahl" }, ayah: 128 } },
  { number: 15, start: { surah: { number: 17, englishName: "Al-Isra" }, ayah: 1 }, end: { surah: { number: 18, englishName: "Al-Kahf" }, ayah: 74 } },
  { number: 16, start: { surah: { number: 18, englishName: "Al-Kahf" }, ayah: 75 }, end: { surah: { number: 20, englishName: "Ta-Ha" }, ayah: 135 } },
  { number: 17, start: { surah: { number: 21, englishName: "Al-Anbiya" }, ayah: 1 }, end: { surah: { number: 22, englishName: "Al-Hajj" }, ayah: 78 } },
  { number: 18, start: { surah: { number: 23, englishName: "Al-Mu'minun" }, ayah: 1 }, end: { surah: { number: 25, englishName: "Al-Furqan" }, ayah: 20 } },
  { number: 19, start: { surah: { number: 25, englishName: "Al-Furqan" }, ayah: 21 }, end: { surah: { number: 27, englishName: "An-Naml" }, ayah: 55 } },
  { number: 20, start: { surah: { number: 27, englishName: "An-Naml" }, ayah: 56 }, end: { surah: { number: 29, englishName: "Al-Ankabut" }, ayah: 45 } },
  { number: 21, start: { surah: { number: 29, englishName: "Al-Ankabut" }, ayah: 46 }, end: { surah: { number: 33, englishName: "Al-Ahzab" }, ayah: 30 } },
  { number: 22, start: { surah: { number: 33, englishName: "Al-Ahzab" }, ayah: 31 }, end: { surah: { number: 36, englishName: "Ya-Sin" }, ayah: 27 } },
  { number: 23, start: { surah: { number: 36, englishName: "Ya-Sin" }, ayah: 28 }, end: { surah: { number: 39, englishName: "Az-Zumar" }, ayah: 31 } },
  { number: 24, start: { surah: { number: 39, englishName: "Az-Zumar" }, ayah: 32 }, end: { surah: { number: 41, englishName: "Fussilat" }, ayah: 46 } },
  { number: 25, start: { surah: { number: 41, englishName: "Fussilat" }, ayah: 47 }, end: { surah: { number: 45, englishName: "Al-Jathiya" }, ayah: 37 } },
  { number: 26, start: { surah: { number: 46, englishName: "Al-Ahqaf" }, ayah: 1 }, end: { surah: { number: 51, englishName: "Adh-Dhariyat" }, ayah: 30 } },
  { number: 27, start: { surah: { number: 51, englishName: "Adh-Dhariyat" }, ayah: 31 }, end: { surah: { number: 57, englishName: "Al-Hadid" }, ayah: 29 } },
  { number: 28, start: { surah: { number: 58, englishName: "Al-Mujadila" }, ayah: 1 }, end: { surah: { number: 66, englishName: "At-Tahrim" }, ayah: 12 } },
  { number: 29, start: { surah: { number: 67, englishName: "Al-Mulk" }, ayah: 1 }, end: { surah: { number: 77, englishName: "Al-Mursalat" }, ayah: 50 } },
  { number: 30, start: { surah: { number: 78, englishName: "An-Naba" }, ayah: 1 }, end: { surah: { number: 114, englishName: "An-Nas" }, ayah: 6 } }
];

async function getParas() {
  try {
    const res = await fetch('https://api.alquran.cloud/v1/juz');
    const data = await res.json();
    
    // If API returns proper data, use it
    if (data.data && Array.isArray(data.data.juzs)) {
      return data.data.juzs.map((juz: any) => ({
        number: juz.number,
        start: {
          surah: {
            number: juz.start.surah.number,
            englishName: juz.start.surah.englishName
          },
          ayah: juz.start.ayah
        },
        end: {
          surah: {
            number: juz.end.surah.number,
            englishName: juz.end.surah.englishName
          },
          ayah: juz.end.ayah
        }
      }));
    }
    
    // Fallback to our predefined data
    return JUZ_DATA;
  } catch (error) {
    console.error("Error fetching juz data:", error);
    return JUZ_DATA;
  }
}

export default async function ParasPage() {
  const paras = await getParas();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
          Quran Paras (Juz)
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Explore the 30 Juz of the Holy Quran
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paras.map((para: Juz) => (
          <Link href={`/paras/${para.number}`} key={para.number}>
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group border-border/50 hover:border-primary/30">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    Juz {para.number}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Starts at {para.start.surah.englishName} {para.start.ayah}
                  </p>
                </div>
                <div className="text-right">
                  <span 
                    className="text-2xl font-arabic group-hover:text-primary transition-colors"
                    style={{ fontFamily: 'UthmanicHafs, "Traditional Arabic", sans-serif' }}
                  >
                    الجزء {para.number}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ends at {para.end.surah.englishName} {para.end.ayah}
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