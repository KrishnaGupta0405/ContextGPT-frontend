import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <NavigationMenuDemo /> */}
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
