'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui, sans-serif',
                    backgroundColor: '#FDF6EC',
                }}>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2D3436', marginBottom: '1rem' }}>
                            Terjadi Kesalahan
                        </h2>
                        <p style={{ color: '#636E72', marginBottom: '1.5rem' }}>
                            Maaf, terjadi kesalahan pada halaman ini.
                        </p>
                        <button
                            onClick={() => reset()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#E63946',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                            }}
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
