// Memberitahu Next.js bahwa ini adalah komponen interaktif (Client Component)
// Ini wajib untuk menggunakan useState, useEffect, dan Link
'use client'; 

import { useState, useEffect } from 'react';
// import Link from 'next/link'; // Impor Link untuk navigasi (DIHAPUS UNTUK MEMPERBAIKI ERROR BUILD)

// ===================================================================
// INTERFACE DATA (SESUAI STRUKTUR API V2)
// ===================================================================

// Tipe data untuk Artikel
interface Article {
  id: string; // ID unik dari Webflow
  fieldData: {
    name: string;      // Field "Name" (Judul artikel Anda)
    description?: string; // Field "Description" (Deskripsi Anda)
    image?: {          // Field "image" (Gambar Anda)
      url: string;
    };
    // Kita tidak butuh 'full-text' di halaman ini, tapi halaman detail butuh
  }
}

// Tipe data untuk Homepage (Hero Section)
interface HomepageItem {
  id: string;
  fieldData: {
    name: string;         // 'name'/'title' di CMS Anda
    description?: string;  // 'description' (Rich Text) di CMS Anda
    background?: {         // 'background' (image) di CMS Anda
      url: string;
    };
  }
}

/**
 * Helper function untuk mendapatkan URL gambar dengan aman
 */
function getWebflowMedia(mediaField: { url: string } | undefined) {
  if (!mediaField || !mediaField.url) {
    return ""; // Kembalikan string kosong jika tidak ada gambar
  }
  return mediaField.url;
}

// ===================================================================
// KOMPONEN UTAMA HALAMAN
// ===================================================================
export default function Home() {
  // State untuk Artikel
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [errorArticles, setErrorArticles] = useState<string | null>(null);

  // State untuk Homepage
  const [homepageData, setHomepageData] = useState<HomepageItem | null>(null);
  const [isLoadingHomepage, setIsLoadingHomepage] = useState(true);
  const [errorHomepage, setErrorHomepage] = useState<string | null>(null);


  // useEffect untuk mengambil SEMUA data saat halaman dimuat
  useEffect(() => {
    // 1. Fetch Artikel
    // PERBAIKAN: Gunakan URL absolut (http://localhost:3000) untuk fetch 
    // karena environment eksekusi tidak bisa me-resolve path relatif ('/api/articles')
    fetch('/api/articles')
      .then(response => {
        if (!response.ok) throw new Error('Gagal mengambil Artikel dari /api/articles');
        return response.json();
      })
      .then((data: Article[]) => {
        setArticles(data);
        setIsLoadingArticles(false);
      })
      .catch(err => {
        console.error("Error Artikel:", err);
        setErrorArticles((err as Error).message);
        setIsLoadingArticles(false);
      });

    // 2. Fetch Homepage
    // PERBAIKAN: Gunakan URL absolut (http://localhost:3000) untuk fetch
    fetch('/api/homepage')
      .then(response => {
        if (!response.ok) throw new Error('Gagal mengambil data Homepage dari /api/homepage');
        return response.json();
      })
      .then((data: HomepageItem[]) => {
        // Asumsikan data Homepage adalah item pertama di koleksi
        if (data && data.length > 0) {
          setHomepageData(data[0]);
        }
        setIsLoadingHomepage(false);
      })
      .catch(err => {
        console.error("Error Homepage:", err);
        setErrorHomepage((err as Error).message);
        setIsLoadingHomepage(false);
      });
  }, []); // [] = jalankan sekali saja

  /**
   * Fungsi untuk me-render konten Artikel
   */
  const renderArticles = () => {
    if (isLoadingArticles) {
      return <p className="text-gray-600 col-span-3 text-center">Memuat artikel...</p>;
    }
    if (errorArticles) {
      return <p className="text-red-500 col-span-3 text-center">Error: {errorArticles}</p>;
    }
    if (articles.length === 0) {
      return <p className="text-gray-600 col-span-3 text-center">Belum ada artikel.</p>;
    }

    // Loop data artikel dan ubah menjadi card
    return articles.map(article => (
      <div key={article.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
        <img 
          src={getWebflowMedia(article.fieldData.image) || 'https://placehold.co/400x250/e2e8f0/cccccc?text=No+Image'} 
          alt={article.fieldData.name || 'Gambar Artikel'} 
          className="w-full h-48 object-cover"
        />
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold flex-grow">{article.fieldData.name}</h3>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            {article.fieldData.description || ''}
          </p>
          
          {/* PERUBAHAN: Menggunakan <a> standar untuk memperbaiki error build */}
          <a 
            href={`/artikel/${article.id}`} 
            className="inline-block text-green-600 font-semibold mt-4 hover:underline"
          >
            Baca Selengkapnya
          </a>
        </div>
      </div>
    ));
  };
  
  // URL Gambar Latar Belakang Hero
  const heroBgUrl = homepageData ? getWebflowMedia(homepageData.fieldData.background) : '';

  // ===================================================================
  // TAMPILAN JSX (HTML UNTUK REACT)
  // ===================================================================
  return (
    <>
      {/* ========================================
        HEADER DENGAN NAVBAR STATIS LENGKAP
        ========================================
      */}
      <header className="border-b border-gray-200 sticky top-0 z-50" style={{ backgroundColor: '#003539', color: '#afee00' }}>
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-10">
                {/* Logo */}
                <a href="/" className="flex flex-col">
                    <span className="font-bold text-2xl" style={{ color: '#00D563' }}>superbank</span>
                    <span className="text-xs text-gray-500 -mt-1" style={{ color: '#afee00' }}>Bagian dari Grab</span>
                </a>
                
                {/* Daftar Menu Lengkap */}
                <ul id="navbar-links" className="hidden md:flex items-center gap-6">
                    <li key="nav-tentang"><a href="/tentang-kami" className="text-sm font-medium hover:text-white" style={{ color: '#afee00' }}>Tentang Kami</a></li>
                    <li key="nav-produk"><a href="/produk" className="text-sm font-medium hover:text-white" style={{ color: '#afee00' }}>Produk</a></li>
                    <li key="nav-promo"><a href="/promo" className="text-sm font-medium hover:text-white" style={{ color: '#afee00' }}>Promo</a></li>
                    <li key="nav-mitra"><a href="/mitra" className="text-sm font-medium hover:text-white" style={{ color: '#afee00' }}>Mitra</a></li>
                    <li key="nav-blog"><a href="/blog" className="text-sm font-medium hover:text-white" style={{ color: '#afee00' }}>Blog & Berita</a></li>
                    <li key="nav-career"><a href="/career" className="text-sm font-medium hover:text-white" style={{ color: '#afee00' }}>Career</a></li>
                    <li key="nav-bantuan"><a href="/bantuan" className="text-sm font-medium hover:text-white" style={{ color: '#afee00' }}>Bantuan</a></li>
                </ul>
            </div>
            
            {/* Tombol Kanan */}
            <div className="flex items-center gap-4">
                <a href="#" className="bg-brand-dark px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800" style={{ color: '#afee00' }}>
                    Download App
                </a>
                <a href="#" className="text-sm font-medium flex items-center gap-1 text-gray-600" style={{ color: '#afee00' }}>
                    EN
                </a>
            </div>
          </nav>
      </header>

      <main>
        {/* ========================================
          HERO SECTION DINAMIS
          ========================================
        */}
        {/* Tampilkan Loading... */}
        {isLoadingHomepage && (
          <div className="pt-20 pb-12" style={{ backgroundColor: '#C5F946', minHeight: '300px' }}>
             <div className="container mx-auto px-6"><p>Memuat hero...</p></div>
          </div>
        )}
        {/* Tampilkan Error */}
        {errorHomepage && (
           <div className="pt-20 pb-12" style={{ backgroundColor: '#FADBD8' }}>
             <div className="container mx-auto px-6"><p>Error: {errorHomepage}</p></div>
          </div>
        )}
        {/* Tampilkan Sukses */}
        {!isLoadingHomepage && homepageData && (
          <section 
            className="pt-20 pb-12 relative overflow-hidden bg-cover bg-center bg-no-repeat" 
            style={{ 
              backgroundColor: '#C5F946', // Fallback color
              backgroundImage: heroBgUrl ? `url(${heroBgUrl})` : 'none' 
            }}
          >
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-md">
                    {/* Data Title dari CMS */}
                    <h1 className="text-7xl font-bold text-brand-dark leading-tight">
                      {homepageData.fieldData.name || 'Judul Default'}
                    </h1>
                    
                    {/* Data Deskripsi (Rich Text) dari CMS */}
                    <div
                      className="text-3xl font-medium text-brand-dark mt-2"
                      dangerouslySetInnerHTML={{ 
                        __html: homepageData.fieldData.description || 'Deskripsi default...' 
                      }} 
                    />

                    <a href="#" className="inline-block bg-brand-dark text-white px-6 py-3 rounded-full font-semibold mt-6 hover:bg-gray-800">
                        Cek Detailnya Disini!
                    </a>
                </div>
                {/* Sponsor statis seperti di HTML asli */}
                <div className="mt-20 flex items-center gap-6">
                    <span className="text-sm font-medium">Superbank bagian dari</span>
                    {/* Ganti placeholder ini dengan logo jika perlu */}
                    <span className="h-5 px-4 py-1 bg-gray-500/20 rounded">Grab</span>
                    <span className="h-5 px-4 py-1 bg-gray-500/20 rounded">Emtek</span>
                </div>
            </div>
            {/* Gambar HP Statis (jika perlu) - Anda bisa menggantinya dengan <img> */}
            {/* <div className="absolute top-10 right-0 w-1/2 z-0"> ... </div> */}
          </section>
        )}

        {/* ========================================
          BAGIAN ARTIKEL DINAMIS
          ========================================
        */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-gray-900 max-w-xs leading-tight">
              Artikel Terbaru Kami
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {renderArticles()}
            </div>
          </div>
        </section>
        
        {/* Salin-tempel section statis lainnya (PAS, Untung, dll) di sini */}
        
      </main>

      {/* Salin-tempel footer statis Anda di sini */}
      {/* <footer className="bg-brand-dark ...">...</footer> */}
    </>
  );
}