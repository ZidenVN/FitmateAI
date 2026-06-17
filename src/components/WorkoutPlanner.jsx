import React, { useState, useEffect } from 'react';
import { Play, Square, Activity, Sparkles, Clock, AlertTriangle } from 'lucide-react';

export default function WorkoutPlanner({ onCompleteTask }) {
  const [selectedDay, setSelectedDay] = useState('Th 4'); // Default Wednesday
  const [fatigueMode, setFatigueMode] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const days = [
    { name: 'Th 2', label: 'T2' },
    { name: 'Th 3', label: 'T3' },
    { name: 'Th 4', label: 'T4' },
    { name: 'Th 5', label: 'T5' },
    { name: 'Th 6', label: 'T6' },
    { name: 'Th 7', label: 'T7' },
    { name: 'CN', label: 'CN' }
  ];

  // Exercises data
  const standardExercises = [
    { name: 'Flat Bench Press (Đẩy ngực phẳng)', sets: '4 sets x 10 reps', duration: '90s rest' },
    { name: 'Incline Dumbbell Fly (Ngực dốc lên)', sets: '3 sets x 12 reps', duration: '60s rest' },
    { name: 'Weighted Push-ups (Hít đất tạ)', sets: '3 sets x 15 reps', duration: '60s rest' },
    { name: 'HIIT Treadmill Running (Chạy bộ)', sets: '15 phút', duration: 'Cường độ cao' }
  ];

  const recoveryExercises = [
    { name: 'Light Dumbbell Press (Đẩy tạ nhẹ)', sets: '3 sets x 12 reps (Tạ nhẹ)', duration: '90s rest' },
    { name: 'Knee Push-ups (Hít đất quỳ gối)', sets: '3 sets x 10 reps', duration: '60s rest' },
    { name: 'Treadmill Incline Walk (Đi bộ dốc)', sets: '20 phút', duration: 'Tốc độ vừa' },
    { name: 'Yoga Stretching (Căng cơ thư giãn)', sets: '10 phút', duration: 'Phục hồi cơ bắp' }
  ];

  const currentExercises = fatigueMode ? recoveryExercises : standardExercises;

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const startWorkout = () => {
    setSeconds(0);
    setTimerRunning(true);
  };

  const stopWorkout = () => {
    setTimerRunning(false);
    onCompleteTask(2); // Complete task ID 2: Tập luyện 30 phút
    alert(`Chúc mừng! Bạn đã hoàn thành buổi tập kéo dài ${formatTime(seconds)}.`);
    setSeconds(0);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="screen-content animate-slide-up">
      {/* Title */}
      <div>
        <h2 className="title-large" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity color="var(--accent-orange)" size={22} />
          AI Workout Planner
        </h2>
        <p className="subtitle">Lập lịch tập thích ứng 24/7 dựa trên thể trạng</p>
      </div>

      {/* Week Calendar Ribbon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
        {days.map((day) => (
          <button
            key={day.name}
            onClick={() => setSelectedDay(day.name)}
            style={{
              flex: 1,
              padding: '12px 6px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: selectedDay === day.name ? 'rgba(255, 87, 34, 0.15)' : 'var(--bg-card)',
              borderColor: selectedDay === day.name ? 'var(--accent-orange)' : 'var(--border-color)',
              color: selectedDay === day.name ? 'var(--accent-orange)' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
          >
            <div>{day.label}</div>
            <div style={{ 
              width: '4px', 
              height: '4px', 
              borderRadius: '50%', 
              background: selectedDay === day.name ? 'var(--accent-orange)' : 'transparent',
              margin: '4px auto 0'
            }} />
          </button>
        ))}
      </div>

      {/* Fatigue Toggle Option */}
      <div 
        className="glass-card" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px',
          borderColor: fatigueMode ? 'rgba(57, 255, 20, 0.3)' : 'var(--border-color)' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Sparkles size={16} color="var(--accent-green)" />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Chế độ mệt mỏi (AI Adaptive)</span>
          </div>
          <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
            <input 
              type="checkbox" 
              checked={fatigueMode} 
              onChange={() => setFatigueMode(!fatigueMode)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              inset: 0,
              backgroundColor: fatigueMode ? 'var(--accent-green)' : '#2d3748',
              borderRadius: '20px',
              transition: '0.4s'
            }}>
              <span style={{
                position: 'absolute',
                content: '""',
                height: '14px',
                width: '14px',
                left: fatigueMode ? '22px' : '3px',
                bottom: '3px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: '0.4s'
              }} />
            </span>
          </label>
        </div>

        {fatigueMode ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '11px', color: 'var(--accent-green)' }}>
            <Sparkles size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>
              AI tự động giảm 30% mức tạ và tăng thời gian phục hồi để tránh quá tải cơ bắp.
            </span>
          </div>
        ) : (
          <p className="subtitle" style={{ fontSize: '11px' }}>
            AI sẽ tự điều chỉnh bài tập nếu hôm nay bạn cảm thấy mệt mỏi hoặc thiếu ngủ.
          </p>
        )}
      </div>

      {/* Exercise List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 700 }}>Danh sách bài tập ({selectedDay})</span>
          <span className="subtitle" style={{ fontSize: '11px' }}>4 bài tập • 45 phút</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentExercises.map((ex, index) => (
            <div 
              key={index}
              className="glass-card" 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.01)'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{ex.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {ex.sets}
                </div>
              </div>
              <span style={{ 
                fontSize: '11px', 
                color: fatigueMode ? 'var(--accent-green)' : 'var(--text-secondary)', 
                background: fatigueMode ? 'rgba(57, 255, 20, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                padding: '4px 8px',
                borderRadius: '8px',
                fontWeight: 600
              }}>
                {ex.duration}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating/Bottom Action Timer */}
      {timerRunning ? (
        <div 
          className="glass-card animate-pulse-slow" 
          style={{ 
            background: 'rgba(255, 87, 34, 0.1)',
            borderColor: 'var(--accent-orange)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '14px 20px',
            borderRadius: '16px',
            marginTop: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="var(--accent-orange)" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'monospace' }}>
                {formatTime(seconds)}
              </div>
              <div className="subtitle" style={{ fontSize: '10px' }}>Buổi tập đang diễn ra</div>
            </div>
          </div>
          <button 
            onClick={stopWorkout}
            style={{
              background: 'var(--accent-orange)',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <Square size={16} fill="white" />
          </button>
        </div>
      ) : (
        <button className="btn-primary btn-orange" onClick={startWorkout} style={{ marginTop: 'auto' }}>
          <Play size={16} fill="black" />
          Bắt đầu tập ngay
        </button>
      )}
    </div>
  );
}
