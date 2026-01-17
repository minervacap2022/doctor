// 游戏状态管理系统
import { 
  GameState, 
  Resources, 
  GameCard, 
  RuntimeGameCard,
  CardChoice, 
  ResourceImpact,
  BattleReport,
  SwipeGesture 
} from '../types/game';
import { 
  GAME_CONFIG, 
  GAME_PHASES, 
  RESOURCES_CONFIG, 
  GamePhaseType 
} from '../data/gameConfig';
import { 
  STUDENT_CARDS, 
  RESIDENT_CARDS, 
  PHD_CARDS 
} from '../data/cardData';
import { 
  CHIEF_CARDS, 
  ACADEMICIAN_CARDS, 
  RARE_EVENT_CARDS, 
  RELIEF_CARDS 
} from '../data/cardDataExtended';
import { GAME_ENDINGS, determineEnding, PROFESSION_TAGS } from '../data/endings';

// 种子随机数生成器
class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    this.seed = this.hashCode(seed);
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

// 生成随机种子
export const generateSeed = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// 初始化游戏状态
export const createInitialState = (seed?: string): GameState => {
  const gameSeed = seed || generateSeed();
  
  return {
    // 基础信息
    seed: gameSeed,
    gameStartTime: Date.now(),
    
    // 阶段管理
    currentPhase: 'Student',
    maxPhaseReached: 'Student',
    phaseCardCount: 0,
    stageScore: 0,
    
    // 资源初始化 - 调整：从50提高到55，给玩家更多容错空间
    resources: {
      Safety: 55,
      Knowledge: 55,
      Ethics: 55,
      Energy: 55
    },
    totalCardCount: 0,
    
    // 卡片系统
    cardDeck: [],
    currentCardIndex: 0,
    cardHistory: [],
    keyChoices: [],
    
    // 游戏状态
    isGameOver: false,
    gamePhase: 'start',
    
    // 统计信息
    rareEventsTriggered: 0,
    consecutiveNegativeCards: 0,
    playerTags: [],
    playerFlags: []
  };
};

// 获取当前阶段的卡片池
export const getPhaseCardPool = (phase: GamePhaseType): GameCard[] => {
  switch (phase) {
    case 'Student': return STUDENT_CARDS;
    case 'Resident': return RESIDENT_CARDS;
    case 'PhD': return PHD_CARDS;
    case 'Chief': return CHIEF_CARDS;
    case 'Academician': return ACADEMICIAN_CARDS;
    default: return STUDENT_CARDS;
  }
};

// 洗牌函数
export const shuffleCards = (cards: GameCard[], seed: string): GameCard[] => {
  const shuffled = [...cards];
  const rng = new SeededRandom(seed);
  
  // Fisher-Yates 洗牌算法
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

// 随机化卡片选项顺序
export const randomizeCardOptions = (card: GameCard, seed: string): RuntimeGameCard => {
  const rng = new SeededRandom(seed + card.id);
  const shouldSwap = rng.next() < 0.5; // 50%概率交换
  
  return {
    ...card,
    isOptionsSwapped: shouldSwap,
    swapSeed: seed + card.id
  };
};

// 获取卡片的显示选项（考虑交换）
export const getDisplayOptions = (card: RuntimeGameCard) => {
  if (card.isOptionsSwapped) {
    return {
      left: card.right,
      right: card.left
    };
  }
  return {
    left: card.left,
    right: card.right
  };
};

// 获取实际选项（将显示选择转换回原始选项）
export const getActualChoice = (displayChoice: 'left' | 'right', card: RuntimeGameCard): 'left' | 'right' => {
  if (card.isOptionsSwapped) {
    return displayChoice === 'left' ? 'right' : 'left';
  }
  return displayChoice;
};

// 获取原始选项标识
export const getOriginalChoiceLabel = (displayChoice: 'left' | 'right', card: RuntimeGameCard): 'original_left' | 'original_right' => {
  const actualChoice = getActualChoice(displayChoice, card);
  return actualChoice === 'left' ? 'original_left' : 'original_right';
};
export const generatePhaseCards = (phase: GamePhaseType, seed: string): GameCard[] => {
  const phaseConfig = GAME_PHASES[phase];
  const cardPool = getPhaseCardPool(phase);
  const rng = new SeededRandom(seed + phase);
  
  // 分离关卡卡和常规卡
  const gateCards = cardPool.filter(card => card.isGate);
  const regularCards = cardPool.filter(card => !card.isGate);
  
  console.log(`${phase}阶段：需要${phaseConfig.cardQuota}张常规卡，有${regularCards.length}张可用`);
  
  // 修复：简化卡片选择逻辑，确保精确生成指定数量的卡片
  const selectedRegular: GameCard[] = [];
  
  // 如果需要的卡片数量大于可用卡片数量，允许重复使用
  const needsRepeat = phaseConfig.cardQuota > regularCards.length;
  
  if (needsRepeat) {
    // 需要重复时，先用完所有卡片，然后重复选择
    const shuffledCards = shuffleCards(regularCards, seed + phase);
    
    // 首先添加所有卡片
    selectedRegular.push(...shuffledCards);
    
    // 然后重复选择缺少的卡片数量
    const remaining = phaseConfig.cardQuota - regularCards.length;
    for (let i = 0; i < remaining; i++) {
      const index = Math.floor(rng.next() * regularCards.length);
      selectedRegular.push(regularCards[index]);
    }
  } else {
    // 不需要重复时，按权重选择
    const availableCards = [...regularCards];
    
    for (let i = 0; i < phaseConfig.cardQuota; i++) {
      if (availableCards.length === 0) break;
      
      // 按权重计算概率
      const totalWeight = availableCards.reduce((sum, card) => sum + (card.weight || 1), 0);
      let random = rng.next() * totalWeight;
      
      let selectedIndex = 0;
      for (let j = 0; j < availableCards.length; j++) {
        random -= (availableCards[j].weight || 1);
        if (random <= 0) {
          selectedIndex = j;
          break;
        }
      }
      
      selectedRegular.push(availableCards[selectedIndex]);
      availableCards.splice(selectedIndex, 1); // 移除已选卡片避免重复
    }
  }
  
  // 洗牌常规卡并应用去重逻辑
  const shuffledRegular = shuffleCards(selectedRegular, seed + phase + 'shuffle');
  const deduplicatedRegular = removeDuplicateAdjacent(shuffledRegular, seed + phase + 'dedup');
  
  // 添加关卡卡到最后
  const selectedGate = gateCards.length > 0 ? [gateCards[0]] : [];
  
  const totalCards = deduplicatedRegular.length + selectedGate.length;
  console.log(`生成${deduplicatedRegular.length}张去重常规卡 + ${selectedGate.length}张关卡卡 = 共${totalCards}张卡片`);
  
  return [...deduplicatedRegular, ...selectedGate];
};

// 移除相邻重复卡片 - 修复版本：更强的去重逻辑
const removeDuplicateAdjacent = (cards: GameCard[], seed: string): GameCard[] => {
  if (cards.length <= 1) return cards;
  
  const result: GameCard[] = [cards[0]];
  const remainingCards = cards.slice(1);
  
  for (let i = 0; i < remainingCards.length; i++) {
    const currentCard = remainingCards[i];
    const lastCard = result[result.length - 1];
    
    // 检查是否与前一张卡片ID相同
    if (currentCard.id === lastCard.id) {
      // 寻找替代卡片
      const alternativeIndex = findAlternativeCard(remainingCards, i, lastCard.id);
      if (alternativeIndex !== -1 && alternativeIndex !== i) {
        // 交换位置
        const alternativeCard = remainingCards[alternativeIndex];
        remainingCards[alternativeIndex] = currentCard;
        result.push(alternativeCard);
        console.log(`避免重复: ${currentCard.id} <-> ${alternativeCard.id}`);
      } else {
        // 没有替代卡片，跳过这张卡片而不是保持原样
        console.log(`跳过重复卡片: ${currentCard.id}`);
        continue;
      }
    } else {
      result.push(currentCard);
    }
  }
  
  return result;
};

// 寻找替代卡片（避免与指定ID相同）
const findAlternativeCard = (cards: GameCard[], startIndex: number, avoidId: string): number => {
  // 先向后查找
  for (let i = startIndex + 1; i < cards.length; i++) {
    if (cards[i].id !== avoidId) {
      return i;
    }
  }
  // 再向前查找（从开始到当前位置）
  for (let i = 0; i < startIndex; i++) {
    if (cards[i].id !== avoidId) {
      return i;
    }
  }
  return -1;
};

// 检查是否需要稀有事件
export const checkRareEvent = (gameState: GameState, seed: string): GameCard | null => {
  const rng = new SeededRandom(seed + gameState.totalCardCount);
  
  // 10%概率触发稀有事件
  if (rng.next() < GAME_CONFIG.RARE_EVENT_PROBABILITY) {
    // 从稀有事件池中随机选取
    const rareCards = RARE_EVENT_CARDS.filter(card => {
      // 按阶段过滤（或全阶段通用）
      return card.phase === gameState.currentPhase || card.phase === 'Student';
    });
    
    if (rareCards.length > 0) {
      const index = Math.floor(rng.next() * rareCards.length);
      return rareCards[index];
    }
  }
  
  return null;
};

// 检查是否需要喘息卡
export const checkReliefCard = (gameState: GameState): GameCard | null => {
  if (gameState.consecutiveNegativeCards >= GAME_CONFIG.RELIEF_CARD_THRESHOLD) {
    // 从喘息卡池中选取
    const reliefCards = RELIEF_CARDS.filter(card => {
      return card.phase === gameState.currentPhase || card.phase === 'Student';
    });
    
    if (reliefCards.length > 0) {
      return reliefCards[0]; // 取第一张喘息卡
    }
  }
  
  return null;
};

// 计算实际资源影响
export const calculateActualImpact = (
  impact: ResourceImpact,
  seed: string
): Resources => {
  const rng = new SeededRandom(seed);
  const actual: Resources = { Safety: 0, Knowledge: 0, Ethics: 0, Energy: 0 };
  
  Object.entries(impact).forEach(([resource, value]) => {
    if (typeof value === 'number') {
      actual[resource as keyof Resources] = value;
    } else if (typeof value === 'string') {
      // 处理范围值，如 "-12" 或 "[5,10]"
      if (value.startsWith('[') && value.endsWith(']')) {
        const [min, max] = value.slice(1, -1).split(',').map(Number);
        actual[resource as keyof Resources] = min + rng.next() * (max - min);
      } else {
        actual[resource as keyof Resources] = parseInt(value);
      }
    }
  });
  
  return actual;
};

// 更新资源 - 增强版本：包含精力自动回复和数值精度修复
export const updateResources = (
  current: Resources, 
  impact: Resources
): Resources => {
  const updated = { ...current };
  
  // 先应用卡片影响
  Object.entries(impact).forEach(([resource, change]) => {
    const newValue = updated[resource as keyof Resources] + change;
    // 修复：添加数值精度处理，避免极小数值
    let finalValue = Math.max(0, Math.min(100, newValue));
    
    // 精度修复：如果数值小于0.001，直接设为0
    if (finalValue < 0.001) {
      finalValue = 0;
    }
    // 如果数值大于99.999，直接设为100
    if (finalValue > 99.999) {
      finalValue = 100;
    }
    
    updated[resource as keyof Resources] = Math.round(finalValue * 1000) / 1000; // 保留3位小数
  });
  
  // 精力自动回复机制：每张卡片后都有回复
  // 精力低于50时，自动回复2-3点（模拟休息和恢复）
  if (updated.Energy < 50) {
    const energyRecovery = Math.min(3, 55 - updated.Energy); // 最多回复到55（初始值）
    updated.Energy += energyRecovery;
    updated.Energy = Math.min(100, updated.Energy);
    console.log(`精力自动回复: +${energyRecovery} -> ${updated.Energy}`);
  }
  
  return updated;
};

// 更新阶段评分 - 修复：调整缩放因子使评分更合理
export const updateStageScore = (
  currentScore: number,
  resourceChanges: Resources,
  phase: GamePhaseType
): number => {
  const weights = GAME_PHASES[phase].scoreWeights;
  let scoreChange = 0;
  
  Object.entries(resourceChanges).forEach(([resource, change]) => {
    const weight = weights[resource as keyof Resources] || 0;
    scoreChange += change * weight;
  });
  
  // 修复：调整缩放因子从0.3到0.15，使评分变化更温和
  const newScore = currentScore + scoreChange * 0.15;
  console.log(`评分计算: ${currentScore} + (${scoreChange} * 0.15) = ${newScore}`);
  
  return Math.max(-100, Math.min(100, newScore));
};

// 检查游戏结束条件 - 重新设计：符合现实逻辑
export const checkGameEnd = (
  gameState: GameState
): { isGameOver: boolean; reason?: string } => {
  const { resources, totalCardCount, gameStartTime } = gameState;
  
  // 1. 负面结束条件：关键资源降到危险水平
  if (resources.Safety <= 0) {
    return { isGameOver: true, reason: 'safety_critical' };
  }
  if (resources.Knowledge <= 0) {
    return { isGameOver: true, reason: 'knowledge_depleted' };
  }
  if (resources.Ethics <= 0) {
    return { isGameOver: true, reason: 'ethics_violation' };
  }
  if (resources.Energy <= 0) {
    return { isGameOver: true, reason: 'exhaustion' };
  }
  
  // 注意：患者安全、医学知识、职业道德达到100是好事，不应该结束游戏
  // 只有精力过高可能有问题（过度亢奋/失控），但我们也把它改为正面
  // 现在只有资源为0才会结束游戏
  
  // 2. 超过最大卡片数
  if (totalCardCount >= GAME_CONFIG.MAX_CARDS_PER_GAME) {
    return { isGameOver: true, reason: 'card_limit' };
  }
  
  // 3. 超过最大时间
  const elapsedMinutes = (Date.now() - gameStartTime) / (1000 * 60);
  if (elapsedMinutes >= GAME_CONFIG.MAX_GAME_TIME_MINUTES) {
    return { isGameOver: true, reason: 'time_limit' };
  }
  
  return { isGameOver: false };
};

// 处理关卡卡
export const processGateCard = (
  gameState: GameState
): { shouldAdvance: boolean; isExcellent: boolean } => {
  const { stageScore } = gameState;
  
  if (stageScore < GAME_CONFIG.STAGE_FAIL_THRESHOLD) {
    // 失败，不能进入下一阶段
    return { shouldAdvance: false, isExcellent: false };
  } else if (stageScore > GAME_CONFIG.EXCELLENT_PASS_THRESHOLD) {
    // 优秀通过
    return { shouldAdvance: true, isExcellent: true };
  } else {
    // 普通通过
    return { shouldAdvance: true, isExcellent: false };
  }
};

// 进入下一阶段
export const advancePhase = (gameState: GameState): GameState => {
  const phases: GamePhaseType[] = ['Student', 'Resident', 'PhD', 'Chief', 'Academician'];
  const currentIndex = phases.indexOf(gameState.currentPhase);
  
  if (currentIndex < phases.length - 1) {
    const nextPhase = phases[currentIndex + 1];
    
    return {
      ...gameState,
      currentPhase: nextPhase,
      maxPhaseReached: nextPhase,
      phaseCardCount: 0,
      stageScore: 0, // 重置阶段评分
    };
  }
  
  return gameState;
};

// 处理滑动手势
export const handleSwipeGesture = (
  startX: number,
  currentX: number,
  screenWidth: number
): SwipeGesture => {
  const deltaX = currentX - startX;
  const progress = Math.abs(deltaX) / (screenWidth * 0.5); // 50%屏幕宽度为满进度
  const velocity = Math.abs(deltaX) / screenWidth;
  
  return {
    direction: deltaX > 0 ? 'right' : 'left',
    progress: Math.min(1, progress),
    velocity
  };
};

// 生成职业画像标签
export const generateProfessionTags = (gameState: GameState): string[] => {
  const tags: string[] = [];
  
  Object.entries(PROFESSION_TAGS).forEach(([tag, condition]) => {
    if (condition(gameState.resources)) {
      tags.push(tag);
    }
  });
  
  // 添加玩家标签
  tags.push(...gameState.playerTags);
  
  return Array.from(new Set(tags)); // 去重
};

// 生成战报
export const generateBattleReport = (gameState: GameState): BattleReport => {
  const endingData = determineEnding(
    gameState, 
    gameState.currentPhase, 
    gameState.stageScore, 
    gameState.playerTags
  );
  
  const survivalTime = Date.now() - gameState.gameStartTime;
  const minutes = Math.floor(survivalTime / (1000 * 60));
  const seconds = Math.floor((survivalTime % (1000 * 60)) / 1000);
  
  const profileTags = generateProfessionTags(gameState);
  
  // 生成分享文案
  const shareText = `#医学生模拟器# 我以「${profileTags.slice(0, 2).join('·')}」${gameState.isGameOver ? '止步' : '晋升'}到「${GAME_PHASES[gameState.maxPhaseReached].name}」，结局「${endingData.title}」。
关键选择：${gameState.keyChoices.slice(0, 3).join(' / ')} ｜存活${minutes}分钟 ｜稀有事件${gameState.rareEventsTriggered} ｜seed:${gameState.seed}`;
  
  return {
    achievement: `我以「${profileTags.join('·')}」${gameState.isGameOver ? '止步' : '完成'}「${GAME_PHASES[gameState.maxPhaseReached].name}」`,
    endingTitle: endingData.title,
    endingDescription: endingData.description,
    profileTags,
    
    keyDecisions: gameState.cardHistory
      .filter(choice => choice.isKeyDecision)
      .slice(0, 3)
      .map(choice => ({
        cardText: `卡片${choice.cardId}`,
        choice: choice.choice === 'left' ? '左选' : '右选'
      })),
    
    survivalStats: {
      minutes,
      seconds,
      totalCards: gameState.totalCardCount,
      maxPhaseReached: gameState.maxPhaseReached,
      rareEventsCount: gameState.rareEventsTriggered
    },
    
    resourceHistory: gameState.cardHistory.map((_, index) => {
      // 简化版本：返回最终资源状态
      return gameState.resources;
    }),
    finalResources: gameState.resources,
    
    gameSeed: gameState.seed,
    shareText
  };
};

export { SeededRandom };