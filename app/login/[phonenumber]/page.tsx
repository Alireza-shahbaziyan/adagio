import { redirect } from "next/navigation";
import OtpForm from "@/components/Auth/OtpForm";
import { IRAN_PHONE_PATTERN } from "@/lib/auth";


export default async function OtpPage({
  params,
}: {
  params: Promise<{ phonenumber: string }>;
}) {
  const { phonenumber } = await params;

  if (!IRAN_PHONE_PATTERN.test(phonenumber)) {
    redirect("/login");
  }

  return (
    <>
      <OtpForm phone={phonenumber} />;
    </>
  );
}
