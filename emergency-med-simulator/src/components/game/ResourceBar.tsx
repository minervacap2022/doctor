import React from 'react';

interface ResourceBarProps {
  name: string;
  value: number;
  max: number;
  color: string;
  ideal?: number; // 理想值（用于精力）
  isAnimating?: boolean;
}

const ResourceBar: React.FC<ResourceBarProps> = ({
  name,
  value,
  max,
  color,
  ideal,
  isAnimating
}) => {
  // 直接使用传入的最新值，确保实时更新
  const clampedValue = Math.max(0, Math.min(max, value));
  const percentage = Math.max(0, Math.min(100, (clampedValue / max) * 100));
  
  // 重新设计状态判断：符合现实逻辑
  const isLowCritical = clampedValue <= 10;  // 低分危险
  const isLowWarning = clampedValue <= 20 && clampedValue > 10;  // 低分警告
  const isHighExcellent = clampedValue >= 90;  // 高分优秀
  const isHighGood = clampedValue >= 80 && clampedValue < 90;  // 高分良好
  
  // 精力有特殊逻辑：只有低分才是问题
  const isEnergyResource = name === '精力';
  
  // 统一状态判断
  const isCritical = isLowCritical;
  const isWarning = isLowWarning;
  const isExcellent = isHighExcellent && !isEnergyResource; // 非精力的高分为优秀
  const isGood = isHighGood && !isEnergyResource; // 非精力的较高分为良好
  
  // 理想值标记（仅用于精力）
  const idealPercentage = ideal ? (ideal / max) * 100 : null;
  
  return (
    <div className="resource-bar-container">
      {/* 资源名称和数值 */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">{name}</span>
        <span 
          className={`text-xs font-bold ${
            isCritical 
              ? 'text-red-600' 
              : isWarning 
              ? 'text-yellow-600'
              : isExcellent
              ? 'text-green-600'
              : isGood
              ? 'text-blue-600'
              : 'text-gray-600'
          }`}
        >
          {Math.round(clampedValue)}
        </span>
      </div>
      
      {/* 资源条容器 */}
      <div className="relative">
        {/* 背景条 */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* 理想值标记 */}
          {idealPercentage && (
            <div 
              className="absolute h-full w-0.5 bg-gray-400 opacity-50 z-10"
              style={{ left: `${idealPercentage}%` }}
            />
          )}
          
          {/* 主资源条 */}
          <div
            className={`h-full transition-all duration-500 ease-in-out ${
              isCritical
                ? 'bg-red-500'
                : isWarning
                ? 'bg-yellow-500'
                : isExcellent
                ? 'bg-green-500'
                : isGood
                ? 'bg-blue-500'
                : ''
            } ${
              isAnimating ? 'animate-pulse' : ''
            }`}
            style={{
              width: `${percentage}%`,
              backgroundColor: (!isWarning && !isCritical && !isExcellent && !isGood) ? color : undefined,
              boxShadow: isAnimating ? `0 0 8px ${color}` : 'none'
            }}
          />
          
          {/* 闪烁效果（警告状态） */}
          {isCritical && (
            <div className="absolute inset-0 bg-red-500 opacity-30 animate-ping" />
          )}
        </div>
        
        {/* 微光效果（增加时） */}
        {isAnimating && (
          <div 
            className="absolute inset-0 h-2 rounded-full opacity-60 animate-pulse"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              width: `${percentage}%`
            }}
          />
        )}
      </div>
      
      {/* 状态指示器 */}
      {isCritical && (
        <div className="flex items-center mt-1">
          <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse mr-1" />
          <span className="text-xs text-red-600 font-medium">
            {name === '精力' && clampedValue <= 10 ? '极度疲劳' : '危险状态'}
          </span>
        </div>
      )}
      
      {/* 优秀状态指示器 */}
      {isExcellent && (
        <div className="flex items-center mt-1">
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse mr-1" />
          <span className="text-xs text-green-600 font-medium">
            优秀状态
          </span>
        </div>
      )}
      
      {/* 良好状态指示器 */}
      {isGood && (
        <div className="flex items-center mt-1">
          <div className="w-1 h-1 bg-blue-500 rounded-full mr-1" />
          <span className="text-xs text-blue-600 font-medium">
            良好状态
          </span>
        </div>
      )}
    </div>
  );
};

export default ResourceBar;