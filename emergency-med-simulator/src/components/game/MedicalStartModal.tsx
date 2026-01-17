import React from 'react';

interface MedicalStartModalProps {
  onStartGame: () => void;
}

const MedicalStartModal: React.FC<MedicalStartModalProps> = ({ onStartGame }) => {
  const handleStart = () => {
    console.log('开始医学生涯之旅');
    onStartGame();
  };
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-white flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden border border-blue-100">
        {/* 游戏标题 */}
        <div className="text-center p-6 flex-shrink-0 bg-gradient-to-b from-blue-50 to-white">
          <div className="text-4xl mb-3">🩺</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            医学生涯模拟器
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            从白袍初染到医学巅峰的传奇之路<br/>
            每个选择都将塑造你的医学人生
          </p>
        </div>
        
        {/* 主要内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 pb-2">
          {/* 游戏信息 */}
          <div className="flex-grow p-6 overflow-y-auto">
            <div className="text-center text-gray-600">
              <p className="text-sm">
                体验从医学生到院士的完整职业发展路径，在关键决策中塑造你的医学之路。
              </p>
            </div>
          </div>
        </div>
        
        {/* 操作按钮区域 */}
        <div className="p-6 flex-shrink-0 bg-gradient-to-t from-gray-50 to-white">
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span>开启医学生涯</span>
          </button>
          
          {/* 版本信息 */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">
              v5.0 - 18个完整决策，6个关键选择，8种结局
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalStartModal;
