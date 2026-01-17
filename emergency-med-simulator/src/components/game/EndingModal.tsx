import React, { useState, useEffect } from 'react';
import { GameState, GameEnding } from '../../types/game';
import { GAME_PHASES } from '../../data/gameConfig';

interface EndingModalProps {
  gameState: GameState;
  onRestart: () => void;
}

const EndingModal: React.FC<EndingModalProps> = ({ gameState, onRestart }) => {
  const [showContent, setShowContent] = useState(false);
  
  // 获取结局数据，提供默认值以防undefined
  const endingData = gameState.ending || {
    id: 'default_ending',
    title: '医学生涯结束',
    subtitle: '你的医学之路告一段落',
    description: '虽然未能达到特定结局，但你的医学生涯依然值得纪念。',
    type: 'default' as const
  };
  
  // 获取结局类型对应的样式
  const getEndingTypeStyles = () => {
    switch (endingData.type) {
      case 'success':
        return {
          bgGradient: 'from-green-500 to-emerald-600',
          textColor: 'text-green-100',
          icon: '🎆',
          bgPattern: 'bg-green-50'
        };
      case 'special':
        return {
          bgGradient: 'from-purple-500 to-indigo-600',
          textColor: 'text-purple-100',
          icon: '🏆',
          bgPattern: 'bg-purple-50'
        };
      case 'failure':
        return {
          bgGradient: 'from-red-500 to-red-600',
          textColor: 'text-red-100',
          icon: '💔',
          bgPattern: 'bg-red-50'
        };
      default:
        return {
          bgGradient: 'from-gray-500 to-gray-600',
          textColor: 'text-gray-100',
          icon: '📋',
          bgPattern: 'bg-gray-50'
        };
    }
  };

  const styles = getEndingTypeStyles();

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden ${styles.bgPattern}`}>
        {/* 标题区域 */}
        <div className={`bg-gradient-to-r ${styles.bgGradient} ${styles.textColor} p-6 text-center`}>
          <div className="text-6xl mb-4">{styles.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{endingData.title}</h2>
          <p className="text-lg opacity-90">{endingData.subtitle}</p>
        </div>
        
        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {showContent && (
            <div className="space-y-6">
              {/* 结局描述 */}
              <div className="text-center">
                <p className="text-gray-700 leading-relaxed text-lg">{endingData.description}</p>
              </div>
              
              {/* AI评价 */}
              {endingData.aiReview && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center">
                    🤖 AI毒舌评价
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    "{endingData.aiReview}"
                  </p>
                </div>
              )}
              
            </div>
          )}
        </div>
        
        {/* 操作按钮 */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>再来一局</span>
          </button>
        </div>
      </div>
    </div>
  );
};


export default EndingModal;
