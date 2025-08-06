"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Zap,
  Shield,
  DollarSign,
  Globe,
  Upload,
  Coins,
  Crown,
  Moon,
  Sun,
  Menu,
  X,
  Twitter,
  Github,
  MessageCircle,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { FloatingPaths } from "@/components/floating_paths";
import Header from "@/components/Header";
import { useWallet } from "@solana/wallet-adapter-react";

export default function SolanaNFTMinting() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mintCount, setMintCount] = useState(12847);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const wallet = useWallet();

  // Simulate live mint counter
  useEffect(() => {
    const interval = setInterval(() => {
      setMintCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    // Apply theme class to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const connectWallet = (walletType: string) => {
    setIsWalletConnected(true);
    // Simulate wallet connection
    console.log(`Connecting to ${walletType}...`);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-green-900 dark:from-purple-950 dark:via-gray-900 dark:to-green-950">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
      {/* Header */}
      <Header
        isWalletConnected={wallet.connected}
        isConnecting={wallet.connecting}
      />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-green-600/20 animate-pulse"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500">
              <Sparkles className="mr-1 h-3 w-3" />
              Powered by Solana
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Mint Your Own NFT on{" "}
              <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
                Solana Instantly
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Create, mint, and trade NFTs on the fastest blockchain. No coding
              required, just pure creativity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href={"/create"}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white text-lg px-8 py-6"
                >
                  Create Your NFT Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-6 bg-transparent"
              >
                View Gallery
              </Button>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {mintCount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">NFTs Minted</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">5.2K</div>
                  <div className="text-sm text-gray-400">Creators</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">$0.01</div>
                  <div className="text-sm text-gray-400">Avg Fee</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    99.9%
                  </div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Animated NFT Cards */}
        <div className="absolute top-20 left-10 animate-bounce delay-1000">
          <Card className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 border-0 rotate-12">
            <CardContent className="p-2 h-full flex items-center justify-center">
              <Crown className="h-8 w-8 text-white" />
            </CardContent>
          </Card>
        </div>
        <div className="absolute top-40 right-10 animate-bounce delay-2000">
          <Card className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 border-0 -rotate-12">
            <CardContent className="p-2 h-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Why Choose Solana?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of NFT minting with unparalleled speed and
              efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-300">
                  Mint NFTs in seconds, not minutes. Solana's speed is
                  unmatched.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Secure</h3>
                <p className="text-gray-300">
                  Bank-level security with decentralized validation and
                  immutable records.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Low Fees</h3>
                <p className="text-gray-300">
                  Mint for pennies, not dollars. Keep more of your profits.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-900/50 to-pink-800/50 border-pink-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Fully Decentralized
                </h3>
                <p className="text-gray-300">
                  True ownership with no central authority. Your NFTs, your
                  rules.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section id="process" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From concept to blockchain in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-10 w-10 text-white" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                  1
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Upload Metadata
              </h3>
              <p className="text-gray-300">
                Upload your artwork, add title, description, and properties. Our
                platform handles the technical details.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-400 rounded-full flex items-center justify-center mx-auto">
                  <Coins className="h-10 w-10 text-white" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                  2
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Mint on Solana
              </h3>
              <p className="text-gray-300">
                Click mint and watch your NFT come to life on the Solana
                blockchain in seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-pink-400 rounded-full flex items-center justify-center mx-auto">
                  <Crown className="h-10 w-10 text-white" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                  3
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Own Your NFT
              </h3>
              <p className="text-gray-300">
                Your NFT is now yours forever. Trade, stake, or showcase it
                across the ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to succeed in the NFT space
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-purple-900/30 to-black/30 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <TrendingUp className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  NFT Staking
                </h3>
                <p className="text-gray-300 text-sm">
                  Earn rewards by staking your NFTs in our yield farming pools.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/30 to-black/30 border-green-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <DollarSign className="h-8 w-8 text-green-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Royalties</h3>
                <p className="text-gray-300 text-sm">
                  Set custom royalty rates and earn from every secondary sale.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/30 to-black/30 border-blue-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <Globe className="h-8 w-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  Cross-Chain
                </h3>
                <p className="text-gray-300 text-sm">
                  Bridge your NFTs to other blockchains seamlessly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-900/30 to-black/30 border-pink-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-pink-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  Fractional Ownership
                </h3>
                <p className="text-gray-300 text-sm">
                  Split ownership of high-value NFTs among multiple investors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Minting?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators who have already minted over{" "}
              {mintCount.toLocaleString()} NFTs on our platform.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white text-xl px-12 py-6"
            >
              Start Minting Now
              <Sparkles className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-green-500"></div>
                <span className="text-xl font-bold text-white">SolMint</span>
              </div>
              <p className="text-gray-400">
                The fastest and most affordable way to mint NFTs on Solana.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Docs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Mint NFTs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Staking
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Royalties
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-6 w-6" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-purple-500/20 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 SolMint. All rights reserved. Built on Solana.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
