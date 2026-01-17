import React, { useState } from 'react';

interface StartModalProps {
  onStartGame: (seed?: string) => void;
  onShowSeedInput: () => void;
}

const StartModal: React.FC<StartModalProps> = ({ onStartGame, onShowSeedInput }) => {
  const [showSeedInput, setShowSeedInput] = useState(false);
  const [seedInput, setSeedInput] = useState('');
  const [seedError, setSeedError] = useState('');
  
  const handleStartWithSeed = () => {
    if (!seedInput.trim()) {
      setSeedError('请输入有效的种子');
      return;
    }
    
    setSeedError('');
    onStartGame(seedInput.trim());
  };
  
  const handleRandomStart = () => {
    console.log('用户点击开始新游戏（随机）');
    onStartGame();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* 游戏标题 - 固定头部 */}
        <div className="text-center p-6 flex-shrink-0">
          <div className="text-3xl mb-2">🏥</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            急诊医学生模拟器
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            体验从医学生到院士的完整职业发展路径，<br/>
            在关键决策中塑造你的医学之路。
          </p>
        </div>
        
        {/* 主要内容区域 - 可滚动 */}
        <div className="flex-1 overflow-y-auto px-6">
          {/* 游戏规则提示 */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">游戏规则</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 时间限制：10分钟或最多32张卡片</li>
              <li>• 5个成长阶段：医学生 → 规培 → 博士 → 主任 → 院士</li>
              <li>• 4项资源：患者安全、医学知识、职业道德、精力</li>
              <li>• 任意资源归零将立即结束游戏</li>
              <li>• 每过一秒随机从三项核心能力中扣除3分</li>
              <li>• 决策质量影响隐藏评分，过低也会结束游戏</li>
            </ul>
          </div>
        </div>
        
        {/* 操作按钮区域 - 固定底部 */}
        <div className="p-6 flex-shrink-0">
        
        {!showSeedInput ? (
          /* 主菜单 */
          <div className="space-y-3">
            <button
              onClick={handleRandomStart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>开始新游戏</span>
            </button>
            
            <button
              onClick={() => setShowSeedInput(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span>输入种子复盘</span>
            </button>
            
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                种子模式可以复现相同的游戏过程
              </p>
            </div>
          </div>
        ) : (
          /* 种子输入 */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                输入游戏种子
              </label>
              <input
                type="text"
                value={seedInput}
                onChange={(e) => {
                  setSeedInput(e.target.value);
                  setSeedError('');
                }}
                placeholder="例如：example123"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  seedError ? 'border-red-500' : ''
                }`}
              />
              {seedError && (
                <p className="mt-1 text-sm text-red-600">{seedError}</p>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowSeedInput(false);
                  setSeedInput('');
                  setSeedError('');
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                返回
              </button>
              
              <button
                onClick={handleStartWithSeed}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                开始游戏
              </button>
            </div>
          </div>
        )}
        
        {/* 版本信息 */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            v2.0 - 五阶段成长系统
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default StartModal;