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
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  T
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  L
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  G
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
                <span className="text-gray-400">support@tradeguard.ai</span>
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
              © {currentYear} TradeGuard AI. All rights reserved.
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
