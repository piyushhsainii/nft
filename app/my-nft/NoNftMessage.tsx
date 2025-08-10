import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Globe, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

const NoNftMessage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-teal-900 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            My NFTs
          </h1>
        </div>

        {/* Empty State */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-full mb-6 border border-purple-500/30">
              <Sparkles className="h-10 w-10 text-purple-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              No NFTs Found
            </h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              You haven't created any NFTs yet. Start your journey by minting
              your first NFT on Solana!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First NFT
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-teal-500 text-teal-400 hover:bg-teal-500/10 bg-transparent"
              >
                <Globe className="mr-2 h-4 w-4" />
                Explore Marketplace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NoNftMessage;
