import { NextResponse } from 'next/server';

// Ini adalah 'backend' Anda. File ini berjalan di server.

export async function GET(request: Request) {
  // Ambil token dan ID dari environment variable yang aman
  const API_TOKEN = process.env.WEBFLOW_API_TOKEN;
  const COLLECTION_ID = process.env.WEBFLOW_ARTICLES_ID;

  // Pastikan variabel ada
  if (!API_TOKEN || !COLLECTION_ID) {
    console.error("Variabel environment API tidak diatur");
    return NextResponse.json(
      { message: "Konfigurasi server error" },
      { status: 500 }
    );
  }

  const WEBFLOW_API_URL = `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items`;

  try {
    // Lakukan fetch dari sisi server
    const response = await fetch(WEBFLOW_API_URL, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'accept-version': '1.0.0',
      },
      // Tambahkan 'cache: no-store' untuk memastikan data selalu baru
      // saat development. Next.js akan meng-cache fetch() secara agresif.
      cache: 'no-store', 
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Webflow API Error:", errorData);
      throw new Error(`Webflow API Error: ${response.status}`);
    }

    const data = await response.json();

    // Kirim data yang berhasil didapat kembali ke frontend
    return NextResponse.json(data.items);

  } catch (error: any) {
    console.error("Error fetching from Webflow:", error.message);
    return NextResponse.json(
      { message: "Gagal mengambil data dari Webflow", error: error.message },
      { status: 500 }
    );
  }
}