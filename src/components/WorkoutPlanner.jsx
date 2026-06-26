import React, { useState, useEffect } from 'react';
import { Play, Square, Activity, Sparkles, Clock, CheckCircle, Circle, Trophy, ArrowRight, RefreshCw, X, Trash2, GripVertical, Plus } from 'lucide-react';

export default function WorkoutPlanner({ onCompleteTask, onWorkoutComplete, isWorkoutCompleted, setScreen, workoutState, setWorkoutState, dietState, myProfile, onUpdateProfile, showToast }) {
  // Real-time day synchronization helper
  const getTodayString = () => {
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    const mapping = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
    return mapping[dayIndex];
  };

  const [selectedDay, setSelectedDay] = useState(getTodayString());
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

  // Lazy medical survey states
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [customCondition, setCustomCondition] = useState('');
  const [timeSlots, setTimeSlots] = useState(myProfile?.trainingTimes || ['18:00']);
  const [selectedDays, setSelectedDays] = useState(myProfile?.trainingDays || ['Thứ 2', 'Thứ 4', 'Thứ 6']);
  const [activeTimeSlot, setActiveTimeSlot] = useState(myProfile?.trainingTimes?.[0] || '18:00');

  // Keep states in sync with profile updates
  useEffect(() => {
    if (myProfile) {
      if (myProfile.trainingTimes) {
        setTimeSlots(myProfile.trainingTimes);
        if (!myProfile.trainingTimes.includes(activeTimeSlot)) {
          setActiveTimeSlot(myProfile.trainingTimes[0] || '18:00');
        }
      }
      if (myProfile.trainingDays) {
        setSelectedDays(myProfile.trainingDays);
      }
    }
  }, [myProfile]);

  // Lazy trigger: show medical modal if medicalCondition is 'Không có' or empty
  useEffect(() => {
    if (myProfile && (!myProfile.medicalCondition || myProfile.medicalCondition === 'Không có' || myProfile.medicalCondition === 'Chưa cập nhật')) {
      setShowMedicalModal(true);
    }
  }, [myProfile]);

  const medicalConditionList = [
    'Tim mạch',
    'Cao huyết áp',
    'Thoát vị đĩa đệm',
    'Hen suyễn',
    'Đau khớp gối',
    'Tiểu đường',
    'Thiếu máu'
  ];

  const handleSaveMedicalSurvey = () => {
    let finalConditions = [...selectedConditions];
    if (customCondition.trim()) {
      finalConditions.push(customCondition.trim());
    }

    const conditionsString = finalConditions.length > 0 ? finalConditions.join(', ') : 'Không có';
    
    if (onUpdateProfile) {
      onUpdateProfile({ 
        medicalCondition: conditionsString,
        trainingTimes: timeSlots,
        trainingDays: selectedDays
      });
    }

    if (showToast) {
      showToast('Đã lưu hồ sơ y tế, lịch tập & khung giờ tập của bạn! 🩺', 'success');
    }
    setShowMedicalModal(false);
  };

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, '18:00']);
  };

  const handleRemoveTimeSlot = (index) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, idx) => idx !== index));
    }
  };

  const handleTimeSlotChange = (index, value) => {
    const updated = timeSlots.map((ts, idx) => idx === index ? value : ts);
    setTimeSlots(updated);
  };

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
    const shuffled = [...topCandidates].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    const offsets = [
      Math.floor(Math.random() * 6) + 5,   // +5 to +10
      -(Math.floor(Math.random() * 6) + 5), // -5 to -10
      Math.floor(Math.random() * 9) - 4    // -4 to +4
    ];

    return selected.map((ex, idx) => {
      const adjustedCalories = Math.max(targetCalories + offsets[idx], 10);
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
    const key = timeSlots.length > 1 ? `${selectedDay}_${activeTimeSlot}` : selectedDay;
    if (fatigueMode) {
      return adaptiveWorkouts[key] || workouts[key] || workouts[selectedDay] || [];
    }
    return workouts[key] || workouts[selectedDay] || [];
  };

  const updateCurrentWorkouts = (newWorkoutsList) => {
    const key = timeSlots.length > 1 ? `${selectedDay}_${activeTimeSlot}` : selectedDay;
    if (fatigueMode) {
      setAdaptiveWorkouts(prev => ({
        ...prev,
        [key]: newWorkoutsList
      }));
    } else {
      setWorkouts(prev => ({
        ...prev,
        [key]: newWorkoutsList
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

    if (onCompleteTask) onCompleteTask(2); // Complete task ID 2
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

  const handleRequestSwap = (index, exercise) => {
    setSwapTarget({ index, exercise });
    const suggestions = getAiAlternatives(exercise);
    setAiSuggestions(suggestions);
  };

  const handleExecuteSwap = (newExercise) => {
    if (swapTarget === null) return;
    const { index } = swapTarget;
    
    const dayWorkouts = [...currentExercises];
    dayWorkouts[index] = newExercise;
    
    updateCurrentWorkouts(dayWorkouts);

    setSwapTarget(null);
    setAiSuggestions([]);

    setToastMessage("AI đã hoán đổi bài tập thành công! 🔄");
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleAutoPlan = () => {
    setIsAutoPlanning(true);
    
    setTimeout(() => {
      const count = selectedDay === 'Th 5' || selectedDay === 'CN' ? 3 : 4;
      const shuffled = [...exercisePool].sort(() => 0.5 - Math.random());
      
      const newExercises = shuffled.slice(0, count).map(ex => {
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
      setToastMessage("AI đã tự động thiết lập lại lịch tập tối ưu! ⚡");
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
      const lowerPrompt = aiPrompt.toLowerCase();
      const tokens = lowerPrompt.split(/[\s,.-]+/).filter(t => t.length > 0);
      
      if (lowerPrompt.includes("thân dưới") || lowerPrompt.includes("dưới")) {
        tokens.push("chân", "đùi", "mông", "leg", "glute");
      }
      if (lowerPrompt.includes("thân trên") || lowerPrompt.includes("trên")) {
        tokens.push("ngực", "lưng", "vai", "tay", "chest", "back", "shoulder", "arm");
      }
      
      const candidates = exercisePool.map(ex => {
        let score = 0;
        tokens.forEach(token => {
          if (ex.tags.some(tag => tag.toLowerCase().includes(token) || token.includes(tag.toLowerCase()))) {
            score += 2;
          }
          if (ex.name.toLowerCase().includes(token)) {
            score += 1;
          }
        });
        return { ...ex, score };
      });

      const matched = candidates.filter(ex => ex.score > 0).sort((a, b) => b.score - a.score);
      const isHeavy = tokens.some(t => ['nặng', 'heavy', 'sung', 'khoẻ', 'mạnh', 'tối đa', 'high', 'căng'].includes(t));
      const isLight = tokens.some(t => ['nhẹ', 'mệt', 'mỏi', 'yếu', 'phục hồi', 'giãn', 'relax', 'low', 'thả lỏng'].includes(t));

      let finalSelected = [];

      if (matched.length === 0) {
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
          return { name: ex.name, sets: adjustedSets, rest: ex.rest, calories: adjustedCalories };
        });
        setToastMessage("AI không tìm thấy bài tập khớp từ khóa. Đã thiết lập lịch tập ngẫu nhiên! ⚡");
      } else {
        let targetCount = Math.max(4, Math.min(matched.length, 6));
        let selectedTemplates = matched.slice(0, targetCount);

        if (selectedTemplates.length < targetCount) {
          const matchedNames = new Set(selectedTemplates.map(t => t.name.toLowerCase()));
          const remainingPool = exercisePool.filter(ex => !matchedNames.has(ex.name.toLowerCase()));
          const matchedTags = new Set(selectedTemplates.flatMap(t => t.tags));
          const relatedExercises = remainingPool.filter(ex => ex.tags.some(tag => matchedTags.has(tag)));
          const paddingCandidates = relatedExercises.length > 0 ? relatedExercises : remainingPool;
          const shuffledPadding = [...paddingCandidates].sort(() => 0.5 - Math.random());
          
          while (selectedTemplates.length < targetCount && shuffledPadding.length > 0) {
            const padItem = shuffledPadding.pop();
            selectedTemplates.push(padItem);
          }
        }

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

          return { name: ex.name, sets: adjustedSets, rest: ex.rest, calories: adjustedCalories };
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

  const handleSkipWorkout = () => {
    setWorkoutState('skipped');
    if (showToast) {
      showToast('Đã báo bỏ tập hôm nay! FitMate AI đã tự động giảm 300 kcal nạp trong ngày. 🥗', 'orange');
    }
  };

  const isToday = selectedDay === getTodayString();
  const canStart = isToday && !isWorkoutCompleted;

  return (
    <div className="screen-content animate-slide-up" style={{ position: 'relative', paddingBottom: '80px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      
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
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(57, 255, 20, 0.2)'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="title-large" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles color="var(--accent-orange)" size={22} />
            Luyện Tập Thích Ứng
          </h2>
          <p className="subtitle">Lập giáo án AI linh hoạt theo mục tiêu & thể trạng</p>
        </div>
      </div>

      {/* Medical/Injury Profile Summary Block */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: 'rgba(255, 87, 34, 0.15)', background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.03) 0%, rgba(0,0,0,0) 100%)' }}>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Hồ sơ y tế & chấn thương của bạn:</span>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-orange)', marginTop: '2px' }}>
            {myProfile?.medicalCondition || 'Không có'}
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
            Lịch tập: {myProfile?.trainingDays ? myProfile.trainingDays.join(', ') : 'Chưa cài đặt'}
            <br />
            Giờ tập: {myProfile?.trainingTimes ? myProfile.trainingTimes.join(', ') : 'Chưa cài đặt'}
          </div>
        </div>
        <button 
          onClick={() => {
            if (myProfile?.trainingTimes) setTimeSlots(myProfile.trainingTimes);
            if (myProfile?.trainingDays) setSelectedDays(myProfile.trainingDays);
            setShowMedicalModal(true);
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Cập nhật
        </button>
      </div>

      {/* Week Day selector row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', marginTop: '12px' }}>
        {days.map((d) => {
          const isTodayBtn = d.name === getTodayString();
          const isSelected = d.name === selectedDay;
          return (
            <button
              key={d.name}
              onClick={() => {
                if (timerRunning) return;
                setSelectedDay(d.name);
                setShowSummary(false);
              }}
              style={{
                flex: 1,
                height: '38px',
                borderRadius: '10px',
                border: isSelected ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)',
                background: isSelected ? 'rgba(255, 87, 34, 0.12)' : 'rgba(255, 255, 255, 0.01)',
                color: isSelected ? 'var(--accent-orange)' : 'white',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: timerRunning ? 'not-allowed' : 'pointer',
                position: 'relative',
                transition: 'all 0.2s'
              }}
            >
              {d.label}
              {isTodayBtn && (
                <span style={{ position: 'absolute', bottom: '3px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-orange)' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* AI Re-plan prompt block */}
      {!timerRunning && !isWorkoutCompleted && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Vd: Chấn thương cổ tay, đau khớp gối nhẹ..." 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button 
              className="btn-primary" 
              onClick={handleApplyAdaptivePrompt} 
              disabled={isAutoPlanning}
              style={{ width: 'auto', padding: '0 12px', background: 'var(--accent-orange)', color: 'white', fontSize: '11.5px', opacity: isAutoPlanning ? 0.6 : 1 }}
            >
              AI Thích ứng
            </button>
          </div>
        </div>
      )}

      {/* Exercises List container */}
      <div style={{ marginTop: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 700 }}>
            Danh sách bài tập ngày {selectedDay} {timeSlots.length > 1 && `(Ca ${activeTimeSlot})`}
          </span>
          {!timerRunning && !isWorkoutCompleted && (
            <button onClick={handleAutoPlan} style={{ background: 'none', border: 'none', color: 'var(--accent-orange)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RefreshCw size={12} /> AI Thiết lập lại
            </button>
          )}
        </div>

        {/* Horizontal tabs for multiple time slots */}
        {timeSlots.length > 1 && (
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', borderBottom: '1px dashed var(--border-color)' }}>
            {timeSlots.map((slot) => {
              const isActive = activeTimeSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => {
                    if (timerRunning) return;
                    setActiveTimeSlot(slot);
                    setShowSummary(false);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: isActive ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)',
                    background: isActive ? 'rgba(255, 87, 34, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    color: isActive ? 'var(--accent-orange)' : 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: timerRunning ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ⏱️ Ca {slot}
                </button>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {timerRunning ? (
            /* Active Live Timer Workout List */
            activeExercises.map((ex) => (
              <div 
                key={ex.id}
                className="glass-card" 
                onClick={() => toggleExerciseStatus(ex.id)}
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
                  <div style={{ fontSize: '13px', fontWeight: 700, textDecoration: ex.completed ? 'line-through' : 'none', color: ex.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
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
                style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', background: draggedIndex === index ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.01)', opacity: draggedIndex === index ? 0.5 : 1, border: draggedIndex === index ? '1px dashed var(--accent-orange)' : '1px solid var(--border-color)', gap: '10px' }}
              >
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
                
                {!isWorkoutCompleted && (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRequestSwap(index, ex); }}
                      style={{ background: 'rgba(57, 255, 20, 0.05)', border: '1px solid rgba(57, 255, 20, 0.15)', color: 'var(--accent-green)', fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <RefreshCw size={10} /> Đổi bài
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteExercise(index); }}
                      style={{ background: 'rgba(255, 87, 34, 0.05)', border: '1px solid rgba(255, 87, 34, 0.15)', color: 'var(--accent-orange)', padding: '5px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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

      {/* AI Medical citations for workout planner */}
      <div className="glass-card" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', background: 'rgba(255,255,255,0.01)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <h5 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          📚 Nguồn Tham Chiếu Khoa Học & Y Học Thể Thao
        </h5>
        <p style={{ fontSize: '9px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          Các giáo án luyện tập của FitMate tuân thủ tiêu chuẩn an toàn y khoa từ:
          <br />• <strong>Hiệp hội Y học Thể thao Hoa Kỳ (ACSM)</strong> - Hướng dẫn tập luyện lâm sàng.
          <br />• <strong>Hiệp hội Tim mạch Hoa Kỳ (AHA)</strong> - Định mức nhịp tim và cường độ tập.
          <br />• <strong>Khuyến nghị từ Bệnh viện Trung ương Quân đội 108</strong> về tập phục hồi chấn thương cơ xương khớp.
        </p>
      </div>

      {/* Swap suggestions modal */}
      {swapTarget && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(12, 15, 18, 0.95)', zIndex: 1200, borderRadius: '30px', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--accent-green)' }}>Gợi ý bài tập thay thế từ AI</span>
            <button onClick={() => setSwapTarget(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
          <p className="subtitle" style={{ fontSize: '11px' }}>Chọn bài tập được AI đề xuất cho bài: <strong>{swapTarget.exercise.name}</strong></p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {aiSuggestions.map((sug, idx) => (
              <div key={idx} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700 }}>{sug.name}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>{sug.sets} • <span style={{ color: 'var(--accent-orange)' }}>-{sug.calories} kcal</span></div>
                </div>
                <button onClick={() => handleExecuteSwap(sug)} style={{ background: 'var(--accent-green)', border: 'none', color: 'var(--bg-dark)', fontSize: '10.5px', fontWeight: 700, padding: '5px 12px', borderRadius: '8px', cursor: 'pointer' }}>Chọn</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lazy Medical Survey Modal */}
      {showMedicalModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(12, 15, 18, 0.96)',
          zIndex: 3000,
          borderRadius: '30px',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          overflowY: 'auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>🩺</div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-orange)' }}>Khảo Sát Bệnh Lý & Chấn Thương</h4>
            <p className="subtitle" style={{ fontSize: '10.5px', marginTop: '2px' }}>AI của FitMate sẽ tự động điều chỉnh bài tập phù hợp với thể trạng y tế của bạn</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Tích chọn các tình trạng sức khỏe (bệnh nền):</span>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {medicalConditionList.map(condition => {
                const isSelected = selectedConditions.includes(condition);
                return (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedConditions(selectedConditions.filter(c => c !== condition));
                      } else {
                        setSelectedConditions([...selectedConditions, condition]);
                      }
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(255, 87, 34, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      color: isSelected ? 'var(--accent-orange)' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '} {condition}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Chấn thương hoặc lưu ý khác (nếu có):</label>
              <input 
                type="text" 
                placeholder="Vd: Đau mỏi khớp vai, yếu cổ tay, gãy tay cũ..."
                value={customCondition}
                onChange={(e) => setCustomCondition(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  color: 'white',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Days of the week selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Lịch tập luyện mong muốn trong tuần:</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', margin: '4px 0' }}>
                {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((day) => {
                  const label = day === 'Chủ Nhật' ? 'CN' : day.replace('Thứ ', 'T');
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedDays(selectedDays.filter(d => d !== day));
                        } else {
                          setSelectedDays([...selectedDays, day]);
                        }
                      }}
                      style={{
                        flex: 1,
                        height: '32px',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(255, 87, 34, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        color: isSelected ? 'var(--accent-orange)' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center'
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multiple Workout Hours Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Khung giờ tập luyện mong muốn hàng ngày:</label>
                <button
                  type="button"
                  onClick={handleAddTimeSlot}
                  style={{
                    background: 'rgba(57, 255, 20, 0.15)',
                    border: 'none',
                    color: 'var(--accent-green)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <Plus size={10} /> Thêm giờ
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {timeSlots.map((ts, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Clock size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="time"
                        value={ts}
                        onChange={(e) => handleTimeSlotChange(idx, e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '6px 10px 6px 30px',
                          color: 'white',
                          fontSize: '12px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          colorScheme: 'dark'
                        }}
                      />
                    </div>
                    {timeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeSlot(idx)}
                        style={{
                          background: 'rgba(255, 87, 34, 0.15)',
                          border: 'none',
                          color: 'var(--accent-orange)',
                          padding: '6px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSaveMedicalSurvey}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13px',
              background: 'var(--accent-orange)',
              color: 'white',
              cursor: 'pointer',
              marginTop: '12px'
            }}
          >
            Lưu khảo sát sức khỏe 🚀
          </button>
        </div>
      )}

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
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                Chỉ có thể bắt đầu tập bài của ngày hôm nay ({getTodayString()})
              </span>
            </div>
          ) : workoutState === 'skipped' ? (
            /* Skipped Today */
            <div className="glass-card" style={{
              background: 'rgba(255, 87, 34, 0.05)',
              borderColor: 'var(--accent-orange)',
              textAlign: 'center',
              padding: '12px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-orange)' }}>
                Bạn đã báo bỏ buổi tập hôm nay! 🥗
              </span>
            </div>
          ) : (
            /* Can Start */
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleSkipWorkout}
                style={{
                  flex: 1,
                  background: 'rgba(255, 87, 34, 0.1)',
                  border: '1px solid rgba(255, 87, 34, 0.3)',
                  color: 'var(--accent-orange)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '12px'
                }}
              >
                Bỏ tập hôm nay
              </button>
              <button 
                className="btn-primary btn-orange" 
                onClick={startWorkout}
                style={{ flex: 2 }}
              >
                <Play size={16} fill="black" />
                Bắt đầu tập ngay
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
