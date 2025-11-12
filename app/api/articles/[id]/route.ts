import { NextRequest, NextResponse } from 'next/server';

/**
 * Handler ini akan mengambil SATU artikel berdasarkan ID-nya.
 * PERBAIKAN: Mengubah cara penulisan parameter kedua agar sesuai
 * dengan ekspektasi server build Netlify.
 */
export async function GET(
  request: NextRequest,
  context: { params: { id: string } } // <-- PERUBAIKAN UTAMA DI SINI
) {
  const API_TOKEN = process.env.WEBFLOW_API_TOKEN;
  const COLLECTION_ID = process.env.WEBFLOW_ARTICLES_ID;
  
  // Ambil 'id' dari 'context.params'
  const itemId = context.params.id; // <-- PERUBAIKAN KECIL DI SINI

  if (!API_TOKEN || !COLLECTION_ID) {
    return NextResponse.json({ message: "Konfigurasi server error" }, { status: 500 });
  }
  if (!itemId) {
    return NextResponse.json({ message: "Item ID tidak ada" }, { status: 400 });
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
      throw new Error(`Webflow API Error: ${response.status}`);
    }

    const data = await response.json();
    // API V2 mengembalikan itemnya langsung (bukan array 'items')
    return NextResponse.json(data); 

  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal mengambil detail artikel dari Webflow", error: error.message },
      { status: 500 }
    );
  }
}