import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, Sparkles, AlertCircle, Eye, X, BookOpen, Utensils } from 'lucide-react';

export default function NutritionVision({ onAddCalories, onCompleteTask, dietState, setDietState, workoutState, myProfile, onUpdateProfile, showToast }) {
  const [scanState, setScanState] = useState('idle'); // 'idle', 'scanning', 'scanned', 'saved'
  const [portion, setPortion] = useState(1); // portion size multiplier
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [customAllergy, setCustomAllergy] = useState('');
  
  // Weight Goal state: 'lose' (giảm cân), 'maintain' (giữ cân), 'gain' (tăng cân)
  const [weightGoal, setWeightGoal] = useState('lose');

  const mockFoodDetections = [
    { name: 'Phở Bò Việt Nam', calories: 550, protein: 25, carbs: 65, fat: 15 },
    { name: 'Cơm Tấm Sườn Nướng', calories: 650, protein: 28, carbs: 70, fat: 18 },
    { name: 'Bún Chả Hà Nội', calories: 590, protein: 22, carbs: 68, fat: 16 },
    { name: 'Ức Gà Áp Chảo Gạo Lứt', calories: 420, protein: 35, carbs: 45, fat: 8 },
    { name: 'Salad Cá Hồi Chanh Leo', calories: 380, protein: 30, carbs: 12, fat: 18 }
  ];

  const [selectedMealPhoto, setSelectedMealPhoto] = useState(null);
  const [detectedDish, setDetectedDish] = useState(mockFoodDetections[0]);

  // Interactive Meal Schedule State
  const [mealSchedule, setMealSchedule] = useState({
    'Th 2': { breakfast: { name: 'Bánh mì ốp la', calories: 380 }, lunch: { name: 'Cơm tấm sườn bì', calories: 650 }, dinner: { name: 'Cá hồi áp chảo', calories: 500 } },
    'Th 3': { breakfast: { name: 'Cháo sườn heo', calories: 350 }, lunch: { name: 'Cơm gà xối mỡ', calories: 750 }, dinner: { name: 'Bò bít tết', calories: 600 } },
    'Th 4': { breakfast: { name: 'Hủ tiếu Nam Vang', calories: 450 }, lunch: { name: 'Bún chả Hà Nội', calories: 550 }, dinner: { name: 'Ức gà áp chảo', calories: 380 } },
    'Th 5': { breakfast: { name: 'Bún bò Huế', calories: 520 }, lunch: { name: 'Cơm sườn rim', calories: 680 }, dinner: { name: 'Salad cá ngừ', calories: 320 } },
    'Th 6': { breakfast: { name: 'Bánh cuốn nóng', calories: 400 }, lunch: { name: 'Cơm gà Hải Nam', calories: 640 }, dinner: { name: 'Lẩu thái thập cẩm', calories: 700 } },
    'Th 7': { breakfast: { name: 'Phở bò chín', calories: 550 }, lunch: { name: 'Bánh xèo miền Tây', calories: 650 }, dinner: { name: 'Bún bò Nam Bộ', calories: 500 } },
    'CN': { breakfast: { name: 'Miến gà ta', calories: 380 }, lunch: { name: 'Bò kho bánh mì', calories: 650 }, dinner: { name: 'Canh sườn khoai tây', calories: 420 } }
  });

  // Highlight current day based on real-time
  const getTodayString = () => {
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday, ...
    const mapping = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
    return mapping[dayIndex];
  };
  const [selectedDay, setSelectedDay] = useState(getTodayString());

  // Meal Suggestion state
  const [suggestedAlternative, setSuggestedAlternative] = useState(null);
  const [targetReplaceDay, setTargetReplaceDay] = useState(getTodayString());
  const [targetReplaceMeal, setTargetReplaceMeal] = useState('lunch'); // 'breakfast', 'lunch', 'dinner'

  // Lazy trigger: show allergy modal if allergies is 'Không có' or empty
  useEffect(() => {
    if (myProfile && (!myProfile.allergies || myProfile.allergies === 'Không có' || myProfile.allergies === 'Chưa cập nhật')) {
      setShowAllergyModal(true);
    }
  }, [myProfile]);

  const allergyList = [
    'Sữa & Lactose',
    'Hải sản',
    'Gluten & Lúa mì',
    'Đậu phộng & Hạt',
    'Trứng',
    'Đậu nành',
    'Cá'
  ];

  const handleSaveAllergies = () => {
    let finalAllergies = [...selectedAllergies];
    if (customAllergy.trim()) {
      finalAllergies.push(customAllergy.trim());
    }

    const allergiesString = finalAllergies.length > 0 ? finalAllergies.join(', ') : 'Không có';
    
    if (onUpdateProfile) {
      onUpdateProfile({ allergies: allergiesString });
    }
    
    if (showToast) {
      showToast('Đã cập nhật thông tin dị ứng của bạn! 🛡️', 'success');
    }
    setShowAllergyModal(false);
  };

  const startScan = () => {
    setScanState('scanning');
    setSelectedMealPhoto(null); // Reset to default photo for live camera demo
    setTimeout(() => {
      const randomDish = mockFoodDetections[Math.floor(Math.random() * mockFoodDetections.length)];
      setDetectedDish(randomDish);
      setScanState('scanned');
    }, 2000);
  };

  const handleMealPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedMealPhoto(url);
      setScanState('scanning');
      setTimeout(() => {
        const randomDish = mockFoodDetections[Math.floor(Math.random() * mockFoodDetections.length)];
        setDetectedDish(randomDish);
        setScanState('scanned');
      }, 2000);
    }
  };

  const handleSave = () => {
    const calories = Math.round(detectedDish.calories * portion);
    onAddCalories(calories);
    if (onCompleteTask) onCompleteTask(1); // Complete task ID 1
    setScanState('saved');
    if (showToast) showToast(`Đã ghi nhận +${calories} kcal vào nhật ký! 🍳`, 'success');
  };

  const resetScan = () => {
    setScanState('idle');
    setPortion(1);
    setSelectedMealPhoto(null);
  };

  // AI recommendations pool (越南/Vietnamese dishes)
  const allSuggestedDishes = [
    { name: 'Ức gà áp chảo sốt cam', calories: 340, protein: 32, carbs: 12, fat: 6, tag: 'lose', allergens: ['Gluten & Lúa mì'] },
    { name: 'Salad cá hồi sốt chanh leo', calories: 380, protein: 30, carbs: 8, fat: 16, tag: 'lose', allergens: ['Hải sản', 'Cá'] },
    { name: 'Cháo yến mạch thịt bò bằm', calories: 290, protein: 20, carbs: 32, fat: 8, tag: 'lose', allergens: ['Gluten & Lúa mì'] },
    { name: 'Thịt heo nạc kho trứng cút', calories: 480, protein: 28, carbs: 10, fat: 16, tag: 'maintain', allergens: ['Trứng'] },
    { name: 'Cá quả kho tộ & rau luộc', calories: 420, protein: 26, carbs: 20, fat: 12, tag: 'maintain', allergens: ['Hải sản', 'Cá'] },
    { name: 'Đậu hũ sốt cà chua gạo lứt', calories: 390, protein: 18, carbs: 45, fat: 10, tag: 'lose', allergens: ['Đậu nành'] },
    { name: 'Cơm tấm sườn nướng mỡ hành', calories: 680, protein: 28, carbs: 75, fat: 20, tag: 'gain', allergens: [] },
    { name: 'Bún chả thịt nướng Hà Nội', calories: 590, protein: 24, carbs: 68, fat: 18, tag: 'maintain', allergens: [] },
    { name: 'Súp hải sản nấm hương', calories: 310, protein: 22, carbs: 18, fat: 8, tag: 'lose', allergens: ['Hải sản'] },
    { name: 'Bò xào hành tây cần tỏi', calories: 450, protein: 32, carbs: 14, fat: 16, tag: 'maintain', allergens: [] },
    { name: 'Đùi gà nướng mật ong gạo lứt', calories: 550, protein: 34, carbs: 50, fat: 14, tag: 'gain', allergens: [] }
  ];

  // Filter recommendations based on goal and user allergies
  const getFilteredSuggestions = () => {
    const userAllergyList = myProfile?.allergies ? myProfile.allergies.toLowerCase().split(',').map(s => s.trim()) : [];
    
    return allSuggestedDishes.filter(dish => {
      // Filter by weight goal
      if (weightGoal === 'lose' && dish.tag !== 'lose') return false;
      if (weightGoal === 'gain' && dish.tag !== 'gain') return false;
      if (weightGoal === 'maintain' && dish.tag !== 'maintain' && dish.tag !== 'lose') return false;

      // Filter by allergies
      const hasAllergen = dish.allergens.some(allergen => {
        return userAllergyList.some(userAllergy => userAllergy.includes(allergen.toLowerCase()) || allergen.toLowerCase().includes(userAllergy));
      });

      return !hasAllergen;
    }).slice(0, 3);
  };

  const filteredDishes = getFilteredSuggestions();

  // Replace a meal in schedule
  const handleReplaceMeal = (dish) => {
    const dayData = { ...mealSchedule[targetReplaceDay] };
    const originalCalories = dayData[targetReplaceMeal].calories;
    const diffCalories = dish.calories - originalCalories;

    // Update local schedule
    setMealSchedule(prev => ({
      ...prev,
      [targetReplaceDay]: {
        ...prev[targetReplaceDay],
        [targetReplaceMeal]: { name: dish.name, calories: dish.calories }
      }
    }));

    // If it's today's meal, sync the calorie difference to dashboard
    if (targetReplaceDay === getTodayString()) {
      onAddCalories(diffCalories);
    }

    if (showToast) {
      showToast(`Đã thay thế ${targetReplaceMeal === 'breakfast' ? 'Bữa sáng' : targetReplaceMeal === 'lunch' ? 'Bữa trưa' : 'Bữa tối'} ngày ${targetReplaceDay} bằng: ${dish.name}! 🔄`, 'success');
    }

    // Transition scanState if we are in the scanned workflow
    if (scanState === 'scanned') {
      setScanState('saved');
      if (onCompleteTask) onCompleteTask(1); // Complete task ID 1
    }

    setSuggestedAlternative(null);
  };

  // Skip a meal handler
  const handleSkipMeal = (mealKey) => {
    setDietState('skipped_breakfast'); // set skipped breakfast state globally
    if (showToast) {
      showToast(`Bạn đã báo bỏ bữa! FitMate AI đã cập nhật cảnh báo điều chỉnh tập luyện trên trang chủ. 🩺`, 'orange');
    }
  };

  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'plan'

  return (
    <div className="screen-content animate-slide-up" style={{ paddingBottom: '80px', overflowY: 'auto', height: '100%' }}>
      {/* Title */}
      <div>
        <h2 className="title-large" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles color="var(--accent-green)" size={22} />
          AI Nutrition Vision
        </h2>
      </div>

      {/* Inner Tab Switcher */}
      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '3px',
        gap: '2px'
      }}>
        <button
          onClick={() => setActiveTab('scan')}
          style={{
            flex: 1,
            padding: '8px 0',
            borderRadius: '11px',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'scan' ? 'rgba(57, 255, 20, 0.15)' : 'transparent',
            color: activeTab === 'scan' ? 'var(--accent-green)' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
        >
          📷 Quét Món
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          style={{
            flex: 1,
            padding: '8px 0',
            borderRadius: '11px',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'plan' ? 'rgba(57, 255, 20, 0.15)' : 'transparent',
            color: activeTab === 'plan' ? 'var(--accent-green)' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
        >
          🗓️ AI Thực Đơn
        </button>
      </div>

      {/* ===== TAB 1: QUÉT MÓN ===== */}
      {activeTab === 'scan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>


      {/* Camera Viewfinder Box */}
      <div 
        className="glass-card" 
        style={{ 
          height: '200px', 
          position: 'relative', 
          overflow: 'hidden', 
          padding: 0,
          borderRadius: '24px',
          border: '2px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#15191e'
        }}
      >
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${selectedMealPhoto || "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=60"})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: scanState === 'idle' ? 0.8 : scanState === 'scanning' ? 0.5 : 0.9,
          filter: scanState === 'scanning' ? 'blur(1px)' : 'none',
          transition: 'all 0.5s ease'
        }} />

        <div style={{ position: 'absolute', inset: '15px', border: '1px dashed rgba(57, 255, 20, 0.3)', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -2, left: -2, width: 12, height: 12, borderTop: '3px solid var(--accent-green)', borderLeft: '3px solid var(--accent-green)' }} />
          <div style={{ position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderTop: '3px solid var(--accent-green)', borderRight: '3px solid var(--accent-green)' }} />
          <div style={{ position: 'absolute', bottom: -2, left: -2, width: 12, height: 12, borderBottom: '3px solid var(--accent-green)', borderLeft: '3px solid var(--accent-green)' }} />
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderBottom: '3px solid var(--accent-green)', borderRight: '3px solid var(--accent-green)' }} />
        </div>

        {scanState === 'scanning' && (
          <div style={{ position: 'absolute', left: 0, width: '100%', height: '4px', background: 'linear-gradient(180deg, transparent, var(--accent-green), transparent)', boxShadow: '0 0 15px var(--accent-green)', animation: 'scan 2s infinite linear', zIndex: 10 }} />
        )}

        {scanState === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 12, alignItems: 'center' }}>
            <button className="btn-primary" onClick={startScan} style={{ width: 'auto', padding: '10px 18px', fontSize: '12.5px' }}>
              <Camera size={16} /> Quét Bằng Camera AI
            </button>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>hoặc</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleMealPhotoChange}
              id="meal-photo-selector"
              style={{ display: 'none' }}
            />
            <label 
              htmlFor="meal-photo-selector"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                color: 'var(--accent-green)',
                background: 'rgba(57, 255, 20, 0.08)',
                border: '1px solid rgba(57, 255, 20, 0.2)',
                padding: '6px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Chọn ảnh từ thiết bị 📁
            </label>
          </div>
        )}

        {scanState === 'scanning' && (
          <div style={{ zIndex: 12, textAlign: 'center' }}>
            <div className="animate-pulse-slow" style={{ fontWeight: 800, color: 'var(--accent-green)', fontSize: '13px' }}>AI ĐANG PHÂN TÍCH...</div>
          </div>
        )}

        {scanState === 'scanned' && (
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(12, 15, 18, 0.85)', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', color: 'var(--accent-green)', fontWeight: 700, border: '1px solid rgba(57, 255, 20, 0.2)', zIndex: 12 }}>
            Nhận diện thành công: {detectedDish.name} (95%)
          </div>
        )}

        {scanState === 'saved' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(12, 15, 18, 0.9)', zIndex: 15, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <Check size={24} color="var(--accent-green)" />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: '13px' }}>Đã Lưu Thành Công!</p>
              <p className="subtitle" style={{ fontSize: '10px' }}>Calo đã được đồng bộ vào Dashboard.</p>
            </div>
            <button className="btn-secondary" onClick={resetScan} style={{ padding: '4px 12px', fontSize: '11px' }}>Quét Bữa Khác</button>
          </div>
        )}
      </div>

      {/* Results Detail Form */}
      {scanState === 'scanned' && (
        <div className="glass-card animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700 }}>Thông tin món ăn quét được</h3>
              <span style={{ fontSize: '9px', background: 'rgba(57, 255, 20, 0.1)', color: 'var(--accent-green)', padding: '2px 6px', borderRadius: '6px', fontWeight: 600 }}>1 Tô/Phần tiêu chuẩn</span>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 700, marginTop: '4px' }}>{detectedDish.name}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px 2px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Năng lượng</span>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-green)' }}>{Math.round(detectedDish.calories * portion)} kcal</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px 2px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Đạm (Pro)</span>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{Math.round(detectedDish.protein * portion)}g</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px 2px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Bột (Carb)</span>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{Math.round(detectedDish.carbs * portion)}g</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px 2px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Béo (Fat)</span>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{Math.round(detectedDish.fat * portion)}g</div>
            </div>
          </div>

          {/* Portion Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Khẩu phần ăn thực tế:</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>{portion}x Phần</span>
            </div>
            <input type="range" min="0.5" max="2" step="0.25" value={portion} onChange={(e) => setPortion(parseFloat(e.target.value))} style={{ accentColor: 'var(--accent-green)', width: '100%' }} />
          </div>

          {/* Assign/Replace meal button directly on scan */}
          <div className="glass-card" style={{ padding: '10px', background: 'rgba(57, 255, 20, 0.02)', borderColor: 'rgba(57, 255, 20, 0.1)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '6px', color: 'var(--accent-green)' }}>🔄 Gán nhanh vào lịch ăn hôm nay:</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['breakfast', 'lunch', 'dinner'].map(mKey => (
                <button
                  key={mKey}
                  onClick={() => {
                    const scannedDish = { name: detectedDish.name, calories: Math.round(detectedDish.calories * portion) };
                    const originalCalories = mealSchedule[getTodayString()][mKey].calories;
                    const diffCalories = scannedDish.calories - originalCalories;

                    setMealSchedule(prev => ({
                      ...prev,
                      [getTodayString()]: {
                        ...prev[getTodayString()],
                        [mKey]: scannedDish
                      }
                    }));
                    onAddCalories(diffCalories);
                    if (showToast) showToast(`Đã gán ${detectedDish.name} vào ${mKey === 'breakfast' ? 'Bữa sáng' : mKey === 'lunch' ? 'Bữa trưa' : 'Bữa tối'} hôm nay!`, 'success');
                    setScanState('saved');
                    if (onCompleteTask) onCompleteTask(1);
                  }}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {mKey === 'breakfast' ? 'Sáng' : mKey === 'lunch' ? 'Trưa' : 'Tối'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="btn-secondary" onClick={resetScan} style={{ flex: 1 }}>Hủy</button>
            <button 
              className="btn-primary" 
              onClick={() => {
                setSuggestedAlternative({
                  name: detectedDish.name,
                  calories: Math.round(detectedDish.calories * portion)
                });
              }} 
              style={{ flex: 2 }}
            >
              Gán Lịch & Lưu 🗓️
            </button>
          </div>
        </div>
      )}

      {/* Info Card when scan idle */}
      {activeTab === 'scan' && scanState === 'idle' && (
        <div className="glass-card" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(57, 255, 20, 0.1)',
            color: 'var(--accent-green)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <Eye size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700 }}>Hỗ trợ món ăn Việt Nam</h4>
            <p className="subtitle" style={{ fontSize: '11px', marginTop: '2px' }}>
              CSDL AI của FitMate nhận diện chuẩn các món Việt như Phở, Bánh mì, Cơm tấm, Bún bò...
            </p>
          </div>
        </div>
      )}

        </div>
      )}

      {/* ===== TAB 2: AI THỰC ĐƠN ===== */}
      {activeTab === 'plan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Allergies status box */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: 'rgba(57, 255, 20, 0.1)' }}>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Bộ lọc dị ứng thực phẩm hiện tại:</span>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-orange)', marginTop: '2px' }}>
            {myProfile?.allergies || 'Không có'}
          </div>
        </div>
        <button 
          onClick={() => setShowAllergyModal(true)}
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

      {/* AI Meal Plan & Scheduler */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 700 }}>Lịch Trình Thực Đơn Tuần</span>
          
          {/* Weight goal selector */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1px' }}>
            {['lose', 'maintain', 'gain'].map(g => (
              <button
                key={g}
                onClick={() => setWeightGoal(g)}
                style={{
                  fontSize: '9.5px',
                  padding: '3px 8px',
                  border: 'none',
                  borderRadius: '6px',
                  background: weightGoal === g ? 'rgba(57, 255, 20, 0.15)' : 'transparent',
                  color: weightGoal === g ? 'var(--accent-green)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {g === 'lose' ? 'Giảm cân' : g === 'maintain' ? 'Giữ cân' : 'Tăng cân'}
              </button>
            ))}
          </div>
        </div>

        {/* Days selector row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '3px' }}>
          {Object.keys(mealSchedule).map(day => {
            const isToday = day === getTodayString();
            const isSel = day === selectedDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  flex: 1,
                  height: '34px',
                  borderRadius: '10px',
                  border: isSel ? '1px solid var(--accent-green)' : '1px solid var(--border-color)',
                  background: isSel ? 'rgba(57, 255, 20, 0.12)' : 'rgba(255,255,255,0.01)',
                  color: isSel ? 'var(--accent-green)' : 'white',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {day}
                {isToday && (
                  <span style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-green)' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Meal items */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
            <span style={{ fontWeight: 700 }}>Thực đơn ngày {selectedDay}</span>
            <span style={{ color: 'var(--text-secondary)' }}>Tổng: {mealSchedule[selectedDay].breakfast.calories + mealSchedule[selectedDay].lunch.calories + mealSchedule[selectedDay].dinner.calories} kcal</span>
          </div>

          {[
            { label: 'Bữa Sáng', key: 'breakfast', time: '07:00' },
            { label: 'Bữa Trưa', key: 'lunch', time: '12:30' },
            { label: 'Bữa Tối', key: 'dinner', time: '19:00' }
          ].map(m => {
            const mealItem = mealSchedule[selectedDay][m.key];
            return (
              <div key={m.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{m.label} ({m.time})</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, marginTop: '2px' }}>{mealItem.name}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--accent-green)' }}>{mealItem.calories} kcal</span>
                  
                  {/* Skip meal button */}
                  {selectedDay === getTodayString() && (
                    <button
                      onClick={() => handleSkipMeal(m.key)}
                      style={{
                        background: 'rgba(255, 87, 34, 0.1)',
                        border: 'none',
                        color: 'var(--accent-orange)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '9px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Bỏ bữa
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Dish Suggestions list based on Allergies */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles color="var(--accent-green)" size={14} /> AI Gợi Ý Món Ăn An Toàn & Thích Ứng
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredDishes.map((dish, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderColor: 'rgba(57, 255, 20, 0.15)', background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.02) 0%, rgba(0,0,0,0) 100%)' }}>
              <div>
                <span style={{ fontSize: '9px', background: 'rgba(57, 255, 20, 0.1)', color: 'var(--accent-green)', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                  {weightGoal === 'lose' ? 'Thâm hụt calo' : weightGoal === 'gain' ? 'Thặng dư calo' : 'Cân bằng'}
                </span>
                <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>{dish.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Calo: {dish.calories} kcal • P: {dish.protein}g | C: {dish.carbs}g | F: {dish.fat}g
                </div>
                
                {/* Academic citations */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '8.5px', color: 'var(--text-secondary)' }}>
                  <BookOpen size={10} color="var(--accent-green)" />
                  <span>Nguồn học thuyết: Viện Dinh dưỡng NIN & PubMed ID: 2984501</span>
                </div>
              </div>

              <button
                onClick={() => setSuggestedAlternative(dish)}
                style={{
                  background: 'rgba(57, 255, 20, 0.15)',
                  border: '1px solid rgba(57, 255, 20, 0.3)',
                  color: 'var(--accent-green)',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Gán lịch
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Knowledge Base Citations Section */}
      <div className="glass-card" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(255,255,255,0.01)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <h5 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <BookOpen size={12} color="var(--accent-green)" /> Cơ Sở Tri Thức Y Khoa & Dinh Dưỡng
        </h5>
        <p style={{ fontSize: '9px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          Các gợi ý dinh dưỡng của FitMate được tham chiếu nghiêm ngặt từ CSDL quốc gia và quốc tế, bao gồm:
          <br />• <strong>Viện Dinh dưỡng Quốc gia Việt Nam (NIN)</strong> - Bảng thành phần thực phẩm VN.
          <br />• <strong>Thư viện Y khoa Quốc gia Hoa Kỳ (NCBI / PubMed)</strong> - Các nghiên cứu chuyên sâu về dị ứng.
          <br />• <strong>Tổ chức Y tế Thế giới (WHO)</strong> - Hướng dẫn định mức năng lượng toàn cầu.
        </p>
      </div>

      {/* Lazy Allergy Survey Modal */}
      {showAllergyModal && (
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
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>🛡️</div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-orange)' }}>Khảo Sát Dị Ứng Thực Phẩm</h4>
            <p className="subtitle" style={{ fontSize: '10.5px', marginTop: '2px' }}>AI của FitMate sẽ loại bỏ món ăn gây hại khỏi lịch trình của bạn</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Tích chọn các loại thực phẩm gây dị ứng:</span>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {allergyList.map(allergy => {
                const isSelected = selectedAllergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAllergies(selectedAllergies.filter(a => a !== allergy));
                      } else {
                        setSelectedAllergies([...selectedAllergies, allergy]);
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
                    {isSelected ? '✓ ' : '+ '} {allergy}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Dị ứng khác (nếu có):</label>
              <input 
                type="text" 
                placeholder="Nhập chất gây dị ứng khác của bạn..."
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
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
          </div>

          <button 
            onClick={handleSaveAllergies}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13px',
              background: 'var(--accent-orange)',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Lưu khảo sát dị ứng 🚀
          </button>
        </div>
      )}

      {/* Replace Meal Schedule Confirm Popup */}
      {suggestedAlternative && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(12, 15, 18, 0.95)',
          zIndex: 2500,
          borderRadius: '30px',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Utensils size={28} color="var(--accent-green)" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ fontSize: '14.5px', fontWeight: 800 }}>Gán món ăn vào lịch trình</h4>
            <p className="subtitle" style={{ fontSize: '10.5px' }}>Chọn ngày và bữa ăn bạn muốn thay thế bằng món: <strong>{suggestedAlternative.name}</strong></p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Chọn ngày trong tuần:</label>
              <select 
                value={targetReplaceDay}
                onChange={(e) => setTargetReplaceDay(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  color: 'white',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              >
                {Object.keys(mealSchedule).map(day => (
                  <option key={day} value={day} style={{ background: '#12161a' }}>{day} {day === getTodayString() ? '(Hôm nay)' : ''}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Chọn bữa ăn:</label>
              <select 
                value={targetReplaceMeal}
                onChange={(e) => setTargetReplaceMeal(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  color: 'white',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              >
                <option value="breakfast" style={{ background: '#12161a' }}>Bữa Sáng</option>
                <option value="lunch" style={{ background: '#12161a' }}>Bữa Trưa</option>
                <option value="dinner" style={{ background: '#12161a' }}>Bữa Tối</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              onClick={() => setSuggestedAlternative(null)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button 
              onClick={() => handleReplaceMeal(suggestedAlternative)}
              className="btn-primary"
              style={{
                flex: 2,
                padding: '12px',
                fontSize: '12.5px',
                fontWeight: 700,
                background: 'var(--accent-green)',
                color: 'var(--bg-dark)',
                cursor: 'pointer'
              }}
            >
              Xác nhận thay thế 🔄
            </button>
          </div>
        </div>
      )}

        </div>
      )}
    </div>
  );
}
