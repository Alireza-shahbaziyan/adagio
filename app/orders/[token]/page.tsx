import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import OrderResultClient from "./OrderResultClient";

interface PageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ status?: "success" | "failed" }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { token } = await params;
  const { status } = await searchParams;

  const isSuccess = status === "success";
  const isFailed = status === "failed";

  if (!isSuccess && !isFailed) {
    return null;
  }

  return (
    <div dir="rtl" lang="fa" className="relative min-h-screen bg-primary-foreground pb-24 text-white md:pb-0">
      <Navbar variant="default" />
      <OrderResultClient token={token} initialStatus={isSuccess ? "success" : "failed"} />
      <Footer mobileBottomPad />
    </div>
  );
}