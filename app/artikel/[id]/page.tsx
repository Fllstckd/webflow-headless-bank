// app/artikel/[id]/page.tsx

// Wajib untuk 'useState', 'useEffect', 'useParams'
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Hook untuk membaca URL
import React from 'react'; // Impor React

// ===================================================================
// INTERFACE DATA (TERMASUK FIELD 'full-text' BARU ANDA)
// ===================================================================
interface Article {
  id: string;
  fieldData: {
    name: string;
    description?: string;
    image?: {
      url: string;
    };
    'full-text'?: string; // <-- FIELD BARU ANDA (slug: full-text)
  }
}

/**
 * Helper function untuk gambar (sama seperti di homepage)
 */
function getWebflowMedia(mediaField: { url: string } | undefined) {
  if (!mediaField || !mediaField.url) {
    // Placeholder yang lebih besar untuk halaman detail
    return "https://placehold.co/800x400/e2e8f0/cccccc?text=No+Image";
  }
  return mediaField.url;
}

// ===================================================================
// KOMPONEN HALAMAN DETAIL (CLIENT COMPONENT)
// ===================================================================
export default function ArticleDetailPage() {
  // State untuk artikel, loading, dan error
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dapatkan parameter 'id' dari URL (misal: /artikel/ID_ARTIKEL)
  const params = useParams();
  const id = params.id as string; // 'id' harus sama dengan nama folder [id]

  // useEffect untuk mengambil data saat 'id' tersedia
  useEffect(() => {
    // Hanya jalankan fetch jika 'id' sudah ada
    if (id) {
      
      // PERBAIKAN: Gunakan URL absolut untuk fetch
      // Ganti 'localhost:3000' jika port Anda berbeda
      const api_url = `http://localhost:3000/api/articles/${id}`;

      // Panggil API route BARU kita
      fetch(api_url)
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => {
              // Teruskan pesan error dari backend (misal: "Item ID tidak ada")
              throw new Error(err.message || 'Gagal memuat artikel');
            });
          }
          return response.json();
        })
        .then((data: Article) => {
          setArticle(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError((err as Error).message);
          setIsLoading(false);
        });
    } else if (params) {
      // Handle jika 'id' tidak ada di params
      console.warn("Parameter 'id' tidak ditemukan di URL params:", params);
      setError("Parameter 'id' tidak ditemukan.");
      setIsLoading(false);
    }
  }, [id, params]); // Dependensi [id, params]: jalankan ulang jika id berubah

  // Tampilkan status Loading...
  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        Memuat artikel...
      </div>
    );
  }

  // Tampilkan status Error
  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  // Tampilkan jika artikel tidak ditemukan
  if (!article) {
    return (
      <div className="container mx-auto p-8 text-center">
        Artikel tidak ditemukan.
      </div>
    );
  }

  // --- SUKSES ---
  // Tampilkan halaman detail artikel
  return (
    <>
      {/* Salin-tempel HEADER Anda dari app/page.tsx */}
      <header className="border-b border-gray-200 sticky top-0 z-50" style={{ backgroundColor: '#003539', color: '#afee00' }}>
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <ul id="navbar-links" className="hidden md:flex items-center gap-6">
                <li key="nav-tentang"><a href="/" className="text-sm font-medium hover:text-white" style={{ color: '#afee00' }}>Home</a></li>
                <li key="nav-bantuan"><a href="/bantuan" className="text-sm font-medium hover:text-white" style={{ color: '#afee00' }}>Bantuan</a></li>
            </ul>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Judul Artikel */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          {article.fieldData.name}
        </h1>
        
        {/* Deskripsi Singkat (Opsional, jika Anda mau) */}
        <p className="text-lg text-gray-600 mt-4">
          {article.fieldData.description}
        </p>

        {/* Gambar Artikel */}
        <img 
          src={getWebflowMedia(article.fieldData.image)} 
          alt={article.fieldData.name} 
          className="w-full h-auto md:h-96 object-cover rounded-lg my-8 bg-gray-100 shadow-md"
        />
        
        {/* Konten FULL-TEXT
          Kita gunakan 'dangerouslySetInnerHTML' karena ini adalah Rich Text (HTML)
          Pastikan Anda sudah menginstal @tailwindcss/typography
        */}
        <div 
          className="prose lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: article.fieldData['full-text'] || ''
          }} 
        />
      </main>
      
      {/* Salin-tempel FOOTER Anda dari app/page.tsx */}
      {/* <footer className="bg-brand-dark ...">...</footer> */}
    </>
  );
}