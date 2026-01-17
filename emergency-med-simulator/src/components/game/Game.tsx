import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, GameCard, RuntimeGameCard, Resources, CardChoice, UIState } from '../../types/game';
import { GamePhaseType, GAME_PHASES } from '../../data/gameConfig';
import {
  createInitialState,
  generatePhaseCards,
  checkRareEvent,
  checkReliefCard,
  calculateActualImpact,
  updateResources,
  updateStageScore,
  checkGameEnd,
  processGateCard,
  advancePhase,
  handleSwipeGesture,
  generateBattleReport,
  randomizeCardOptions,
  getActualChoice,
  getOriginalChoiceLabel
} from '../../utils/gameEngine';
import { determineEnding } from '../../data/endings';

// 子组件
import TopPanel from './TopPanel';
import DecisionCard from './DecisionCard';
import EndingModal from './EndingModal';
import BattleReport from './BattleReport';
import StartModal from './StartModal';

const Game: React.FC = () => {
  // 核心游戏状态
  const [gameState, setGameState] = useState<GameState>(() => createInitialState());
  const [currentCard, setCurrentCard] = useState<RuntimeGameCard | null>(null);
  
  // UI 状态
  const [uiState, setUIState] = useState<UIState>({
    isCardAnimating: false,
    swipeProgress: 0,
    swipeDirection: null,
    showStartModal: true,
    showEndingModal: false,
    showBattleReport: false,
    showSeedInput: false,
    phaseTransition: false,
    resourceChangeAnimations: []
  });
  
  // 重置键 - 用于强制组件重新初始化
  const [resetKey, setResetKey] = useState<number>(0);
  
  // 触摸交互状态
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<{ x: number; y: number } | null>(null);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const gameTimerRef = useRef<NodeJS.Timeout>();

  // 初始化游戏 - 修复版本：完全重置并防止卡住
  const initializeGame = useCallback((seed?: string) => {
    console.log('✨ 开始完全重置游戏状态...');
    
    // 1. 立即停止所有异步操作
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = undefined;
    }
    
    // 2. 强制重置所有状态
    const newState = createInitialState(seed);
    console.log('🔧 新状态资源值:', newState.resources);
    
    // 3. 同步重置状态 - 关键修复：避免异步冲突
    setGameState(newState);
    setCurrentCard(null);
    setUIState({
      isCardAnimating: false,
      swipeProgress: 0,
      swipeDirection: null,
      showStartModal: false,
      showEndingModal: false,
      showBattleReport: false,
      showSeedInput: false,
      phaseTransition: false,
      resourceChangeAnimations: []
    });
    setTouchStart(null);
    setTouchCurrent(null);
    
    console.log('✅ 状态重置完成，立即启动新游戏...');
    
    // 4. 立即生成新游戏内容（移除延迟以避免卡住）
    try {
      const initialCards = generatePhaseCards('Student', newState.seed);
      const firstCard = initialCards[0] || null;
      
      console.log('🃏 生成初始卡片:', initialCards.length, '张');
      
      // 5. 立即设置游戏状态
      setGameState({
        ...newState,
        cardDeck: initialCards,
        gamePhase: 'playing'
      });
      
      // 应用选项随机化
      const randomizedFirstCard = firstCard ? randomizeCardOptions(firstCard, newState.seed) : null;
      setCurrentCard(randomizedFirstCard);
      
      // 6. 启动计时器
      startGameTimer();
      
      console.log('✨ 游戏启动成功！');
      
    } catch (error) {
      console.error('❗ 游戏初始化失败:', error);
      setUIState(prev => ({ ...prev, showStartModal: true }));
    }
  }, []);
  
  // 完全重启游戏的函数 - 终极修复版本：使用最可靠的方法
  const restartGame = useCallback(() => {
    console.log('🎯 [DEBUG] restartGame 函数被调用!');
    
    try {
      // 添加视觉反馈
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        button.style.opacity = '0.5';
        button.textContent = '重启中...';
      }
      
      console.log('💫 [DEBUG] 准备刷新页面进行完全重置...');
      
      // 使用最直接可靠的方法：页面刷新
      setTimeout(() => {
        console.log('🔄 [DEBUG] 执行页面刷新');
        window.location.reload();
      }, 300); // 给用户一点视觉反馈时间
      
    } catch (error) {
      console.error('❌ [DEBUG] restartGame 执行出错:', error);
      // 立即备用方案
      window.location.reload();
    }
  }, []);

  // 游戏计时器
  const startGameTimer = useCallback(() => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    
    gameTimerRef.current = setInterval(() => {
      setGameState(prev => {
        const gameEndCheck = checkGameEnd(prev);
        if (gameEndCheck.isGameOver) {
          triggerGameEnd(gameEndCheck.reason || 'time_limit');
          return prev;
        }
        return prev;
      });
    }, 1000);
  }, []);

  // 触发游戏结束
  const triggerGameEnd = useCallback((reason: string) => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    
    setGameState(prev => {
      const endingData = determineEnding(
        prev,
        prev.currentPhase,
        prev.stageScore,
        prev.playerTags
      );
      
      return {
        ...prev,
        isGameOver: true,
        endingId: endingData.id,
        gamePhase: 'ended'
      };
    });
    
    setUIState(prev => ({ ...prev, showEndingModal: true }));
  }, []);

  // 处理卡片选择 - 修复：统一卡片处理逻辑
  const makeChoice = useCallback((choice: 'left' | 'right') => {
    if (!currentCard || gameState.isGameOver || uiState.isCardAnimating) {
      console.log('忽略选择：', { currentCard: !!currentCard, isGameOver: gameState.isGameOver, isAnimating: uiState.isCardAnimating });
      return;
    }

    console.log(`选择 ${choice}: ${currentCard.id}, isGate: ${currentCard.isGate}`);
    setUIState(prev => ({ ...prev, isCardAnimating: true }));

    try {
      // 获取实际选项（考虑选项交换）
      const actualChoice = getActualChoice(choice, currentCard);
      const selectedOption = actualChoice === 'left' ? currentCard.left : currentCard.right;
      const originalChoiceLabel = getOriginalChoiceLabel(choice, currentCard);
      const actualImpact = calculateActualImpact(
        selectedOption.impact,
        gameState.seed + gameState.totalCardCount
      );
      
      // 更新资源
      const newResources = updateResources(gameState.resources, actualImpact);
      
      // 更新阶段评分
      const newStageScore = updateStageScore(
        gameState.stageScore,
        actualImpact,
        gameState.currentPhase
      );
      
      console.log(`阶段评分: ${gameState.stageScore} -> ${newStageScore}`);
      
      // 记录选择
      const cardChoice: CardChoice = {
        cardId: currentCard.id,
        choice,
        actualChoice: originalChoiceLabel,
        impact: selectedOption.impact,
        actualImpact,
        timeCost: currentCard.timeCost,
        isKeyDecision: currentCard.category === 'emergency' || currentCard.isGate
      };
      
      // 检查是否为负面影响
      const isNegativeCard = Object.values(actualImpact).some(val => val < -3);
      
      // 一次性更新游戏状态
      const updatedState = {
        ...gameState,
        resources: newResources,
        stageScore: newStageScore,
        totalCardCount: gameState.totalCardCount + 1,
        phaseCardCount: gameState.phaseCardCount + 1,
        cardHistory: [...gameState.cardHistory, cardChoice],
        consecutiveNegativeCards: isNegativeCard 
          ? gameState.consecutiveNegativeCards + 1 
          : 0,
        
        // 添加标签和标记
        playerTags: [
          ...gameState.playerTags,
          ...(selectedOption.addTags || [])
        ],
        playerFlags: [
          ...gameState.playerFlags,
          ...(selectedOption.addFlags || [])
        ],
        
        // 更新关键决策
        keyChoices: cardChoice.isKeyDecision 
          ? [...gameState.keyChoices, selectedOption.label].slice(-3)
          : gameState.keyChoices
      };
      
      setGameState(updatedState);
      
      // 检查游戏结束条件
      const gameEndCheck = checkGameEnd(updatedState);
      
      if (gameEndCheck.isGameOver) {
        setTimeout(() => {
          triggerGameEnd(gameEndCheck.reason || 'resource_limit');
        }, 800);
        return;
      }
      
      // 延迟处理下一张卡 - 传递当前卡片和更新后的状态
      setTimeout(() => {
        processNextCard(currentCard, updatedState);
      }, 800);
      
    } catch (error) {
      console.error('处理卡片选择时出错:', error);
      setUIState(prev => ({ ...prev, isCardAnimating: false }));
    }
  }, [currentCard, gameState, uiState.isCardAnimating]);

  // 处理下一张卡片 - 修复版本：接受参数避免状态不一致
  const processNextCard = useCallback((justPlayedCard?: GameCard, latestState?: GameState) => {
    const cardToCheck = justPlayedCard || currentCard;
    const stateToUse = latestState || gameState;
    
    console.log(`processNextCard: 处理卡片 ${cardToCheck?.id}, isGate: ${cardToCheck?.isGate}`);
    
    // 检查是否是关卡卡
    if (cardToCheck?.isGate) {
      const gateResult = processGateCard(stateToUse);
      
      console.log(`关卡卡结果: shouldAdvance=${gateResult.shouldAdvance}, stageScore=${stateToUse.stageScore}`);
      
      if (!gateResult.shouldAdvance) {
        // 阶段失败，触发结局
        console.log('阶段失败，游戏结束');
        setTimeout(() => triggerGameEnd('stage_fail'), 500);
        return;
      } else {
        // 进入下一阶段
        console.log(`通过关卡，进入下一阶段`);
        const advancedState = advancePhase(stateToUse);
        
        console.log(`阶段切换: ${stateToUse.currentPhase} -> ${advancedState.currentPhase}`);
        
        // 触发阶段过渡动画
        setUIState(prev => ({ ...prev, phaseTransition: true }));
        
        setTimeout(() => {
          // 生成新阶段卡片
          const newPhaseCards = generatePhaseCards(
            advancedState.currentPhase,
            advancedState.seed + advancedState.currentPhase
          );
          
          console.log(`生成${advancedState.currentPhase}阶段卡片: ${newPhaseCards.length}张`);
          
          // 一次性更新所有状态
          setGameState({
            ...advancedState,
            cardDeck: newPhaseCards,
            currentCardIndex: 0
          });
          
          // 应用选项随机化
          const randomizedPhaseCard = newPhaseCards[0] ? randomizeCardOptions(newPhaseCards[0], advancedState.seed + advancedState.currentPhase) : null;
          setCurrentCard(randomizedPhaseCard);
          setUIState(prev => ({ 
            ...prev, 
            phaseTransition: false,
            isCardAnimating: false 
          }));
        }, 1500);
        
        return;
      }
    }
    
    // 普通卡片处理
    let nextCard: GameCard | null = null;
    let stateUpdates: Partial<GameState> = {};
    
    // 检查喘息卡
    const reliefCard = checkReliefCard(stateToUse);
    if (reliefCard) {
      nextCard = reliefCard;
      stateUpdates.consecutiveNegativeCards = 0;
      console.log('触发喘息卡');
    }
    
    // 检查稀有事件
    if (!nextCard) {
      const rareCard = checkRareEvent(stateToUse, stateToUse.seed);
      if (rareCard) {
        nextCard = rareCard;
        stateUpdates.rareEventsTriggered = stateToUse.rareEventsTriggered + 1;
        console.log('触发稀有事件');
      }
    }
    
    // 使用常规卡片
    if (!nextCard) {
      const nextIndex = stateToUse.currentCardIndex + 1;
      if (nextIndex < stateToUse.cardDeck.length) {
        nextCard = stateToUse.cardDeck[nextIndex];
        stateUpdates.currentCardIndex = nextIndex;
        console.log(`下一张卡: ${nextCard?.id} (index: ${nextIndex})`);
      }
    }
    
    // 批量更新状态
    if (Object.keys(stateUpdates).length > 0) {
      setGameState(prev => ({ ...prev, ...stateUpdates }));
    }
    
    // 应用选项随机化
    const randomizedNextCard = nextCard ? randomizeCardOptions(nextCard, stateToUse.seed + stateToUse.totalCardCount) : null;
    setCurrentCard(randomizedNextCard);
    setUIState(prev => ({ ...prev, isCardAnimating: false }));
    
    // 如果没有更多卡片，结束游戏
    if (!nextCard) {
      console.log('没有更多卡片，游戏结束');
      setTimeout(() => triggerGameEnd('no_more_cards'), 500);
    }
  }, [currentCard, gameState]);

  // 触摸事件处理
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (uiState.isCardAnimating || !currentCard) return;
    
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchCurrent({ x: touch.clientX, y: touch.clientY });
  }, [uiState.isCardAnimating, currentCard]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart || uiState.isCardAnimating) return;
    
    const touch = e.touches[0];
    setTouchCurrent({ x: touch.clientX, y: touch.clientY });
    
    const swipe = handleSwipeGesture(
      touchStart.x,
      touch.clientX,
      window.innerWidth
    );
    
    setUIState(prev => ({
      ...prev,
      swipeDirection: swipe.direction,
      swipeProgress: swipe.progress
    }));
  }, [touchStart, uiState.isCardAnimating]);

  const handleTouchEnd = useCallback(() => {
    if (uiState.swipeProgress > 0.3 && uiState.swipeDirection) {
      makeChoice(uiState.swipeDirection);
    }
    
    // 重置触摸状态
    setTouchStart(null);
    setTouchCurrent(null);
    setUIState(prev => ({
      ...prev,
      swipeDirection: null,
      swipeProgress: 0
    }));
  }, [uiState.swipeProgress, uiState.swipeDirection, makeChoice]);

  // 点击选择
  const handleClickChoice = useCallback((choice: 'left' | 'right') => {
    makeChoice(choice);
  }, [makeChoice]);

  // 处理时间惩罚 - 修改：每秒扣3分
  const handleTimePenalty = useCallback((penaltyType: 'Safety' | 'Knowledge' | 'Ethics') => {
    if (gameState.isGameOver || uiState.isCardAnimating) {
      return;
    }
    
    console.log(`时间惩罚: ${penaltyType} -3分`);
    
    setGameState(prev => {
      const currentValue = prev.resources[penaltyType];
      const newValue = Math.max(0, currentValue - 3);  // 修改：从-1改为-3
      
      console.log(`${penaltyType}: ${currentValue} -> ${newValue}`);
      
      const newResources = {
        ...prev.resources,
        [penaltyType]: newValue
      };
      
      // 检查是否因为时间惩罚导致游戏结束
      if (newValue === 0) {
        setTimeout(() => {
          triggerGameEnd(`${penaltyType.toLowerCase()}_depleted`);
        }, 100);
      }
      
      return {
        ...prev,
        resources: newResources
      };
    });
  }, [gameState.isGameOver, uiState.isCardAnimating, triggerGameEnd]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, []);

  // 渲染
  return (
    <div className="game-container bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部信息面板 */}
      <TopPanel 
        key={resetKey} // 强制重新挂载所有子组件
        gameState={gameState}
        uiState={uiState}
      />
      
      {/* 主游戏区域 */}
      <div className="game-main flex items-center justify-center p-4" style={{minHeight: 'calc(100vh - 120px)'}}>
        {currentCard && (
          <DecisionCard
            ref={cardRef}
            card={currentCard}
            gameState={gameState}
            uiState={uiState}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClickChoice={handleClickChoice}
            onTimePenalty={handleTimePenalty}
          />
        )}
      </div>
      
      {/* 模态框 */}
      {uiState.showStartModal && (
        <StartModal
          onStartGame={initializeGame}
          onShowSeedInput={() => setUIState(prev => ({ ...prev, showSeedInput: true }))}
        />
      )}
      
      {uiState.showEndingModal && (
        <EndingModal
          gameState={gameState}
          onShowReport={() => {
            setUIState(prev => ({
              ...prev,
              showEndingModal: false,
              showBattleReport: true
            }));
          }}
          onRestart={() => {
            console.log('🔥 [RESTART] 用户点击了再来一局（结局模态框）');
            console.log('🔥 [RESTART] 立即执行页面刷新');
            window.location.reload();
          }}
        />
      )}
      
      {uiState.showBattleReport && (
        <BattleReport
          gameState={gameState}
          onClose={() => {
            setUIState(prev => ({ ...prev, showBattleReport: false }));
          }}
          onRestart={() => {
            console.log('🔥 [RESTART] 用户点击了再来一局（战报模态框）');
            console.log('🔥 [RESTART] 立即执行页面刷新');
            window.location.reload();
          }}
        />
      )}
      
      {/* 阶段过渡动画 */}
      {uiState.phaseTransition && (
        <div className="fixed inset-0 bg-blue-600 bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🎆</div>
            <div className="text-2xl font-bold mb-2">恭喜你！</div>
            <div className="text-xl">
              成功完成了「{gameState.currentPhase && GAME_PHASES[gameState.currentPhase]?.name}」阶段
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;