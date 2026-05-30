import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";
import { FooterProps } from '../../types';
interface ModularFooterProps extends FooterProps {
  className?: string;
}
export function ModularFooter({
  variant = 'default',
  showLinks = true,
  showSocial = true,
  className
}: ModularFooterProps) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={className || "bg-gray-900 text-white"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">TradeGuard AI</h3>
                <p className="text-gray-400 text-sm">Advanced Brand Protection</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered trademark monitoring and violation detection platform.
            </p>
            {showSocial && (
              <div className="flex space-x-3">
                <a href="https://x.com/nodesemesta" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors" title="X (Twitter)">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://github.com/nodesmesta/TrademarkGuardAI" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors" title="GitHub">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                </a>
                <a href="https://discord.com/channels/760709262694416435" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors" title="Discord">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                </a>
              </div>
            )}
          </div>
          {showLinks && variant !== 'simple' && (
            <>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  <li><Link href="#features" className="text-gray-400 hover:text-white">Features</Link></li>
                  <li><Link href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</Link></li>
                  <li><Link href="#use-cases" className="text-gray-400 hover:text-white">Use Cases</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-3">
                  <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                  <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentation</Link></li>
                  <li><Link href="/api" className="text-gray-400 hover:text-white">API Reference</Link></li>
                </ul>
              </div>
            </>
          )}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">info@nodesemesta.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
               {currentYear} TradeGuard AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm">Privacy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-sm">Terms</Link>
              <Link href="/cookies" className="text-gray-500 hover:text-gray-300 text-sm">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
