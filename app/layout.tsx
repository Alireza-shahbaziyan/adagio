import type { Metadata } from "next";
import { Vazirmatn, Instrument_Serif, Anton } from "next/font/google";
import { interFontForEnglishChar, yekanBakhFontForFarsiChar, nastaliq } from "./fonts/fontsConfig";
import "./globals.css";
import { Providers } from "@/lib/providers";
import Toast from "@/components/Toast";
import { cn } from "@/lib/utils";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "900"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "آداجیو | Adagio",
  description: "فروشگاه لباس آداجیو | Adagio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={cn(vazirmatn.variable, instrumentSerif.variable, anton.variable, interFontForEnglishChar.variable, yekanBakhFontForFarsiChar.variable, nastaliq.variable)}
    >
      <body className="bg-background text-foreground antialiased">
        <Providers>
          {children}
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
