import toast from 'react-hot-toast';

// --- INTERFACES ---
// These define the "shape" of the data our SDK works with.

/** * Describes the wallet's API that our SDK needs.
 * This ensures any wallet we connect must provide these functions.
 */
interface WalletApi {
  signTx: (unsignedTx: string) => Promise<string>;
  submitTx: (signedTx: string) => Promise<string>;
}

/** Defines the structure for wallet balance information. */
export interface WalletBalances {
  night: number;
  dust: number;
  dustGenerationRate: number;
}

/** Defines the input required to make a donation. */
export interface DonationDetails {
  charityId: string;
  amount: number;
  donorSecret: string;
}

/** Defines the result of a successful donation. */
export interface DonationResult {
  donationId: string;
}


// --- THE SDK CLASS ---

/**
 * MiddlewareSDK provides a simplified interface for interacting with the 
 * ZK Charity platform and the Midnight wallet.
 */
export class MiddlewareSDK {
  private api: WalletApi;

  /**
   * Creates an instance of the SDK.
   * @param walletApi The connected wallet's API object.
   */
  constructor(walletApi: WalletApi) {
    this.api = walletApi;
  }

  /**
   * Fetches the NIGHT and DUST balances from the connected wallet.
   * @returns A promise that resolves to the wallet's balances.
   */
  async getWalletBalances(): Promise<WalletBalances> {
    // Simulate a network call to fetch balances
    await new Promise(res => setTimeout(res, 500));
    
    const mockNight = Math.random() * 1000 + 100;
    const mockDust = Math.random() * 2000 + 500;
    
    return {
      night: mockNight,
      dust: mockDust,
      dustGenerationRate: mockNight * 0.01,
    };
  }

  /**
   * Constructs, signs, and submits a donation transaction.
   * Handles user feedback through toast notifications.
   * @param details The details of the donation to be made.
   * @returns A promise that resolves to the donation result, including the transaction ID.
   */
  async makeDonation(details: DonationDetails): Promise<DonationResult> {
    const toastId = toast.loading('1/3: Building transaction...');
    console.log('Making donation with details:', details);

    try {
      // 1. Simulate creating the transaction data
      await new Promise(res => setTimeout(res, 1000));
      const unsignedTx = "mock_unsigned_cbor_tx_for_" + details.charityId;

      // 2. Request signature from the user's wallet
      toast.loading('2/3: Awaiting signature in wallet...', { id: toastId });
      const signedTx = await this.api.signTx(unsignedTx);

      // 3. Submit the signed transaction to the network
      toast.loading('3/3: Submitting to Midnight network...', { id: toastId });
      const txId = await this.api.submitTx(signedTx);

      toast.success('Donation sent successfully!', { id: toastId, duration: 5000 });
      return { donationId: txId };

    } catch (err: any) {
      console.error('Donation failed:', err);
      toast.error(err.message || 'Donation failed.', { id: toastId });
      // Re-throw the error so the UI component knows the process failed
      throw err;
    }
  }
}