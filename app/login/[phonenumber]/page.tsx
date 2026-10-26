import { redirect } from "next/navigation";
import OtpForm from "@/components/Auth/OtpForm";
import { IRAN_PHONE_PATTERN } from "@/lib/auth";
import { getSafeNextPath } from "@/utils/redirect";

export default async function OtpPage({
  params,
  searchParams,
}: {
  params: Promise<{ phonenumber: string }>;
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { phonenumber } = await params;
  const { next } = await searchParams;

  if (!IRAN_PHONE_PATTERN.test(phonenumber)) {
    redirect("/login");
  }

  return <OtpForm phone={phonenumber} next={getSafeNextPath(next)} />;
}
