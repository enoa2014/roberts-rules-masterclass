import { cookies } from "next/headers";
import { ThemeType, VALID_THEMES, THEME_SHORT_MAP } from "@/components/core/types";
import dynamic from "next/dynamic";

const ClassicRegister = dynamic(() => import("@/components/themes/classic/views/RegisterView"));
const FestivalRegister = dynamic(() => import("@/components/themes/festival/views/RegisterView"));
const MintRegister = dynamic(() => import("@/components/themes/mint/views/RegisterView"));
const CharcoalRegister = dynamic(() => import("@/components/themes/charcoal/views/RegisterView"));
const CopperRegister = dynamic(() => import("@/components/themes/copper/views/RegisterView"));

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get("app-theme")?.value;

  let activeTheme = (THEME_SHORT_MAP[rawTheme as string] || rawTheme || "classic") as ThemeType;

  if (!VALID_THEMES.includes(activeTheme)) {
    activeTheme = 'classic';
  }

  switch (activeTheme) {
    case 'festival-civic': return <FestivalRegister />;
    case 'charcoal-grid': return <CharcoalRegister />;
    case 'copper-lecture': return <CopperRegister />;
    case 'mint-campaign': return <MintRegister />;
    default: return <ClassicRegister />;
  }
}
