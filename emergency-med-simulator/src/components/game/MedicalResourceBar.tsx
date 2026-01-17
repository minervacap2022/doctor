import React from 'react';

interface MedicalResourceBarProps {
  name: string;
  value: number;
  max: number;
  color: string;
  icon?: string;
  isAnimating?: boolean;
}

const MedicalResourceBar: React.FC<MedicalResourceBarProps> = ({
  name,
  value,
  max,
  color,
  icon,
  isAnimating
}) => {
  // 确保值在合理范围内
  const clampedValue = Math.max(0, Math.min(max, value));
  const percentage = Math.max(0, Math.min(100, (clampedValue / max) * 100));
  
  // 获取属性评级和描述
  const getAttributeLevel = () => {
    if (name.includes('仁心')) {
      if (value >= 22) return { level: '医者楷模', color: 'text-green-600' };
      else if (value >= 15) return { level: '医德高尚', color: 'text-blue-600' };
      else if (value >= 10) return { level: '正在成长', color: 'text-gray-600' };
      else if (value >= 5) return { level: '医德滑坡', color: 'text-yellow-600' };
      else return { level: '道德沦丧', color: 'text-red-600' };
    } else if (name.includes('临床')) {
      if (value >= 22) return { level: '手术圣手', color: 'text-green-600' };
      else if (value >= 15) return { level: '技术精湛', color: 'text-blue-600' };
      else if (value >= 10) return { level: '基础扎实', color: 'text-gray-600' };
      else if (value >= 5) return { level: '技能不足', color: 'text-yellow-600' };
      else return { level: '临床失格', color: 'text-red-600' };
    } else if (name.includes('科研')) {
      if (value >= 25) return { level: '诺奖级别', color: 'text-purple-600' };
      else if (value >= 20) return { level: '学术泰斗', color: 'text-green-600' };
      else if (value >= 15) return { level: '科研精英', color: 'text-blue-600' };
      else if (value >= 10) return { level: '初窥门径', color: 'text-gray-600' };
      else if (value >= 5) return { level: '学术不精', color: 'text-yellow-600' };
      else return { level: '科研废弃', color: 'text-red-600' };
    } else if (name.includes('领袖')) {
      if (value >= 22) return { level: '医界领袖', color: 'text-green-600' };
      else if (value >= 15) return { level: '管理才干', color: 'text-blue-600' };
      else if (value >= 10) return { level: '具备潜力', color: 'text-gray-600' };
      else if (value >= 5) return { level: '格局有限', color: 'text-yellow-600' };
      else return { level: '目光短浅', color: 'text-red-600' };
    }
    return { level: '成长中', color: 'text-gray-600' };
  };

  const attributeInfo = getAttributeLevel();
  const isDanger = value < 5;
  const isWarning = value >= 5 && value < 10;
  const isExcellent = value >= 22;
  const isGood = value >= 15 && value < 22;
  
  // 选择进度条颜色
  const getBarColor = () => {
    if (isDanger) return 'bg-red-500';
    if (isWarning) return 'bg-yellow-500';
    if (isExcellent) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (isGood) return 'bg-blue-500';
    return color;
  };
  
  return (
    <div className="medical-resource-bar-container space-y-1">
      {/* 属性名称和数值 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="text-xs font-medium text-gray-700">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${attributeInfo.color}`}>
            {attributeInfo.level}
          </span>
          <span className={`text-xs font-bold ${
            isDanger ? 'text-red-600' : 
            isWarning ? 'text-yellow-600' :
            isExcellent ? 'text-green-600' :
            isGood ? 'text-blue-600' :
            'text-gray-600'
          }`}>
            {Math.round(clampedValue)}
          </span>
        </div>
      </div>
      
      {/* 进度条容器 */}
      <div className="relative">
        {/* 背景条 */}
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          {/* 关键阈值标记 */}
          <div className="absolute h-full w-px bg-gray-300 opacity-50" style={{ left: '10%' }} />
          <div className="absolute h-full w-px bg-gray-300 opacity-50" style={{ left: '15%' }} />
          <div className="absolute h-full w-px bg-gray-400 opacity-50" style={{ left: '22%' }} />
          
          {/* 主进度条 */}
          <div
            className={`h-full transition-all duration-500 ease-in-out ${getBarColor()} ${
              isAnimating ? 'animate-pulse' : ''
            }`}
            style={{
              width: `${percentage}%`,
              boxShadow: isAnimating ? `0 0 12px ${color}` : 
                        isExcellent ? '0 0 8px rgba(34, 197, 94, 0.5)' : 
                        'none'
            }}
          />
          
          {/* 危险闪烁效果 */}
          {isDanger && (
            <div className="absolute inset-0 bg-red-500 opacity-30 animate-ping" />
          )}
        </div>
        
        {/* 增长动画效果 */}
        {isAnimating && (
          <div 
            className="absolute inset-0 h-2.5 rounded-full opacity-60 animate-pulse"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              width: `${percentage}%`
            }}
          />
        )}
      </div>
      
      {/* 成就标记 */}
      {value >= 25 && name.includes('科研') && (
        <div className="flex items-center mt-1">
          <span className="text-xs text-purple-600 font-bold animate-pulse">
            🏆 诺贝尔奖水准
          </span>
        </div>
      )}
      
      {/* 危险警告 */}
      {isDanger && (
        <div className="flex items-center mt-1">
          <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse mr-1" />
          <span className="text-xs text-red-600 font-medium">
            ⚠️ 职业生涯危机
          </span>
        </div>
      )}
      
      {/* 卓越标记 */}
      {isExcellent && !name.includes('科研') && (
        <div className="flex items-center mt-1">
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse mr-1" />
          <span className="text-xs text-green-600 font-medium">
            ⭐ 行业标杆
          </span>
        </div>
      )}
    </div>
  );
};

export default MedicalResourceBar;
