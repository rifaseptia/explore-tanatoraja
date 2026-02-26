import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDF6EC]">
            <div className="text-center px-4 max-w-lg">
                <h1 className="text-8xl font-heading font-bold text-[#E63946] mb-4">404</h1>
                <h2 className="text-2xl font-heading font-semibold text-[#2D3436] mb-4">
                    Halaman Tidak Ditemukan
                </h2>
                <p className="text-gray-600 mb-8">
                    Maaf, halaman yang Anda cari tidak tersedia.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-[#E63946] text-white rounded-xl font-medium hover:bg-[#c62d3a] transition-colors"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
