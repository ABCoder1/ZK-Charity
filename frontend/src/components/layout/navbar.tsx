import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, X, Menu, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../../hooks/useWallet';

const NavLink = ({ children }: { children: React.ReactNode }) => (
  <a href="#" className="text-slate-300 hover:text-white transition-colors">{children}</a>
);

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isConnected, disconnect } = useWallet();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 backdrop-blur-lg bg-slate-900/50 border-b border-slate-700/50">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <Shield className="h-8 w-8 text-violet-400" />
            <span className="font-bold text-xl">ZK Charity</span>
          </a>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link to="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
          <Link to="/charities" className="text-slate-300 hover:text-white transition-colors">Charities</Link>
          <NavLink>How It Works</NavLink>
        </div>
        <div className="flex flex-1 justify-end items-center gap-x-6">
          <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></a>
          {isConnected && (
            <button onClick={disconnect} className="hidden lg:block text-sm font-semibold text-slate-300 hover:text-white">Disconnect</button>
          )}
          <div className="flex lg:hidden">
            <button type="button" onClick={toggleMobileMenu} className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-300">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-lg" onClick={toggleMobileMenu}></div>
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-slate-700">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5 flex items-center space-x-2">
                   <Shield className="h-8 w-8 text-violet-400" />
                   <span className="font-bold text-xl">ZK Charity</span>
                </a>
                <button type="button" onClick={toggleMobileMenu} className="-m-2.5 rounded-md p-2.5 text-slate-300">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-slate-700">
                  <div className="space-y-2 py-6">
                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-slate-800">About</a>
                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-slate-800">Charities</a>
                  </div>
                  <div className="py-6">
                    {isConnected && (
                      <button onClick={() => { disconnect(); toggleMobileMenu(); }} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-slate-800">Disconnect</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};