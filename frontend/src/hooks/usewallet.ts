// This file simulates a professional wallet connector library like '@midnight-network/wallet-connector'
import { useState, useEffect } from 'react';

// This would be imported from the library
interface WalletApi {
  getBalance: () => Promise<string>;
  signTx: (tx: string) => Promise<string>;
  submitTx: (tx: string) => Promise<string>;
}

// The state returned by the main hook
interface UseWalletState {
  isConnected: boolean;
  isConnecting: boolean;
  walletName: string | null;
  api: WalletApi | null;
  connect: (walletName: 'lace') => Promise<void>;
  disconnect: () => void;
}

// The main hook your components will use
export const useWallet = (): UseWalletState => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [api, setApi] = useState<WalletApi | null>(null);

  const disconnect = () => {
    setWalletName(null);
    setApi(null);
    console.log("Wallet disconnected.");
  };

  const connect = async (name: 'lace') => {
    setIsConnecting(true);
    console.log(`Attempting to connect ${name}...`);
    
    try {
      const wallet = window.cardano?.[name];
      if (!wallet) throw new Error(`${name} wallet not found.`);
      
      const enabledApi = await wallet.enable();
      
      setApi(enabledApi);
      setWalletName(name);
      console.log(`${name} connected successfully.`);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      disconnect(); // Ensure clean state on failure
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    isConnected: !!api,
    isConnecting,
    walletName,
    api,
    connect,
    disconnect,
  };
};