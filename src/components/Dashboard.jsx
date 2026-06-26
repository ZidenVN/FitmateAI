import React, { useState, useEffect } from 'react';
import { Flame, Trophy, ArrowUpRight, TrendingUp, Zap, Menu, X, User, LogOut, Check, MessageCircle, Calendar, HeartPulse, Mail } from 'lucide-react';

export default function Dashboard({ 
  streak, 
  setStreak, 
  rewardPoints,
  setRewardPoints,
  caloriesConsumed, 
  caloriesBurned = 0,
  workoutSummary = null,
  setScreen,
  onOpenProfile,
  justCompletedWorkout = false,
  setJustCompletedWorkout,
  showToast,
  myProfile,
  onLogout,
  dietState,
  setDietState,
  workoutState,
  setWorkoutState,
  onUpdateProfile
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFizzing, setIsFizzing] = useState(false);
  const [showStreakCardCompleted, setShowStreakCardCompleted] = useState(justCompletedWorkout);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [trophyTab, setTrophyTab] = useState('voucher'); // 'voucher' or 'withdraw'
  
  // Withdraw modal states
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [withdrawCoins, setWithdrawCoins] = useState('');

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

  const calTarget = workoutState === 'skipped' ? 2100 : 2400;
  
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
    onOpenProfile(myProfile);
  };

  const handleLogout = () => {
    setDrawerOpen(false);
    if (onLogout) {
      onLogout();
    } else if (showToast) {
      showToast('Đăng xuất thành công!', 'success');
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
                src={myProfile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60"} 
                alt={`${myProfile?.name || 'User'} Avatar`} 
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-green)' }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{myProfile?.name || 'User'}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{myProfile?.role || 'Hội viên'}</div>
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
                onClick={() => {
                  setDrawerOpen(false);
                  if (setScreen) setScreen('appointments');
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
                <Calendar size={16} color="var(--accent-green)" />
                Lịch hẹn
              </button>

              <button 
                onClick={() => {
                  setDrawerOpen(false);
                  if (setScreen) setScreen('chuyen-sau');
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
                <HeartPulse size={16} color="var(--accent-green)" />
                Chuyên sâu
              </button>

              <button 
                onClick={() => {
                  setDrawerOpen(false);
                  setShowVipModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#ffd700',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '8px 4px',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <Zap size={16} color="#ffd700" fill="#ffd700" />
                Gói VIP Premium 👑
              </button>

              <button 
                onClick={() => {
                  setDrawerOpen(false);
                  setShowSupportModal(true);
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
                <Mail size={16} color="var(--accent-green)" />
                Liên hệ hỗ trợ ✉
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
            <p className="subtitle">Chào mừng trở lại, {myProfile?.name?.replace('(Bạn)', '').trim() || 'Hội viên'} 👋</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Streak Badge */}
          <div className="glass-card" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            padding: '6px 10px', 
            borderRadius: '12px',
            borderColor: 'rgba(255, 87, 34, 0.2)',
            cursor: 'pointer'
          }} onClick={() => {
            setStreak(s => s + 1);
            if (showToast) showToast('Chúc mừng chuỗi phong độ của bạn! 🔥', 'success');
          }}>
            <Flame color="var(--accent-orange)" fill="var(--accent-orange)" size={16} />
            <span style={{ fontWeight: 700, fontSize: '12.5px', color: 'var(--accent-orange)' }}>{streak} ngày</span>
          </div>

          {/* Reward Points Badge */}
          <div className="glass-card" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            padding: '6px 10px', 
            borderRadius: '12px',
            borderColor: 'rgba(255, 215, 0, 0.35)',
            background: 'rgba(255, 215, 0, 0.05)',
            cursor: 'pointer'
          }} onClick={() => setShowWithdrawModal(true)}>
            <Trophy color="#ffd700" fill="#ffd700" size={16} />
            <span style={{ fontWeight: 700, fontSize: '12.5px', color: '#ffd700' }}>{rewardPoints} xu</span>
          </div>
        </div>
      </div>

      {/* AI Adaptive Warning Banners */}
      {workoutState === 'skipped' && (
        <div className="glass-card animate-pulse-slow" style={{ 
          background: 'rgba(255, 87, 34, 0.08)', 
          borderColor: 'rgba(255, 87, 34, 0.35)', 
          color: 'var(--accent-orange)', 
          fontSize: '11.5px', 
          fontWeight: 600, 
          padding: '12px',
          borderRadius: '14px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(255, 87, 34, 0.1)',
          margin: 0
        }}>
          <span style={{ fontSize: '15px' }}>⚠️</span>
          <span style={{ lineHeight: '1.3' }}>
            <strong>AI Cảnh báo:</strong> Hôm nay bạn bỏ tập. FitMate AI đã <strong>giảm 300 kcal</strong> tiêu chuẩn nạp để cân bằng năng lượng.
          </span>
        </div>
      )}

      {dietState === 'skipped_breakfast' && (
        <div className="glass-card animate-pulse-slow" style={{ 
          background: 'rgba(255, 87, 34, 0.08)', 
          borderColor: 'rgba(255, 87, 34, 0.35)', 
          color: 'var(--accent-orange)', 
          fontSize: '11.5px', 
          fontWeight: 600, 
          padding: '12px',
          borderRadius: '14px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(255, 87, 34, 0.1)',
          margin: 0
        }}>
          <span style={{ fontSize: '15px' }}>🩺</span>
          <span style={{ lineHeight: '1.3' }}>
            <strong>AI Khuyên dùng:</strong> Bạn đã bỏ bữa trong lịch trình. Bạn nên <strong>giảm cường độ tập</strong> hôm nay để tránh hạ đường huyết!
          </span>
        </div>
      )}

      {caloriesConsumed > calTarget && (
        <div className="glass-card animate-pulse-slow" style={{ 
          background: 'rgba(57, 255, 20, 0.06)', 
          borderColor: 'rgba(57, 255, 20, 0.25)', 
          color: 'var(--text-primary)', 
          fontSize: '11.5px', 
          fontWeight: 600, 
          padding: '12px',
          borderRadius: '14px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(57, 255, 20, 0.05)',
          margin: 0
        }}>
          <span style={{ fontSize: '15px' }}>🏃‍♂️</span>
          <span style={{ lineHeight: '1.3' }}>
            <strong>AI Đề xuất:</strong> Bạn đã nạp dư thừa calo (+{caloriesConsumed - calTarget} kcal). Hãy tập thêm <strong>15-20 phút Cardio</strong> để giữ thâm hụt!
          </span>
        </div>
      )}

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

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }} onClick={() => setScreen('marketplace')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '6px', borderRadius: '10px', background: 'rgba(47, 128, 237, 0.1)', color: '#2f80ed' }}>
                  <Calendar size={16} />
                </div>
                <ArrowUpRight size={14} color="var(--text-secondary)" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Đặt Lịch PT</span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Thuê PT huấn luyện</span>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }} onClick={() => setScreen('chuyen-sau')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '6px', borderRadius: '10px', background: 'rgba(155, 81, 224, 0.1)', color: '#9b51e0' }}>
                  <HeartPulse size={16} />
                </div>
                <ArrowUpRight size={14} color="var(--text-secondary)" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Chuyên Sâu</span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Y tế, dị ứng & lịch hoạt động</span>
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
              Nhấn vào đây để xem lịch tập. Hoàn thành ít nhất **2 bài tập** để tăng chuỗi Streak khích lệ tinh thần nhé! 🔥
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
              Tuyệt vời! Bạn đã kéo dài chuỗi streak thành **{streak} ngày** để duy trì động lực tập luyện! (Streak tập không quy đổi ra điểm thưởng) 🌟
            </p>
          </div>
        </div>
      )}

      {/* Withdraw & Voucher Modal */}
      {showWithdrawModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(12, 15, 18, 0.97)',
          zIndex: 2000,
          borderRadius: '30px',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          gap: '14px',
          overflowY: 'auto'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '15px', color: '#ffd700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={18} /> Cửa hàng Đổi Thưởng
            </span>
            <button 
              onClick={() => {
                setShowWithdrawModal(false);
                setBankName('');
                setAccountNumber('');
                setAccountName('');
                setWithdrawCoins('');
              }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Balance card */}
          <div className="glass-card" style={{ 
            background: 'rgba(255, 215, 0, 0.04)', 
            borderColor: 'rgba(255, 215, 0, 0.25)', 
            padding: '12px', 
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Số dư xu của bạn</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffd700', marginTop: '2px' }}>{rewardPoints} xu</div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-green)', textAlign: 'right' }}>
              ≈ {(rewardPoints * 100).toLocaleString()} VNĐ
            </div>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '2px' }}>
            <button 
              onClick={() => setTrophyTab('voucher')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: trophyTab === 'voucher' ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
                color: trophyTab === 'voucher' ? '#ffd700' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: 'pointer'
              }}
            >
              🎁 Đổi Voucher
            </button>
            <button 
              onClick={() => setTrophyTab('withdraw')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: trophyTab === 'withdraw' ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
                color: trophyTab === 'withdraw' ? '#ffd700' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: 'pointer'
              }}
            >
              💸 Rút tiền mặt
            </button>
          </div>

          {trophyTab === 'voucher' ? (
            /* Voucher Grid */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
              {[
                { id: 1, title: 'California Fitness Gym', desc: 'Giảm 50% gói tập thử 1 tháng', cost: 150, code: 'CALI50FM', logo: '🔴' },
                { id: 2, title: 'Elite Fitness Center', desc: '7 ngày tập thử miễn phí toàn hệ thống', cost: 200, code: 'ELITE7FM', logo: '🔵' },
                { id: 3, title: 'HLV Mai Xuân Tú', desc: 'Voucher giảm 100k tập kèm PT 1-1', cost: 100, code: 'HLVTU100K', logo: '🏋️‍♂️' },
                { id: 4, title: 'Gymshark Việt Nam', desc: 'Giảm 20% phụ kiện & đồ thể thao', cost: 150, code: 'SHARK20', logo: '🦈' }
              ].map(voucher => (
                <div key={voucher.id} className="glass-card" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderColor: 'rgba(255, 215, 0, 0.15)' }}>
                  <div style={{ fontSize: '24px', background: 'rgba(255,255,255,0.03)', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {voucher.logo}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700 }}>{voucher.title}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>{voucher.desc}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#ffd700', fontWeight: 700 }}>{voucher.cost} xu</span>
                      <button 
                        onClick={() => {
                          if (rewardPoints >= voucher.cost) {
                            setRewardPoints(prev => prev - voucher.cost);
                            showToast(`Đổi thành công! Mã voucher: ${voucher.code}`, 'success');
                          } else {
                            showToast('Bạn không đủ xu để đổi voucher này! ⚠️', 'orange');
                          }
                        }}
                        style={{
                          background: 'var(--accent-green)',
                          border: 'none',
                          color: 'var(--bg-dark)',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Đổi ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Withdraw Form */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              <p className="subtitle" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                Quy đổi 1 xu = 100đ. Số xu tối thiểu có thể rút là 50 xu.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>Ngân hàng / Ví:</label>
                <select 
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    color: 'white',
                    fontSize: '12.5px',
                    outline: 'none'
                  }}
                >
                  <option value="" disabled style={{ background: '#12161a' }}>Chọn Ngân hàng hoặc Ví MoMo</option>
                  <option value="Vietcombank" style={{ background: '#12161a' }}>Vietcombank</option>
                  <option value="Techcombank" style={{ background: '#12161a' }}>Techcombank</option>
                  <option value="MB Bank" style={{ background: '#12161a' }}>MB Bank</option>
                  <option value="Ví MoMo" style={{ background: '#12161a' }}>Ví MoMo</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>Số tài khoản / Số điện thoại:</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: 0912345678"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '12.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>Tên chủ tài khoản (không dấu):</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: NGUYEN VAN A"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '12.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>Số xu muốn rút (tối thiểu 50 xu):</label>
                <input 
                  type="number" 
                  placeholder={`Nhập số xu (tối đa ${rewardPoints})`}
                  value={withdrawCoins}
                  onChange={(e) => setWithdrawCoins(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '12.5px',
                    outline: 'none'
                  }}
                />
                {withdrawCoins && (
                  <span style={{ fontSize: '11px', color: 'var(--accent-orange)', fontWeight: 600, marginTop: '2px' }}>
                    Bạn sẽ nhận được: {(Number(withdrawCoins) * 100).toLocaleString()} VNĐ
                  </span>
                )}
              </div>

              <button 
                type="button"
                disabled={!bankName || !accountNumber || !accountName || !withdrawCoins || Number(withdrawCoins) < 50 || Number(withdrawCoins) > rewardPoints}
                onClick={() => {
                  const coinsToDeduct = Number(withdrawCoins);
                  setRewardPoints(prev => prev - coinsToDeduct);
                  if (showToast) {
                    showToast(`Yêu cầu rút ${(coinsToDeduct * 100).toLocaleString()} VNĐ thành công! Tiền sẽ được chuyển trong 24h.`, 'success');
                  }
                  setShowWithdrawModal(false);
                  setBankName('');
                  setAccountNumber('');
                  setAccountName('');
                  setWithdrawCoins('');
                }}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '13px',
                  marginTop: '12px',
                  background: '#ffd700',
                  color: '#12151c',
                  cursor: 'pointer',
                  opacity: (!bankName || !accountNumber || !accountName || !withdrawCoins || Number(withdrawCoins) < 50 || Number(withdrawCoins) > rewardPoints) ? 0.5 : 1
                }}
              >
                Yêu cầu quy đổi tiền mặt
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIP Premium Upgrade Modal */}
      {showVipModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(12, 15, 18, 0.97)',
          zIndex: 2000,
          borderRadius: '30px',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          gap: '16px',
          overflowY: 'auto'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#ffd700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              👑 Gói VIP Premium FitMate
            </span>
            <button 
              onClick={() => setShowVipModal(false)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p className="subtitle" style={{ fontSize: '11px', lineHeight: '1.4' }}>
              Mở khóa toàn bộ các tính năng AI chuyên sâu và kết nối đội ngũ HLV hàng đầu để thúc đẩy hành trình của bạn!
            </p>
          </div>

          {/* Pricing cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Gói VIP 1 Tháng', price: '99.000đ', savings: null },
              { name: 'Gói VIP 6 Tháng', price: '499.000đ', savings: 'Tiết kiệm 15%' },
              { name: 'Gói VIP 12 Tháng', price: '799.000đ', savings: 'Tiết kiệm 30%' }
            ].map((pkg, idx) => (
              <div key={idx} className="glass-card" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '14px', 
                borderColor: idx === 2 ? '#ffd700' : 'rgba(255,255,255,0.1)',
                background: idx === 2 ? 'rgba(255, 215, 0, 0.03)' : 'rgba(255,255,255,0.01)'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{pkg.name}</div>
                  {pkg.savings && (
                    <span style={{ fontSize: '9px', background: 'rgba(255, 215, 0, 0.2)', color: '#ffd700', padding: '1px 5px', borderRadius: '4px', display: 'inline-block', marginTop: '3px', fontWeight: 700 }}>
                      {pkg.savings}
                    </span>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-green)' }}>{pkg.price}</div>
                  <button 
                    onClick={() => {
                      if (onUpdateProfile) {
                        onUpdateProfile({ role: 'VIP Hội viên' });
                      }
                      showToast(`Nâng cấp VIP Premium (${pkg.name}) thành công! 👑`, 'success');
                      setShowVipModal(false);
                    }}
                    style={{
                      background: idx === 2 ? '#ffd700' : 'rgba(255,255,255,0.06)',
                      border: idx === 2 ? 'none' : '1px solid var(--border-color)',
                      color: idx === 2 ? 'var(--bg-dark)' : 'white',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginTop: '6px'
                    }}
                  >
                    Chọn mua
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Features List */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px' }}>
            <h5 style={{ fontSize: '11.5px', fontWeight: 700, color: '#ffd700' }}>Quyền lợi VIP Premium:</h5>
            {[
              'Phân tích Dinh dưỡng AI nâng cao không giới hạn',
              'Giáo án thích ứng chuyên sâu theo Bệnh lý & Chấn thương',
              'Đặt lịch hẹn không giới hạn với HLV có Tick xanh',
              'Mở khóa phòng chat VIP 1-1 hỗ trợ trực tiếp 24/7'
            ].map((feature, fIdx) => (
              <div key={fIdx} style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Support Modal */}
      {showSupportModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(12, 15, 18, 0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 3000,
          borderRadius: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          gap: '16px'
        }}>
          {/* Header X close button */}
          <button 
            onClick={() => setShowSupportModal(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>

          {/* Large envelope green icon circle */}
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(57, 255, 20, 0.08)',
            border: '2px solid rgba(57, 255, 20, 0.25)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <Mail size={30} color="#39ff14" />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', textAlign: 'center', margin: 0 }}>
            Liên hệ hỗ trợ ✉
          </h3>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.4', margin: '0 10px', maxWidth: '280px' }}>
            Chúng tôi luôn ghi nhận góp ý và hỗ trợ giải đáp mọi thắc mắc của bạn về FitMate!
          </p>

          {/* Support Email Card */}
          <div className="glass-card" style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.02)',
            borderColor: 'rgba(255,255,255,0.08)',
            textAlign: 'center',
            marginTop: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
              EMAIL ĐỘI NGŨ HỖ TRỢ
            </span>
            <span style={{ 
              fontSize: '16px', 
              fontWeight: 800, 
              color: '#39ff14', 
              textShadow: '0 0 10px rgba(57, 255, 20, 0.4)'
            }}>
              phattan13252@gmail.com
            </span>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.4', margin: '6px 10px 0' }}>
            Nhấp nút bên dưới để mở ứng dụng email và gửi phản hồi cho chúng tôi trực tiếp.
          </p>

          {/* Action buttons */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <button 
              onClick={() => {
                window.open('mailto:phattan13252@gmail.com?subject=Yêu cầu hỗ trợ từ FitMate');
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '13px',
                background: 'linear-gradient(90deg, #15ff00 0%, #2aff00 100%)',
                color: 'black',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                boxShadow: '0 4px 15px rgba(57, 255, 20, 0.2)'
              }}
            >
              <Mail size={16} /> Gửi email phản hồi
            </button>

            <button 
              onClick={() => setShowSupportModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '13px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
