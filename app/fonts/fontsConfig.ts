import localFont from "next/font/local";
import { Inter } from "next/font/google";
// Instrument_Serif, Anton
// use app\fonts\Anton\Anton-Regular.ttf and app\fonts\Instrument_Serif\InstrumentSerif-Regular.ttf

export const Instrument_Serif = localFont({
  src: [
    { path: "./Instrument_Serif/InstrumentSerif-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const Anton = localFont({
  src: [
    { path: "./Anton/Anton-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-anton",
  display: "swap",
});


export const interFontForEnglishChar = Inter({
    subsets: ["latin"],
    variable: "--font-interFontForEnglishChar",
});


export const yekanBakhFontForFarsiChar = localFont({
  
  src: [
    { path: "./Farsinumerals/Webfonts/fonts/Woff2/IRANSansXFaNum-Thin.woff2", weight: "100", style: "normal" },
    { path: "./Farsinumerals/Webfonts/fonts/Woff2/IRANSansXFaNum-Light.woff2", weight: "300", style: "normal" },
    { path: "./Farsinumerals/Webfonts/fonts/Woff2/IRANSansXFaNum-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Farsinumerals/Webfonts/fonts/Woff2/IRANSansXFaNum-DemiBold.woff2", weight: "600", style: "normal" },
    { path: "./Farsinumerals/Webfonts/fonts/Woff2/IRANSansXFaNum-Bold.woff2", weight: "700", style: "normal" },
    { path: "./Farsinumerals/Webfonts/fonts/Woff2/IRANSansXFaNum-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "./Farsinumerals/Webfonts/fonts/Woff2/IRANSansXFaNum-ExtraBlack.woff2", weight: "900", style: "normal" },
    { path: "./Farsinumerals/Webfonts/fonts/Woff2/IRANSansXFaNum-Black.woff2", weight: "950", style: "normal" },
  ],
  variable: "--font-yekanBakhFontForFarsiChar",
  display: "swap",
});

export const nastaliq = localFont({
  src:[
    { path: "./IranNastaliq.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-nastaliq",
  display: "swap",
})