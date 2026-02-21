import type { ThemeType } from "@yiqidu/ui";

export interface ThemeMetric {
  id: string;
  value: string;
  labelMap: Record<ThemeType, string>;
  iconType: 'users' | 'book' | 'vote' | 'award';
}

export interface ThemeFeature {
  id: string;
  titleMap: Record<ThemeType, string>;
  descMap: Record<ThemeType, string>;
  iconType: 'scale' | 'zap' | 'users' | 'crown';
}

export interface ThemeEntry {
  id: string;
  titleMap: Record<ThemeType, string>;
  descMap: Record<ThemeType, string>;
  href: string;
  iconType: 'course' | 'rules' | 'reading' | 'tools' | 'resources' | 'interact' | 'homework' | 'discussion' | 'invite' | 'lab' | 'admin' | 'about' | 'faq';
}

export interface ThemeStep {
  id: string;
  stepIdx: string;
  titleMap: Record<ThemeType, string>;
  descMap: Record<ThemeType, string>;
  iconType: 'shield' | 'book' | 'gavel';
}

// 统一的页面静态数据字典
export const HOME_METRICS: ThemeMetric[] = [
  {
    id: 'students',
    value: '500+',
    labelMap: {
      'classic': '活跃学员',
      'festival-civic': '活力学员',
      'charcoal-grid': '结构学员',
      'copper-lecture': '讲堂学员',
      'mint-campaign': '实践学员'
    },
    iconType: 'users'
  },
  {
    id: 'courses',
    value: '12+',
    labelMap: {
      'classic': '精品课程',
      'festival-civic': '活力课程',
      'charcoal-grid': '结构课程',
      'copper-lecture': '讲堂课程',
      'mint-campaign': '实践课程'
    },
    iconType: 'book'
  },
  {
    id: 'battles',
    value: '50+',
    labelMap: {
      'classic': '模拟会议',
      'festival-civic': '课堂演练',
      'charcoal-grid': '结构演练',
      'copper-lecture': '讲堂研讨',
      'mint-campaign': '实践演练'
    },
    iconType: 'vote'
  },
  {
    id: 'rating',
    value: '98%',
    labelMap: {
      'classic': '好评率',
      'festival-civic': '学员好评',
      'charcoal-grid': '结构好评',
      'copper-lecture': '讲堂好评',
      'mint-campaign': '实践好评'
    },
    iconType: 'award'
  }
];

export const HOME_FEATURES: ThemeFeature[] = [
  {
    id: 'course-sys',
    iconType: 'scale',
    titleMap: {
      'classic': '系统课程',
      'festival-civic': '活力课程体系',
      'charcoal-grid': '结构化课程体系',
      'copper-lecture': '讲堂课程体系',
      'mint-campaign': '实践课程体系'
    },
    descMap: {
      'classic': '由浅入深的课程体系，从基础概念到高阶应用全覆盖，建立完整的课堂规则框架。',
      'festival-civic': '在活力课堂氛围中，从基础到高阶系统掌握议事规则，让学习更有节奏与目标。',
      'charcoal-grid': '模块化课程体系，从规则拆解到场景应用分层推进，帮助你形成可复用的课堂讨论框架。',
      'copper-lecture': '围绕规则原理、案例拆解与表达训练构建讲堂体系，让学习者稳步建立课堂表达框架。',
      'mint-campaign': '围绕实践任务与案例演练推进学习，让规则理解逐步转化为课堂应用。'
    }
  },
  {
    id: 'interact',
    iconType: 'zap',
    titleMap: {
      'classic': '互动课堂',
      'festival-civic': '实时互动课堂',
      'charcoal-grid': '规则化互动',
      'copper-lecture': '讲堂研讨',
      'mint-campaign': '任务驱动实践'
    },
    descMap: {
      'classic': '实时投票、举手发言，还原课堂讨论场景，在实践中掌握规则精髓。',
      'festival-civic': '实时投票、举手发言，在课堂互动中体验规则化讨论，让每次参与更有秩序。',
      'charcoal-grid': '流程化互动、规则化发言，还原课堂讨论的节奏与边界，在实践中提升表达质量。',
      'copper-lecture': '从讲解到提问再到观点陈述，形成节奏清晰的课堂互动，让每次发言都更有依据与逻辑。',
      'mint-campaign': '以任务驱动的课堂互动，强化表达、倾听与反馈的闭环。'
    }
  },
  {
    id: 'community',
    iconType: 'users',
    titleMap: {
      'classic': '社群共学',
      'festival-civic': '活力共学社群',
      'charcoal-grid': '结构学习共同体',
      'copper-lecture': '讲堂共学社群',
      'mint-campaign': '实践协作小组'
    },
    descMap: {
      'classic': '与同行教师与家长一起练习，在讨论中共同进步，形成学习共同体。',
      'festival-civic': '与同行教师与家长一起共学，在讨论与复盘中提升表达与协作能力。',
      'charcoal-grid': '与伙伴在统一结构下协同练习，在复盘中持续优化规则运用，形成高质量学习共同体。',
      'copper-lecture': '与同伴在阅读、讨论与复盘中共同打磨表达能力，形成兼具深度与温度的讲堂学习共同体。',
      'mint-campaign': '在实践任务与案例讨论中协同练习，形成稳定的课堂协作方法。'
    }
  },
  {
    id: 'cert',
    iconType: 'crown',
    titleMap: {
      'classic': '能力认证',
      'festival-civic': '活力表现认证',
      'charcoal-grid': '结构能力评级',
      'copper-lecture': '讲堂结业认证',
      'mint-campaign': '实践能力认证'
    },
    descMap: {
      'classic': '完成课程与挑战，获得官方认证的结业证书，证明你的课堂沟通能力水平。',
      'festival-civic': '完成课程与实践挑战，获得学习档案与能力认证，展示课堂协作与表达进阶成果。',
      'charcoal-grid': '完成结构化挑战，获得能力认证与过程证据，清晰展示你的课堂协作能力水平。',
      'copper-lecture': '完成讲堂任务与专题答辩，获得学习档案与能力认证，清晰展示你的课堂表达进阶成果。',
      'mint-campaign': '完成实践任务与展示，获得学习档案与能力认证，沉淀可复用的课堂方法。'
    }
  }
];

export const HOME_STEPS: ThemeStep[] = [
  {
    id: 'step1',
    stepIdx: '01',
    iconType: 'shield',
    titleMap: {
      'classic': '注册加入',
      'festival-civic': '激活课程',
      'charcoal-grid': '配置环境',
      'copper-lecture': '进入序厅',
      'mint-campaign': '领取任务'
    },
    descMap: {
      'classic': '创建账号并输入邀请码，立即解锁全部课程内容，开始你的学习之旅。',
      'festival-civic': '创建账号并输入邀请码，立即进入活力课堂学习，开启你的课堂沟通与协作之旅。',
      'charcoal-grid': '创建账号并输入邀请码，立即进入结构化学习体系，开启你的清晰成长路径。',
      'copper-lecture': '创建账号并输入邀请码，立即进入讲堂学习空间，开启你的规则表达与课堂协作训练。',
      'mint-campaign': '创建账号并输入邀请码，立即进入实践训练空间，开启你的课堂表达与协作之旅。'
    }
  },
  {
    id: 'step2',
    stepIdx: '02',
    iconType: 'book',
    titleMap: {
      'classic': '系统学习',
      'festival-civic': '沉浸学习',
      'charcoal-grid': '研读规则',
      'copper-lecture': '倾听讲座',
      'mint-campaign': '实地考察'
    },
    descMap: {
      'classic': '跟随课程体系，从基础原则到高阶应用循序渐进，建立完整知识体系。',
      'festival-civic': '在活力课堂节奏中系统学习，从基础原则到高阶应用，建立可执行的课堂规则体系。',
      'charcoal-grid': '在统一结构和清晰模块中学习，从基础原则到高阶应用稳步推进，建立可执行知识体系。',
      'copper-lecture': '在讲堂节奏中完成规则学习与案例拆解，从基础原则到高阶应用稳步建立知识体系。',
      'mint-campaign': '在实践节奏中完成规则学习与案例拆解，强化课堂应用能力。'
    }
  },
  {
    id: 'step3',
    stepIdx: '03',
    iconType: 'gavel',
    titleMap: {
      'classic': '模拟实战',
      'festival-civic': '登台演练',
      'charcoal-grid': '沙盘推演',
      'copper-lecture': '激辩答辩',
      'mint-campaign': '结题汇报'
    },
    descMap: {
      'classic': '参与互动课堂，在模拟会议中真实演练所学规则，提升实践能力。',
      'festival-civic': '参与模拟课堂与讨论演练，在规则化流程中真实练习，提升协作与表达能力。',
      'charcoal-grid': '参与结构化模拟会议，在标准流程中演练规则应用，持续提升协作与决策质量。',
      'copper-lecture': '参与讲堂研讨与模拟会议，在观点表达和规则运用中持续复盘，形成稳定实践能力。',
      'mint-campaign': '参与实践任务与模拟会议，在观点表达和规则运用中持续复盘，形成稳定实践能力。'
    }
  }
];

export const QUICK_ENTRIES: ThemeEntry[] = [
  {
    id: 'c1',
    href: '/course',
    iconType: 'course',
    titleMap: { 'classic': '课程总览', 'festival-civic': '活力大纲', 'charcoal-grid': '模组清单', 'copper-lecture': '讲座日历', 'mint-campaign': '任务板' },
    descMap: { 'classic': '浏览所有课程', 'festival-civic': '探索互动课程', 'charcoal-grid': '查看结构模块', 'copper-lecture': '查阅讲堂进度', 'mint-campaign': '管理训练目标' }
  },
  {
    id: 'c2',
    href: '/rules',
    iconType: 'rules',
    titleMap: { 'classic': '学习中心', 'festival-civic': '训练营地', 'charcoal-grid': '规则引擎', 'copper-lecture': '图书馆', 'mint-campaign': '实践工坊' },
    descMap: { 'classic': '议事规则学习', 'festival-civic': '开始课堂训练', 'charcoal-grid': '掌握底部逻辑', 'copper-lecture': '沉淀理论知识', 'mint-campaign': '动手模拟演练' }
  },
  {
    id: 'c3',
    href: '/reading',
    iconType: 'reading',
    titleMap: { 'classic': '阅读探究', 'festival-civic': '深读空间', 'charcoal-grid': '解析终端', 'copper-lecture': '名家文库', 'mint-campaign': '调研资料' },
    descMap: { 'classic': '深度阅读材料', 'festival-civic': '拓展认知边界', 'charcoal-grid': '解析核心法案', 'copper-lecture': '借阅经典文献', 'mint-campaign': '分析真实案例' }
  },
];
