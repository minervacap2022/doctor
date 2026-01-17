// 新的游戏类型定义
import { GamePhaseType, CardCategoryType } from '../data/gameConfig';

// 游戏状态
export interface GameState {
  // 基础信息
  gameStartTime: number;
  gameEndTime?: number;  // 游戏结束时间（用于固定生存时间）
  
  // 阶段管理
  currentPhase: GamePhaseType;
  maxPhaseReached: GamePhaseType;
  phaseCardCount: number; // 当前阶段已经序的卡片数
  stageScore: number; // 隐形阶段评分 (-100 到 +100)
  
  // 资源和进度
  resources: Resources;
  totalCardCount: number; // 总卡片数（最多32张）
  
  // 卡片系统
  cardDeck: GameCard[];
  currentCardIndex: number;
  cardHistory: CardChoice[];
  keyChoices: string[]; // 关键决策记录（最多3个）
  usedCardIds: string[]; // 已使用的卡片ID，防止重复
  
  // 游戏状态
  isGameOver: boolean;
  endingId?: string;
  
  // 统计信息
  rareEventsTriggered: number;
  consecutiveNegativeCards: number; // 连续负面卡片数（用于喘息卡机制）
  playerTags: string[]; // 玩家标签集合
  playerFlags: string[]; // 玩家标记集合（用于事件链）
  
  // 游戏阶段
  gamePhase: 'start' | 'playing' | 'ended' | 'report';
}

// 资源系统 - 四大属性体系
export interface Resources {
  Benevolence: number;  // 仁心仁术 0-100
  Clinical: number;     // 临床精技 0-100
  Research: number;     // 科研卓识 0-100
  Leadership: number;   // 领袖格局 0-100
}

// 资源影响
export interface ResourceImpact {
  Benevolence?: number | string;  // 支持数值或范围字符串如"+3"
  Clinical?: number | string;     
  Research?: number | string;
  Leadership?: number | string;
}

// 卡片选择记录
export interface CardChoice {
  cardId: string;
  choice: 'left' | 'right';
  actualChoice: 'original_left' | 'original_right'; // 实际选择的原始选项
  impact: ResourceImpact;
  actualImpact: Resources; // 实际生效的资源变化
  timeCost: number;
  isKeyDecision: boolean; // 是否为关键决策
}

// 运行时卡片（包含随机化状态）
export interface RuntimeGameCard extends GameCard {
  isOptionsSwapped: boolean; // 选项是否被交换
  swapSeed: string; // 用于选项交换的种子
}

// 游戏卡片（从 cardData.ts 导入）
export interface GameCard {
  id: string;
  phase: GamePhaseType;
  text: string; // ≤60字
  left: {
    label: string; // ≤12字
    impact: ResourceImpact;
    addTags?: string[];
    addFlags?: string[];
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

// 游戏结局
export interface GameEnding {
  id: string;
  title: string;
  description: string;
  tags: string[];
  phase?: GamePhaseType;
  type: 'success' | 'failure' | 'special';
  aiReview?: string; // AI生成的毒舌评价
}

// 战报系统
export interface BattleReport {
  // 基本信息
  achievement: string; // 成就文案
  endingTitle: string; // 结局标题
  endingDescription: string; // 结局描述
  profileTags: string[]; // 职业画像标签
  
  // 关键决策（最多3个）
  keyDecisions: Array<{
    cardText: string;
    choice: string;
  }>;
  
  // 统计数据
  survivalStats: {
    minutes: number;
    seconds: number;
    totalCards: number;
    maxPhaseReached: GamePhaseType;
    rareEventsCount: number;
  };
  
  // 资源图表数据（用于火花线图）
  resourceHistory: Resources[];
  finalResources: Resources;
  
  // 分享数据
  gameSeed: string;
  shareText: string; // 格式化分享文案
  imageDataUrl?: string; // PNG图片数据
}

// 滑动手势
export interface SwipeGesture {
  direction: 'left' | 'right' | null;
  progress: number; // 0-1
  velocity: number;
}

// 提示显示
export interface ResourceHint {
  resource: keyof Resources;
  direction: 'up' | 'down' | 'stable'; // ↑↓≈
  intensity: 'weak' | 'medium' | 'strong'; // 影响强度
}

// 阶段进度状态
export interface PhaseProgress {
  phase: GamePhaseType;
  status: 'completed' | 'active' | 'locked';
  cardProgress: number; // 当前阶段卡片进度
  totalCards: number; // 当前阶段总卡片数
}

// 游戏初始化选项
export interface GameInitOptions {
  seed?: string; // 可选种子，用于复盘
  difficulty?: 'normal' | 'hard'; // 难度设置（预留）
}

// UI 交互状态
export interface UIState {
  // 卡片交互
  isCardAnimating: boolean;
  swipeProgress: number;
  swipeDirection: 'left' | 'right' | null;
  
  // 模态框状态
  showStartModal: boolean;
  showEndingModal: boolean;
  showBattleReport: boolean;
  showSeedInput: boolean;
  
  // 动画状态
  phaseTransition: boolean;
  resourceChangeAnimations: Array<{
    resource: keyof Resources;
    change: number;
    timestamp: number;
  }>;
}

// 卡片池管理
export interface CardPool {
  regular: GameCard[]; // 常规卡片
  rare: GameCard[]; // 稀有事件卡片
  relief: GameCard[]; // 喘息卡
  gate: GameCard[]; // 关卡卡
}

// 游戏配置
export interface GameConfig {
  maxCards: number;
  maxTimeMinutes: number;
  stageFailThreshold: number;
  excellentPassThreshold: number;
  rareEventProbability: number;
  reliefCardThreshold: number;
}