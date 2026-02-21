

export type Course = {
    id: number;
    title: string;
    description: string;
    level: string;
    duration: string;
    students: number;
    rating: number;
    progress: number;
    status: "in_progress" | "locked" | "completed";
    instructor: string;
    topics: string[];
    color: "blue" | "purple" | "cyan" | "green" | "amber" | "red";
};

export type LearningPath = {
    id: number;
    title: string;
    description: string;
    courses: number;
    duration: string;
    difficulty: string;
    color: "blue" | "purple" | "amber";
    icon: string;
};

export const courses: Course[] = [
    {
        id: 1,
        title: "议事规则基础",
        description: "掌握罗伯特议事规则的基本概念和核心原则",
        level: "基础",
        duration: "6小时",
        students: 245,
        rating: 4.9,
        progress: 85,
        status: "in_progress",
        instructor: "张教授",
        topics: ["基本概念", "会议流程", "投票规则"],
        color: "blue",
    },
    {
        id: 2,
        title: "会议主持技巧",
        description: "学习如何有效主持各类会议，提升领导力",
        level: "进阶",
        duration: "8小时",
        students: 189,
        rating: 4.8,
        progress: 60,
        status: "in_progress",
        instructor: "李老师",
        topics: ["主持技巧", "时间管理", "冲突处理"],
        color: "purple",
    },
    {
        id: 3,
        title: "辩论与表达",
        description: "提升公共演讲和辩论能力，学会有效表达观点",
        level: "进阶",
        duration: "10小时",
        students: 156,
        rating: 4.7,
        progress: 30,
        status: "in_progress",
        instructor: "王老师",
        topics: ["演讲技巧", "逻辑思维", "说服力"],
        color: "cyan",
    },
    {
        id: 4,
        title: "模拟议会实战",
        description: "通过模拟议会实践，真实体验议事过程",
        level: "实战",
        duration: "12小时",
        students: 98,
        rating: 4.9,
        progress: 0,
        status: "locked",
        instructor: "赵专家",
        topics: ["模拟实践", "角色扮演", "案例分析"],
        color: "green",
    },
    {
        id: 5,
        title: "课堂协作实践",
        description: "了解课堂协作的途径和方法，提升沟通能力",
        level: "实战",
        duration: "8小时",
        students: 134,
        rating: 4.6,
        progress: 45,
        status: "in_progress",
        instructor: "陈老师",
        topics: ["协作途径", "课堂规则", "实践案例"],
        color: "amber",
    },
    {
        id: 6,
        title: "议事文书写作",
        description: "掌握各类议事文书的写作规范和技巧",
        level: "基础",
        duration: "4小时",
        students: 203,
        rating: 4.8,
        progress: 100,
        status: "completed",
        instructor: "刘老师",
        topics: ["文书规范", "写作技巧", "模板应用"],
        color: "red",
    },
];

export const learningPaths: LearningPath[] = [
    {
        id: 1,
        title: "新手入门",
        description: "适合零基础学员的完整学习路径",
        courses: 4,
        duration: "20小时",
        difficulty: "基础",
        color: "blue",
        icon: "Target",
    },
    {
        id: 2,
        title: "进阶提升",
        description: "有一定基础，希望深入学习的学员",
        courses: 6,
        duration: "35小时",
        difficulty: "进阶",
        color: "purple",
        icon: "TrendingUp",
    },
    {
        id: 3,
        title: "实战专家",
        description: "面向有经验学员的高级实战课程",
        courses: 8,
        duration: "50小时",
        difficulty: "专家",
        color: "amber",
        icon: "Award",
    },
];
