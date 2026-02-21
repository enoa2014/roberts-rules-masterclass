import { cookies } from "next/headers";
import { ThemeType, VALID_THEMES, THEME_SHORT_MAP } from "@/components/core/types";
import dynamic from "next/dynamic";

const ClassicAbout = dynamic(() => import("@/components/themes/classic/views/AboutView"));
const FestivalAbout = dynamic(() => import("@/components/themes/festival/views/AboutView"));
const MintAbout = dynamic(() => import("@/components/themes/mint/views/AboutView"));
const CharcoalAbout = dynamic(() => import("@/components/themes/charcoal/views/AboutView"));
const CopperAbout = dynamic(() => import("@/components/themes/copper/views/AboutView"));

export default async function AboutPage() {
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get("app-theme")?.value;

  let activeTheme = (THEME_SHORT_MAP[rawTheme as string] || rawTheme || "classic") as ThemeType;

  if (!VALID_THEMES.includes(activeTheme)) {
    activeTheme = "classic";
  }

  switch (activeTheme) {
    case "festival-civic":
      return <FestivalAbout />;
    case "charcoal-grid":
      return <CharcoalAbout />;
    case "copper-lecture":
      return <CopperAbout />;
    case "mint-campaign":
      return <MintAbout />;
    default:
      return <ClassicAbout />;
  }
}
