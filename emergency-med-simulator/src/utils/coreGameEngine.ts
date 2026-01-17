import { GameState, GameCard, CardChoice, RuntimeGameCard } from '../types/game';
import { GAME_CONFIG, GAME_PHASES } from '../data/gameConfig';
import { allCards } from '../data/coreCards';

// 初始化游戏状态
export const createInitialState = (): GameState => {
  return {
    // 基础信息
    gameStartTime: Date.now(),
    gameEndTime: undefined,
    
    // 阶段管理
    currentPhase: 'Undergrad',
    maxPhaseReached: 'Undergrad',
    phaseCardCount: 0,
    stageScore: 0,
    
    totalCardCount: 0,
    
    // 卡片系统
    cardDeck: [],
    currentCardIndex: 0,
    cardHistory: [],
    keyChoices: [],
    usedCardIds: [],
    
    // 游戏状态
    isGameOver: false,
    endingId: undefined,
    
    // 统计信息
    rareEventsTriggered: 0,
    consecutiveNegativeCards: 0,
    playerTags: [],
    playerFlags: [],
    
    // 游戏阶段
    gamePhase: 'start'
  };
};

// 生成阶段卡片 - 每个阶段1个核心决策
export const generatePhaseCards = (phase: GamePhaseType, usedCardIds: string[] = []): GameCard[] => {
  const phaseConfig = GAME_PHASES[phase];
  const targetCount = phaseConfig.cardQuota; // 每个阶段1张核心决策卡

  // 获取当前阶段的核心卡片
  const phaseCards = allCards.filter(card => 
    card.phase === phase && !usedCardIds.includes(card.id)
  );

  console.log(`[DEBUG] Phase ${phase} has ${phaseCards.length} core cards available`);
  
  if (phaseCards.length === 0) {
    console.error(`No cards available for phase ${phase}`);
    return [];
  }

  // 直接返回该阶段的核心卡片
  const selectedCards = phaseCards.slice(0, targetCount);
  console.log(`[DEBUG] Selected cards for ${phase}:`, selectedCards.map(c => c.id));
  return selectedCards;
};

// 随机化卡片选项（保持Tinder式机制）
export const randomizeCardOptions = (card: GameCard): RuntimeGameCard => {
  const shouldSwap = Math.random() > 0.5;
  return {
    ...card,
    isOptionsSwapped: shouldSwap
  };
};

// 获取实际选择（考虑选项是否被交换）
export const getActualChoice = (choice: 'left' | 'right', card: RuntimeGameCard): 'left' | 'right' => {
  if (card.isOptionsSwapped) {
    return choice === 'left' ? 'right' : 'left';
  }
  return choice;
};



// 检查游戏是否结束
export const checkGameEnd = (gameState: GameState): boolean => {
  // 检查是否完成所有6个核心决策
  if (gameState.totalCardCount >= GAME_CONFIG.MAX_CARDS_PER_GAME) {
    return true;
  }
  
  // 检查时间限制
  const elapsedTime = Date.now() - gameState.gameStartTime;
  const maxTime = GAME_CONFIG.MAX_GAME_TIME_MINUTES * 60 * 1000;
  if (elapsedTime > maxTime) {
    return true;
  }
  
  return false;
};

// 处理关卡卡片（简化版）
export const processGateCard = (gameState: GameState): { shouldAdvance: boolean; isExcellent: boolean } => {
  // 简化：直接允许进入下一阶段
  return {
    shouldAdvance: true,
    isExcellent: true
  };
};

// 进入下一阶段
export const advancePhase = (gameState: GameState): GameState => {
  const phases: GamePhaseType[] = ['Undergrad', 'Intern', 'Resident', 'Attending', 'Director', 'Academician'];
  const currentIndex = phases.indexOf(gameState.currentPhase);
  
  if (currentIndex < phases.length - 1) {
    const nextPhase = phases[currentIndex + 1];
    return {
      ...gameState,
      currentPhase: nextPhase,
      maxPhaseReached: nextPhase,
      phaseCardCount: 0,
      stageScore: 0
    };
  }
  
  return gameState;
};

// 洗牌函数
export const shuffleCards = (cards: GameCard[]): GameCard[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 获取阶段卡片池
export const getPhaseCardPool = (phase: GamePhaseType): GameCard[] => {
  return allCards.filter(card => card.phase === phase);
};
