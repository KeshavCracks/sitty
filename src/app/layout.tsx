import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo, Instrument_Sans, Chivo_Mono } from "next/font/google";
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

// rig.ai design system fonts
const archivo = Archivo({
  variable: "--font-rig-headline",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-rig-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const chivoMono = Chivo_Mono({
  variable: "--font-rig-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${instrumentSans.variable} ${chivoMono.variable} antialiased bg-background text-foreground min-h-screen`}
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
