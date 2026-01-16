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
    <html lang="en">
      {/*Antialiased -> smooths text rendering, making fonts look cleaner and less jagged on screen. */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
