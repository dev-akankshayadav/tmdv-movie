import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MovieDB - Movie Explorer",
  description: "Explore and discover movies with MovieDB powered by TMDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div style={{ minHeight: "100vh" }} className="flex flex-col">
          <AppHeader />
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 py-8">
              {children}
            </div>
          </main>
          <AppFooter />
        </div>
      </body>
    </html>
  );
}
