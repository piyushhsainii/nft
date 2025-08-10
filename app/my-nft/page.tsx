"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Filter,
  Grid3X3,
  List,
  ExternalLink,
  Share2,
  Copy,
  Eye,
  Wallet,
  Plus,
  Sparkles,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  Crown,
  Zap,
  Globe,
  Heart,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import NoNftMessage from "./NoNftMessage";
import { getStatusColor } from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
  royalty: number;
  transactionId: string;
  mintDate: string;
  views: number;
  likes: number;
  price?: number;
  status: "minted" | "listed" | "sold";
}

export default function MyNFTs() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const wallet = useWallet();

  const filteredAndSortedNFTs = nfts
    .filter((nft) => {
      const matchesSearch =
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || nft.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.mintDate).getTime() - new Date(a.mintDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.mintDate).getTime() - new Date(b.mintDate).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "views":
          return b.views - a.views;
        case "likes":
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  const copyTransactionId = (txId: string) => {
    navigator.clipboard.writeText(txId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "minted":
        return <Sparkles className="h-3 w-3" />;
      case "listed":
        return <TrendingUp className="h-3 w-3" />;
      case "sold":
        return <Crown className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  useEffect(() => {
    if (!wallet.publicKey) return; // Don't run until wallet is connected
    const fetchNfts = async () => {
      const { data, error } = await supabase
        .from("NFTs")
        .select("*")
        .eq("wallet_address", wallet.publicKey?.toString());

      if (error) {
        toast("Error while fetching NFT's");
      }
      setNfts(data as NFT[]);
    };
    fetchNfts();
  }, [wallet.publicKey]);

  if (wallet.connecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-teal-900 p-4">
        <div className="container mx-auto max-w-7xl py-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full mb-6 animate-spin">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Loading Your NFTs...
            </h2>
            <p className="text-gray-400">
              Fetching your collection from the blockchain
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!wallet.connected) {
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

          {/* Wallet Connection Required */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-full mb-6 border border-purple-500/30">
                <Wallet className="h-10 w-10 text-purple-400" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Connect your Solana wallet to view and manage your NFT
                collection
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (nfts.length === 0) {
    return <NoNftMessage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-teal-900 p-4">
      <div className="container mx-auto max-w-7xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                My NFTs
              </h1>
              <p className="text-gray-300">
                {nfts.length} NFT{nfts.length !== 1 ? "s" : ""} in your
                collection
              </p>
            </div>
            <Link href="/create">
              <Button className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create New NFT
              </Button>
            </Link>
          </div>
        </div>
        {/* Filters and Controls */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search your NFTs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "text-gray-400 hover:text-white"
                  }
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "text-gray-400 hover:text-white"
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NFT Grid/List */}
        {filteredAndSortedNFTs.length === 0 ? (
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No NFTs Found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedNFTs.map((nft) => (
              <Card
                key={nft.id}
                className="bg-black/40 border-purple-500/30 backdrop-blur-sm hover:scale-105 transition-transform group"
              >
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={nft?.image || "/placeholder.svg"}
                      alt={nft?.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={getStatusColor(nft.status)}>
                        {getStatusIcon(nft.status)}
                        <span className="ml-1 capitalize">{nft.status}</span>
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-black/50 hover:bg-black/70 text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 truncate">
                      {nft.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {nft.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {nft.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {nft.likes}
                        </span>
                      </div>
                      {nft.price && (
                        <span className="text-teal-400 font-semibold">
                          {nft.price} SOL
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-teal-500 text-teal-400 hover:bg-teal-500/10 bg-transparent"
                        onClick={() =>
                          window.open(
                            `https://explorer.solana.com/address/${nft.transactionId}?cluster=devnet`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-500 text-purple-400 hover:bg-purple-500/10 bg-transparent"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://explorer.solana.com/address/${nft.transactionId}?cluster=devnet`
                          );
                          toast("Copied to Clipboard");
                        }}
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedNFTs.map((nft) => (
              <Card
                key={nft.id}
                className="bg-black/40 border-purple-500/30 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-lg overflow-hidden">
                        <Image
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-white truncate">
                          {nft.name}
                        </h3>
                        <Badge className={getStatusColor(nft.status)}>
                          {getStatusIcon(nft.status)}
                          <span className="ml-1 capitalize">{nft.status}</span>
                        </Badge>
                      </div>

                      <p className="text-gray-400 mb-3 line-clamp-2">
                        {nft.description}
                      </p>
                      {/* Transaction ID */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-gray-500">TX:</span>
                        <code className="text-xs text-teal-300 bg-black/50 px-2 py-1 rounded truncate flex-1">
                          {nft.transactionId}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyTransactionId(nft.transactionId)}
                          className="text-teal-400 hover:text-teal-300"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-teal-500 text-teal-400 hover:bg-teal-500/10 bg-transparent"
                          onClick={() =>
                            window.open(
                              `https://explorer.solana.com/address/${nft.transactionId}?cluster=devnet`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View on Solscan
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-500 text-purple-400 hover:bg-purple-500/10 bg-transparent "
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `https://explorer.solana.com/address/${nft.transactionId}?cluster=devnet`
                            );
                            toast("Copied to Clipboard");
                          }}
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
