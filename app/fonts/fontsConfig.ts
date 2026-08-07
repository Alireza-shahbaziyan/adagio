import localFont from "next/font/local";



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

// add local font for Inter font for English characters
/*
app\fonts\Inter\Inter-Italic-VariableFont_opsz,wght.ttf
app\fonts\Inter\Inter-VariableFont_opsz,wght.ttf

*/

export const Inter = localFont({
  src: [
    { path: "./Inter/Inter-VariableFont_opsz,wght.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
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