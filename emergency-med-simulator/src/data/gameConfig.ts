// 游戏全局配置 - 18个完整决策
export const GAME_CONFIG = {
  MAX_CARDS_PER_GAME: 18,  // 18个完整决策 (6阶段 × 3问题)
  MAX_GAME_TIME_MINUTES: 20,  // 20分钟游戏时间
};

// 资源配置 - 四大属性体系
export const RESOURCES_CONFIG = {
  Benevolence: { name: "仁心仁术", color: "#ff6b6b", max: 100 },
  Clinical: { name: "临床精技", color: "#4ecdc4", max: 100 },
  Research: { name: "科研卓识", color: "#9b59b6", max: 100 },
  Leadership: { name: "领袖格局", color: "#f39c12", max: 100 }
};

// 医学生涯6阶段配置 - 每个阶段3个决策
export const GAME_PHASES = {
  Undergrad: {
    name: "本科生·白袍初染",
    cardQuota: 3,  // 每个阶段3个决策
    keywords: ["解剖伦理", "急诊见习", "学术举报"]
  },
  Intern: {
    name: "规培医生·生死时速",
    cardQuota: 3,
    keywords: ["危重抢救", "资源分配", "论文署名"]
  },
  Resident: {
    name: "住院医师·暗夜微光",
    cardQuota: 3,
    keywords: ["医疗事故", "罕见病研究", "患者隐私"]
  },
  Attending: {
    name: "主治医师·荆棘王座",
    cardQuota: 3,
    keywords: ["医闹事件", "跨国合作", "医保改革"]
  },
  Director: {
    name: "科室主任·权杖与枷锁",
    cardQuota: 3,
    keywords: ["高价药争议", "青年培养", "学术发言"]
  },
  Academician: {
    name: "院士之路·巅峰抉择",
    cardQuota: 3,
    keywords: ["基因治疗", "资源分配", "诺贝尔奖"]
  }
} as const;

export type GamePhaseType = keyof typeof GAME_PHASES;