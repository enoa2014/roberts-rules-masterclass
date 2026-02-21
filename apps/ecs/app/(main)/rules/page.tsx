import { cookies } from "next/headers";
import { ThemeType, VALID_THEMES, THEME_SHORT_MAP } from "@/components/core/types";
import dynamic from "next/dynamic";

const ClassicRules = dynamic(() => import("@/components/themes/classic/views/RulesView"));
const FestivalRules = dynamic(() => import("@/components/themes/festival/views/RulesView"));
const MintRules = dynamic(() => import("@/components/themes/mint/views/RulesView"));
const CharcoalRules = dynamic(() => import("@/components/themes/charcoal/views/RulesView"));
const CopperRules = dynamic(() => import("@/components/themes/copper/views/RulesView"));

export default async function RulesPage() {
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get("app-theme")?.value;

  let activeTheme = (THEME_SHORT_MAP[rawTheme as string] || rawTheme || "classic") as ThemeType;

  if (!VALID_THEMES.includes(activeTheme)) {
    activeTheme = "classic";
  }

  switch (activeTheme) {
    case "festival-civic":
      return <FestivalRules />;
    case "charcoal-grid":
      return <CharcoalRules />;
    case "copper-lecture":
      return <CopperRules />;
    case "mint-campaign":
      return <MintRules />;
    default:
      return <ClassicRules />;
  }
}
