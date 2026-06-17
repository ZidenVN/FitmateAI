import React from 'react';
import { Flame, CheckCircle2, Circle, Trophy, ArrowUpRight, TrendingUp, Zap } from 'lucide-react';

export default function Dashboard({ 
  streak, 
  setStreak, 
  caloriesConsumed, 
  tasks, 
  toggleTask, 
  setScreen 
}) {
  const calTarget = 2400;
  const calPercent = Math.min(Math.round((caloriesConsumed / calTarget) * 100), 100);
  
  // Calculate SVG dash offset for calorie ring
  // r = 40, circumference = 2 * pi * r = 251.2
  const strokeDashoffset = 251.2 - (251.2 * calPercent) / 100;

  // Macro calculation
  const proteinTarget = 130;
  const carbsTarget = 300;
  const fatTarget = 70;
  
  // If calorie is updated from scanning, add macros proportionally
  const isScanned = caloriesConsumed > 1300;
  const protein = isScanned ? 110 : 85;
  const carbs = isScanned ? 245 : 180;
  const fat = isScanned ? 60 : 45;

  return (
    <div className="screen-content animate-slide-up">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="title-large" style={{ fontWeight: 800 }}>FitMate</h2>
          <p className="subtitle">Chào mừng trở lại, Hùng 👋</p>
        </div>
        <div className="glass-card" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          padding: '6px 12px', 
          borderRadius: '12px',
          borderColor: 'rgba(255, 87, 34, 0.2)' 
        }} onClick={() => setStreak(s => s + 1)}>
          <Flame color="var(--accent-orange)" fill="var(--accent-orange)" size={18} />
          <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-orange)' }}>{streak} ngày</span>
        </div>
      </div>

      {/* Calorie Stats Card */}
      <div className="glass-card highlight-green" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div className="progress-ring-container">
          <svg width="100" height="100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="var(--accent-green)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.8s ease-in-out',
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%'
              }}
            />
          </svg>
          <div className="progress-ring-text">
            <span className="progress-ring-val">{caloriesConsumed}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>/ {calTarget} kcal</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <span className="subtitle">Năng lượng nạp vào</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-green)' }}>
                {calTarget - caloriesConsumed}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>kcal còn lại</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', fontSize: '11px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)' }}>Đạm</div>
              <div style={{ fontWeight: 600 }}>{protein}g / {proteinTarget}g</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)' }}>Tinh bột</div>
              <div style={{ fontWeight: 600 }}>{carbs}g / {carbsTarget}g</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)' }}>Béo</div>
              <div style={{ fontWeight: 600 }}>{fat}g / {fatTarget}g</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }} onClick={() => setScreen('nutrition')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ padding: '6px', borderRadius: '10px', background: 'rgba(57, 255, 20, 0.1)', color: 'var(--accent-green)' }}>
              <Zap size={16} />
            </div>
            <ArrowUpRight size={14} color="var(--text-secondary)" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700 }}>Quét Bữa Ăn</span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>AI Scan Calo qua ảnh</span>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }} onClick={() => setScreen('workout')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ padding: '6px', borderRadius: '10px', background: 'rgba(255, 87, 34, 0.1)', color: 'var(--accent-orange)' }}>
              <TrendingUp size={16} />
            </div>
            <ArrowUpRight size={14} color="var(--text-secondary)" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700 }}>Lịch Luyện Tập</span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Kế hoạch AI thích ứng</span>
        </div>
      </div>

      {/* Gamified Checklist */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="title-medium" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Nhiệm vụ hôm nay
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600 }}>
            {tasks.filter(t => t.completed).length}/{tasks.length} Hoàn thành
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.map(task => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {task.completed ? (
                <CheckCircle2 size={18} color="var(--accent-green)" />
              ) : (
                <Circle size={18} color="var(--text-secondary)" />
              )}
              <span style={{ 
                fontSize: '13px', 
                color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                textDecoration: task.completed ? 'line-through' : 'none'
              }}>
                {task.text}
              </span>
            </div>
          ))}
        </div>

        {tasks.every(t => t.completed) && (
          <div className="animate-pulse-slow" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(57, 255, 20, 0.1)',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid rgba(57, 255, 20, 0.3)',
            marginTop: '4px'
          }}>
            <Trophy size={16} color="var(--accent-green)" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-green)' }}>
              Đã nhận thưởng hôm nay! +10 XP & +1 ngày Streak 🔥
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
