import { GameCard } from './cardData';

// 主任医师阶段卡片
const CHIEF_CARDS: GameCard[] = [
  {
    id: "CHF_Surgery_Pressure_01",
    phase: "Chief",
    text: "家属强烈要求高风险手术。改期评估还是立即安排？",
    left: {
      label: "改期优化评估",
      impact: { Safety: 10, Ethics: 6, Energy: -5 }
    },
    right: {
      label: "按压力上台",
      impact: { Safety: "-12", Ethics: -6, Energy: -3 },
      risk: { Safety: [-15, 10] }
    },
    timeCost: 3,
    category: "emergency",
    weight: 10
  },
  {
    id: "CHF_Teaching_Assignment_01",
    phase: "Chief",
    text: "分配带教任务，好学生想跟你，但你已经很忙。",
    left: {
      label: "亲自带教",
      impact: { Knowledge: 8, Ethics: 6, Energy: -8 }
    },
    right: {
      label: "分配给其他医生",
      impact: { Energy: -2, Ethics: 2, Knowledge: 1 }
    },
    timeCost: 2,
    category: "teaching",
    weight: 7
  },
  {
    id: "CHF_Media_Interview_01",
    phase: "Chief",
    text: "记者采访医疗事故，要求你评论同行做法。",
    left: {
      label: "客观中立评论",
      impact: { Ethics: 10, Energy: -3, Safety: 2 }
    },
    right: {
      label: "拒绝采访",
      impact: { Energy: -1, Ethics: 3 }
    },
    timeCost: 2,
    category: "media",
    weight: 6
  },
  {
    id: "CHF_Resource_Allocation_01",
    phase: "Chief",
    text: "科室资源紧张，两个患者都需要同一设备。",
    left: {
      label: "按病情紧急度分配",
      impact: { Safety: 12, Ethics: 8, Energy: -5 }
    },
    right: {
      label: "按经济条件分配",
      impact: { Safety: -5, Ethics: -10, Energy: -2 }
    },
    timeCost: 2,
    category: "emergency",
    weight: 8
  },
  {
    id: "CHF_Quality_Control_01",
    phase: "Chief",
    text: "质控检查发现下属医生的手术记录有问题。",
    left: {
      label: "严格按规处理",
      impact: { Safety: 10, Ethics: 12, Energy: -6 }
    },
    right: {
      label: "私下沟通警告",
      impact: { Safety: 3, Ethics: -3, Energy: -2 }
    },
    timeCost: 2,
    category: "compliance",
    weight: 7
  },
  {
    id: "CHF_Innovation_Risk_01",
    phase: "Chief",
    text: "新手术技术有风险，但可能改善患者预后。",
    left: {
      label: "谨慎尝试",
      impact: { Knowledge: 10, Safety: 5, Energy: -6 }
    },
    right: {
      label: "坚持传统方法",
      impact: { Safety: 3, Knowledge: -2, Energy: -1 }
    },
    timeCost: 3,
    category: "emergency",
    weight: 8
  },
  // 关卡卡
  {
    id: "CHF_GATE_Surgery_Audit",
    phase: "Chief",
    text: "手术质控审计，你的医疗技术和管理能力受到检验。",
    left: {
      label: "全面配合审计",
      impact: { Safety: 15, Ethics: 15, Energy: -8 }
    },
    right: {
      label: "形式化应对",
      impact: { Safety: 5, Ethics: -5, Energy: -3 }
    },
    timeCost: 3,
    category: "compliance",
    isGate: true,
    weight: 1
  }
];

// 院士阶段卡片
const ACADEMICIAN_CARDS: GameCard[] = [
  {
    id: "ACA_Media_Crisis_01",
    phase: "Academician",
    text: "学术争议引发舆情发酵。公开道歉还是沉默应对？",
    left: {
      label: "公开道歉改进",
      impact: { Ethics: 12, Safety: 4, Energy: -6 }
    },
    right: {
      label: "沉默应对",
      impact: { Ethics: -10, Energy: -2 }
    },
    timeCost: 2,
    category: "media",
    rareEventChance: 0.3,
    weight: 8
  },
  {
    id: "ACA_Public_Health_01",
    phase: "Academician",
    text: "重大公卫事件，需要你作为专家提供建议。",
    left: {
      label: "基于科学证据建议",
      impact: { Safety: 15, Knowledge: 8, Ethics: 10, Energy: -8 }
    },
    right: {
      label: "考虑政治因素",
      impact: { Safety: -5, Ethics: -8, Energy: -3 }
    },
    timeCost: 3,
    category: "publicHealth",
    weight: 10
  },
  {
    id: "ACA_Interest_Conflict_01",
    phase: "Academician",
    text: "制药公司邀请你参与新药研发，报酬丰厚。",
    left: {
      label: "公开利益冲突声明",
      impact: { Ethics: 15, Knowledge: 5, Energy: -3 }
    },
    right: {
      label: "隐瞒利益关系",
      impact: { Ethics: -15, Knowledge: 3, Energy: 1 }
    },
    timeCost: 2,
    category: "academic",
    weight: 8
  },
  {
    id: "ACA_Mentorship_01",
    phase: "Academician",
    text: "年轻学者找你指导，但你时间有限。",
    left: {
      label: "亲自指导培养",
      impact: { Knowledge: 6, Ethics: 8, Energy: -8 }
    },
    right: {
      label: "推荐其他导师",
      impact: { Energy: -2, Ethics: 2 }
    },
    timeCost: 2,
    category: "teaching",
    weight: 6
  },
  {
    id: "ACA_Legacy_Research_01",
    phase: "Academician",
    text: "你的经典研究被质疑，年轻人提出不同观点。",
    left: {
      label: "开放讨论反思",
      impact: { Knowledge: 8, Ethics: 12, Energy: -5 }
    },
    right: {
      label: "维护权威拒绝",
      impact: { Knowledge: -5, Ethics: -8, Energy: -2 }
    },
    timeCost: 2,
    category: "academic",
    weight: 7
  },
  {
    id: "ACA_International_Award_01",
    phase: "Academician",
    text: "国际奖项提名，但需要你在争议话题上表态。",
    left: {
      label: "坚持学术立场",
      impact: { Knowledge: 12, Ethics: 10, Energy: -5 }
    },
    right: {
      label: "中性表态",
      impact: { Knowledge: 5, Ethics: 2, Energy: -2 }
    },
    timeCost: 2,
    category: "academic",
    weight: 6
  },
  // 关卡卡
  {
    id: "ACA_GATE_Academy_Review",
    phase: "Academician",
    text: "院士评鉴，你的学术成就和社会贡献受到全面检验。",
    left: {
      label: "以德为先，学为本",
      impact: { Knowledge: 12, Ethics: 18, Energy: -8 }
    },
    right: {
      label: "强调个人成就",
      impact: { Knowledge: 8, Ethics: -5, Energy: -3 }
    },
    timeCost: 3,
    category: "academic",
    isGate: true,
    weight: 1
  }
];

// 稀有事件卡片 (10%概率触发)
const RARE_EVENT_CARDS: GameCard[] = [
  {
    id: "RARE_Hero_Rescue_01",
    phase: "Student", // 可以在任意阶段触发
    text: "深夜遇车祸多发伤，你是现场唯一医护！",
    left: {
      label: "上前救治",
      impact: { Safety: 15, Knowledge: 10, Energy: -12, Ethics: 8 },
      addTags: ["Hero_Doctor", "Miracle_Worker"]
    },
    right: {
      label: "谨慎避开",
      impact: { Safety: -5, Ethics: -10, Energy: 2 }
    },
    timeCost: 3,
    category: "emergency",
    isRare: true,
    weight: 1
  },
  {
    id: "RARE_Viral_Scandal_01",
    phase: "Resident",
    text: "你的争议视频意外走红全网...",
    left: {
      label: "积极澄清并道歉",
      impact: { Ethics: 5, Energy: -15, Safety: -5 }
    },
    right: {
      label: "隐躲避风头",
      impact: { Ethics: -20, Energy: -10, Safety: -5 },
      addTags: ["Internet_Scandal", "Career_Ruined"]
    },
    timeCost: 2,
    category: "media",
    isRare: true,
    weight: 1
  },
  {
    id: "RARE_Medical_Breakthrough_01",
    phase: "PhD",
    text: "你的研究意外取得重大突破，全世界关注！",
    left: {
      label: "谨慎公布结果",
      impact: { Knowledge: 20, Ethics: 10, Energy: -8, Safety: 5 },
      addTags: ["Scientific_Pioneer", "World_Renowned"]
    },
    right: {
      label: "秘密研究获利",
      impact: { Knowledge: 15, Ethics: -15, Energy: -5 }
    },
    timeCost: 3,
    category: "academic",
    isRare: true,
    weight: 1
  },
  {
    id: "RARE_Medical_Ethics_Crisis_01",
    phase: "Chief",
    text: "重大医疗事故，全社会关注，你需要公开回应。",
    left: {
      label: "勇担责任改革",
      impact: { Ethics: 18, Safety: 10, Energy: -15, Knowledge: 5 },
      addTags: ["Reform_Leader", "Ethical_Warrior"]
    },
    right: {
      label: "推脱责任",
      impact: { Ethics: -25, Safety: -10, Energy: -8 },
      addTags: ["Scandal_Involved"]
    },
    timeCost: 4,
    category: "media",
    isRare: true,
    weight: 1
  },
  {
    id: "RARE_Global_Pandemic_01",
    phase: "Academician",
    text: "全球大流行，你的建议将影响亿万人生命！",
    left: {
      label: "基于科学的抵抗政策",
      impact: { Safety: 25, Knowledge: 15, Ethics: 20, Energy: -20 },
      addTags: ["Global_Hero", "Pandemic_Fighter"]
    },
    right: {
      label: "儿全的建议",
      impact: { Safety: -15, Ethics: -20, Energy: -10 },
      addTags: ["Pandemic_Failure"]
    },
    timeCost: 5,
    category: "publicHealth",
    isRare: true,
    weight: 1
  }
];

// 喘息卡 - 在连续负面事件后插入
const RELIEF_CARDS: GameCard[] = [
  {
    id: "RELIEF_Coffee_Break_01",
    phase: "Student",
    text: "同学邀请你吃下午茶，放松一下心情。",
    left: {
      label: "愉快接受",
      impact: { Energy: 8, Ethics: 2 }
    },
    right: {
      label: "继续学习",
      impact: { Knowledge: 3, Energy: -1 }
    },
    timeCost: 1,
    category: "communication",
    weight: 1
  },
  {
    id: "RELIEF_Patient_Thanks_01",
    phase: "Resident",
    text: "患者家属送来锦旗，感谢你的治疗。",
    left: {
      label: "心存感激",
      impact: { Energy: 10, Ethics: 5, Safety: 3 }
    },
    right: {
      label: "淡然处之",
      impact: { Energy: 5, Ethics: 3 }
    },
    timeCost: 1,
    category: "communication",
    weight: 1
  }
];

export { CHIEF_CARDS, ACADEMICIAN_CARDS, RARE_EVENT_CARDS, RELIEF_CARDS };