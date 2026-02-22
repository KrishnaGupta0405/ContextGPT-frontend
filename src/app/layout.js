import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ContextGPT | Landing Page",
  description: "Convert you Website into AI Powered chatbot",
};

import { AuthProvider } from "@/context/AuthContext";
import SessionClearer from "@/components/SessionClearer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionClearer />
        <AuthProvider>
          <TooltipProvider>
            {/* <NavigationMenuDemo /> */}
            {children}
            <Toaster position="bottom-right" richColors />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
