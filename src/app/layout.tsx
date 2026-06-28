import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

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
  title: "Forge — AI Software Engineer",
  description:
    "An autonomous software engineering agent that plans, codes, and ships. Inspired by OpenHands and Devin. Claude-powered reasoning, GitHub-native workflows, and a polished developer experience.",
  keywords: [
    "AI software engineer",
    "autonomous coding agent",
    "Devin",
    "OpenHands",
    "OpenDevin",
    "Claude AI",
    "developer tools",
    "code generation",
    "GitHub automation",
    "Next.js",
  ],
  authors: [{ name: "KeshavCracks" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Forge — AI Software Engineer",
    description:
      "An autonomous software engineering agent that plans, codes, and ships. Claude-powered, GitHub-native, deployable on Vercel.",
    url: "https://github.com/KeshavCracks/sitty",
    siteName: "Forge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forge — AI Software Engineer",
    description:
      "An autonomous software engineering agent that plans, codes, and ships. Claude-powered, GitHub-native, deployable on Vercel.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://db.onlinewebfonts.com" />
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium"
        />
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
