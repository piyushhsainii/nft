"use client";
import type React from "react";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Upload,
  X,
  Plus,
  Check,
  Loader2,
  AlertCircle,
  Info,
  ArrowLeft,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import MintSuccessCard from "@/components/MintSuccessCard";
import { clusterApiUrl } from "@solana/web3.js";
import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { supabase } from "@/lib/supabase";

interface Attribute {
  trait_type: string;
  value: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  symbol: string;
  image: File | null;
  file: Uint8Array | null;
  attributes: Attribute[];
  royalty: string | null;
}

type MintingStep =
  | "idle"
  | "uploading"
  | "creating"
  | "confirming"
  | "success"
  | "error";

export default function CreateNFT() {
  const [metadata, setMetadata] = useState<NFTMetadata>({
    name: "",
    description: "",
    symbol: "",
    image: null,
    file: null,
    attributes: [{ trait_type: "", value: "" }],
    royalty: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [mintingStep, setMintingStep] = useState<MintingStep>("idle");
  const [progress, setProgress] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    {
      id: "uploading",
      label: "Uploading Metadata",
      description: "Storing your NFT data on IPFS",
    },
    {
      id: "creating",
      label: "Creating NFT on Solana",
      description: "Minting your NFT on the blockchain",
    },
    {
      id: "confirming",
      label: "Confirming Transaction",
      description: "Waiting for blockchain confirmation",
    },
    {
      id: "success",
      label: "NFT Created Successfully",
      description: "Your NFT is now live!",
    },
  ];

  const handleImageUpload = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      setMetadata((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const buffer = Buffer.from(arrayBuffer);
        const uint8array = new Uint8Array(arrayBuffer);
        setMetadata((data) => ({ ...data, file: uint8array }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageUpload(e.dataTransfer.files[0]);
      }
    },
    [handleImageUpload]
  );

  const addAttribute = () => {
    setMetadata((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: "", value: "" }],
    }));
  };

  const removeAttribute = (index: number) => {
    setMetadata((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const updateAttribute = (
    index: number,
    field: keyof Attribute,
    value: string
  ) => {
    setMetadata((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) =>
        i === index ? { ...attr, [field]: value } : attr
      ),
    }));
  };
  const wallet = useWallet();

  const handleNFTCreation = async () => {
    try {
      if (!metadata.image || !wallet.publicKey) return;
      setMintingStep("uploading");
      const umi = createUmi(clusterApiUrl("devnet"))
        .use(mplTokenMetadata())
        .use(walletAdapterIdentity(wallet));
      const uniqueFileName = `images/${Date.now()}-${metadata.image?.name}`;
      // Generate a new mint account
      const mint = generateSigner(umi);
      const { data, error } = await supabase.storage
        .from("nft-storage")
        .upload(`images/${uniqueFileName}`, metadata.image, {
          cacheControl: "3600",
          upsert: false, // Don't overwrite, use unique names instead
        });
      if (!data || error) return setMintingStep("error");
      // fetching public url
      const { data: publicURL } = await supabase.storage
        .from("nft-storage")
        .getPublicUrl(data?.path);

      const metadataJson = {
        name: metadata.name,
        description: metadata.description,
        image: publicURL.publicUrl, // URL of the image uploaded to Supabase
        symbol: metadata.symbol,
        attributes: metadata.attributes,
        sellerFeeBasisPoints: metadata.royalty,
      };
      const jsonBlob = new Blob([JSON.stringify(metadataJson)], {
        type: "application/json",
      });
      const { data: uploadedMetadata, error: metadataErr } =
        await supabase.storage
          .from("nft-storage")
          .upload(`metadata/${metadata.symbol}.json`, jsonBlob, {
            cacheControl: "3600",
            upsert: false,
          });
      if (!uploadedMetadata || error) return setMintingStep("error");
      setMintingStep("creating");
      const { data: metadataURI } = await supabase.storage
        .from("nft-storage")
        .getPublicUrl(uploadedMetadata?.path);
      // CREATING THE NFT
      const tx = await createNft(umi, {
        mint: mint,
        name: metadata.name,
        sellerFeeBasisPoints: percentAmount(1),
        uri: metadataURI.publicUrl,
        isCollection: true,
        symbol: metadata.symbol,
      }).sendAndConfirm(umi, { send: { commitment: "finalized" } });
      // initialising an umi instance
      setMintingStep("confirming");
      const digitalAsset = await fetchDigitalAsset(umi, mint.publicKey, {
        commitment: "confirmed",
      });
      console.log("NFT Public Addrss: ", digitalAsset.mint.publicKey);
      console.log("Mint Public Addrss: ", mint.publicKey);
      setTransactionId(digitalAsset.mint.publicKey);
      await supabase.from("NFTs").insert({
        name: metadata.name,
        description: metadata.description,
        image: metadataURI.publicUrl,
        attributes: JSON.stringify(metadata.attributes),
        transactionId: digitalAsset.mint.publicKey.toString(),
        royalty: metadata.royalty,
        wallet_address: wallet.publicKey,
      });
      setMintingStep("success");
    } catch (error) {
      console.log(error, "errrrror");
      setMintingStep("error");
      return error;
    }
  };

  const resetForm = () => {
    setMintingStep("idle");
    setProgress(0);
    setError("");
    setTransactionId("");
  };

  const copyTransactionId = () => {
    navigator.clipboard.writeText(transactionId);
  };

  if (mintingStep === "success") {
    return (
      <MintSuccessCard
        copyTransactionId={copyTransactionId}
        imagePreview={imagePreview!}
        metadata={metadata ?? "0"}
        resetForm={resetForm}
        transactionId={transactionId}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-teal-900 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/my-nft"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 mx-5"
          >
            <Button>
              <Zap className="mr-2 h-4 w-4" />
              My NFT's
            </Button>
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Create Your NFT
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your digital art into a unique NFT on the Solana
            blockchain
          </p>
        </div>

        {/* Progress Bar (shown during minting) */}
        {mintingStep !== "idle" && mintingStep !== "error" && (
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">
                    Minting Progress
                  </span>
                  <span className="text-teal-400">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-gray-800" />
              </div>

              <div className="space-y-3">
                {steps.map((step, index) => {
                  const isActive = step.id === mintingStep;
                  const isCompleted =
                    steps.findIndex((s) => s.id === mintingStep) > index;

                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-500"
                            : isActive
                            ? "bg-teal-500"
                            : "bg-gray-600"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-3 w-3 text-white" />
                        ) : isActive ? (
                          <Loader2 className="h-3 w-3 text-white animate-spin" />
                        ) : (
                          <span className="text-xs text-white">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <div
                          className={`font-medium ${
                            isActive
                              ? "text-teal-400"
                              : isCompleted
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {mintingStep === "error" && (
          <Card className="bg-red-900/20 border-red-500/30 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-400" />
                <h3 className="text-lg font-semibold text-red-400">
                  Minting Failed
                </h3>
              </div>
              <p className="text-gray-300 mb-4">{error}</p>
              <Button
                onClick={resetForm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        {(mintingStep === "idle" || mintingStep === "error") && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  NFT Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-white p-2">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={metadata.name}
                    onChange={(e) =>
                      setMetadata((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter NFT name"
                    className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="name" className="text-white p-2">
                    SYMBOL *
                  </Label>
                  <Input
                    id="name"
                    maxLength={10}
                    value={metadata.symbol}
                    onChange={(e) =>
                      setMetadata((prev) => ({
                        ...prev,
                        symbol: e.target.value,
                      }))
                    }
                    placeholder="Enter NFT name"
                    className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-white p-2">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={metadata.description}
                    onChange={(e) =>
                      setMetadata((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your NFT"
                    rows={4}
                    className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label className="text-white">Image *</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-teal-500 bg-teal-500/10"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="mx-auto rounded-lg max-h-48 object-cover"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setImagePreview(null);
                            setMetadata((prev) => ({ ...prev, image: null }));
                          }}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-300 mb-2">
                          Drag and drop your image here
                        </p>
                        <p className="text-gray-500 text-sm mb-4">or</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-teal-500 text-teal-400 hover:bg-teal-500/10"
                        >
                          Choose File
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            handleImageUpload(e.target.files[0])
                          }
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Attributes */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-white">Attributes</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Add traits and properties to make your NFT unique
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-3">
                    {metadata.attributes.map((attr, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Trait type (e.g., Color)"
                          value={attr.trait_type}
                          onChange={(e) =>
                            updateAttribute(index, "trait_type", e.target.value)
                          }
                          className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                        />
                        <Input
                          placeholder="Value (e.g., Blue)"
                          value={attr.value}
                          onChange={(e) =>
                            updateAttribute(index, "value", e.target.value)
                          }
                          className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                        />
                        {metadata.attributes.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeAttribute(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addAttribute}
                      className="border-purple-500 text-purple-400 hover:bg-purple-500/10 bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Attribute
                    </Button>
                  </div>
                </div>

                {/* Royalty */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-white">Royalty Percentage</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How much you earn on secondary sales (0-10%)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={metadata.royalty ?? JSON.stringify(0)}
                    onValueChange={(value) =>
                      setMetadata((prev) => ({ ...prev, royalty: value }))
                    }
                  >
                    <SelectTrigger className=" border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className=" border-gray-600">
                      {[0, 2.5, 5, 7.5, 10].map((percentage) => (
                        <SelectItem
                          key={percentage}
                          value={(percentage * 100).toString()}
                        >
                          {percentage}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Preview & Actions */}
            <div className="space-y-6">
              {/* Preview Card */}
              <Card className="bg-black/40 border-teal-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-teal-400" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-teal-500/20 rounded-lg border border-teal-500/30 mb-4 overflow-hidden">
                    {imagePreview ? (
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="NFT Preview"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-500">
                            Upload an image to preview
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {metadata.name || "Untitled NFT"}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {metadata.description || "No description provided"}
                  </p>

                  {metadata.attributes.some(
                    (attr) => attr.trait_type && attr.value
                  ) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">
                        Attributes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {metadata.attributes
                          .filter((attr) => attr.trait_type && attr.value)
                          .map((attr, index) => (
                            <Badge
                              key={index}
                              className="bg-teal-500/20 text-teal-300 border-teal-500/50 text-xs"
                            >
                              {attr.trait_type}: {attr.value}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Wallet Connection */}
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm text-white">
                <CardContent className="p-6">
                  {!isWalletConnected ? (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <WalletMultiButton className="" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full">
                        {}
                      </div>
                      <span className="text-green-400">Wallet Connected</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mint Button */}
              <Button
                onClick={handleNFTCreation}
                disabled={
                  (mintingStep !== "idle" && mintingStep !== "error") ||
                  wallet.connected == false
                }
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white text-lg py-6"
              >
                {mintingStep === "idle" || mintingStep === "error" ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Mint NFT
                  </>
                ) : (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Minting...
                  </>
                )}
              </Button>

              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
