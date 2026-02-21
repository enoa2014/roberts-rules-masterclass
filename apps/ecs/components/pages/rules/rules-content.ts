import type { ThemeType } from "@yiqidu/ui";

export type RulesCopy = {
  pageTitle: string;
  pageDescription: string;
};

const CLASSIC_COPY: RulesCopy = {
  pageTitle: "议事规则详解",
  pageDescription: "从基础原理到高阶应用，面向课堂沟通与协作，系统掌握罗伯特议事规则。",
};

export const RULES_COPY: Record<ThemeType, RulesCopy> = {
  classic: CLASSIC_COPY,
  "festival-civic": {
    pageTitle: "活力课堂议事规则详解",
    pageDescription: "从基础原理到高阶应用，在活力课堂训练中掌握罗伯特议事规则。",
  },
  "mint-campaign": {
    pageTitle: "薄荷实践议事规则详解",
    pageDescription: "从基础原理到高阶应用，在薄荷实践训练中掌握罗伯特议事规则。",
  },
  "charcoal-grid": CLASSIC_COPY,
  "copper-lecture": CLASSIC_COPY,
};
