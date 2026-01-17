// 结局系统
import { GamePhaseType, GAME_PHASES } from './gameConfig';

export interface GameEnding {
  id: string;
  title: string;
  description: string;
  tags: string[];
  phase?: GamePhaseType; // 阶段性结局
  type: 'success' | 'failure' | 'special';
  condition: EndingCondition;
}

export interface EndingCondition {
  // 资源条件 - 任意资源=0或=100
  resourceFailure?: {
    resource: 'Safety' | 'Knowledge' | 'Ethics' | 'Energy';
    value: 0 | 100;
  };
  // 阶段失败 - StageScore < STAGE_FAIL_THRESHOLD
  stageFail?: {
    phase: GamePhaseType;
  };
  // 多资源条件
  multiResource?: {
    Safety?: { min?: number; max?: number };
    Knowledge?: { min?: number; max?: number };
    Ethics?: { min?: number; max?: number };
    Energy?: { min?: number; max?: number };
  };
  // 特殊条件
  special?: 'perfect_balance' | 'hero_legend' | 'rare_events_3plus' | 'max_phase_reached';
  // 标签条件
  hasTag?: string;
}

// 决策分析系统
export interface DecisionAnalysis {
  totalDecisions: number;
  poorDecisions: Array<{
    cardId: string;
    cardText: string;
    yourChoice: string;
    betterChoice: string;
    reason: string;
    impactOnScore: number;
  }>;
  excellentDecisions: Array<{
    cardId: string;
    cardText: string;
    yourChoice: string;
    reason: string;
  }>;
  scoreBreakdown: {
    safetyContribution: number;
    knowledgeContribution: number;
    ethicsContribution: number;
    energyContribution: number;
    totalScore: number;
  };
  failureReasons: string[];
  improvements: string[];
}

// 分析玩家决策
export function analyzePlayerDecisions(
  gameState: any,
  currentPhase: string,
  stageScore: number
): DecisionAnalysis {
  const cardHistory = gameState.cardHistory || [];
  const phaseWeights = GAME_PHASES[currentPhase as keyof typeof GAME_PHASES]?.scoreWeights || {
    Safety: 0.25, Knowledge: 0.25, Ethics: 0.25, Energy: 0.25
  };
  
  const analysis: DecisionAnalysis = {
    totalDecisions: cardHistory.length,
    poorDecisions: [],
    excellentDecisions: [],
    scoreBreakdown: {
      safetyContribution: 0,
      knowledgeContribution: 0,
      ethicsContribution: 0,
      energyContribution: 0,
      totalScore: stageScore
    },
    failureReasons: [],
    improvements: []
  };
  
  // 分析每个决策
  cardHistory.forEach((choice: any, index: number) => {
    const impact = choice.actualImpact || {};
    const isNegativeDecision = Object.values(impact).some((val: any) => val < -5);
    const isPositiveDecision = Object.values(impact).some((val: any) => val > 5);
    
    // 计算对阶段评分的贡献
    let scoreContribution = 0;
    Object.entries(impact).forEach(([resource, change]) => {
      const weight = phaseWeights[resource as keyof typeof phaseWeights] || 0;
      const contribution = (change as number) * weight * 0.15; // 使用与游戏引擎相同的缩放因子
      scoreContribution += contribution;
      
      // 更新分项贡献
      if (resource === 'Safety') analysis.scoreBreakdown.safetyContribution += contribution;
      if (resource === 'Knowledge') analysis.scoreBreakdown.knowledgeContribution += contribution;
      if (resource === 'Ethics') analysis.scoreBreakdown.ethicsContribution += contribution;
      if (resource === 'Energy') analysis.scoreBreakdown.energyContribution += contribution;
    });
    
    // 识别不良决策
    if (isNegativeDecision && scoreContribution < -2) {
      const poorDecision = {
        cardId: choice.cardId,
        cardText: `决策 ${index + 1}`, // 简化显示
        yourChoice: choice.actualChoice === 'original_left' ? '左选项' : '右选项',
        betterChoice: choice.actualChoice === 'original_left' ? '右选项' : '左选项',
        reason: generateDecisionFeedback(impact, currentPhase),
        impactOnScore: Math.round(scoreContribution * 10) / 10
      };
      analysis.poorDecisions.push(poorDecision);
    }
    
    // 识别优秀决策
    if (isPositiveDecision && scoreContribution > 3) {
      const excellentDecision = {
        cardId: choice.cardId,
        cardText: `决策 ${index + 1}`,
        yourChoice: choice.actualChoice === 'original_left' ? '左选项' : '右选项',
        reason: '这个选择很好地平衡了各项要素，为您的职业发展加分！'
      };
      analysis.excellentDecisions.push(excellentDecision);
    }
  });
  
  // 生成失败原因和改进建议
  if (stageScore < -15) {
    analysis.failureReasons = generateFailureReasons(gameState, analysis, currentPhase);
    analysis.improvements = generateImprovements(gameState, analysis, currentPhase);
  }
  
  return analysis;
}

// 生成决策反馈
function generateDecisionFeedback(impact: any, phase: string): string {
  const negativeAspects = [];
  if (impact.Safety < -5) negativeAspects.push('患者安全');
  if (impact.Ethics < -5) negativeAspects.push('职业道德');
  if (impact.Knowledge < -5) negativeAspects.push('医学知识');
  if (impact.Energy < -8) negativeAspects.push('精力管理');
  
  if (negativeAspects.length > 0) {
    return `这个选择严重影响了${negativeAspects.join('、')}，在${GAME_PHASES[phase as keyof typeof GAME_PHASES]?.name}阶段这些都是关键要素。`;
  }
  
  return '这个选择的负面影响过大，需要更谨慎地权衡利弊。';
}

// 生成失败原因
function generateFailureReasons(gameState: any, analysis: DecisionAnalysis, phase: string): string[] {
  const reasons = [];
  
  if (analysis.poorDecisions.length >= 3) {
    reasons.push(`连续做出了${analysis.poorDecisions.length}个不良决策，累积负面影响过大`);
  }
  
  const breakdown = analysis.scoreBreakdown;
  if (breakdown.safetyContribution < -8) {
    reasons.push('在患者安全方面的选择过于冒险，这在医疗行业是致命的');
  }
  if (breakdown.ethicsContribution < -8) {
    reasons.push('职业道德方面的选择有问题，损害了专业声誉');
  }
  if (breakdown.knowledgeContribution < -5) {
    reasons.push('对学习和知识积累不够重视，专业能力提升缓慢');
  }
  
  if (reasons.length === 0) {
    reasons.push('多个小的不良决策累积造成了整体评分过低');
  }
  
  return reasons;
}

// 生成改进建议
function generateImprovements(gameState: any, analysis: DecisionAnalysis, phase: string): string[] {
  const improvements = [];
  const phaseWeights = GAME_PHASES[phase as keyof typeof GAME_PHASES]?.scoreWeights;
  
  // 基于权重给出建议
  if (phaseWeights?.Safety && phaseWeights.Safety >= 0.3) {
    improvements.push('在医疗决策中，患者安全永远是第一位的，选择时要优先考虑最安全的方案');
  }
  
  if (phaseWeights?.Ethics && phaseWeights.Ethics >= 0.3) {
    improvements.push('职业道德是医者的根本，面对诱惑时要坚持原则，诚实正直');
  }
  
  if (phaseWeights?.Knowledge && phaseWeights.Knowledge >= 0.3) {
    improvements.push('持续学习和知识更新是医学专业的要求，要主动寻求学习机会');
  }
  
  // 基于不良决策给出具体建议
  analysis.poorDecisions.slice(0, 2).forEach(decision => {
    improvements.push(`${decision.cardText}应该选择${decision.betterChoice}：${decision.reason}`);
  });
  
  if (improvements.length === 0) {
    improvements.push('在每个选择中都要仔细权衡后果，优先考虑长远的职业发展');
  }
  
  return improvements.slice(0, 4); // 最多4条建议
}

// 结局数据
export const GAME_ENDINGS: GameEnding[] = [
  // 资源为0的即时结局
  {
    id: "safety_zero",
    title: "医疗事故",
    description: "患者安全归零，一念之差，终生遗憎。医学道路容不得半点马虎。",
    tags: ["疗事故", "安全红线"],
    type: 'failure',
    condition: { resourceFailure: { resource: 'Safety', value: 0 } }
  },
  {
    id: "knowledge_zero",
    title: "知识危机",
    description: "知识存量耗尽，在医学道路上迷失了方向。永远不要停止学习的脚步。",
    tags: ["知识危机", "学习不足"],
    type: 'failure',
    condition: { resourceFailure: { resource: 'Knowledge', value: 0 } }
  },
  {
    id: "ethics_zero",
    title: "道德沦丧",
    description: "职业道德归零，在利益和诱惑面前迷失了初心。医者仁心，是永远的底线。",
    tags: ["道德沦丧", "初心丢失"],
    type: 'failure',
    condition: { resourceFailure: { resource: 'Ethics', value: 0 } }
  },
  {
    id: "energy_zero",
    title: "职业倦怠",
    description: "精力耗尽，身心俱疲。医者也需要被治愈，请好好休息。",
    tags: ["职业倦怠", "身心俱疲"],
    type: 'failure',
    condition: { resourceFailure: { resource: 'Energy', value: 0 } }
  },
  
  // 阶段性结局
  {
    id: "student_dropout",
    title: "学业中断",
    description: "医学路虽难，但每个选择都是成长。也许换个方向，你会找到属于自己的道路。",
    tags: ["理想主义者", "挫折反思"],
    phase: "Student",
    type: 'failure',
    condition: { stageFail: { phase: "Student" } }
  },
  {
    id: "student_honor",
    title: "优秀毕业生",
    description: "以诚待学，以德立身，未来可期。你的努力和品格为医学之路奠定了坚实的基础。",
    tags: ["品学兼优", "合规卫士"],
    phase: "Student",
    type: 'success',
    condition: { 
      multiResource: { 
        Ethics: { min: 70 }, 
        Knowledge: { min: 70 }, 
        Safety: { min: 60 } 
      } 
    }
  },
  
  {
    id: "resident_burnout",
    title: "职业倦怠",
    description: "规培阶段的高强度让你身心俱疲。医者也需要被治愈，请好好休息。",
    tags: ["现实主义者", "自我保护"],
    phase: "Resident",
    type: 'failure',
    condition: { stageFail: { phase: "Resident" } }
  },
  {
    id: "resident_excellence",
    title: "临床骨干",
    description: "在临床一线闪闪发光的医者。你的专业精神和责任担当赢得了所有人的尊敬。",
    tags: ["临床专家", "责任担当"],
    phase: "Resident",
    type: 'success',
    condition: { 
      multiResource: { 
        Safety: { min: 75 }, 
        Ethics: { min: 65 }, 
        Knowledge: { min: 65 } 
      } 
    }
  },
  
  {
    id: "phd_academic_scandal",
    title: "学术不端",
    description: "在学术道路上走了弯路。学术道路容不得半点造假，诚信是学者的最基本品质。",
    tags: ["投机取巧", "自食恶果"],
    phase: "PhD",
    type: 'failure',
    condition: { hasTag: "data_fabrication" }
  },
  {
    id: "phd_research_star",
    title: "学术新星",
    description: "在真理的道路上勇敢前行。你的严谨和创新为医学研究带来了新的希望。",
    tags: ["学术派", "求真务实"],
    phase: "PhD",
    type: 'success',
    condition: { 
      multiResource: { 
        Knowledge: { min: 80 }, 
        Ethics: { min: 75 } 
      } 
    }
  },
  
  {
    id: "chief_malpractice",
    title: "医疗纠纷",
    description: "在责任重大的位置上出现了严重问题。一念之差，终生遗憎。",
    tags: ["风险偏好", "教训深刻"],
    phase: "Chief",
    type: 'failure',
    condition: { stageFail: { phase: "Chief" } }
  },
  {
    id: "chief_master",
    title: "医学大师",
    description: "医技精湛，医德高尚，众望所归。你的技术和奢德是后辈学习的模板。",
    tags: ["手术派", "德艺双馨"],
    phase: "Chief",
    type: 'success',
    condition: { 
      multiResource: { 
        Safety: { min: 80 }, 
        Knowledge: { min: 75 }, 
        Ethics: { min: 75 } 
      } 
    }
  },
  
  {
    id: "academician_legacy",
    title: "学界泰斗",
    description: "桃李满天下，精神永流传。你的学术成就和师者风范将永远激励后人。",
    tags: ["学术权威", "师者典范"],
    phase: "Academician",
    type: 'success',
    condition: { 
      multiResource: { 
        Knowledge: { min: 80 }, 
        Ethics: { min: 85 } 
      } 
    }
  },
  {
    id: "academician_controversy",
    title: "争议人物",
    description: "在学术道路上留下了争议。功过由后人评说，历史的真相等待时间检验。",
    tags: ["复杂人物", "历史存疑"],
    phase: "Academician",
    type: 'failure',
    condition: { stageFail: { phase: "Academician" } }
  },
  
  // 特殊结局
  {
    id: "perfect_balance",
    title: "完美平衡",
    description: "在医学道路上找到了完美的平衡点。知识、安全、道德和精力都得到了理想的发展。",
    tags: ["全能医者", "人生赢家"],
    type: 'special',
    condition: { 
      special: 'perfect_balance'
    }
  },
  {
    id: "heroic_legend",
    title: "英雄传奇",
    description: "你的英雄事迹将永远激励后来者。在关键时刻的勇敢和担当，成就了一段传奇。",
    tags: ["英雄医者", "传奇人物"],
    type: 'special',
    condition: { 
      hasTag: "Hero_Doctor"
    }
  },
  {
    id: "innovation_pioneer",
    title: "创新先锋",
    description: "你的科学发现和创新精神改变了医学领域，为人类健康事业做出了重大贡献。",
    tags: ["科学先锋", "创新革命"],
    type: 'special',
    condition: { 
      hasTag: "Scientific_Pioneer"
    }
  },
  {
    id: "global_impact",
    title: "全球影响力",
    description: "你的决策和行动在全球范围内产生了深远影响，成为了真正的世界级医学领袖。",
    tags: ["世界领袖", "全球影响"],
    type: 'special',
    condition: { 
      hasTag: "Global_Hero"
    }
  }
];

// 职业画像标签生成规则
export const PROFESSION_TAGS = {
  // 主要标签（基于终局资源状态）
  "安全卫士": (resources: any) => resources.Safety >= 80,
  "学术大牛": (resources: any) => resources.Knowledge >= 80,
  "道德模范": (resources: any) => resources.Ethics >= 80,
  "精力充沛": (resources: any) => resources.Energy >= 70,
  
  // 组合标签
  "全能医者": (resources: any) => 
    resources.Safety >= 70 && resources.Knowledge >= 70 && 
    resources.Ethics >= 70 && resources.Energy >= 60,
  "理想主义者": (resources: any) => 
    resources.Ethics >= 70 && resources.Safety >= 60,
  "现实主义者": (resources: any) => 
    resources.Energy >= 60 && resources.Safety >= 50,
  "学术派": (resources: any) => 
    resources.Knowledge >= 75 && resources.Ethics >= 60,
  "临床派": (resources: any) => 
    resources.Safety >= 75 && resources.Knowledge >= 60,
  
  // 风险标签
  "风险偏好者": (resources: any) => resources.Safety <= 40,
  "知识贫乏者": (resources: any) => resources.Knowledge <= 40,
  "道德风险者": (resources: any) => resources.Ethics <= 40,
  "疲劳战士": (resources: any) => resources.Energy <= 30,
};

// 生成结局函数 - 增强版本：包含决策分析
export function determineEnding(
  gameState: any, 
  currentPhase: string, 
  stageScore: number, 
  playerTags: string[]
): GameEnding & { analysis?: DecisionAnalysis } {
  const { resources, rareEventsTriggered, totalCardCount } = gameState;
  
  // 生成决策分析（只在失败时）
  let analysis: DecisionAnalysis | undefined;
  if (stageScore < -15 || resources.Safety <= 0 || resources.Knowledge <= 0 || resources.Ethics <= 0 || resources.Energy <= 0) {
    analysis = analyzePlayerDecisions(gameState, currentPhase, stageScore);
  }
  
  // 1. 检查稀有事件特殊结局
  if (playerTags.includes('Hero_Doctor')) {
    return { ...GAME_ENDINGS.find(e => e.id === 'heroic_legend')!, analysis };
  }
  if (playerTags.includes('Scientific_Pioneer')) {
    return { ...GAME_ENDINGS.find(e => e.id === 'innovation_pioneer')!, analysis };
  }
  if (playerTags.includes('Global_Hero')) {
    return { ...GAME_ENDINGS.find(e => e.id === 'global_impact')!, analysis };
  }
  
  // 2. 检查资源失败结局
  if (resources.Safety <= 0) {
    return { ...GAME_ENDINGS.find(e => e.id === 'safety_zero')!, analysis };
  }
  if (resources.Knowledge <= 0) {
    return { ...GAME_ENDINGS.find(e => e.id === 'knowledge_zero')!, analysis };
  }
  if (resources.Ethics <= 0) {
    return { ...GAME_ENDINGS.find(e => e.id === 'ethics_zero')!, analysis };
  }
  if (resources.Energy <= 0) {
    return { ...GAME_ENDINGS.find(e => e.id === 'energy_zero')!, analysis };
  }
  
  // 3. 检查特殊结局条件
  const resourcesBalanced = Math.abs(resources.Safety - 70) <= 15 &&
                          Math.abs(resources.Knowledge - 70) <= 15 &&
                          Math.abs(resources.Ethics - 70) <= 15 &&
                          Math.abs(resources.Energy - 50) <= 20;
  if (resourcesBalanced && currentPhase === 'Academician') {
    return { ...GAME_ENDINGS.find(e => e.id === 'perfect_balance')!, analysis };
  }
  
  // 4. 检查阶段性结局
  const phaseSpecificEndings = GAME_ENDINGS.filter(e => e.phase === currentPhase);
  
  for (const ending of phaseSpecificEndings) {
    if (ending.condition.stageFail && stageScore < -10) {
      return { ...ending, analysis };
    }
    
    if (ending.condition.multiResource) {
      const condition = ending.condition.multiResource;
      let meets = true;
      
      for (const [resource, limits] of Object.entries(condition)) {
        const value = resources[resource];
        if (limits.min && value < limits.min) meets = false;
        if (limits.max && value > limits.max) meets = false;
      }
      
      if (meets) return { ...ending, analysis };
    }
    
    if (ending.condition.hasTag && playerTags.includes(ending.condition.hasTag)) {
      return { ...ending, analysis };
    }
  }
  
  // 5. 默认结局（按当前阶段）
  const defaultEndings = {
    'Student': 'student_honor',
    'Resident': 'resident_excellence', 
    'PhD': 'phd_research_star',
    'Chief': 'chief_master',
    'Academician': 'academician_legacy'
  };
  
  return { ...GAME_ENDINGS.find(e => e.id === defaultEndings[currentPhase as keyof typeof defaultEndings])!, analysis };
}