import { cookies } from "next/headers";
import { ThemeType, VALID_THEMES, THEME_SHORT_MAP } from "@/components/core/types";
import dynamic from "next/dynamic";

const ClassicReading = dynamic(() => import("@/components/themes/classic/views/ReadingView"));
const FestivalReading = dynamic(() => import("@/components/themes/festival/views/ReadingView"));
const MintReading = dynamic(() => import("@/components/themes/mint/views/ReadingView"));
const CharcoalReading = dynamic(() => import("@/components/themes/charcoal/views/ReadingView"));
const CopperReading = dynamic(() => import("@/components/themes/copper/views/ReadingView"));

export default async function ReadingPage() {
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get("app-theme")?.value;

  let activeTheme = (THEME_SHORT_MAP[rawTheme as string] || rawTheme || "classic") as ThemeType;

  if (!VALID_THEMES.includes(activeTheme)) {
    activeTheme = "classic";
  }

  switch (activeTheme) {
    case "festival-civic":
      return <FestivalReading />;
    case "charcoal-grid":
      return <CharcoalReading />;
    case "copper-lecture":
      return <CopperReading />;
    case "mint-campaign":
      return <MintReading />;
    default:
      return <ClassicReading />;
  }
}
