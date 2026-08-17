import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KiwiKids NZ",
    template: "%s | KiwiKids NZ",
  },
  description:
    "Helping New Zealand families discover childcare, schools, activities and trusted information from birth through Year 13.",
  applicationName: "KiwiKids NZ",
  keywords: [
    "New Zealand childcare",
    "NZ schools",
    "early childhood education",
    "kids activities",
    "school finder",
    "Auckland families",
    "KiwiKids NZ",
  ],
  authors: [{ name: "KiwiKids NZ" }],
  creator: "KiwiKids NZ",
  publisher: "KiwiKids NZ",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NZ" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
