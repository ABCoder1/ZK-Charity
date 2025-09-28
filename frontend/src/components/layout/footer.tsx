import { Shield, Github, Twitter, MessageSquare } from 'lucide-react';

export const Footer = () => {
  const socialLinks = [
    { icon: <Github />, href: '#' },
    { icon: <Twitter />, href: '#' },
    { icon: <MessageSquare />, href: '#' },
  ];

  return (
    <footer className="w-full max-w-7xl mx-auto z-10">
      <div className="mx-auto px-6 lg:px-8 py-8 border-t border-slate-700/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-violet-400" />
            <span className="font-bold">ZK Charity</span>
          </div>
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} The MoonKnight Devs. All rights reserved.</p>
          <div className="flex space-x-6">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.href} className="text-slate-400 hover:text-white transition-colors">
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};