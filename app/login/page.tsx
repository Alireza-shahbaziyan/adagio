import LoginForm from "@/components/Auth/LoginForm";
import { getSafeNextPath } from "@/utils/redirect";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;

  return <LoginForm next={getSafeNextPath(next)} />;
}
