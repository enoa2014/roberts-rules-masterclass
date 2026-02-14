import { LoginForm } from "@/app/login/login-form";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const callback = params.callbackUrl;
  const callbackUrl = Array.isArray(callback)
    ? callback[0]
    : callback || "/invite";

  return <LoginForm callbackUrl={callbackUrl} />;
}
