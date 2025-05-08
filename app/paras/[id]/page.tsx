// app/paras/[id]/page.tsx
import ParaPageClient from "./ParaPageClient";

export const dynamic = "force-dynamic";

async function getParaData(id: string) {
  const res = await fetch(`https://api.alquran.cloud/v1/juz/${id}/ar.alafasy`);
  const data = await res.json();
  if (data.code === 200 && data.data) {
    return { para: data.data };
  }
  throw new Error("Failed to fetch para data");
}

export default async function ParaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const { para } = await getParaData(id);
    return <ParaPageClient para={para} />;
  } catch (error) {
    console.error("Error loading para:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Error Loading Para</h1>
          <p className="text-muted-foreground">
            Failed to load the requested Para. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    const res = await fetch("https://api.alquran.cloud/v1/juz");
    const data = await res.json();
    
    // The API returns juz data in data.data.juzs array
    if (data.data && data.data.juzs) {
      return data.data.juzs.map((juz: any) => ({
        id: juz.number.toString(),
      }));
    }
    
    // Fallback: return all 30 juz numbers if API structure is different
    return Array.from({ length: 30 }, (_, i) => ({
      id: (i + 1).toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    // Fallback if API request fails
    return Array.from({ length: 30 }, (_, i) => ({
      id: (i + 1).toString(),
    }));
  }
}