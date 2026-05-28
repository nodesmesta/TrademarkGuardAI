import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
const inter = Inter({ subsets: ["latin"] })
export const metadata: Metadata = {
  title: "TradeGuard AI - Advanced Trademark Protection Platform",
  description: "Real-time trademark monitoring and violation detection powered by AI. Protect your brand across the entire web with automated surveillance and analytics.",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
      },
    ],
  },
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                const originalWarn = console.warn;
                console.warn = function(...args) {
                  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) {
                  }
                  if (typeof args[0] === 'string' && args[0].includes('Clock: This module has been deprecated')) {
                  }
                  originalWarn.apply(console, args);
                };
              }
            `
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}