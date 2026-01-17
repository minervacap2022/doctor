import { GamePhaseType, CardCategoryType } from './gameConfig';

// 卡片基础接口
export interface GameCard {
  id: string;
  phase: GamePhaseType;
  text: string; // ≤60字
  left: {
    label: string; // ≤12字
    impact: ResourceImpact;
    addTags?: string[];
    addFlags?: string[];
    risk?: { [key: string]: [number, number] }; // [min, max] 风险范围
  };
  right: {
    label: string; // ≤12字
    impact: ResourceImpact;
    addTags?: string[];
    addFlags?: string[];
    risk?: { [key: string]: [number, number] }; // [min, max] 风险范围
  };
  timeCost: number;
  category: CardCategoryType;
  isGate?: boolean; // 关卡卡
  isRare?: boolean; // 稀有事件
  weight?: number; // 抽取权重
  leads?: Array<{
    ifFlag?: string;
    ifTag?: string;
    nextPool?: string;
  }>; // 事件链
  rareEventChance?: number; // 触发稀有事件概率
}

export interface ResourceImpact {
  Safety?: number | string;
  Knowledge?: number | string;
  Ethics?: number | string;
  Energy?: number | string;
}

// 医学生阶段卡片
const STUDENT_CARDS: GameCard[] = [
  // 常规卡片
  {
    id: "STU_Exam_Cheat_01",
    phase: "Student",
    text: "期末考试时发现同桌在偷看小抄。举报还是装作没看见？",
    left: {
      label: "装作没看见",
      impact: { Ethics: -8, Energy: 1 },  // 从-12调整为-8，减少负面影响
      risk: { Knowledge: [-3, 1] },  // 从[-5,2]调整为[-3,1]
      addFlags: ["exam_cheating_ignored"]
    },
    right: {
      label: "举报同学",
      impact: { Ethics: 7, Knowledge: 2, Energy: -2 },
      addTags: ["honor_student"]
    },
    timeCost: 1,
    category: "academic",
    weight: 8
  },
  {
    id: "STU_Anatomy_Privacy_01",
    phase: "Student",
    text: "解剖课上，同学想拍摄标本发朋友圈炫耀。",
    left: {
      label: "制止并解释规定",
      impact: { Ethics: 8, Knowledge: 2, Energy: -2 }
    },
    right: {
      label: "睁一眼闭一眼",
      impact: { Ethics: -5, Energy: 1 },  // 从-8调整为-5
      addFlags: ["privacy_violation_ignored"]
    },
    timeCost: 1,
    category: "compliance",
    weight: 7
  },
  {
    id: "STU_Emergency_Priority_01",
    phase: "Student",
    text: "实习时遇到多个患者同时到达，如何分诊？",
    left: {
      label: "按到达先后顺序",
      impact: { Safety: -5, Ethics: 3, Energy: -1 }
    },
    right: {
      label: "按病情轻重分诊",
      impact: { Safety: 8, Knowledge: 5, Energy: -4 }
    },
    timeCost: 2,
    category: "emergency",
    weight: 10
  },
  {
    id: "STU_Teacher_Question_01",
    phase: "Student",
    text: "带教老师问起一个你不会的专业问题。",
    left: {
      label: "模糊回应蒙混",
      impact: { Knowledge: -3, Ethics: -4, Energy: 1 }  // 从{ Knowledge: -5, Ethics: -6 }调整
    },
    right: {
      label: "坦诚说不会",
      impact: { Ethics: 6, Knowledge: 2, Energy: -3 }
    },
    timeCost: 1,
    category: "teaching",
    weight: 6
  },
  {
    id: "STU_Patient_Communication_01",
    phase: "Student",
    text: "患者询问病情，但你还是学生，不应直接回答。",
    left: {
      label: "请医生来解答",
      impact: { Ethics: 7, Safety: 2, Energy: -2 }
    },
    right: {
      label: "简单回应安慰",
      impact: { Safety: -3, Ethics: -4, Energy: 1 }
    },
    timeCost: 1,
    category: "communication",
    weight: 8
  },
  {
    id: "STU_Study_Group_01",
    phase: "Student",
    text: "同学邀请你加入学习小组，但你已经很累了。",
    left: {
      label: "参加学习",
      impact: { Knowledge: 6, Energy: -6, Ethics: 2 }
    },
    right: {
      label: "回去休息",
      impact: { Energy: 4, Knowledge: -2 }
    },
    timeCost: 1,
    category: "academic",
    weight: 5
  },
  // 关卡卡
  {
    id: "STU_GATE_Final_Exam",
    phase: "Student",
    text: "期末考试/OSCE技能考核到了，这将决定你的学业前途。",
    left: {
      label: "全力应考",
      impact: { Knowledge: 12, Energy: -8, Ethics: 4 }
    },
    right: {
      label: "佛系应考",
      impact: { Knowledge: 3, Energy: 2, Ethics: -2 }
    },
    timeCost: 3,
    category: "academic",
    isGate: true,
    weight: 1
  }
];

// 研究生/规培阶段卡片
const RESIDENT_CARDS: GameCard[] = [
  {
    id: "RES_RedPacket_01",
    phase: "Resident",
    text: "家属偷偷塞红包，说'医生，拜托多关照'。",
    left: {
      label: "拒收并登记",
      impact: { Ethics: 8, Safety: 2, Energy: -3 },
      addFlags: ["recorded_bribery"]
    },
    right: {
      label: "代退不登记",
      impact: { Ethics: 4, Energy: -1 },
      addTags: ["informal_handling"]
    },
    timeCost: 2,
    category: "communication",
    leads: [{ ifFlag: "recorded_bribery", nextPool: "audit_pool" }],
    weight: 8
  },
  {
    id: "RES_Night_Shift_Report_01",
    phase: "Resident",
    text: "夜班时发现上级医生的处方可能有误，但他已经下班。",
    left: {
      label: "立即电话询问",
      impact: { Safety: 10, Energy: -5, Ethics: 2 }
    },
    right: {
      label: "明天再说",
      impact: { Safety: -10, Energy: 2, Ethics: -5 }
    },
    timeCost: 2,
    category: "emergency",
    weight: 10
  },
  {
    id: "RES_Family_Communication_01",
    phase: "Resident",
    text: "家属对治疗方案不满，情绪激动要求换医生。",
    left: {
      label: "耐心解释安抚",
      impact: { Ethics: 6, Energy: -6, Safety: 2 }
    },
    right: {
      label: "请上级处理",
      impact: { Energy: -2, Ethics: 2, Knowledge: 1 }
    },
    timeCost: 2,
    category: "communication",
    weight: 7
  },
  {
    id: "RES_Overwork_01",
    phase: "Resident",
    text: "连续36小时值班，极度疲劳但还有手术要上。",
    left: {
      label: "申请换班",
      impact: { Safety: 6, Energy: 5, Ethics: 2 }
    },
    right: {
      label: "坚持上台",
      impact: { Safety: -8, Energy: -10, Ethics: 5 },
      risk: { Safety: [-15, 0] }
    },
    timeCost: 3,
    category: "emergency",
    weight: 9
  },
  {
    id: "RES_Medication_Error_01",
    phase: "Resident",
    text: "发现自己开错了药，患者还未服用。",
    left: {
      label: "立即纠正上报",
      impact: { Safety: 8, Ethics: 7, Energy: -5 }
    },
    right: {
      label: "悄悄更正",
      impact: { Safety: 5, Ethics: -8, Energy: -2 }
    },
    timeCost: 2,
    category: "compliance",
    weight: 8
  },
  {
    id: "RES_Learning_Opportunity_01",
    phase: "Resident",
    text: "有个难得的手术学习机会，但需要加班。",
    left: {
      label: "参加学习",
      impact: { Knowledge: 7, Energy: -8, Ethics: 2 }
    },
    right: {
      label: "准时下班",
      impact: { Energy: 3, Knowledge: -3 }
    },
    timeCost: 2,
    category: "teaching",
    weight: 6
  },
  // 关卡卡
  {
    id: "RES_GATE_License_Exam",
    phase: "Resident",
    text: "执业医师考试在即，这是正式行医的门槛。",
    left: {
      label: "全力备考",
      impact: { Knowledge: 14, Energy: -10, Ethics: 4 }
    },
    right: {
      label: "临时抱佛脚",
      impact: { Knowledge: 5, Energy: -3, Ethics: -2 }
    },
    timeCost: 3,
    category: "academic",
    isGate: true,
    weight: 1
  }
];

// 博士阶段卡片
const PHD_CARDS: GameCard[] = [
  {
    id: "PHD_Data_Missing_01",
    phase: "PhD",
    text: "实验数据缺失关键点。补做实验还是'合理插补'？",
    left: {
      label: "补做实验",
      impact: { Knowledge: 6, Energy: -8, Safety: 2, Ethics: 3 }
    },
    right: {
      label: "合理插补",
      impact: { Knowledge: 3, Ethics: -15 },
      addTags: ["data_fabrication"],
      risk: { Knowledge: [-10, 5] }
    },
    timeCost: 3,
    category: "academic",
    leads: [{ ifTag: "data_fabrication", nextPool: "scandal_pool" }],
    weight: 9
  },
  {
    id: "PHD_Authorship_01",
    phase: "PhD",
    text: "导师要求在你的研究成果上加上他朋友的署名。",
    left: {
      label: "拒绝并据理力争",
      impact: { Ethics: 11, Knowledge: 2, Energy: -8 }
    },
    right: {
      label: "妥协添加署名",
      impact: { Ethics: -12, Energy: -3, Knowledge: 1 }
    },
    timeCost: 2,
    category: "academic",
    weight: 8
  },
  {
    id: "PHD_Patient_Photo_01",
    phase: "PhD",
    text: "罕见病例需要拍照，患者已同意但未打码。",
    left: {
      label: "严格打码处理",
      impact: { Ethics: 8, Safety: 3, Energy: -2 }
    },
    right: {
      label: "直接使用",
      impact: { Ethics: -10, Knowledge: 3, Energy: 1 }
    },
    timeCost: 1,
    category: "compliance",
    weight: 7
  },
  {
    id: "PHD_Review_Conflict_01",
    phase: "PhD",
    text: "审稿时发现是竞争对手的论文，有明显缺陷。",
    left: {
      label: "客观公正评审",
      impact: { Ethics: 11, Knowledge: 3, Energy: -3 }
    },
    right: {
      label: "从严打分",
      impact: { Ethics: -8, Knowledge: 2, Energy: 1 }
    },
    timeCost: 2,
    category: "academic",
    weight: 6
  },
  {
    id: "PHD_Collaboration_01",
    phase: "PhD",
    text: "国际合作项目要求分享患者数据，有隐私风险。",
    left: {
      label: "充分匿名化后分享",
      impact: { Knowledge: 6, Ethics: 4, Energy: -4 }
    },
    right: {
      label: "拒绝分享",
      impact: { Ethics: 3, Knowledge: -5, Energy: -1 }
    },
    timeCost: 2,
    category: "compliance",
    weight: 7
  },
  {
    id: "PHD_Conference_Present_01",
    phase: "PhD",
    text: "重要会议发言机会，但研究结果不够完美。",
    left: {
      label: "如实汇报局限性",
      impact: { Ethics: 8, Knowledge: 4, Energy: -3 }
    },
    right: {
      label: "美化结果",
      impact: { Knowledge: 3, Ethics: -10, Energy: 1 }
    },
    timeCost: 2,
    category: "academic",
    weight: 6
  },
  // 关卡卡
  {
    id: "PHD_GATE_Dissertation",
    phase: "PhD",
    text: "博士论文答辩，评委对你的研究方法提出质疑。",
    left: {
      label: "据实回应",
      impact: { Knowledge: 12, Ethics: 8, Energy: -8 }
    },
    right: {
      label: "回避问题",
      impact: { Knowledge: 3, Ethics: -5, Energy: -2 }
    },
    timeCost: 3,
    category: "academic",
    isGate: true,
    weight: 1
  }
];

export { STUDENT_CARDS, RESIDENT_CARDS, PHD_CARDS };