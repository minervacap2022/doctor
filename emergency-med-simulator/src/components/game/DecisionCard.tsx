import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { GameCard, RuntimeGameCard, GameState, UIState, ResourceHint } from '../../types/game';
import { RESOURCES_CONFIG } from '../../data/gameConfig';
import { getDisplayOptions } from '../../utils/gameEngine';

interface DecisionCardProps {
  card: RuntimeGameCard;
  gameState: GameState;
  uiState: UIState;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onClickChoice: (choice: 'left' | 'right') => void;
  onTimePenalty: (penaltyType: 'Safety' | 'Knowledge' | 'Ethics') => void;
}

const DecisionCard = forwardRef<HTMLDivElement, DecisionCardProps>((
  { card, gameState, uiState, onTouchStart, onTouchMove, onTouchEnd, onClickChoice, onTimePenalty },
  ref
) => {
  // 倒计时状态
  const [timeLeft, setTimeLeft] = useState(10);
  const [penaltyCount, setPenaltyCount] = useState(0);
  const [lastPenaltyType, setLastPenaltyType] = useState<'Safety' | 'Knowledge' | 'Ethics' | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 重置倒计时（当卡片变化时）
  useEffect(() => {
    console.log(`开始新卡片倒计时: ${card.id}`);
    
    setTimeLeft(10);
    setPenaltyCount(0);
    setLastPenaltyType(null);
    
    // 清除之前的计时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // 开始新的倒计时
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 0) {
          // 每秒进行时间惩罚（如果还未达到最大惩罚次数）
          setPenaltyCount(currentCount => {
            if (currentCount < 10) {
              // 随机选择一个属性进行惩罚
              const penaltyTypes: ('Benevolence' | 'Clinical' | 'Research')[] = ['Benevolence', 'Clinical', 'Research'];
              const randomType = penaltyTypes[Math.floor(Math.random() * penaltyTypes.length)];
              
              console.log(`第${currentCount + 1}秒: 对${randomType}进行时间惩罚-3分`);
              
              setLastPenaltyType(randomType);
              onTimePenalty(randomType);
              
              return currentCount + 1;
            }
            return currentCount;
          });
          return prev - 1;
        }
        return 0;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [card.id, onTimePenalty]); // 当卡片ID或惩罚函数变化时重新初始化
  
  // 当用户做出选择时停止倒计时
  useEffect(() => {
    if (uiState.isCardAnimating) {
      console.log('停止倒计时：用户已做出选择');
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [uiState.isCardAnimating]);
  
  // 组件卸载时清理计时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  // 获取显示选项（考虑随机交换）
  const displayOptions = getDisplayOptions(card);
  
  // 生成资源提示
  const generateResourceHints = (impact: any): ResourceHint[] => {
    const hints: ResourceHint[] = [];
    
    Object.entries(impact).forEach(([resource, value]) => {
      if (typeof value === 'number' && value !== 0) {
        hints.push({
          resource: resource as keyof typeof RESOURCES_CONFIG,
          direction: value > 0 ? 'up' : 'down',
          intensity: Math.abs(value) > 8 ? 'strong' : Math.abs(value) > 4 ? 'medium' : 'weak'
        });
      }
    });
    
    return hints;
  };
  
  const leftHints = generateResourceHints(displayOptions.left.impact);
  const rightHints = generateResourceHints(displayOptions.right.impact);
  
  // 计算卡片变形
  const getCardTransform = () => {
    if (!uiState.swipeDirection || uiState.swipeProgress === 0) {
      return 'translateX(0) rotate(0deg)';
    }
    
    const progress = uiState.swipeProgress;
    const direction = uiState.swipeDirection;
    const maxTranslate = 100; // px
    const maxRotate = 15; // degrees
    
    const translateX = direction === 'left' ? -progress * maxTranslate : progress * maxTranslate;
    const rotate = direction === 'left' ? -progress * maxRotate : progress * maxRotate;
    
    return `translateX(${translateX}px) rotate(${rotate}deg)`;
  };
  
  // 渲染资源提示图标
  const renderResourceHints = (hints: ResourceHint[]) => {
    return hints.map((hint, index) => {
      const config = RESOURCES_CONFIG[hint.resource];
      const directionSymbol = hint.direction === 'up' ? '↑' : '↓';
      
      return (
        <span 
          key={index}
          className={`inline-flex items-center space-x-0.5 text-xs ${
            hint.intensity === 'strong' ? 'font-bold' : ''
          }`}
          style={{ color: config.color }}
        >
          <span>{directionSymbol}</span>
        </span>
      );
    });
  };
  
  return (
    <div className="decision-card-container relative w-full max-w-md mx-auto">
      {/* 主卡片 */}
      <div
        ref={ref}
        className={`decision-card relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${
          uiState.isCardAnimating ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
        }`}
        style={{
          transform: getCardTransform(),
          opacity: uiState.isCardAnimating ? 0.8 : 1
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* 卡片头部 */}
        <div className="card-header p-4 bg-gradient-to-r from-blue-50 to-blue-100">
          {/* 倒计时显示 */}
          <div className="flex items-center justify-center mb-3">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              timeLeft <= 3 ? 'bg-red-100 text-red-700' : 
              timeLeft <= 5 ? 'bg-yellow-100 text-yellow-700' : 
              'bg-green-100 text-green-700'
            }`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{timeLeft > 0 ? `${timeLeft}秒` : '时间到'}</span>
              {penaltyCount > 0 && (
                <span className="text-xs bg-red-200 text-red-600 px-2 py-0.5 rounded-full">
                  -{penaltyCount * 3}分
                </span>
              )}
              {lastPenaltyType && (
                <span className="text-xs bg-orange-200 text-orange-600 px-2 py-0.5 rounded-full">
                  {lastPenaltyType === 'Safety' ? '患者安全-3' :
                   lastPenaltyType === 'Knowledge' ? '医学知识-3' :
                   '职业道德-3'}
                </span>
              )}
            </div>
          </div>
          {/* 阶段和类别标签 */}
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {card.phase === 'Undergrad' ? '本科生' : 
               card.phase === 'Intern' ? '规培医生' :
               card.phase === 'Resident' ? '住院医师' :
               card.phase === 'Attending' ? '主治医师' :
               card.phase === 'Director' ? '科室主任' : '院士'}
            </span>
            
            {card.isGate && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                关卡考验
              </span>
            )}
            
            {card.isRare && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                ✨ 稀有事件
              </span>
            )}
          </div>
          
          {/* 卡片正文 */}
          <div className="card-text text-base leading-relaxed text-gray-800 font-medium">
            {card.text}
          </div>
          
          {/* 时间成本 */}
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>时间成本: {card.timeCost}分钟</span>
          </div>
        </div>
        
        {/* 选择区域 */}
        <div className="choices-area grid grid-cols-2">
          {/* 左选 */}
          <button
            className={`choice-button left-choice p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 border-r border-gray-200 transition-all duration-200 ${
              uiState.swipeDirection === 'left' && uiState.swipeProgress > 0.2
                ? 'bg-blue-100 scale-105'
                : ''
            }`}
            onClick={() => onClickChoice('left')}
            disabled={uiState.isCardAnimating}
          >
            <div className="choice-content text-left">
              <div className="choice-label text-sm font-medium text-gray-800 mb-2">
                {displayOptions.left.label}
              </div>
              
              {/* 资源提示 */}
              <div className="resource-hints flex items-center space-x-1">
                {renderResourceHints(leftHints)}
              </div>
            </div>
          </button>
          
          {/* 右选 */}
          <button
            className={`choice-button right-choice p-4 bg-gradient-to-bl from-gray-50 to-gray-100 hover:from-green-50 hover:to-green-100 transition-all duration-200 ${
              uiState.swipeDirection === 'right' && uiState.swipeProgress > 0.2
                ? 'bg-green-100 scale-105'
                : ''
            }`}
            onClick={() => onClickChoice('right')}
            disabled={uiState.isCardAnimating}
          >
            <div className="choice-content text-right">
              <div className="choice-label text-sm font-medium text-gray-800 mb-2">
                {displayOptions.right.label}
              </div>
              
              {/* 资源提示 */}
              <div className="resource-hints flex items-center justify-end space-x-1">
                {renderResourceHints(rightHints)}
              </div>
            </div>
          </button>
        </div>
        
        {/* 滑动提示 */}
        <div className="swipe-hint absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>← 滑动选择 →</span>
          </div>
        </div>
      </div>
      
      {/* 选择提示覆盖层 */}
      {uiState.swipeDirection && uiState.swipeProgress > 0.3 && (
        <div className={`absolute inset-0 rounded-2xl pointer-events-none flex items-center justify-center ${
          uiState.swipeDirection === 'left'
            ? 'bg-blue-500 bg-opacity-20'
            : 'bg-green-500 bg-opacity-20'
        }`}>
          <div className={`text-2xl font-bold ${
            uiState.swipeDirection === 'left' ? 'text-blue-700' : 'text-green-700'
          }`}>
            {uiState.swipeDirection === 'left' ? displayOptions.left.label : displayOptions.right.label}
          </div>
        </div>
      )}
      
      {/* 加载状态 */}
      {uiState.isCardAnimating && (
        <div className="absolute inset-0 bg-white bg-opacity-80 rounded-2xl flex items-center justify-center">
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">处理中...</span>
          </div>
        </div>
      )}
    </div>
  );
});

DecisionCard.displayName = 'DecisionCard';

export default DecisionCard;