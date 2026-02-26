import type { Metadata } from "next";
import { Sora, Work_Sans } from "next/font/google";
import "../globals.css";

const sora = Sora({
    variable: "--font-heading",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const workSans = Work_Sans({
    variable: "--font-body",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Admin | Explore Tana Toraja",
    description: "Admin Dashboard",
};

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body className={`${sora.variable} ${workSans.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
