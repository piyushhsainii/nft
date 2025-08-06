import React from "react";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, Check, Copy, ExternalLink, Share2 } from "lucide-react";
import Image from "next/image";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface Attribute {
  trait_type: string;
  value: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: File | null;
  attributes: Attribute[];
  royalty: string;
}

const MintSuccessCard = ({
  imagePreview,
  metadata,
  copyTransactionId,
  transactionId,
  resetForm,
}: {
  imagePreview: string;
  metadata: NFTMetadata;
  copyTransactionId: () => void;
  transactionId: string;
  resetForm: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-teal-900 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-4">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            NFT Created Successfully!
          </h1>
          <p className="text-gray-300">
            Your NFT has been minted on the Solana blockchain
          </p>
        </div>

        {/* Success Card */}
        <Card className="bg-black/40 border-teal-500/30 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* NFT Preview */}
              <div className="flex-shrink-0">
                {imagePreview && (
                  <div className="w-48 h-48 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-teal-500/20 border border-teal-500/30">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt={metadata.name}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* NFT Details */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {metadata.name}
                </h3>
                <p className="text-gray-300 mb-4">{metadata.description}</p>

                {/* Attributes */}
                {metadata.attributes.some(
                  (attr) => attr.trait_type && attr.value
                ) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      Attributes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {metadata.attributes
                        .filter((attr) => attr.trait_type && attr.value)
                        .map((attr, index) => (
                          <Badge
                            key={index}
                            className="bg-teal-500/20 text-teal-300 border-teal-500/50"
                          >
                            {attr.trait_type}: {attr.value}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}

                {/* Transaction ID */}
                <div className="mb-4">
                  <Label className="text-sm font-semibold text-gray-400">
                    Transaction ID
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs text-teal-300 bg-black/50 px-2 py-1 rounded flex-1 truncate">
                      {transactionId}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyTransactionId}
                      className="text-teal-400 hover:text-teal-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Royalty */}
                <div className="text-sm text-gray-400">
                  Royalty: {metadata.royalty}% on secondary sales
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white flex-1"
            onClick={() =>
              window.open(
                `https://explorer.solana.com/address/${transactionId}?cluster=devnet`,
                "_blank"
              )
            }
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Solscan
          </Button>
          <Button
            onClick={() => {
              toast("Copied link to clipboard");
            }}
            variant="outline"
            className="border-teal-500 text-teal-400 hover:bg-teal-500/10 flex-1 bg-transparent hover:text-white cursor-pointer"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share NFT
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button
            variant="ghost"
            onClick={resetForm}
            className="text-gray-400 hover:text-white hover:bg-transparent"
          >
            Create Another NFT
          </Button>
          <Link href="/">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MintSuccessCard;
