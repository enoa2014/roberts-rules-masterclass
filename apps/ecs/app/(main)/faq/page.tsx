import { cookies } from "next/headers";
import { ThemeType, VALID_THEMES, THEME_SHORT_MAP } from "@/components/core/types";
import dynamic from "next/dynamic";

const ClassicFaq = dynamic(() => import("@/components/themes/classic/views/FaqView"));
const FestivalFaq = dynamic(() => import("@/components/themes/festival/views/FaqView"));
const MintFaq = dynamic(() => import("@/components/themes/mint/views/FaqView"));
const CharcoalFaq = dynamic(() => import("@/components/themes/charcoal/views/FaqView"));
const CopperFaq = dynamic(() => import("@/components/themes/copper/views/FaqView"));

export default async function FaqPage() {
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get("app-theme")?.value;

  let activeTheme = (THEME_SHORT_MAP[rawTheme as string] || rawTheme || "classic") as ThemeType;

  if (!VALID_THEMES.includes(activeTheme)) {
    activeTheme = "classic";
  }

  switch (activeTheme) {
    case "festival-civic":
      return <FestivalFaq />;
    case "charcoal-grid":
      return <CharcoalFaq />;
    case "copper-lecture":
      return <CopperFaq />;
    case "mint-campaign":
      return <MintFaq />;
    default:
      return <ClassicFaq />;
  }
}
