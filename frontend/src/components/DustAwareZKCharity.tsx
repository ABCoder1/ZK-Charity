import React, { useState, useEffect } from 'react';
// Import a library for parsing CBOR asset balances (hypothetical, but necessary)
// In a real project, this would be part of the Midnight SDK.
// import { parseCborValue } from '@midnight-network/sdk'; 


export enum PrivacyLevel {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    ANONYMOUS = "ANONYMOUS",
}

// The API object returned by the wallet's .enable() method
interface WalletApi {
    getBalance: () => Promise<string>; // Returns balance as CBOR string
    signTx: (tx: string, partialSign: boolean) => Promise<string>; // Signs a CBOR transaction
    submitTx: (tx: string) => Promise<string>; // Submits a signed CBOR transaction
    getUsedAddresses: () => Promise<string[]>;
}

// This function connects to Lace wallet extension
const connectLaceWallet = async (): Promise<WalletApi | null> => {
    console.log("Searching for window.cardano.lace...");
    
    // 1. Detect the wallet
    const wallet = window.cardano?.lace;

    if (!wallet) {
        console.error("Lace wallet extension not found.");
        return null;
    }

    try {
        // 2. Request access and get the API object
        const api: WalletApi = await wallet.enable();
        console.log("Lace wallet connected successfully!");
        return api;
    } catch (error) {
        console.error("User rejected wallet connection:", error);
        return null;
    }
};

// The SDK is built to use the real Wallet API
export class CompactZKCharitySDK {
    private api: WalletApi;

    constructor(api: WalletApi) {
        this.api = api;
        console.log("Compact SDK initialized with real wallet API.");
    }

    async getWalletBalances() {
        // 1. Get the balance from the wallet API (returns a CBOR string)
        const balanceCbor = await this.api.getBalance();

        // 2. Parse the CBOR string to get asset values.
        // NOTE: This is a simplified version of a complex process.
        // You would use a library to parse this correctly.
        // For this example, we'll just return mock values.
        // const parsedBalance = parseCborValue(balanceCbor);
        // const nightAmount = parsedBalance.get(NIGHT_POLICY_ID)?.get(NIGHT_ASSET_NAME) || 0;
        // const dustAmount = parsedBalance.get(DUST_POLICY_ID)?.get(DUST_ASSET_NAME) || 0;

        const mockNight = Math.random() * 1000 + 100;
        const mockDust = Math.random() * 2000 + 500;
        
        return {
            night: mockNight,
            dust: mockDust,
            dustGenerationRate: mockNight * 0.01,
        };
    }

    async estimateDustCost(privacyLevel: PrivacyLevel) {
        const baseCosts: { [key in PrivacyLevel]: number } = {
            [PrivacyLevel.PUBLIC]: 200,
            [PrivacyLevel.PRIVATE]: 500,
            [PrivacyLevel.ANONYMOUS]: 1000,
        };
        return { estimatedCost: baseCosts[privacyLevel] };
    }

    // This function follows the build -> sign -> submit flow.
    async makeDonation(charityId: string, amount: number, donorSecret: string, privacyLevel: PrivacyLevel) {
        console.log("Preparing transaction for donation...");

        // Step 1: Build the Unsigned Transaction
        // The DApp is responsible for this.Uses a Midnight transaction builder library.
        // This is a placeholder for the complex process.
        console.log("Building unsigned transaction...");
        const unsignedTx = `cbor_for_donation_to_${charityId}_with_amount_${amount}`;
        
        // Step 2: Sign the Transaction using the Wallet API
        console.log("Sending transaction to wallet for signing...");
        const signedTx = await this.api.signTx(unsignedTx, false); // `false` for a full signature
        
        // Step 3: Submit the Signed Transaction using the Wallet API
        console.log("Submitting signed transaction to the network...");
        const txId = await this.api.submitTx(signedTx);
        
        const { estimatedCost } = await this.estimateDustCost(privacyLevel);

        return {
            donationId: txId,
            dustConsumed: estimatedCost, // The actual cost would come from the transaction details
            privacyLevel,
        };
    }
}

// Extend the window interface to include the cardano object
declare global {
    interface Window {
        cardano?: any;
    }
}

// =====================================================================
// The React Component 
// =====================================================================
export const DustAwareZKCharity: React.FC = () => {
    const [sdk, setSdk] = useState<CompactZKCharitySDK | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [walletBalances, setWalletBalances] = useState<any | null>(null);
    const [donationCost, setDonationCost] = useState<number>(0);
    const [canAfford, setCanAfford] = useState(true);
    
    // Form state
    const [selectedCharity, setSelectedCharity] = useState<string>('');
    const [donationAmount, setDonationAmount] = useState<number>(10);
    const [donorSecret, setDonorSecret] = useState<string>('');
    const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(PrivacyLevel.PRIVATE);

    const handleConnect = async () => {
        setConnectionStatus('connecting');
        const api = await connectLaceWallet();
        if (api) {
            const sdkInstance = new CompactZKCharitySDK(api);
            setSdk(sdkInstance);
            setConnectionStatus('connected');
        } else {
            alert("Could not connect to Lace wallet. Please ensure it's installed and you've granted access.");
            setConnectionStatus('disconnected');
        }
    };

    useEffect(() => {
        if (!sdk) return;
        const updateData = async () => {
            const balances = await sdk.getWalletBalances();
            const { estimatedCost } = await sdk.estimateDustCost(privacyLevel);
            setWalletBalances(balances);
            setDonationCost(estimatedCost);
            setCanAfford(balances.dust >= estimatedCost);
        };
        updateData();
    }, [sdk, privacyLevel]);

    const handleDonation = async () => {
        if (!sdk || !selectedCharity || !donationAmount || !donorSecret || !canAfford) {
            alert('Please fill all fields and ensure you have enough DUST.');
            return;
        }
        try {
            const result = await sdk.makeDonation(selectedCharity, donationAmount, donorSecret, privacyLevel);
            alert(`Donation successful! Transaction ID: ${result.donationId}`);
            // Manually refresh balances after donation
            const balances = await sdk.getWalletBalances();
            setWalletBalances(balances);
        } catch (error) {
            console.error('Donation failed:', error);
            alert('Donation failed. The wallet may have rejected the transaction or the network is busy.');
        }
    };

    if (!sdk || connectionStatus !== 'connected') {
        return (
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">ZK Charity</h1>
                <p className="mb-8">Anonymous donations on the Midnight Network.</p>
                <button 
                    onClick={handleConnect} 
                    disabled={connectionStatus === 'connecting'}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Lace Wallet'}
                </button>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-8">
            <h1 className="text-4xl font-bold text-center text-gray-800">ZK Charity Platform</h1>
            <section className="p-6 bg-gray-50 border rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Wallet Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div><h3 className="font-medium text-blue-600">NIGHT Balance</h3><p className="text-2xl font-bold">{walletBalances?.night?.toFixed(2) ?? '...'}</p></div>
                    <div><h3 className="font-medium text-purple-600">DUST Balance</h3><p className="text-2xl font-bold">{walletBalances?.dust?.toFixed(0) ?? '...'}</p></div>
                    <div><h3 className="font-medium text-green-600">DUST Generation</h3><p className="text-2xl font-bold">{walletBalances?.dustGenerationRate?.toFixed(1) ?? '...'}/hr</p></div>
                </div>
            </section>
            <section className="p-6 border rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Make an Anonymous Donation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Select Charity</label><select value={selectedCharity} onChange={(e) => setSelectedCharity(e.target.value)} className="w-full p-2 border rounded-md"><option value="">Select a charity...</option><option value="charity_red_cross">Red Cross</option><option value="charity_dwb">Doctors Without Borders</option></select></div>
                        <div><label className="block text-sm font-medium mb-1">Donation Amount (USD)</label><input type="number" step="1" value={donationAmount} onChange={(e) => setDonationAmount(parseFloat(e.target.value))} className="w-full p-2 border rounded-md" /></div>
                        <div><label className="block text-sm font-medium mb-1">Donor Secret (Keep Private!)</label><input type="password" value={donorSecret} onChange={(e) => setDonorSecret(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Your secret for proof generation" /></div>
                    </div>
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Privacy Level</label><select value={privacyLevel} onChange={(e) => setPrivacyLevel(e.target.value as PrivacyLevel)} className="w-full p-2 border rounded-md"><option value={PrivacyLevel.PUBLIC}>Public (Low Cost)</option><option value={PrivacyLevel.PRIVATE}>Private (Medium Cost)</option><option value={PrivacyLevel.ANONYMOUS}>Anonymous (High Cost)</option></select></div>
                        <div className={`p-3 rounded-md ${canAfford ? 'bg-green-50' : 'bg-red-50'}`}><h4 className="font-medium text-gray-800 mb-1">Transaction Cost</h4><div className="flex justify-between items-center text-sm"><span>DUST Required:</span><span className="font-bold">{donationCost || '...'}</span></div>{!canAfford && <div className="mt-1 text-sm text-red-600">⚠️ Insufficient DUST</div>}</div>
                        <button onClick={handleDonation} disabled={!canAfford || !selectedCharity || !donationAmount || !donorSecret} className="w-full p-3 rounded-md transition font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">Donate Anonymously</button>
                    </div>
                </div>
            </section>
        </div>
    );
};