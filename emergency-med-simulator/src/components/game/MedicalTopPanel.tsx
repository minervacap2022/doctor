import React from 'react';
import MedicalResourceBar from './MedicalResourceBar';
import { GameState, UIState, Resources } from '../../types/game';
import { RESOURCES_CONFIG } from '../../data/gameConfig';

interface MedicalTopPanelProps {
  gameState: GameState;
  uiState: UIState;
}

const MedicalTopPanel: React.FC<MedicalTopPanelProps> = ({ gameState, uiState }) => {
  const { resources } = gameState;
  
  // 医学生涯属性图标
  const resourceIcons: { [key: string]: string } = {
    Benevolence: '❤️',  // 仁心仁术
    Clinical: '🩺',     // 临床精技
    Research: '🔬',     // 科研卓识
    Leadership: '👑'    // 领袖格局
  };
  
  // 检查是否有资源动画
  const getResourceAnimation = (resource: keyof Resources) => {
    const recentChange = uiState.resourceChangeAnimations?.find(
      anim => anim.resource === resource && 
      Date.now() - anim.timestamp < 1000
    );
    return !!recentChange;
  };
  
  // 计算综合评分
  const calculateOverallScore = () => {
    const total = resources.Benevolence + resources.Clinical + 
                 resources.Research + resources.Leadership;
    return Math.round(total / 4);
  };
  
  const overallScore = calculateOverallScore();
  
  // 获取职业发展阶段描述
  const getCareerStageDescription = () => {
    if (overallScore >= 22) return '医学巨擘';
    if (overallScore >= 18) return '业界精英';
    if (overallScore >= 15) return '骨干医师';
    if (overallScore >= 12) return '成长医师';
    if (overallScore >= 10) return '初出茅庐';
    if (overallScore >= 5) return '需要努力';
    return '职业危机';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-800">医学生涯</span>
          <span className="text-sm text-gray-600">
            综合评分: <span className={`font-bold ${
              overallScore >= 20 ? 'text-green-600' :
              overallScore >= 15 ? 'text-blue-600' :
              overallScore >= 10 ? 'text-gray-600' :
              overallScore >= 5 ? 'text-yellow-600' :
              'text-red-600'
            }`}>{overallScore}</span>
          </span>
        </div>
        <span className={`text-sm font-semibold px-2 py-1 rounded ${
          overallScore >= 22 ? 'bg-green-100 text-green-700' :
          overallScore >= 15 ? 'bg-blue-100 text-blue-700' :
          overallScore >= 10 ? 'bg-gray-100 text-gray-700' :
          overallScore >= 5 ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {getCareerStageDescription()}
        </span>
      </div>
      
      {/* 四大属性显示 */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(RESOURCES_CONFIG).map(([key, config]) => (
          <MedicalResourceBar
            key={key}
            name={config.name}
            value={resources[key as keyof Resources]}
            max={config.max}
            color={config.color}
            icon={resourceIcons[key]}
            isAnimating={getResourceAnimation(key as keyof Resources)}
          />
        ))}
      </div>
      
      {/* 特殊成就提示 */}
      {resources.Research >= 25 && (
        <div className="mt-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
          <span className="text-xs text-purple-700 font-medium">
            🎯 诺贝尔奖候选人 - 科研成就接近巅峰！
          </span>
        </div>
      )}
      
      {resources.Benevolence >= 22 && resources.Clinical >= 22 && (
        <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
          <span className="text-xs text-green-700 font-medium">
            ⭐ 医界传奇 - 德术双馨，患者心中的守护神！
          </span>
        </div>
      )}
      
      {Math.min(resources.Benevolence, resources.Clinical, resources.Research, resources.Leadership) >= 15 && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-xs text-blue-700 font-medium">
            💎 全面发展 - 四维均衡，医学领域的全才！
          </span>
        </div>
      )}
      
      {/* 危机警告 */}
      {Math.max(resources.Benevolence, resources.Clinical, resources.Research, resources.Leadership) <= 5 && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200 animate-pulse">
          <span className="text-xs text-red-700 font-bold">
            ⚠️ 职业生涯濒临崩溃！所有属性过低，可能面临失败结局！
          </span>
        </div>
      )}
    </div>
  );
};

export default MedicalTopPanel;
