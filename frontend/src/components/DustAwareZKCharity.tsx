import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Zap, Droplets, Loader2, Wallet, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useWallet } from '../hooks/useWallet'; 
import { MiddlewareSDK, WalletBalances } from '../sdk/Middleware.ts';



// Reusable UI Components with the Lace aesthetic

const WalletStatusCard = ({ icon, title, value, unit }: any) => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center space-x-4 transition-all duration-300 hover:bg-slate-700/50 hover:scale-105">
    <div className="p-3 rounded-full bg-slate-900 border border-slate-700">
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-xl font-bold text-slate-100">
        {value} <span className="text-base font-normal text-slate-400">{unit}</span>
      </p>
    </div>
  </div>
);

const GradientButton = ({ children, onClick, disabled, className }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold text-white shadow-lg
      bg-gradient-to-r from-violet-600 to-fuchsia-500
      hover:from-violet-500 hover:to-fuchsia-400
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-slate-900
      disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed
      transition-all duration-300 ease-in-out transform hover:scale-105
      ${className}
    `}
  >
    {children}
  </button>
);

export const DustAwareZKCharity: React.FC = () => {
  const { isConnected, isConnecting, connect, api } = useWallet();
  
  // ✨ 2. The SDK is instantiated from the imported class
  const sdk = useMemo(() => (api ? new MiddlewareSDK(api) : null), [api]);

  // ✨ 3. We can use the exported WalletBalances interface for our state
  const [balances, setBalances] = useState<WalletBalances>({ night: 0, dust: 0, dustGenerationRate: 0 });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charity, setCharity] = useState('');
  const [amount, setAmount] = useState(50);
  const [secret, setSecret] = useState('');
  
  const DUST_COST = 500;
  const canAfford = balances.dust >= DUST_COST;
  const isFormValid = charity && amount > 0 && secret.length > 0;

  useEffect(() => {
    if (isConnected && sdk) {
      sdk.getWalletBalances().then(setBalances);
    }
  }, [isConnected, sdk]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sdk || !isFormValid || !canAfford) return;
    
    setIsSubmitting(true);
    try {
      await sdk.makeDonation({ charityId: charity, amount, donorSecret: secret });
      const newBalances = await sdk.getWalletBalances();
      setBalances(newBalances);
      setCharity('');
      setAmount(50);
      setSecret('');
    } catch (error) {
      // The SDK's error is caught here, so we can stop the loading spinner
      console.log("Caught donation error in component.");
    } finally {
      setIsSubmitting(false);
    }
  };


// --- RENDER LOGIC WITH ANIMATIONS ---

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    if (!isConnected) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center p-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-2xl backdrop-blur-lg max-w-md mx-auto"
            >
                {/* ... content of the connect wallet view ... */}
                 <ShieldCheck className="mx-auto h-16 w-16 text-violet-400" />
                 <h1 className="mt-4 text-3xl font-bold tracking-tight">ZK Charity</h1>
                 <p className="mt-2 text-slate-400">Make private donations on the Midnight Network.</p>
                 <GradientButton onClick={() => connect('lace')} disabled={isConnecting} className="mt-8">
                     {isConnecting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wallet className="mr-2 h-5 w-5" />}
                     {isConnecting ? 'Connecting...' : 'Connect Lace Wallet'}
                 </GradientButton>
            </motion.div>
        );
    }
    
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Charity Dashboard</h1>
          <p className="text-slate-400">Your wallet is connected and ready to donate.</p>
        </div>
      </header>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WalletStatusCard icon={<Zap size={24} className="text-yellow-400"/>} title="NIGHT Balance" value={balances.night.toFixed(2)} unit="" />
        <WalletStatusCard icon={<Droplets size={24} className="text-fuchsia-400"/>} title="DUST Balance" value={balances.dust.toFixed(0)} unit="" />
        <WalletStatusCard icon={<Loader2 size={24} className="text-green-400"/>} title="DUST Generation" value={`${balances.dustGenerationRate.toFixed(1)}/hr`} unit="" />
      </section>

      <section>
        <form onSubmit={handleDonate} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-6 backdrop-blur-lg">
          <h2 className="text-xl font-semibold">Create Your Anonymous Donation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="charity" className="block text-sm font-medium text-slate-300">Charity</label>
              <select id="charity" value={charity} onChange={e => setCharity(e.target.value)} className="mt-1 block w-full rounded-md bg-slate-900 border-slate-700 shadow-sm focus:border-violet-500 focus:ring-violet-500">
                <option value="">Select a charity...</option>
                <option value="red-cross">Red Cross</option>
                <option value="dwb">Doctors Without Borders</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-300">Amount (USD)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="mt-1 block w-full rounded-md bg-slate-900 border-slate-700 shadow-sm focus:border-violet-500 focus:ring-violet-500" />
            </div>
          </div>
          
          <div>
            <label htmlFor="secret" className="block text-sm font-medium text-slate-300">Donor Secret</label>
            <input type="password" id="secret" value={secret} onChange={e => setSecret(e.target.value)} className="mt-1 block w-full rounded-md bg-slate-900 border-slate-700" placeholder="Your private key for proof generation" />
          </div>

          <div className="border-t border-slate-700 pt-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Transaction Cost</h3>
              <p className={`text-sm ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                {DUST_COST} DUST required for this private donation.
              </p>
            </div>
            <GradientButton type="submit" disabled={!isFormValid || !canAfford || isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
              {isSubmitting ? 'Processing...' : 'Submit Donation'}
            </GradientButton>
          </div>
        </form>
      </section>
    </div>
  );
};