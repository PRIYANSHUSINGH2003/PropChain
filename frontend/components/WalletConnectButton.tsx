"use client";
import React from "react";
import { ChainProvider, useChain } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";

const CHAIN_NAME = "cosmoshub"; // Change to your target chain if needed

export default function WalletConnectButton() {
  const { address, status, connect, disconnect } = useChain(CHAIN_NAME);

  if (status === "Connected" && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold"
      onClick={connect}
    >
      Connect Wallet
    </button>
  );
}

// To use this button, wrap your app in ChainProvider in _app.tsx or layout.tsx
// Example:
// <ChainProvider chains={[chain]} assetLists={[assetList]} wallets={keplrWallets}>
//   <WalletConnectButton />
//   {children}
// </ChainProvider>
