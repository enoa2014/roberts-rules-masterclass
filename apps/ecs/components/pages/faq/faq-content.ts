import type { ThemeType } from "@yiqidu/ui";

export type FaqCopy = {
  pageTitle: string;
  pageDescription: string;
};

export const FAQ_COPY: Record<ThemeType, FaqCopy> = {
  classic: {
    pageTitle: "常见问题",
    pageDescription: "这里有您可能关心的问题解答",
  },
  "festival-civic": {
    pageTitle: "活力课堂常见问题",
    pageDescription: "这里有活力课堂学习中常见的问题解答",
  },
  "mint-campaign": {
    pageTitle: "薄荷实践常见问题",
    pageDescription: "这里有薄荷实践学习中常见的问题解答",
  },
  "charcoal-grid": {
    pageTitle: "栅格常见问题",
    pageDescription: "这里有结构化学习中常见的问题解答",
  },
  "copper-lecture": {
    pageTitle: "讲堂常见问题",
    pageDescription: "这里有讲堂学习中常见的问题解答",
  },
};
