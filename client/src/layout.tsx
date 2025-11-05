'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import RelayEnvironment from "@/lib/RelayEnvironment.js";
import AuthWrapper from "@/components/MenuBar/AuthWrapper.js";
import { TooltipProvider } from "@/components/ui/tooltip.js";
import { AuthProvider } from "@/lib/AuthContext.js";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RelayEnvironmentProvider environment={RelayEnvironment}>
          <TooltipProvider>
            <AuthProvider>
              <AuthWrapper />
              <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </main>
              <Toaster />
            </AuthProvider>
          </TooltipProvider>
        </RelayEnvironmentProvider>
      </body>
    </html>
  );
}
