import { cookies } from "next/headers";
import { ThemeType, VALID_THEMES, THEME_SHORT_MAP } from "@/components/core/types";
import dynamic from "next/dynamic";

const ClassicLogin = dynamic(() => import("@/components/themes/classic/views/LoginView"));
const FestivalLogin = dynamic(() => import("@/components/themes/festival/views/LoginView"));
const MintLogin = dynamic(() => import("@/components/themes/mint/views/LoginView"));
const CharcoalLogin = dynamic(() => import("@/components/themes/charcoal/views/LoginView"));
const CopperLogin = dynamic(() => import("@/components/themes/copper/views/LoginView"));

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

  const cookieStore = await cookies();
  const rawTheme = cookieStore.get("app-theme")?.value;

  let activeTheme = (THEME_SHORT_MAP[rawTheme as string] || rawTheme || "classic") as ThemeType;

  if (!VALID_THEMES.includes(activeTheme)) {
    activeTheme = 'classic';
  }

  switch (activeTheme) {
    case 'festival-civic': return <FestivalLogin callbackUrl={callbackUrl} />;
    case 'charcoal-grid': return <CharcoalLogin callbackUrl={callbackUrl} />;
    case 'copper-lecture': return <CopperLogin callbackUrl={callbackUrl} />;
    case 'mint-campaign': return <MintLogin callbackUrl={callbackUrl} />;
    default: return <ClassicLogin callbackUrl={callbackUrl} />;
  }
}
