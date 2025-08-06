import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Activity, Wallet2 } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Badge } from "./ui/badge";
import { div } from "framer-motion/client";

const Header = ({
  isWalletConnected,
  isConnecting,
}: {
  isWalletConnected: boolean;
  isConnecting: boolean;
}) => {
  return (
    <header className="relative z-50 border-b border-purple-500/20 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-green-500"></div>
            <span className="text-xl font-bold text-white">SolMint</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#process"
              className="text-gray-300 hover:text-white transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="#about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isConnecting ? (
              <div></div>
            ) : !isWalletConnected ? (
              <div className="hidden md:flex space-x-2">
                <WalletMultiButton />
              </div>
            ) : (
              <Badge className="bg-green-500/20 text-green-400 border-green-500">
                <Activity className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
