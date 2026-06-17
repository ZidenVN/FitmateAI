import React, { useState, useEffect } from 'react';
import { Play, Square, Activity, Sparkles, Clock, CheckCircle, Circle, Trophy, ArrowRight, RefreshCw, X, Trash2, GripVertical } from 'lucide-react';

export default function WorkoutPlanner({ onCompleteTask, onWorkoutComplete, isWorkoutCompleted, setScreen }) {
  const [selectedDay, setSelectedDay] = useState('Th 4'); // Default Wednesday (Today)
  const [fatigueMode, setFatigueMode] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeExercises, setActiveExercises] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  // AI Exercise Swap States
  const [swapTarget, setSwapTarget] = useState(null); // { index, exercise }
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [isAutoPlanning, setIsAutoPlanning] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [adaptiveWorkouts, setAdaptiveWorkouts] = useState({});

  const days = [
    { name: 'Th 2', label: 'T2' },
    { name: 'Th 3', label: 'T3' },
    { name: 'Th 4', label: 'T4' },
    { name: 'Th 5', label: 'T5' },
    { name: 'Th 6', label: 'T6' },
    { name: 'Th 7', label: 'T7' },
    { name: 'CN', label: 'CN' }
  ];

  // Daily unique exercises database stored in state to allow AI Swaps
  const [workouts, setWorkouts] = useState({
    'Th 2': [
      { name: 'Flat Bench Press (Đẩy ngực phẳng)', sets: '4 sets x 10 reps', rest: '90s', calories: 80 },
      { name: 'Tricep Pushdown (Cơ tay sau)', sets: '3 sets x 12 reps', rest: '60s', calories: 50 },
      { name: 'Incline Dumbbell Press (Đẩy ngực trên)', sets: '3 sets x 12 reps', rest: '60s', calories: 70 },
      { name: 'Treadmill Jogging (Chạy bộ nhẹ)', sets: '15 phút', rest: 'Cường độ vừa', calories: 120 }
    ],
    'Th 3': [
      { name: 'Barbell Squat (Gánh đùi sau)', sets: '4 sets x 8 reps', rest: '90s', calories: 100 },
      { name: 'Leg Press (Đạp đùi đúp)', sets: '3 sets x 10 reps', rest: '60s', calories: 80 },
      { name: 'Dumbbell Lunges (Bước chùng chân)', sets: '3 sets x 12 reps', rest: '60s', calories: 70 },
      { name: 'Jump Squats (Bật nhảy tại chỗ)', sets: '3 sets x 15 reps', rest: 'Cường độ cao', calories: 60 }
    ],
    'Th 4': [
      { name: 'Lat Pulldown (Kéo xô lưng)', sets: '4 sets x 10 reps', rest: '90s', calories: 80 },
      { name: 'Dumbbell Rows (Chèo tạ tay)', sets: '3 sets x 12 reps', rest: '60s', calories: 70 },
      { name: 'Weighted Plank (Gồng bụng tạ)', sets: '3 sets x 60 giây', rest: '60s', calories: 50 },
      { name: 'Bicycle Crunches (Đạp xe bụng)', sets: '3 sets x 20 reps', rest: 'Phục hồi', calories: 40 }
    ],
    'Th 5': [
      { name: 'Treadmill Walk (Đi bộ thư giãn)', sets: '20 phút', rest: 'Thả lỏng', calories: 80 },
      { name: 'Yoga Stretching (Căng cơ toàn thân)', sets: '15 phút', rest: 'Phục hồi', calories: 50 },
      { name: 'Foam Rolling (Lăn giãn cơ bắp)', sets: '10 phút', rest: 'Massage', calories: 20 }
    ],
    'Th 6': [
      { name: 'Kettlebell Swings (Vung tạ ấm)', sets: '4 sets x 15 reps', rest: '90s', calories: 90 },
      { name: 'Burpees (Hít đất bật nhảy)', sets: '3 sets x 12 reps', rest: '60s', calories: 80 },
      { name: 'Bodyweight Pull-ups (Hít xà đơn)', sets: '3 sets x Max reps', rest: '60s', calories: 60 },
      { name: 'Mountain Climbers (Leo núi bụng)', sets: '3 sets x 30 giây', rest: 'Cơ bụng', calories: 50 }
    ],
    'Th 7': [
      { name: 'Stationary Cycling (Đạp xe trong nhà)', sets: '20 phút', rest: 'Cơ đùi', calories: 150 },
      { name: 'Jump Rope (Nhảy dây tốc độ)', sets: '3 sets x 2 phút', rest: 'Cardio', calories: 80 },
      { name: 'Shadow Boxing (Đấm bốc giả lập)', sets: '10 phút', rest: 'Đốt mỡ', calories: 70 }
    ],
    'CN': [
      { name: 'Active Recovery Stretching', sets: '20 phút', rest: 'Thư giãn', calories: 60 },
      { name: 'Deep Breathing Meditation', sets: '10 phút', rest: 'Tinh thần', calories: 10 }
    ]
  });

  // Wednesday (Today) Fatigue Mode adapted workouts
  const wednesdayFatigueWorkouts = [
    { name: 'Light Lat Pulldown (Kéo xô nhẹ)', sets: '3 sets x 12 reps (AI giảm tạ)', rest: '90s', calories: 50 },
    { name: 'Light Dumbbell Rows (Chèo tạ nhẹ)', sets: '3 sets x 10 reps (AI giảm tạ)', rest: '60s', calories: 40 },
    { name: 'Planks (Gồng bụng nhẹ)', sets: '3 sets x 30 giây', rest: '60s', calories: 30 },
    { name: 'Full Body Stretching (Căng cơ nhẹ)', sets: '10 phút', rest: 'Thư giãn', calories: 30 }
  ];

  // Dynamic exercise pool representing various movements
  const exercisePool = [
    { name: 'Incline Barbell Bench Press (Đẩy ngực dốc lên)', baseCalories: 85, sets: '4 sets x 10 reps', rest: '90s', tags: ['ngực', 'chest', 'nặng', 'heavy', 'ngực trên', 'sung sức'] },
    { name: 'Chest Fly Machine (Ép ngực bằng máy)', baseCalories: 75, sets: '4 sets x 12 reps', rest: '60s', tags: ['ngực', 'chest', 'vừa', 'medium'] },
    { name: 'Dips (Cơ ngực dưới & Tay sau)', baseCalories: 70, sets: '4 sets x Max reps', rest: '60s', tags: ['ngực', 'tay sau', 'chest', 'tricep', 'nặng', 'heavy', 'sung sức'] },
    { name: 'Overhead Dumbbell Extension (Tay sau qua đầu)', baseCalories: 45, sets: '3 sets x 12 reps', rest: '60s', tags: ['tay sau', 'tricep', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Tricep Dumbbell Kickbacks (Tập tay sau)', baseCalories: 45, sets: '3 sets x 12 reps', rest: '60s', tags: ['tay sau', 'tricep', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Skull Crushers (Nằm đẩy tạ sau đầu)', baseCalories: 55, sets: '3 sets x 10 reps', rest: '60s', tags: ['tay sau', 'tricep', 'vừa', 'medium'] },
    { name: 'Incline Dumbbell Fly (Ngực dốc bay tạ)', baseCalories: 65, sets: '3 sets x 12 reps', rest: '60s', tags: ['ngực', 'chest', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Push-ups (Hít đất truyền thống)', baseCalories: 60, sets: '3 sets x 15 reps', rest: '60s', tags: ['ngực', 'chest', 'nhẹ', 'light', 'tay sau', 'vai', 'mệt mỏi'] },
    { name: 'Decline Dumbbell Press (Đẩy ngực dốc xuống)', baseCalories: 75, sets: '3 sets x 12 reps', rest: '60s', tags: ['ngực', 'chest', 'vừa', 'medium'] },
    { name: 'Bodyweight Pull-ups (Hít xà đơn)', baseCalories: 85, sets: '4 sets x Max reps', rest: '90s', tags: ['lưng', 'xô', 'back', 'nặng', 'heavy', 'sung sức'] },
    { name: 'Bent-over Barbell Row (Gập người chèo tạ)', baseCalories: 85, sets: '4 sets x 10 reps', rest: '60s', tags: ['lưng', 'xô', 'back', 'nặng', 'heavy', 'sung sức'] },
    { name: 'Seated Cable Row (Kéo cáp ngồi)', baseCalories: 75, sets: '4 sets x 12 reps', rest: '60s', tags: ['lưng', 'xô', 'back', 'vừa', 'medium'] },
    { name: 'Single-Arm Dumbbell Row (Kéo tạ một bên)', baseCalories: 65, sets: '3 sets x 12 reps', rest: '60s', tags: ['lưng', 'xô', 'back', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'T-Bar Row (Chèo thanh T lưng xô)', baseCalories: 75, sets: '3 sets x 10 reps', rest: '60s', tags: ['lưng', 'xô', 'back', 'nặng', 'heavy', 'sung sức'] },
    { name: 'Face Pulls (Kéo cáp cơ vai sau)', baseCalories: 60, sets: '3 sets x 15 reps', rest: '60s', tags: ['vai', 'shoulder', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Dumbbell Goblet Squat (Gánh tạ tay)', baseCalories: 90, sets: '4 sets x 12 reps', rest: '90s', tags: ['chân', 'đùi', 'leg', 'nặng', 'heavy', 'sung sức'] },
    { name: 'Bulgarian Split Squat (Squat một chân)', baseCalories: 95, sets: '4 sets x 10 reps', rest: '60s', tags: ['chân', 'đùi', 'leg', 'nặng', 'heavy', 'sung sức'] },
    { name: 'Hack Squat Machine (Đạp tạ máy dốc)', baseCalories: 105, sets: '4 sets x 10 reps', rest: '90s', tags: ['chân', 'đùi', 'leg', 'nặng', 'heavy', 'sung sức'] },
    { name: 'Leg Extensions (Máy đá đùi trước)', baseCalories: 75, sets: '3 sets x 12 reps', rest: '60s', tags: ['chân', 'đùi', 'leg', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Dumbbell Lunges (Bước chùng chân tạ)', baseCalories: 85, sets: '3 sets x 12 reps', rest: '60s', tags: ['chân', 'đùi', 'leg', 'vừa', 'medium'] },
    { name: 'Sumo Deadlift (Tạ đòn mông đùi)', baseCalories: 90, sets: '3 sets x 10 reps', rest: '90s', tags: ['chân', 'đùi', 'mông', 'leg', 'nặng', 'heavy', 'sung sức'] },
    { name: 'Walking Lunges (Bước tiến chùng chân)', baseCalories: 75, sets: '3 sets x 12 reps', rest: '60s', tags: ['chân', 'đùi', 'leg', 'vừa', 'medium'] },
    { name: 'Step-ups (Bước bục gỗ tạ tay)', baseCalories: 65, sets: '3 sets x 12 reps', rest: '60s', tags: ['chân', 'đùi', 'leg', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Glute Bridges (Nằm cầu mông bụng)', baseCalories: 60, sets: '3 sets x 15 reps', rest: '60s', tags: ['mông', 'bụng', 'abs', 'glute', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Box Jumps (Bật nhảy bục gỗ)', baseCalories: 65, sets: '3 sets x 10 reps', rest: '60s', tags: ['chân', 'leg', 'cardio', 'vừa', 'medium'] },
    { name: 'Kettlebell Swings (Vung tạ ấm)', baseCalories: 70, sets: '3 sets x 15 reps', rest: '60s', tags: ['lưng', 'chân', 'cardio', 'vừa', 'medium'] },
    { name: 'Mountain Climbers (Leo núi nhanh)', baseCalories: 55, sets: '3 sets x 30 giây', rest: 'Cardio', tags: ['bụng', 'abs', 'cardio', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Ab Wheel Rollouts (Lăn bánh xe bụng)', baseCalories: 55, sets: '3 sets x 10 reps', rest: '60s', tags: ['bụng', 'abs', 'vừa', 'medium'] },
    { name: 'Hanging Leg Raises (Đu xà nâng gối)', baseCalories: 45, sets: '3 sets x 12 reps', rest: '60s', tags: ['bụng', 'abs', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Side Plank (Plank nghiêng sườn)', baseCalories: 45, sets: '3 sets x 45 giây', rest: '60s', tags: ['bụng', 'abs', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Russian Twists (Xoay hông vặn bụng)', baseCalories: 45, sets: '3 sets x 20 reps', rest: '60s', tags: ['bụng', 'abs', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Lying Leg Raises (Nằm nâng hai chân)', baseCalories: 35, sets: '3 sets x 15 reps', rest: '60s', tags: ['bụng', 'abs', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Dead Bug (Tập cơ bụng sâu)', baseCalories: 35, sets: '3 sets x 12 reps', rest: 'Phục hồi', tags: ['bụng', 'abs', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Elliptical Trainer (Máy chạy toàn thân)', baseCalories: 110, sets: '15 phút', rest: 'Thả lỏng', tags: ['cardio', 'toàn thân', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Rowing Machine (Máy chèo thuyền)', baseCalories: 115, sets: '15 phút', rest: 'Toàn thân', tags: ['cardio', 'toàn thân', 'nặng', 'heavy', 'sung sức'] },
    { name: 'Stationary Cycling (Đạp xe tại chỗ)', baseCalories: 125, sets: '15 phút', rest: 'Cardio', tags: ['cardio', 'vừa', 'medium'] },
    { name: 'Incline Walking (Đi bộ leo dốc máy)', baseCalories: 85, sets: '20 phút', rest: 'Nhẹ nhàng', tags: ['cardio', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Elliptical Slow Pace (Chạy máy chậm)', baseCalories: 75, sets: '20 phút', rest: 'Phục hồi', tags: ['cardio', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Leisure Cycling (Đạp xe nhẹ nhàng)', baseCalories: 75, sets: '20 phút', rest: 'Thư giãn', tags: ['cardio', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Elliptical Cardio (Máy tập toàn thân)', baseCalories: 140, sets: '20 phút', rest: 'Thả lỏng', tags: ['cardio', 'nặng', 'heavy', 'sung sức'] },
    { name: 'Stair Climber (Máy leo cầu thang)', baseCalories: 160, sets: '12 phút', rest: 'Cơ đùi', tags: ['cardio', 'chân', 'nặng', 'heavy', 'sung sức'] },
    { name: 'Kettlebell Halos (Cơ vai & bụng)', baseCalories: 50, sets: '3 sets x 12 reps', rest: '60s', tags: ['vai', 'bụng', 'abs', 'shoulder', 'nhẹ', 'light', 'mệt mỏi'] },
    { name: 'Dumbbell Bicep Curls (Cuốn bắp tay trước)', baseCalories: 45, sets: '3 sets x 12 reps', rest: '60s', tags: ['tay trước', 'tay', 'nhẹ', 'light', 'mệt mỏi'] }
  ];

  // Dynamically suggest AI alternatives based on target calories (+/- 5 to 10 kcal)
  const getAiAlternatives = (targetEx) => {
    const targetCalories = targetEx.calories || 60;
    const targetName = targetEx.name;

    // Filter out same exercise
    const candidates = exercisePool.filter(ex => ex.name.toLowerCase() !== targetName.toLowerCase());

    // Sort by calorie closeness
    candidates.sort((a, b) => Math.abs(a.baseCalories - targetCalories) - Math.abs(b.baseCalories - targetCalories));

    // Take top 6 closest to ensure variety, then pick 3
    const topCandidates = candidates.slice(0, 6);
    // Shuffle and pick 3
    const shuffled = [...topCandidates].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    // Apply the user's requested variation: 5 to 10 calories up/down
    const offsets = [
      Math.floor(Math.random() * 6) + 5,   // +5 to +10
      -(Math.floor(Math.random() * 6) + 5), // -5 to -10
      Math.floor(Math.random() * 9) - 4    // -4 to +4
    ];

    // Map selected templates to the target adjusted calories
    return selected.map((ex, idx) => {
      const adjustedCalories = Math.max(targetCalories + offsets[idx], 10); // Don't let calories go below 10
      
      // Adjust sets/reps slightly based on the calorie difference
      let adjustedSets = ex.sets;
      if (offsets[idx] > 0 && ex.sets.includes('reps')) {
        adjustedSets = ex.sets.replace(/(\d+)\s*reps/, (match, reps) => `${parseInt(reps) + 2} reps`);
      } else if (offsets[idx] < 0 && ex.sets.includes('reps')) {
        adjustedSets = ex.sets.replace(/(\d+)\s*reps/, (match, reps) => `${Math.max(parseInt(reps) - 2, 6)} reps`);
      }

      return {
        name: ex.name,
        sets: adjustedSets,
        rest: ex.rest,
        calories: adjustedCalories
      };
    });
  };

  // Get current day's exercises
  const getDailyExercises = () => {
    if (fatigueMode) {
      return adaptiveWorkouts[selectedDay] || workouts[selectedDay] || [];
    }
    return workouts[selectedDay] || [];
  };

  const updateCurrentWorkouts = (newWorkoutsList) => {
    if (fatigueMode) {
      setAdaptiveWorkouts(prev => ({
        ...prev,
        [selectedDay]: newWorkoutsList
      }));
    } else {
      setWorkouts(prev => ({
        ...prev,
        [selectedDay]: newWorkoutsList
      }));
    }
  };

  const currentExercises = getDailyExercises();

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
    const initialized = currentExercises.map((ex, idx) => ({
      ...ex,
      id: idx,
      completed: false
    }));
    setActiveExercises(initialized);
    setTimerRunning(true);
    setShowSummary(false);
  };

  const toggleExerciseStatus = (id) => {
    const updated = activeExercises.map(ex => {
      if (ex.id === id) {
        return { ...ex, completed: !ex.completed };
      }
      return ex;
    });
    setActiveExercises(updated);

    if (updated.every(ex => ex.completed)) {
      finishWorkout(updated, seconds);
    }
  };

  const finishWorkout = (exercisesList, timeInSeconds) => {
    setTimerRunning(false);
    const completedList = exercisesList.filter(ex => ex.completed);
    const totalCal = completedList.reduce((sum, ex) => sum + ex.calories, 0);
    const timeFormatted = formatTime(timeInSeconds);

    const summary = {
      time: timeFormatted,
      calories: totalCal,
      exercises: completedList
    };

    setSummaryData(summary);
    setShowSummary(true);

    onCompleteTask(2); // Complete task ID 2: Tập luyện
    if (onWorkoutComplete) {
      onWorkoutComplete(summary);
    }
  };

  const stopWorkoutManually = () => {
    finishWorkout(activeExercises, seconds);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Trigger AI suggestions modal
  const handleRequestSwap = (index, exercise) => {
    setSwapTarget({ index, exercise });
    const suggestions = getAiAlternatives(exercise);
    setAiSuggestions(suggestions);
  };

  // Perform exercise swap inline without alerts
  const handleExecuteSwap = (newExercise) => {
    if (swapTarget === null) return;
    const { index } = swapTarget;
    
    // Update current day's workouts
    const dayWorkouts = [...currentExercises];
    dayWorkouts[index] = newExercise;
    
    updateCurrentWorkouts(dayWorkouts);

    setSwapTarget(null);
    setAiSuggestions([]);

    // Inline Toast instead of browser alert
    setToastMessage("AI đã hoán đổi bài tập thành công! 🔄");
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleAutoPlan = () => {
    setIsAutoPlanning(true);
    
    // Simulate AI thinking and calculation
    setTimeout(() => {
      // Pick 3-4 random, distinct exercises from the pool for the current day
      const count = selectedDay === 'Th 5' || selectedDay === 'CN' ? 3 : 4;
      const shuffled = [...exercisePool].sort(() => 0.5 - Math.random());
      
      const newExercises = shuffled.slice(0, count).map(ex => {
        // Vary calories slightly from base calories (+/- 5 to 10 kcal)
        const offset = (Math.floor(Math.random() * 6) + 5) * (Math.random() > 0.5 ? 1 : -1); 
        return {
          name: ex.name,
          sets: ex.sets,
          rest: ex.rest,
          calories: Math.max(ex.baseCalories + offset, 15)
        };
      });

      updateCurrentWorkouts(newExercises);

      setIsAutoPlanning(false);

      // Show toast
      setToastMessage("AI đã tự động thiết lập lại lịch tập tối ưu cho hôm nay! ⚡");
      setTimeout(() => setToastMessage(""), 3000);
    }, 1200);
  };

  const handleDeleteExercise = (index) => {
    const dayWorkouts = [...currentExercises];
    if (dayWorkouts.length <= 2) {
      setToastMessage("Mỗi ngày cần duy trì tối thiểu 2 bài tập để đảm bảo hiệu quả! ⚠️");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    
    dayWorkouts.splice(index, 1);
    updateCurrentWorkouts(dayWorkouts);
    setToastMessage("Đã xóa bài tập khỏi danh sách! 🗑️");
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const dayWorkouts = [...currentExercises];
    const draggedItem = dayWorkouts[draggedIndex];
    dayWorkouts.splice(draggedIndex, 1);
    dayWorkouts.splice(targetIndex, 0, draggedItem);
    updateCurrentWorkouts(dayWorkouts);
    setDraggedIndex(null);
    setToastMessage("Đã thay đổi thứ tự bài tập! ↕️");
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleApplyAdaptivePrompt = () => {
    if (!aiPrompt.trim()) {
      setToastMessage("Vui lòng nhập thể trạng hoặc mục tiêu tập luyện! ✍️");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    setIsAutoPlanning(true);

    setTimeout(() => {
      // Split user input into lowercase word tokens
      const lowerPrompt = aiPrompt.toLowerCase();
      const tokens = lowerPrompt.split(/[\s,.-]+/).filter(t => t.length > 0);
      
      // Concept expansions / Synonyms mapping
      if (lowerPrompt.includes("thân dưới") || lowerPrompt.includes("dưới")) {
        tokens.push("chân", "đùi", "mông", "leg", "glute");
      }
      if (lowerPrompt.includes("thân trên") || lowerPrompt.includes("trên")) {
        tokens.push("ngực", "lưng", "vai", "tay", "chest", "back", "shoulder", "arm");
      }
      
      // Calculate match score for every exercise in our pool
      const candidates = exercisePool.map(ex => {
        let score = 0;
        tokens.forEach(token => {
          // Check if token matches exercise tags
          if (ex.tags.some(tag => tag.toLowerCase().includes(token) || token.includes(tag.toLowerCase()))) {
            score += 2;
          }
          // Check if token matches exercise name
          if (ex.name.toLowerCase().includes(token)) {
            score += 1;
          }
        });
        return { ...ex, score };
      });

      // Filter to candidates with score > 0, sorted by score descending
      const matched = candidates.filter(ex => ex.score > 0).sort((a, b) => b.score - a.score);

      // Determine intensity based on keywords in the prompt
      const isHeavy = tokens.some(t => ['nặng', 'heavy', 'sung', 'khoẻ', 'mạnh', 'tối đa', 'high', 'căng'].includes(t));
      const isLight = tokens.some(t => ['nhẹ', 'mệt', 'mỏi', 'yếu', 'phục hồi', 'giãn', 'relax', 'low', 'thả lỏng'].includes(t));

      let finalSelected = [];

      if (matched.length === 0) {
        // Fallback: if no keywords match, pick 5 random exercises from the pool
        const shuffled = [...exercisePool].sort(() => 0.5 - Math.random());
        finalSelected = shuffled.slice(0, 5).map(ex => {
          let adjustedCalories = ex.baseCalories;
          let adjustedSets = ex.sets;
          if (isHeavy) {
            adjustedCalories += 15;
            if (ex.sets.includes('reps')) {
              adjustedSets = ex.sets.replace(/(\d+)\s*reps/, (match, reps) => `${parseInt(reps) + 2} reps`);
            }
          } else if (isLight) {
            adjustedCalories = Math.max(ex.baseCalories - 15, 15);
            adjustedSets = ex.sets.replace('sets', 'sets (nhẹ)').replace(/(\d+)\s*reps/, (match, reps) => `${Math.max(parseInt(reps) - 2, 6)} reps`);
          }
          return {
            name: ex.name,
            sets: adjustedSets,
            rest: ex.rest,
            calories: adjustedCalories
          };
        });
        setToastMessage("AI không tìm thấy bài tập khớp từ khóa. Đã thiết lập lịch tập ngẫu nhiên! ⚡");
      } else {
        // Target count is dynamic between 4 and 6 exercises based on matches
        let targetCount = Math.max(4, Math.min(matched.length, 6));

        // Take the top matched templates
        let selectedTemplates = matched.slice(0, targetCount);

        // If the matching templates are fewer than targetCount (e.g. matched 2 but target is 4), pad list
        if (selectedTemplates.length < targetCount) {
          const matchedNames = new Set(selectedTemplates.map(t => t.name.toLowerCase()));
          const remainingPool = exercisePool.filter(ex => !matchedNames.has(ex.name.toLowerCase()));
          
          // Pad with related exercises sharing tags
          const matchedTags = new Set(selectedTemplates.flatMap(t => t.tags));
          const relatedExercises = remainingPool.filter(ex => ex.tags.some(tag => matchedTags.has(tag)));
          
          const paddingCandidates = relatedExercises.length > 0 ? relatedExercises : remainingPool;
          const shuffledPadding = [...paddingCandidates].sort(() => 0.5 - Math.random());
          
          while (selectedTemplates.length < targetCount && shuffledPadding.length > 0) {
            const padItem = shuffledPadding.pop();
            selectedTemplates.push(padItem);
          }
        }

        // Apply intensity adjustments to final selected list
        finalSelected = selectedTemplates.map(ex => {
          let adjustedCalories = ex.baseCalories;
          let adjustedSets = ex.sets;

          if (isHeavy) {
            adjustedCalories += 15;
            if (ex.sets.includes('reps')) {
              adjustedSets = ex.sets.replace(/(\d+)\s*reps/, (match, reps) => `${parseInt(reps) + 2} reps`);
            }
          } else if (isLight) {
            adjustedCalories = Math.max(ex.baseCalories - 15, 15);
            adjustedSets = ex.sets.replace('sets', 'sets (nhẹ)').replace(/(\d+)\s*reps/, (match, reps) => `${Math.max(parseInt(reps) - 2, 6)} reps`);
          }

          return {
            name: ex.name,
            sets: adjustedSets,
            rest: ex.rest,
            calories: adjustedCalories
          };
        });

        setToastMessage(`AI Adaptive: Đã lên lịch ${finalSelected.length} bài tập phù hợp! 🎯`);
      }

      setAdaptiveWorkouts(prev => ({
        ...prev,
        [selectedDay]: finalSelected
      }));

      setIsAutoPlanning(false);
      setTimeout(() => setToastMessage(""), 3500);
    }, 1200);
  };

  // Validation conditions
  const isToday = selectedDay === 'Th 4';
  const canStart = isToday && !isWorkoutCompleted;

  return (
    <div className="screen-content animate-slide-up" style={{ position: 'relative' }}>
      
      {/* Inline Toast Banner */}
      {toastMessage && (
        <div className="animate-slide-up" style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          background: 'var(--bg-card-solid)',
          border: '1px solid var(--accent-green)',
          color: 'var(--text-primary)',
          padding: '12px 16px',
          borderRadius: '14px',
          fontSize: '13px',
          fontWeight: 600,
          textAlign: 'left',
          zIndex: 1005,
          boxShadow: '0 8px 32px rgba(57, 255, 20, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'rgba(57, 255, 20, 0.15)', 
            borderRadius: '50%', 
            padding: '4px' 
          }}>
            <CheckCircle size={14} color="var(--accent-green)" />
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Modal: AI Exercise Swap Suggestions */}
      {swapTarget && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(12, 15, 18, 0.95)',
          zIndex: 1002,
          borderRadius: '30px',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--accent-green)' }}>AI Adaptive Swap</span>
            <button 
              onClick={() => setSwapTarget(null)}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>

          <div>
            <span className="subtitle" style={{ fontSize: '10px' }}>Bài gốc cần thay thế:</span>
            <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>{swapTarget.exercise.name}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>AI Gợi ý thay thế phù hợp:</span>
            
            {aiSuggestions.map((sug, idx) => (
              <div 
                key={idx}
                className="glass-card highlight-green" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '6px', 
                  cursor: 'pointer',
                  borderColor: 'rgba(57, 255, 20, 0.2)' 
                }}
                onClick={() => handleExecuteSwap(sug)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>{sug.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-orange)', fontWeight: 700 }}>-{sug.calories} kcal</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                  {sug.sets} • Nghỉ {sug.rest}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Modal: Summary Deficit Calorie */}
      {showSummary && summaryData && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(12, 15, 18, 0.95)',
          zIndex: 1000,
          borderRadius: '30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px 20px',
          gap: '16px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 87, 34, 0.1)',
            color: 'var(--accent-orange)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '2px solid var(--accent-orange)'
          }}>
            <Trophy size={32} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h3 className="title-medium" style={{ fontSize: '18px' }}>
              {summaryData.exercises.length === activeExercises.length ? "Buổi tập trọn vẹn! 🏆" : "Hoàn thành sớm! ⏱️"}
            </h3>
            
            {/* Inline Streak Reward Feedback inside Modal */}
            {summaryData.exercises.length >= 2 ? (
              <p style={{ color: 'var(--accent-green)', fontSize: '12.5px', fontWeight: 700, marginTop: '6px', background: 'rgba(57, 255, 20, 0.1)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block' }}>
                Đã cộng +1 ngày Streak tập luyện! 🔥
              </p>
            ) : (
              <p style={{ color: 'var(--accent-orange)', fontSize: '11px', marginTop: '6px', background: 'rgba(255, 87, 34, 0.1)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', fontWeight: 600 }}>
                Tập thêm {2 - summaryData.exercises.length} bài nữa để nhận Streak nhé! 💪
              </p>
            )}
          </div>

          {/* Stats Box */}
          <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center', margin: '8px 0' }}>
            <div className="glass-card" style={{ flex: 1, textAlign: 'center', padding: '12px 6px' }}>
              <span className="subtitle" style={{ fontSize: '9px' }}>Thời gian</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'white', marginTop: '2px' }}>
                {summaryData.time}
              </div>
            </div>
            <div className="glass-card" style={{ flex: 1, textAlign: 'center', padding: '12px 6px', borderColor: 'var(--accent-orange)' }}>
              <span className="subtitle" style={{ fontSize: '9px' }}>Calo tiêu hao</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-orange)', marginTop: '2px' }}>
                -{summaryData.calories} kcal
              </div>
            </div>
          </div>

          {/* Exercises Deficit Breakdown List */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Báo cáo thâm hụt từng bài:</span>
            {summaryData.exercises.map((ex, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                padding: '6px 10px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <span style={{ color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                  {ex.name}
                </span>
                <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>-{ex.calories} kcal</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '10px' }}>
            <button 
              className="btn-primary btn-orange" 
              onClick={() => {
                setShowSummary(false);
                if (setScreen) setScreen('dashboard');
              }} 
              style={{ width: '100%' }}
            >
              Về Trang chủ (Xem Streak)
              <ArrowRight size={16} />
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => setShowSummary(false)} 
              style={{ width: '100%', padding: '10px' }}
            >
              Xem lại Lịch tập
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <h2 className="title-large" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity color="var(--accent-orange)" size={22} />
          AI Workout Planner
        </h2>
        <p className="subtitle">Lập lịch tập thích ứng 24/7 dựa trên thể trạng</p>
      </div>

      {/* Week Calendar Ribbon (Disabled if training) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', opacity: timerRunning ? 0.5 : 1, pointerEvents: timerRunning ? 'none' : 'auto' }}>
        {days.map((day) => (
          <button
            key={day.name}
            onClick={() => {
              setSelectedDay(day.name);
              setAiPrompt('');
            }}
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
          borderColor: fatigueMode ? 'rgba(57, 255, 20, 0.3)' : 'var(--border-color)',
          opacity: timerRunning ? 0.5 : 1,
          pointerEvents: timerRunning ? 'none' : 'auto'
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
              onChange={() => {
                const next = !fatigueMode;
                setFatigueMode(next);
                if (!next) {
                  setAiPrompt('');
                }
              }}
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
              AI Adaptive đang kích hoạt. Hãy nhập thể trạng hoặc vùng cơ muốn tập ở dưới để AI phân tích và tự động lên lịch tập!
            </span>
          </div>
        ) : (
          <p className="subtitle" style={{ fontSize: '11px' }}>
            AI sẽ tự điều chỉnh bài tập dựa theo thể trạng, nhóm cơ và phương pháp tập mong muốn của bạn.
          </p>
        )}

        {fatigueMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
            <label style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Nhập thể trạng, mục tiêu (Ví dụ: mệt mỏi tập bụng nhẹ, vai lưng nặng sung sức...):
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ví dụ: mệt mỏi, tập bụng nhẹ nhàng..."
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  color: 'white',
                  fontSize: '12.5px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyAdaptivePrompt();
                }}
              />
              <button
                onClick={handleApplyAdaptivePrompt}
                disabled={isAutoPlanning}
                style={{
                  background: 'var(--accent-green)',
                  border: 'none',
                  color: 'var(--bg-dark)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'opacity 0.2s',
                  opacity: isAutoPlanning ? 0.7 : 1
                }}
              >
                {isAutoPlanning ? 'Đang lọc...' : 'Lọc AI'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auto Plan Button */}
      {!timerRunning && !isWorkoutCompleted && (
        <button
          onClick={handleAutoPlan}
          disabled={isAutoPlanning}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '14px',
            border: '1.5px dashed var(--accent-orange)',
            background: 'rgba(255, 87, 34, 0.08)',
            color: 'var(--accent-orange)',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(255, 87, 34, 0.1)',
            transition: 'all 0.2s ease',
            opacity: isAutoPlanning ? 0.7 : 1,
            pointerEvents: isAutoPlanning ? 'none' : 'auto'
          }}
        >
          <Sparkles size={16} className={isAutoPlanning ? 'animate-spin' : ''} />
          {isAutoPlanning ? 'AI đang thiết kế lịch tập tối ưu...' : 'Tự động thiết lịch bằng AI'}
        </button>
      )}

      {/* Exercise List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 700 }}>
            {timerRunning ? 'Bảng kiểm tra buổi tập' : `Danh sách bài tập (${selectedDay})`}
          </span>
          <span className="subtitle" style={{ fontSize: '11px' }}>
            {currentExercises.length} bài tập • ~45 phút
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {timerRunning ? (
            /* Active Training Exercise Checkboxes */
            activeExercises.map((ex) => (
              <div 
                key={ex.id}
                onClick={() => toggleExerciseStatus(ex.id)}
                className="glass-card animate-slide-in"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: ex.completed ? 'rgba(57, 255, 20, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: ex.completed ? 'var(--accent-green)' : 'var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                {ex.completed ? (
                  <CheckCircle size={18} color="var(--accent-green)" />
                ) : (
                  <Circle size={18} color="var(--text-secondary)" />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: 700,
                    textDecoration: ex.completed ? 'line-through' : 'none',
                    color: ex.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                  }}>
                    {ex.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {ex.sets} • <span style={{ color: 'var(--accent-orange)' }}>-{ex.calories} kcal</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Regular Read-only Exercises List */
            currentExercises.map((ex, index) => (
              <div 
                key={index}
                className="glass-card" 
                draggable={!timerRunning && !isWorkoutCompleted}
                onDragStart={(e) => {
                  if (timerRunning || isWorkoutCompleted) return;
                  setDraggedIndex(index);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  if (timerRunning || isWorkoutCompleted) return;
                  handleDrop(index);
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: draggedIndex === index ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.01)',
                  opacity: draggedIndex === index ? 0.5 : 1,
                  cursor: !timerRunning && !isWorkoutCompleted ? 'grab' : 'default',
                  transition: 'opacity 0.2s, background 0.2s',
                  border: draggedIndex === index ? '1px dashed var(--accent-orange)' : '1px solid var(--border-color)',
                  gap: '10px'
                }}
              >
                {/* Drag Handle Icon on the left */}
                {!timerRunning && !isWorkoutCompleted && (
                  <div style={{ color: 'var(--text-secondary)', cursor: 'grab', paddingRight: '4px', display: 'flex', alignItems: 'center' }}>
                    <GripVertical size={14} />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{ex.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span>{ex.sets}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>-{ex.calories} kcal</span>
                  </div>
                </div>
                
                {/* Action Buttons Group */}
                {!isWorkoutCompleted && (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestSwap(index, ex);
                      }}
                      style={{
                        background: 'rgba(57, 255, 20, 0.05)',
                        border: '1px solid rgba(57, 255, 20, 0.15)',
                        color: 'var(--accent-green)',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <RefreshCw size={10} />
                      Đổi bài
                    </button>
                    
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteExercise(index);
                      }}
                      style={{
                        background: 'rgba(255, 87, 34, 0.05)',
                        border: '1px solid rgba(255, 87, 34, 0.15)',
                        color: 'var(--accent-orange)',
                        padding: '5px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      title="Xóa bài tập này"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating/Bottom Action Timer & Disabled States */}
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
            onClick={stopWorkoutManually}
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
        /* Action buttons with validation rules */
        <div style={{ marginTop: 'auto' }}>
          {isWorkoutCompleted && isToday ? (
            /* Completed Today */
            <div className="glass-card" style={{
              background: 'rgba(57, 255, 20, 0.05)',
              borderColor: 'var(--accent-green)',
              textAlign: 'center',
              padding: '12px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-green)' }}>
                Buổi tập hôm nay đã được hoàn thành! 🏆
              </span>
            </div>
          ) : !isToday ? (
            /* Selected day is NOT today */
            <div className="glass-card" style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderColor: 'var(--border-color)',
              textAlign: 'center',
              padding: '12px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Chỉ có thể bắt đầu tập bài của ngày hôm nay (Thứ 4)
              </span>
            </div>
          ) : (
            /* Can Start */
            <button className="btn-primary btn-orange" onClick={startWorkout}>
              <Play size={16} fill="black" />
              Bắt đầu tập ngay
            </button>
          )}
        </div>
      )}
    </div>
  );
}
