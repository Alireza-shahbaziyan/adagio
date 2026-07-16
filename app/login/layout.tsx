import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        dir="rtl"
        lang="fa"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary-foreground p-6 text-white"
      >
        <div
          className="absolute top-[-20%] right-[-15%] h-[60vw] w-[60vw] max-w-175 max-h-175 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(168,168,168,0.10), transparent 70%)",
            animation: "driftOne 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-20%] left-[-15%] h-[55vw] w-[55vw] max-w-160 max-h-160 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(243,243,243,0.06), transparent 70%)",
            animation: "driftTwo 26s ease-in-out infinite",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        <Link
          href="/"
          style={{ direction: "ltr" }}
          className="absolute border-b border-white px-2 top-5 right-5 z-[2] font-instrument-serif text-[22px] italic text-foreground
         md:top-10 md:right-10"
        >
          Adagio
        </Link>

        <div
          style={{ animation: "cardIn 0.7s cubic-bezier(.16,.8,.24,1)" }}
          className="relative z-1 w-full max-w-105 rounded-[28px] border border-white/8 bg-[#181818]/55 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-[28px] md:p-12"
        >
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
