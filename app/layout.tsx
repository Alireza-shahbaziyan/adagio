import type { Metadata } from "next";

import { Inter as interFontForEnglishChar, yekanBakhFontForFarsiChar, nastaliq, Instrument_Serif, Anton }
from "./fonts/fontsConfig";
import { Providers } from "@/lib/providers";
import Toast from "@/components/Toast";
import { cn } from "@/lib/utils";
import { frontend, referer } from "@/utils/getURL";
import "./globals.css";


const metadataBaseUrl = referer ?? frontend;

export const metadata: Metadata = {
  title: "آداجیو | Adagio",
  description: "فروشگاه لباس آداجیو | Adagio",
  metadataBase: metadataBaseUrl ? new URL(metadataBaseUrl) : undefined,
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
    <html
      lang="fa" dir="rtl" data-scroll-behavior="smooth"
      className={cn(Instrument_Serif.variable, Anton.variable, interFontForEnglishChar.variable, yekanBakhFontForFarsiChar.variable, nastaliq.variable)}
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
