import type { Metadata } from "next";
import { Archivo, Inter, Space_Grotesk } from "next/font/google";
import { LanguageProvider } from "@/components/i18n/language-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-editorial", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Achmad Ricky R.P. · Fullstack Developer",
  description: "Dark, AI-native developer portfolio and ProjectBowl showcase."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${archivo.variable} font-sans antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
