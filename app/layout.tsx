import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/AppProvider";
import { Toaster } from "sonner";
require("@solana/wallet-adapter-react-ui/styles.css");

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolMint - Mint Your Own NFT on Solana Instantly",
  description:
    "Create, mint, and trade NFTs on the fastest blockchain. No coding required, just pure creativity.",
  keywords: ["Mint Your Own NFT", "Solana", "NFT", "create NFT", "blockchain"],
  authors: [{ name: "Piyush saini" }],
  creator: "Piyush Saini",
  publisher: "Piyush Saini",
  robots: "index, follow",
  openGraph: {
    title: "SolMint - Mint Your Own NFT on Solana Instantly",
    description:
      "Create, mint, and trade NFTs on the fastest blockchain. No coding required, just pure creativity.",
    type: "website",
    images: [
      {
        url: "https://apneajyhbpncbciasirk.supabase.co/storage/v1/object/public/nft-storage/solmint-landingpage.png",
        width: 1200,
        height: 630,
        alt: "Liquid ETH",
      },
    ],
    siteName: "VoiceAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolMint - Mint Your Own NFT on Solana Instantly",
    description:
      "Create, mint, and trade NFTs on the fastest blockchain. No coding required, just pure creativity.",
    images: [
      "https://apneajyhbpncbciasirk.supabase.co/storage/v1/object/public/nft-storage/solmint-landingpage.png",
    ],
    creator: "Piyush Saini",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3B82F6",
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
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
