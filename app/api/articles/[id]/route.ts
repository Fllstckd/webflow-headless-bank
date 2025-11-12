// app/api/articles/[id]/route.ts
// FILE INI YANG DIPERBAIKI

import { NextResponse } from 'next/server';

/**
 * Handler ini akan mengambil SATU artikel berdasarkan ID-nya.
 */
export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  const API_TOKEN = process.env.WEBFLOW_API_TOKEN;
  const COLLECTION_ID = process.env.WEBFLOW_ARTICLES_ID;

  // --- PERBAIKAN DIMULAI DI SINI ---
  // Terkadang 'params.id' bisa 'undefined'
  // Kita tambahkan fallback untuk mengambil ID dari URL secara manual
  
  let itemId = params.id; // Coba ambil dari params

  // Fallback jika params.id tidak ada
  if (!itemId) {
    try {
      // Buat objek URL dari request
      const url = new URL(request.url);
      // URL akan terlihat seperti: http://localhost:3000/api/articles/ID_ARTIKEL
      // Kita ambil bagian terakhir dari path
      const pathParts = url.pathname.split('/');
      itemId = pathParts[pathParts.length - 1]; // Ambil bagian terakhir (ID-nya)
    } catch (e) {
      console.error("Gagal mem-parsing URL untuk ID:", e);
      // Biarkan itemId 'undefined' agar error di bawah tertangkap
    }
  }
  // --- BATAS PERBAIKAN ---

  if (!API_TOKEN || !COLLECTION_ID) {
    return NextResponse.json({ message: "Konfigurasi server error" }, { status: 500 });
  }

  // Cek lagi 'itemId' setelah mencoba fallback
  if (!itemId || itemId === '[id]') { // Pastikan kita tidak mendapatkan nama folder
    return NextResponse.json({ message: "Item ID tidak ada di URL" }, { status: 400 });
  }

  // Endpoint Webflow V2 untuk SATU item
  const WEBFLOW_API_URL = `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items/${itemId}`;

  try {
    const response = await fetch(WEBFLOW_API_URL, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'accept-version': '1.0.0',
      },
      cache: 'no-store', // Selalu ambil data terbaru
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Webflow API Error (Single Item):", errorData);
      throw new Error(`Webflow API Error: ${response.status}. Pesan: ${errorData.message}`);
    }

    const data = await response.json();
    // API V2 mengembalikan itemnya langsung
    return NextResponse.json(data); 

  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal mengambil detail artikel dari Webflow", error: error.message },
      { status: 500 }
    );
  }
}