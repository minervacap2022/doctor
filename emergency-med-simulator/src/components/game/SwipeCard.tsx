import React, { useState, useRef, useEffect } from 'react';
import { RuntimeGameCard } from '../../types/game';

interface SwipeCardProps {
  card: RuntimeGameCard;
  onChoice: (choice: 'left' | 'right') => void;
  onSwipeProgress?: (progress: number, direction: 'left' | 'right' | null) => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ card, onChoice, onSwipeProgress }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    rotation: 0,
    opacity: 1
  });

  const SWIPE_THRESHOLD = 100; // 滑动距离阈值
  const ROTATION_MULTIPLIER = 0.15; // 旋转系数

  // 开始拖拽（支持触摸和鼠标）
  const handleStart = (clientX: number, clientY: number) => {
    setDragState(prev => ({
      ...prev,
      isDragging: true,
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY
    }));
  };

  // 拖拽中
  const handleMove = (clientX: number, clientY: number) => {
    if (!dragState.isDragging) return;

    const deltaX = clientX - dragState.startX;
    const deltaY = clientY - dragState.startY;
    const rotation = deltaX * ROTATION_MULTIPLIER;
    const opacity = 1 - Math.abs(deltaX) / (SWIPE_THRESHOLD * 2);

    setDragState(prev => ({
      ...prev,
      currentX: clientX,
      currentY: clientY,
      rotation,
      opacity: Math.max(0.3, opacity)
    }));

    // 通知父组件滑动进度
    if (onSwipeProgress) {
      const progress = Math.abs(deltaX) / SWIPE_THRESHOLD;
      const direction = deltaX > 0 ? 'right' : deltaX < 0 ? 'left' : null;
      onSwipeProgress(Math.min(progress, 1), direction);
    }
  };

  // 结束拖拽
  const handleEnd = () => {
    if (!dragState.isDragging) return;

    const deltaX = dragState.currentX - dragState.startX;
    
    // 判断是否达到滑动阈值
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      // 触发选择
      const choice = deltaX > 0 ? 'right' : 'left';
      
      // 添加飞出动画
      setDragState(prev => ({
        ...prev,
        currentX: deltaX > 0 ? window.innerWidth : -window.innerWidth,
        rotation: deltaX > 0 ? 30 : -30,
        opacity: 0
      }));

      // 延迟触发选择，等待动画完成
      setTimeout(() => {
        onChoice(choice);
      }, 300);
    } else {
      // 回弹到原位
      setDragState(prev => ({
        ...prev,
        isDragging: false,
        currentX: dragState.startX,
        currentY: dragState.startY,
        rotation: 0,
        opacity: 1
      }));
    }

    if (onSwipeProgress) {
      onSwipeProgress(0, null);
    }
  };

  // 鼠标事件
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // 触摸事件
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // 全局事件监听
  useEffect(() => {
    if (dragState.isDragging) {
      // 鼠标事件
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // 防止拖拽时选中文字
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [dragState.isDragging, dragState.startX, dragState.startY]);

  // 计算变换样式
  const getTransformStyle = () => {
    if (dragState.isDragging) {
      const deltaX = dragState.currentX - dragState.startX;
      const deltaY = dragState.currentY - dragState.startY;
      return {
        transform: `translate(${deltaX}px, ${deltaY}px) rotate(${dragState.rotation}deg)`,
        opacity: dragState.opacity,
        transition: 'none',
        cursor: 'grabbing'
      };
    }
    return {
      transform: 'translate(0, 0) rotate(0deg)',
      opacity: 1,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'grab'
    };
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* 卡片主体 */}
      <div
        ref={cardRef}
        className="bg-white rounded-2xl shadow-xl p-6 touch-none select-none"
        style={getTransformStyle()}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 卡片内容 */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-500 mb-2">
            {card.phase === 'Undergrad' ? '本科生' : 
             card.phase === 'Intern' ? '规培医生' :
             card.phase === 'Resident' ? '住院医师' :
             card.phase === 'Attending' ? '主治医师' :
             card.phase === 'Director' ? '科室主任' : '院士之路'}
          </div>
          <p className="text-gray-800 leading-relaxed text-base">{card.text}</p>
        </div>

        {/* 选项按钮 */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onChoice('left')}
            className="text-left p-4 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl transition-all transform hover:scale-105 border border-red-200"
          >
            <div className="text-red-800 font-medium">{card.left.label}</div>
          </button>
          <button
            onClick={() => onChoice('right')}
            className="text-left p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all transform hover:scale-105 border border-green-200"
          >
            <div className="text-green-800 font-medium">{card.right.label}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
