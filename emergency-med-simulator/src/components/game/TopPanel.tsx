import React from 'react';
import { GameState, UIState } from '../../types/game';
import { GAME_PHASES, RESOURCES_CONFIG, GamePhaseType } from '../../data/gameConfig';
import ResourceBar from './ResourceBar';
import PhaseProgress from './PhaseProgress';

interface TopPanelProps {
  gameState: GameState;
  uiState: UIState;
}

const TopPanel: React.FC<TopPanelProps> = ({ gameState, uiState }) => {
  return (
    <div className="top-panel bg-white shadow-sm border-b border-gray-200 p-4">
      {/* 资源显示区域 */}
      <div className="resources-section mb-4">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(gameState.resources).map(([key, value]) => {
            const config = RESOURCES_CONFIG[key as keyof typeof RESOURCES_CONFIG];
            return (
              <ResourceBar
                key={key}
                name={config.name}
                value={value}
                max={config.max}
                color={config.color}
                ideal={'ideal' in config ? config.ideal : undefined}
                isAnimating={uiState.resourceChangeAnimations.some(
                  anim => anim.resource === key
                )}
              />
            );
          })}
        </div>
      </div>
      
      {/* 阶段进度和游戏状态 */}
      <div className="flex items-center justify-between">
        {/* 阶段进度 */}
        <div className="phase-progress-section flex-1">
          <PhaseProgress
            currentPhase={gameState.currentPhase}
            maxPhaseReached={gameState.maxPhaseReached}
            phaseCardCount={gameState.phaseCardCount}
            totalCardCount={gameState.totalCardCount}
            isTransitioning={uiState.phaseTransition}
          />
        </div>
        
        {/* 稀有事件状态 */}
        {gameState.rareEventsTriggered > 0 && (
          <div className="game-status-section flex items-center space-x-1 text-sm text-gray-600">
            <span className="text-yellow-500">✨</span>
            <span>稀有事件: {gameState.rareEventsTriggered}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPanel;