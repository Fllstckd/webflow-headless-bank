// app/api/homepage/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const API_TOKEN = process.env.WEBFLOW_API_TOKEN;
  // Kita akan tambahkan ID ini ke .env.local nanti
  const COLLECTION_ID = process.env.WEBFLOW_HOMEPAGE_ID; 

  if (!API_TOKEN || !COLLECTION_ID) {
    console.error("Variabel environment API Homepage tidak diatur");
    return NextResponse.json(
      { message: "Konfigurasi server error" },
      { status: 500 }
    );
  }

  // Menggunakan API v2
  const WEBFLOW_API_URL = `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items`;

  try {
    const response = await fetch(WEBFLOW_API_URL, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'accept-version': '1.0.0',
      },
      cache: 'no-store', 
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Webflow API Error (Homepage):", errorData);
      throw new Error(`Webflow API Error: ${response.status}`);
    }

    const data = await response.json();
    // Kirim semua item (biasanya hanya ada 1 untuk homepage)
    return NextResponse.json(data.items); 

  } catch (error: any) {
    console.error("Error fetching from Webflow (Homepage):", error.message);
    return NextResponse.json(
      { message: "Gagal mengambil data Homepage dari Webflow", error: error.message },
      { status: 500 }
    );
  }
}