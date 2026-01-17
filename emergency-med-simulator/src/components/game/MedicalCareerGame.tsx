import React, { useState, useEffect, useCallback } from 'react';
import { 
  GameState, 
  UIState, 
  RuntimeGameCard, 
  CardChoice
} from '../../types/game';
import { GAME_PHASES, GamePhaseType } from '../../data/gameConfig';
import { allCards } from '../../data/coreCards';
import { determineEnding } from '../../data/coreEndings';
import * as gameEngine from '../../utils/coreGameEngine';
import SwipeCard from './SwipeCard';
import MedicalStartModal from './MedicalStartModal';
import EndingModal from './EndingModal';

const MedicalCareerGame: React.FC = () => {
  // 游戏状态
  const [gameState, setGameState] = useState<GameState>(() => 
    gameEngine.createInitialState()
  );
  
  // UI状态
  const [uiState, setUiState] = useState<UIState>({
    isCardAnimating: false,
    swipeProgress: 0,
    swipeDirection: null,
    showStartModal: true,
    showEndingModal: false,
    phaseTransition: false,
    resourceChangeAnimations: []
  });
  
  // 当前卡片
  const [currentCard, setCurrentCard] = useState<RuntimeGameCard | null>(null);
  
  
  // 初始化游戏
  const startGame = useCallback(() => {
    const newState = gameEngine.createInitialState();
    
    // 生成第一阶段的卡片
    const phaseCards = gameEngine.generatePhaseCards(newState.currentPhase, []);
    const deck = phaseCards.map(card => 
      gameEngine.randomizeCardOptions(card)
    );
    
    // 记录已使用的卡片ID
    const usedIds = phaseCards.map(card => card.id);
    
    setGameState({
      ...newState,
      cardDeck: deck,
      usedCardIds: usedIds,
      gamePhase: 'playing'
    });
    
    setCurrentCard(deck[0]);
    setUiState(prev => ({ ...prev, showStartModal: false }));
  }, []);
  
  // 处理卡片选择
  const handleCardChoice = useCallback(async (choice: 'left' | 'right') => {
    if (!currentCard || uiState.isCardAnimating) return;
    
    setUiState(prev => ({ ...prev, isCardAnimating: true }));
    
    // 获取实际选择和影响
    const actualChoice = gameEngine.getActualChoice(choice, currentCard);
    const choiceData = actualChoice === 'left' ? currentCard.left : currentCard.right;
    // 不再需要资源计算，游戏基于路径选择
    
    // 记录选择
    const cardChoice: CardChoice = {
      cardId: currentCard.id,
      choice,
      actualChoice: actualChoice === 'left' ? 'original_left' : 'original_right',
      impact: choiceData.impact,
      actualImpact: {},
      timeCost: currentCard.timeCost,
      isKeyDecision: currentCard.isRare || false
    };
    
    // 添加标签
    const newTags = [...gameState.playerTags];
    if (choiceData.addTags) {
      choiceData.addTags.forEach(tag => {
        if (!newTags.includes(tag)) {
          newTags.push(tag);
        }
      });
    }
    
    // 更新游戏状态
    const updatedState: GameState = {
      ...gameState,
      totalCardCount: gameState.totalCardCount + 1,
      phaseCardCount: gameState.phaseCardCount + 1,
      currentCardIndex: gameState.currentCardIndex + 1,
      cardHistory: [...gameState.cardHistory, cardChoice],
      playerTags: newTags,
      rareEventsTriggered: currentCard.isRare 
        ? gameState.rareEventsTriggered + 1 
        : gameState.rareEventsTriggered
    };
    
    // 检查游戏结束
    if (gameEngine.checkGameEnd(updatedState)) {
      try {
        const ending = await determineEnding(updatedState, newTags);
        setGameState({
          ...updatedState,
          isGameOver: true,
          gamePhase: 'ended',
          endingId: ending.id,
          ending: ending,
          gameEndTime: Date.now()  // 记录游戏结束时间
        });
      } catch (error) {
        console.error('Failed to determine ending:', error);
        // 使用默认结局
        const defaultEnding = {
          id: 'default_ending',
          title: '医学生涯结束',
          description: '虽然未能达到特定结局，但你的医学生涯依然值得纪念。',
          type: 'default' as const,
          tags: [],
          aiReview: '恭喜你，成功证明了随机点击也能通关医学模拟器！'
        };
        setGameState({
          ...updatedState,
          isGameOver: true,
          gamePhase: 'ended',
          endingId: defaultEnding.id,
          ending: defaultEnding,
          gameEndTime: Date.now()
        });
      }
      
      setTimeout(() => {
        setUiState(prev => ({ 
          ...prev, 
          isCardAnimating: false,
          showEndingModal: true 
        }));
      }, 500);
      
      return;
    }
    
    // 检查是否需要进入下一阶段
    const currentPhaseConfig = GAME_PHASES[gameState.currentPhase as keyof typeof GAME_PHASES];
    if (currentPhaseConfig && gameState.phaseCardCount >= currentPhaseConfig.cardQuota - 1) {
      // 先检查是否满足晋级条件
      const { shouldAdvance, isExcellent } = gameEngine.processGateCard(updatedState);
      
      if (!shouldAdvance) {
        // 不满足晋级条件，游戏结束
        try {
          const ending = await determineEnding(updatedState, updatedState.tags || []);
          setGameState({
            ...updatedState,
            gamePhase: 'ended',
            ending,
            gameEndTime: Date.now()  // 记录游戏结束时间
          });
        } catch (error) {
          console.error('Failed to determine ending:', error);
          const defaultEnding = {
            id: 'default_ending',
            title: '医学生涯结束',
            description: '虽然未能达到特定结局，但你的医学生涯依然值得纪念。',
            type: 'default' as const,
            tags: [],
            aiReview: '恭喜你，成功证明了随机点击也能通关医学模拟器！'
          };
          setGameState({
            ...updatedState,
            gamePhase: 'ended',
            ending: defaultEnding,
            gameEndTime: Date.now()
          });
        }
        
        setTimeout(() => {
          setUiState(prev => ({ 
            ...prev, 
            isCardAnimating: false,
            showEndingModal: true 
          }));
        }, 500);
        return;
      }
      
      // 满足条件才能晋级
      const nextState = gameEngine.advancePhase(updatedState);
      
      // 生成新阶段的卡片
      if (nextState.currentPhase !== updatedState.currentPhase) {
        const newPhaseCards = gameEngine.generatePhaseCards(
          nextState.currentPhase,
          updatedState.usedCardIds || []
        );
        const newDeck = newPhaseCards.map(card =>
          gameEngine.randomizeCardOptions(card)
        );
        
        // 更新已使用的卡片ID
        const newUsedIds = [...(updatedState.usedCardIds || []), ...newPhaseCards.map(card => card.id)];
        
        setGameState({
          ...nextState,
          cardDeck: [...updatedState.cardDeck, ...newDeck],
          usedCardIds: newUsedIds,
          currentCardIndex: updatedState.cardDeck.length
        });
        
        setCurrentCard(newDeck[0]);
        
        // 阶段转换动画
        setUiState(prev => ({ ...prev, phaseTransition: true }));
        setTimeout(() => {
          setUiState(prev => ({ ...prev, phaseTransition: false }));
        }, 1500);
      } else {
        setGameState(updatedState);
        // 如果已经是最后阶段且卡片用完，游戏结束
        if (updatedState.currentCardIndex >= updatedState.cardDeck.length) {
          try {
            const ending = await determineEnding(updatedState, newTags);
            setGameState({
              ...updatedState,
              isGameOver: true,
              gamePhase: 'ended',
              endingId: ending.id,
              ending: ending,  // 存储完整的结局对象
              gameEndTime: Date.now()  // 记录游戏结束时间
            });
          } catch (error) {
            console.error('Failed to determine ending:', error);
            const defaultEnding = {
              id: 'default_ending',
              title: '医学生涯结束',
              description: '虽然未能达到特定结局，但你的医学生涯依然值得纪念。',
              type: 'default' as const,
              tags: [],
              aiReview: '恭喜你，成功证明了随机点击也能通关医学模拟器！'
            };
            setGameState({
              ...updatedState,
              isGameOver: true,
              gamePhase: 'ended',
              endingId: defaultEnding.id,
              ending: defaultEnding,
              gameEndTime: Date.now()
            });
          }
          
          setTimeout(() => {
            setUiState(prev => ({ 
              ...prev, 
              isCardAnimating: false,
              showEndingModal: true 
            }));
          }, 500);
          
          return;
        }
        // 显示下一张卡片
        setCurrentCard(updatedState.cardDeck[updatedState.currentCardIndex]);
      }
    } else {
      setGameState(updatedState);
      // 显示下一张卡片
      if (updatedState.currentCardIndex < updatedState.cardDeck.length) {
        setCurrentCard(updatedState.cardDeck[updatedState.currentCardIndex]);
      }
    }
    
    
    // 重置动画状态
    setTimeout(() => {
      setUiState(prev => ({ ...prev, isCardAnimating: false }));
    }, 500);
  }, [gameState, currentCard, uiState.isCardAnimating]);
  
  
  // 时间惩罚（暂时未实现）
  const handleTimePenalty = useCallback(() => {
    console.log('Time penalty feature not implemented');
  }, []);
  
  // 重新开始
  const restartGame = () => {
    startGame();
    setUiState({
      isCardAnimating: false,
      swipeProgress: 0,
      swipeDirection: null,
      showStartModal: true,
      showEndingModal: false,
      phaseTransition: false,
      resourceChangeAnimations: []
    });
  };
  
  // 清理动画
  useEffect(() => {
    const timer = setInterval(() => {
      setUiState(prev => ({
        ...prev,
        resourceChangeAnimations: prev.resourceChangeAnimations.filter(
          anim => Date.now() - anim.timestamp < 2000
        )
      }));
    }, 500);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* 开始界面 */}
      {uiState.showStartModal && (
        <MedicalStartModal
          onStartGame={startGame}
        />
      )}
      
      {/* 游戏主界面 */}
      {gameState.gamePhase === 'playing' && currentCard && (
        <div className="max-w-md mx-auto p-4">
          {/* 游戏标题 */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-blue-800 mb-2">🏥 医学生涯模拟器</h1>
          </div>

          {/* 阶段进度 */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center space-x-2 text-sm">
              {Object.entries(GAME_PHASES).map(([key, phase], index) => {
                const phaseKeys = Object.keys(GAME_PHASES);
                const currentIndex = phaseKeys.indexOf(gameState.currentPhase);
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                
                return (
                  <div key={key} className="flex items-center">
                    <div className={`px-3 py-1 rounded-full text-xs ${
                      isCompleted ? 'bg-green-100 text-green-800' :
                      isCurrent ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {phase.name.split('·')[0]}
                    </div>
                    {index < phaseKeys.length - 1 && (
                      <div className={`w-4 h-0.5 mx-1 ${
                        isCompleted ? 'bg-green-300' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 当前阶段标题 */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-blue-800 mb-2">
              {GAME_PHASES[gameState.currentPhase as keyof typeof GAME_PHASES]?.name || '未知阶段'}
            </h2>
          </div>

          {/* 决策卡片 */}
          <div className="mt-6 mb-8 relative" style={{ minHeight: '400px' }}>
            <SwipeCard
              card={currentCard}
              onChoice={handleCardChoice}
            />
          </div>
          
          {/* 阶段转换提示 */}
          {uiState.phaseTransition && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-8 animate-pulse">
                <h2 className="text-2xl font-bold text-center">
                  晋升至 {GAME_PHASES[gameState.currentPhase as keyof typeof GAME_PHASES]?.name || '新阶段'}
                </h2>
                <p className="text-gray-600 text-center mt-2">
                  医学生涯新篇章开启...
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* 结局界面 */}
      {uiState.showEndingModal && (
        <EndingModal
          gameState={gameState}
          onRestart={restartGame}
        />
      )}
    </div>
  );
};

export default MedicalCareerGame;
