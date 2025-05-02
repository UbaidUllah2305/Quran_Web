// app/api/quran/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const translation = searchParams.get('translation') || 'en.asad';
  
  try {
    // Fetch complete Quran data with translation
    const res = await fetch(`https://api.alquran.cloud/v1/quran/${translation}`);
    const data = await res.json();
    
    return NextResponse.json(data.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Quran data' },
      { status: 500 }
    );
  }
}