import React, { useState, useEffect } from 'react';
import { Home, Camera, Calendar, MessageSquare, Battery, Wifi, Signal } from 'lucide-react';
import Dashboard from './components/Dashboard';
import NutritionVision from './components/NutritionVision';
import WorkoutPlanner from './components/WorkoutPlanner';
import CompanionAndMarketplace from './components/CompanionAndMarketplace';

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [caloriesConsumed, setCaloriesConsumed] = useState(1250);
  const [streak, setStreak] = useState(7);
  const [currentTime, setCurrentTime] = useState('09:41');
  
  const [tasks, setTasks] = useState([
    { id: 1, text: "Quét calo bữa trưa với AI Vision", completed: false },
    { id: 2, text: "Tập luyện tối thiểu 15 phút (AI Planner)", completed: false },
    { id: 3, text: "Trò chuyện với AI Companion", completed: false }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, text: "Chào Hùng! Hôm nay bạn cảm thấy thế nào? Bạn đã sẵn sàng hoàn thành mục tiêu chưa? 🎯", sender: 'buddy' }
  ]);

  // Update clock time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const handleCompleteTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, completed: true };
      }
      return t;
    }));
  };

  // Check if all tasks completed to dynamically reward streak
  useEffect(() => {
    if (tasks.length > 0 && tasks.every(t => t.completed)) {
      // Reward streak if not already increased today
      // (For this mock, we just let it increase by 1 if streak is 7)
      if (streak === 7) {
        setStreak(8);
      }
    }
  }, [tasks]);

  const handleAddCalories = (calories) => {
    setCaloriesConsumed(prev => prev + calories);
  };

  const renderActiveScreen = () => {
    switch (screen) {
      case 'dashboard':
        return (
          <Dashboard 
            streak={streak} 
            setStreak={setStreak}
            caloriesConsumed={caloriesConsumed} 
            tasks={tasks}
            toggleTask={handleToggleTask}
            setScreen={setScreen}
          />
        );
      case 'nutrition':
        return (
          <NutritionVision 
            onAddCalories={handleAddCalories}
            onCompleteTask={handleCompleteTask}
          />
        );
      case 'workout':
        return (
          <WorkoutPlanner 
            onCompleteTask={handleCompleteTask}
          />
        );
      case 'companion':
        return (
          <CompanionAndMarketplace 
            messages={messages}
            setMessages={setMessages}
            onCompleteTask={handleCompleteTask}
          />
        );
      default:
        return <Dashboard streak={streak} setStreak={setStreak} caloriesConsumed={caloriesConsumed} tasks={tasks} toggleTask={handleToggleTask} setScreen={setScreen} />;
    }
  };

  return (
    <div className="phone-emulator">
      {/* Notch */}
      <div className="phone-notch">
        <div className="phone-speaker" />
        <div className="phone-camera" />
      </div>

      {/* Status Bar */}
      <div className="phone-status-bar">
        <span>{currentTime}</span>
        <div className="status-right">
          <Signal size={14} color="var(--text-primary)" />
          <Wifi size={14} color="var(--text-primary)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>88%</span>
            <Battery size={16} color="var(--text-primary)" />
          </div>
        </div>
      </div>

      {/* Main App Screens Container */}
      <div className="app-container">
        {renderActiveScreen()}

        {/* Navigation Bar */}
        <div className="bottom-nav">
          <button 
            className={`nav-item ${screen === 'dashboard' ? 'active' : ''}`}
            onClick={() => setScreen('dashboard')}
          >
            <div className="nav-icon-wrapper">
              <Home size={20} />
            </div>
            <span>Trang chủ</span>
          </button>

          <button 
            className={`nav-item ${screen === 'nutrition' ? 'active' : ''}`}
            onClick={() => setScreen('nutrition')}
          >
            <div className="nav-icon-wrapper">
              <Camera size={20} />
            </div>
            <span>Quét món</span>
          </button>

          <button 
            className={`nav-item ${screen === 'workout' ? 'active' : ''}`}
            onClick={() => setScreen('workout')}
          >
            <div className="nav-icon-wrapper">
              <Calendar size={20} />
            </div>
            <span>Lịch tập</span>
          </button>

          <button 
            className={`nav-item ${screen === 'companion' ? 'active' : ''}`}
            onClick={() => setScreen('companion')}
          >
            <div className="nav-icon-wrapper">
              <MessageSquare size={20} />
            </div>
            <span>Trợ lý & PT</span>
          </button>
        </div>
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="home-indicator" />
    </div>
  );
}
