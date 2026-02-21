import { cookies } from "next/headers";
import { ThemeType, VALID_THEMES, THEME_SHORT_MAP } from "@/components/core/types";
import dynamic from 'next/dynamic';

const ClassicHome = dynamic(() => import("@/components/themes/classic/views/HomeView"));
const FestivalHome = dynamic(() => import("@/components/themes/festival/views/HomeView"));
const CharcoalHome = dynamic(() => import("@/components/themes/charcoal/views/HomeView"));
const CopperHome = dynamic(() => import("@/components/themes/copper/views/HomeView"));
const MintHome = dynamic(() => import("@/components/themes/mint/views/HomeView"));

export default async function HomePage() {
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get("app-theme")?.value;

  let activeTheme = (THEME_SHORT_MAP[rawTheme as string] || rawTheme || "classic") as ThemeType;

  if (!VALID_THEMES.includes(activeTheme)) {
    console.warn(`[Theme Middleware] 未知的主题取值: "${rawTheme}" 触发安全降级`);
    activeTheme = 'classic';
  }

  switch (activeTheme) {
    case 'festival-civic': return <FestivalHome />;
    case 'charcoal-grid': return <CharcoalHome />;
    case 'copper-lecture': return <CopperHome />;
    case 'mint-campaign': return <MintHome />;
    default: return <ClassicHome />;
  }
}
