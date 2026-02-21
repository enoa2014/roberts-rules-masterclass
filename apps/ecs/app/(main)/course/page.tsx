import { cookies } from "next/headers";
import { ThemeType, VALID_THEMES, THEME_SHORT_MAP } from "@/components/core/types";
import dynamic from "next/dynamic";

const ClassicCourse = dynamic(() => import("@/components/themes/classic/views/CourseView"));
const FestivalCourse = dynamic(() => import("@/components/themes/festival/views/CourseView"));
const MintCourse = dynamic(() => import("@/components/themes/mint/views/CourseView"));
const CharcoalCourse = dynamic(() => import("@/components/themes/charcoal/views/CourseView"));
const CopperCourse = dynamic(() => import("@/components/themes/copper/views/CourseView"));

export default async function CoursePage() {
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get("app-theme")?.value;

  let activeTheme = (THEME_SHORT_MAP[rawTheme as string] || rawTheme || "classic") as ThemeType;

  if (!VALID_THEMES.includes(activeTheme)) {
    activeTheme = 'classic';
  }

  switch (activeTheme) {
    case 'festival-civic': return <FestivalCourse />;
    case 'charcoal-grid': return <CharcoalCourse />;
    case 'copper-lecture': return <CopperCourse />;
    case 'mint-campaign': return <MintCourse />;
    default: return <ClassicCourse />;
  }
}
