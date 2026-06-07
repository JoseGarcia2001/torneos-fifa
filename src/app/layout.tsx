import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://torneos-fifa-ten.vercel.app"),
  title: "Copa Familiar FIFA ⚽",
  description:
    "Torneo de FIFA en familia: sorteo de grupos en vivo, resultados y fase final.",
  openGraph: {
    title: "Copa Familiar FIFA",
    description:
      "Torneo de FIFA en familia: sorteo de grupos en vivo, resultados y fase final.",
    type: "website",
    locale: "es_CO",
    siteName: "Copa Familiar FIFA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Copa Familiar FIFA",
    description: "Torneo de FIFA en familia: sorteo, resultados y fase final.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
