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
  // Use NEXT_PUBLIC_METADATA_BASE to set absolute base for Open Graph / Twitter images
  // Fallback to http://localhost:3001 when the env var is not set (dev).
  metadataBase: new URL(process.env.NEXT_PUBLIC_METADATA_BASE ?? "http://localhost:3001"),
  title: "Barie",
  description: "Seu emagrecimento organizado dia após dia",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/newBarieIcon.png", sizes: "192x192" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Barie",
    description: "Seu emagrecimento organizado dia após dia",
    siteName: "Barie",
    type: "website",
    images: [
      {
        url: "/images/newBarieIcon.png",
        width: 1576,
        height: 1064,
        alt: "Barie - emagrecimento organizado",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barie",
    description: "Seu emagrecimento organizado dia após dia",
    images: ["/images/newBarieIcon.png"],
  },
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
        {children}
      </body>
    </html>
  );
}
