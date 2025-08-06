"use client";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const endpooint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [], []);
  return (
    <ConnectionProvider endpoint={endpooint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default AppProvider;
