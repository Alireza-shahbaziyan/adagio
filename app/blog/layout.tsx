import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar variant="default" />
      {children}
      <Footer mobileBottomPad={true} />
    </div>
  );
}
