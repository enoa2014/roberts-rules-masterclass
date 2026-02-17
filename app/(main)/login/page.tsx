import { LoginForm } from "./login-form";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function resolveSafeCallbackUrl(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) {
    return "/invite";
  }

  // Only allow same-site relative paths to prevent open redirect.
  if (raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }

  return "/invite";
}

export default async function LoginPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const callbackUrl = resolveSafeCallbackUrl(params.callbackUrl);

  return <LoginForm callbackUrl={callbackUrl} />;
}
