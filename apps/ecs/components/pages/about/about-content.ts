import type { ThemeType } from "@yiqidu/ui";
import { Heart, Lightbulb, Users } from "lucide-react";
import type { AboutCtaCard, AboutValueCard } from "./AboutView";

export type AboutCopy = {
  pageTitle: string;
  pageDescription: string;
  brandName: string;
  intro1: string;
  intro2: string;
  valueCards: AboutValueCard[];
  ctaTitle: string;
  ctaCards: AboutCtaCard[];
};

const BASE_VALUES = {
  respect: "尊重",
  rational: "理性",
  collaborate: "协作",
};

const VALUE_DESCRIPTIONS = {
  respect: "倾听与包容",
  rational: "逻辑与规则",
  collaborate: "共识与落实",
};

const buildValues = (labels: { respect: string; rational: string; collaborate: string }): AboutValueCard[] => [
  { icon: Heart, label: labels.respect, desc: VALUE_DESCRIPTIONS.respect },
  { icon: Lightbulb, label: labels.rational, desc: VALUE_DESCRIPTIONS.rational },
  { icon: Users, label: labels.collaborate, desc: VALUE_DESCRIPTIONS.collaborate },
];

export const ABOUT_COPY: Record<ThemeType, AboutCopy> = {
  classic: {
    pageTitle: "关于我们",
    pageDescription: "面向教师与家长的课堂沟通与协作培训",
    brandName: "「议起读」",
    intro1: "是一个面向教师与家长的课堂沟通与协作培训平台。我们相信，清晰的讨论规则与协作习惯是高效课堂与家校沟通的基础。",
    intro2: "通过引入《罗伯特议事规则》并本土化适配，我们形成了面向教师与家长的课程体系，包含规则讲解、课堂情境演练、家校沟通模拟与复盘。",
    valueCards: buildValues(BASE_VALUES),
    ctaTitle: "加入课程学习",
    ctaCards: [
      {
        title: "我是家长 / 教师",
        desc: "希望参与课程学习？",
        linkLabel: "立即注册账号",
        href: "/register",
      },
      {
        title: "我是教育工作者",
        desc: "有意引入课程或成为讲师？",
        linkLabel: "联系商务合作",
        href: "mailto:partner@yiqidu.com",
      },
    ],
  },
  "festival-civic": {
    pageTitle: "关于活力课堂",
    pageDescription: "面向教师与家长的活力课堂沟通培训",
    brandName: "「议起读·活力课堂」",
    intro1: "是一个面向教师与家长的课堂沟通培训平台。我们相信，在更有活力的课堂氛围中，表达、倾听与协作更容易形成习惯。",
    intro2: "通过引入《罗伯特议事规则》并本土化适配，我们设计了更具活力的课堂训练。除了规则讲解，还包含情境演练、课堂流程设计与教师互学，让课堂讨论更有序。",
    valueCards: buildValues({
      respect: "活力尊重",
      rational: "活力理性",
      collaborate: "活力协作",
    }),
    ctaTitle: "加入活力课堂",
    ctaCards: [
      {
        title: "我是活力课堂学员",
        desc: "希望参与活力课堂训练？",
        linkLabel: "立即加入活力课堂",
        href: "/register",
      },
      {
        title: "我是活力课堂组织者",
        desc: "有意引入活力课堂课程或成为讲师？",
        linkLabel: "联系课堂合作",
        href: "mailto:partner@yiqidu.com",
        delayMs: 100,
      },
    ],
  },
  "mint-campaign": {
    pageTitle: "关于薄荷实践",
    pageDescription: "面向教师与家长的薄荷实践沟通训练",
    brandName: "「议起读·薄荷实践」",
    intro1: "是一个面向教师与家长的课堂实践训练平台。我们强调清晰流程与即时反馈，让表达与协作在练习中沉淀。",
    intro2: "通过引入《罗伯特议事规则》并本土化适配，我们开发了强调实践反馈的课程体系。从任务驱动、分组讨论到模拟会议，让学员在练习中形成表达、倾听与协作能力。",
    valueCards: buildValues({
      respect: "薄荷尊重",
      rational: "薄荷理性",
      collaborate: "薄荷协作",
    }),
    ctaTitle: "加入薄荷实践",
    ctaCards: [
      {
        title: "我是薄荷实践学员",
        desc: "希望参与薄荷实践训练？",
        linkLabel: "立即加入薄荷实践",
        href: "/register",
      },
      {
        title: "我是薄荷实践组织者",
        desc: "有意引入薄荷实践课程或成为讲师？",
        linkLabel: "联系实践合作",
        href: "mailto:partner@yiqidu.com",
        delayMs: 100,
      },
    ],
  },
  "charcoal-grid": {
    pageTitle: "关于栅格",
    pageDescription: "面向教师与家长的结构化沟通训练",
    brandName: "「议起读·炭黑栅格」",
    intro1: "是一个面向教师与家长的结构化沟通训练平台。通过边界清晰、节奏明确的训练，形成可迁移的课堂协作能力。",
    intro2: "通过引入《罗伯特议事规则》并本土化适配，我们构建了分层明确的课程体系。从规则拆解、案例演练到会议复盘，帮助学员稳定建立表达、倾听与共识形成能力。",
    valueCards: buildValues({
      respect: "栅格尊重",
      rational: "栅格理性",
      collaborate: "栅格协作",
    }),
    ctaTitle: "加入炭黑栅格",
    ctaCards: [
      {
        title: "我是栅格学员",
        desc: "希望参与结构化课程学习？",
        linkLabel: "立即加入结构课程",
        href: "/register",
      },
      {
        title: "我是结构化教育者",
        desc: "有意引入结构化课程或成为讲师？",
        linkLabel: "联系结构合作",
        href: "mailto:partner@yiqidu.com",
        delayMs: 100,
      },
    ],
  },
  "copper-lecture": {
    pageTitle: "关于讲堂",
    pageDescription: "面向教师与家长的讲堂式沟通训练",
    brandName: "「议起读·铜色讲堂」",
    intro1: "是一个面向教师与家长的讲堂式沟通培训平台。通过讲解、示例与复盘，提升规则化表达能力。",
    intro2: "通过引入《罗伯特议事规则》并本土化适配，我们构建了“讲解 - 演练 - 复盘”闭环课程。学员在每节讲堂中理解规则原理，并完成情景练习，形成可迁移的方法。",
    valueCards: buildValues({
      respect: "讲堂尊重",
      rational: "讲堂理性",
      collaborate: "讲堂协作",
    }),
    ctaTitle: "加入铜色讲堂",
    ctaCards: [
      {
        title: "我是讲堂学员",
        desc: "希望参与讲堂式课程学习？",
        linkLabel: "立即加入铜色讲堂",
        href: "/register",
      },
      {
        title: "我是讲堂教育者",
        desc: "有意引入讲堂课程或成为讲师？",
        linkLabel: "联系讲堂合作",
        href: "mailto:partner@yiqidu.com",
        delayMs: 100,
      },
    ],
  },
};
