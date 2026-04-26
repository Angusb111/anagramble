import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Anagramble",
  description: "Daily anagram puzzle game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", dmSans.variable, dmSerif.variable, "font-sans", figtree.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}