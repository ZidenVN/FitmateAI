import React, { useState, useEffect } from 'react';
import { Flame, Trophy, ArrowUpRight, TrendingUp, Zap, Menu, X, User, LogOut, Check, MessageCircle } from 'lucide-react';

export default function Dashboard({ 
  streak, 
  setStreak, 
  caloriesConsumed, 
  caloriesBurned = 0,
  workoutSummary = null,
  setScreen,
  onOpenProfile,
  justCompletedWorkout = false,
  setJustCompletedWorkout,
  showToast
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFizzing, setIsFizzing] = useState(false);
  const [showStreakCardCompleted, setShowStreakCardCompleted] = useState(justCompletedWorkout);

  useEffect(() => {
    if (justCompletedWorkout) {
      setShowStreakCardCompleted(true);
      setIsFizzing(false);
      
      const timer1 = setTimeout(() => {
        setIsFizzing(true);
      }, 2500);

      const timer2 = setTimeout(() => {
        setShowStreakCardCompleted(false);
        if (setJustCompletedWorkout) {
          setJustCompletedWorkout(false);
        }
      }, 3500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [justCompletedWorkout]);

  const calTarget = 2400;
  
  // Net calories = Food Consumed - Exercise Burned
  const netCalories = Math.max(caloriesConsumed - caloriesBurned, 0);
  const calPercent = Math.min(Math.round((netCalories / calTarget) * 100), 100);
  
  // Calculate SVG dash offset for calorie ring
  const strokeDashoffset = 251.2 - (251.2 * calPercent) / 100;

  // Macro calculation (adjusted if food scan has occurred)
  const proteinTarget = 130;
  const carbsTarget = 300;
  const fatTarget = 70;
  
  const isScanned = caloriesConsumed > 1250;
  const protein = isScanned ? 110 : 85;
  const carbs = isScanned ? 245 : 180;
  const fat = isScanned ? 60 : 45;

  const handleOpenOwnProfile = () => {
    setDrawerOpen(false);
    onOpenProfile({
      name: 'Hùng (Bạn)',
      role: 'Hội viên',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
      isPt: false,
      isSelf: true
    });
  };

  const handleLogout = () => {
    setDrawerOpen(false);
    if (showToast) {
      showToast('Tính năng Đăng xuất sẽ khả dụng ở phiên bản chính thức!', 'orange');
    }
  };

  return (
    <div className="screen-content animate-slide-up" style={{ position: 'relative' }}>
      
      {/* Drawer Sidebar Menu */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              borderRadius: '30px'
            }}
          />
          {/* Drawer Panel */}
          <div className="animate-slide-in" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '260px',
            height: '100%',
            background: 'var(--bg-card-solid)',
            borderRight: '1px solid var(--border-color)',
            zIndex: 1001,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            borderRadius: '30px 0 0 30px'
          }}>
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--accent-green)' }}>FitMate Menu</span>
              <button 
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* User Info Brief */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60" 
                alt="Hùng Avatar" 
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-green)' }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Hùng (Bạn)</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Hội viên</div>
              </div>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              <button 
                onClick={handleOpenOwnProfile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '8px 4px',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <User size={16} color="var(--accent-green)" />
                Trang cá nhân
              </button>

              <button 
                onClick={() => {
                  setDrawerOpen(false);
                  if (setScreen) setScreen('messenger');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '8px 4px',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <MessageCircle size={16} color="var(--accent-green)" />
                Trò chuyện
              </button>

              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '8px 4px',
                  width: '100%',
                  textAlign: 'left',
                  marginTop: 'auto'
                }}
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => setDrawerOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-color)',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <Menu size={18} />
          </button>
          <div>
            <h2 className="title-large" style={{ fontWeight: 800 }}>FitMate</h2>
            <p className="subtitle">Chào mừng trở lại, Hùng 👋</p>
          </div>
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

      {/* Calorie Stats Card (Net Calorie Display) */}
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
            <span className="progress-ring-val">{netCalories}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>/ {calTarget} net</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <span className="subtitle">Calo ròng còn lại</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-green)' }}>
                {Math.max(calTarget - netCalories, 0)}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>kcal</span>
            </div>
          </div>
          
          {/* Calorie Consumed vs Burned breakdown */}
          <div style={{ display: 'flex', gap: '12px', fontSize: '11px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)' }} />
                Nạp (In)
              </div>
              <div style={{ fontWeight: 700, fontSize: '12px', marginTop: '2px' }}>{caloriesConsumed} kcal</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-orange)' }} />
                Đốt (Out)
              </div>
              <div style={{ fontWeight: 700, fontSize: '12px', marginTop: '2px', color: 'var(--accent-orange)' }}>-{caloriesBurned} kcal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access or Summary */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {workoutSummary ? (
          /* Workout Summary Card shown on Homepage once completed */
          <div className="glass-card highlight-orange" style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderLeftColor: 'var(--accent-orange)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="title-medium" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                <Trophy size={16} color="var(--accent-orange)" />
                Buổi tập hôm nay đã xong!
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--accent-orange)', fontWeight: 700 }}>
                {workoutSummary.time} • -{workoutSummary.calories} kcal
              </span>
            </div>

            {/* AI calculated exercise breakdown list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '12px' }}>
              {workoutSummary.exercises.map((ex, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} color="var(--accent-green)" />
                    {ex.name.split(' ')[0]}
                  </span>
                  <span style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>-{ex.calories} kcal</span>
                </div>
              ))}
            </div>
            <button className="btn-secondary" onClick={() => setScreen('workout')} style={{ width: '100%', fontSize: '11px', padding: '6px' }}>
              Xem chi tiết lịch tập
            </button>
          </div>
        ) : (
          /* Standard Quick Access cards */
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
        )}
      </div>

      {/* Gamified Trophy Tip Card - Stands out when workout is not complete, vanishes after workout completion */}
      {!workoutSummary && (
        <div 
          className="glass-card streak-card-glow" 
          onClick={() => setScreen('workout')}
          style={{ 
            display: 'flex', 
            gap: '10px', 
            background: 'rgba(255, 87, 34, 0.06)', 
            borderColor: 'rgba(255, 87, 34, 0.35)',
            borderWidth: '1.5px',
            boxShadow: '0 0 15px rgba(255, 87, 34, 0.1)',
            cursor: 'pointer'
          }}
        >
          <Trophy size={20} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', background: 'rgba(255, 87, 34, 0.2)', color: 'var(--accent-orange)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                DAILY TARGET
              </span>
              <span style={{ fontSize: '10px', color: 'var(--accent-orange)', fontWeight: 700 }}>Chưa hoàn thành</span>
            </div>
            <h5 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Tích lũy Streak tập luyện</h5>
            <p className="subtitle" style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
              Nhấn vào đây để xem lịch tập. Hoàn thành ít nhất **2 bài tập** để nhận Streak nhé! 🔥
            </p>
          </div>
        </div>
      )}

      {/* Completed Streak Card - Celebration & Dissolving (Fizz-out) */}
      {workoutSummary && showStreakCardCompleted && (
        <div 
          className={`glass-card ${isFizzing ? 'animate-fizz-out' : 'animate-slide-up'}`}
          style={{ 
            display: 'flex', 
            gap: '10px', 
            background: 'rgba(57, 255, 20, 0.08)', 
            borderColor: 'rgba(57, 255, 20, 0.45)',
            borderWidth: '1.5px',
            boxShadow: '0 0 20px rgba(57, 255, 20, 0.15)'
          }}
        >
          <Flame size={20} color="var(--accent-green)" fill="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', background: 'rgba(57, 255, 20, 0.2)', color: 'var(--accent-green)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                HOÀN THÀNH XUẤT SẮC
              </span>
              <span style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 700 }}>+1 Streak ngày! 🔥</span>
            </div>
            <h5 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)' }}>Đã tăng chuỗi Streak!</h5>
            <p className="subtitle" style={{ fontSize: '10.5px', color: 'var(--text-primary)', lineHeight: '1.3' }}>
              Tuyệt vời! Bạn đã tích lũy và kéo dài chuỗi streak ngày hôm nay thành **{streak} ngày**. Giao diện này đang sủi bọt biến mất...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
