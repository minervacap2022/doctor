import React from 'react';
import { GamePhaseType, GAME_PHASES } from '../../data/gameConfig';

interface PhaseProgressProps {
  currentPhase: GamePhaseType;
  maxPhaseReached: GamePhaseType;
  phaseCardCount: number;
  totalCardCount: number;
  isTransitioning?: boolean;
}

const PhaseProgress: React.FC<PhaseProgressProps> = ({
  currentPhase,
  maxPhaseReached,
  phaseCardCount,
  totalCardCount,
  isTransitioning
}) => {
  const phases: GamePhaseType[] = ['Undergrad', 'Intern', 'Resident', 'Attending', 'Director', 'Academician'];
  const phaseLabels = {
    Undergrad: '本',
    Intern: '实',
    Resident: '住',
    Attending: '主',
    Director: '任',
    Academician: '院'
  };
  
  const getPhaseStatus = (phase: GamePhaseType): 'completed' | 'active' | 'locked' => {
    const phaseIndex = phases.indexOf(phase);
    const currentIndex = phases.indexOf(currentPhase);
    const maxIndex = phases.indexOf(maxPhaseReached);
    
    if (phaseIndex < currentIndex) return 'completed';
    if (phaseIndex === currentIndex) return 'active';
    if (phaseIndex <= maxIndex) return 'locked';
    return 'locked';
  };
  
  const getCurrentPhaseProgress = (): number => {
    const phaseConfig = GAME_PHASES[currentPhase as keyof typeof GAME_PHASES];
    if (!phaseConfig) return 0;
    const totalPhaseCards = phaseConfig.cardQuota + phaseConfig.gateCard;
    return totalPhaseCards > 0 ? (phaseCardCount / totalPhaseCards) * 100 : 0;
  };
  
  return (
    <div className="phase-progress-container">
      {/* 阶段名称显示 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {GAME_PHASES[currentPhase as keyof typeof GAME_PHASES]?.name || '当前阶段'}
          </span>
          <span className="text-xs text-gray-500">
            ({phaseCardCount}/{(GAME_PHASES[currentPhase as keyof typeof GAME_PHASES]?.cardQuota || 0) + (GAME_PHASES[currentPhase as keyof typeof GAME_PHASES]?.gateCard || 0)})
          </span>
        </div>
        
        <div className="text-xs text-gray-500">
          总进度: {totalCardCount}/32
        </div>
      </div>
      
      {/* 阶段圆点指示器 */}
      <div className="flex items-center justify-between">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase);
          const isActive = status === 'active';
          const isCompleted = status === 'completed';
          
          return (
            <React.Fragment key={phase}>
              {/* 阶段节点 */}
              <div className="relative flex flex-col items-center">
                {/* 进度环 */}
                {isActive && (
                  <div className="absolute inset-0 w-8 h-8 rounded-full">
                    <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 14}`}
                        strokeDashoffset={`${2 * Math.PI * 14 * (1 - getCurrentPhaseProgress() / 100)}`}
                        className="transition-all duration-300 ease-in-out"
                      />
                    </svg>
                  </div>
                )}
                
                {/* 主节点 */}
                <div
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 text-white shadow-lg scale-105'
                      : isActive
                      ? `bg-blue-500 text-white shadow-lg ${
                          isTransitioning ? 'animate-pulse scale-110' : 'scale-105'
                        }`
                      : 'bg-gray-200 text-gray-600 border-2 border-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    phaseLabels[phase]
                  )}
                </div>
                
                {/* 阶段标签 */}
                <div className={`mt-1 text-xs text-center ${
                  isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {GAME_PHASES[phase as keyof typeof GAME_PHASES]?.name?.slice(0, 2) || '阶段'}
                </div>
              </div>
              
              {/* 连接线 */}
              {index < phases.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 relative">
                  <div className="absolute inset-0 bg-gray-300" />
                  <div 
                    className={`absolute inset-0 transition-all duration-500 ${
                      phases.indexOf(maxPhaseReached) > index
                        ? 'bg-green-500'
                        : phases.indexOf(currentPhase) > index
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* 当前阶段进度条 */}
      <div className="mt-3">
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${getCurrentPhaseProgress()}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>当前阶段进度</span>
          <span>{Math.round(getCurrentPhaseProgress())}%</span>
        </div>
      </div>
    </div>
  );
};

export default PhaseProgress;