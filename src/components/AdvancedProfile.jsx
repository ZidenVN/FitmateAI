import React, { useState } from 'react';
import { ArrowLeft, HeartPulse, ShieldAlert, Clock, Calendar, Check, Edit3, Save } from 'lucide-react';

export default function AdvancedProfile({ myProfile, onUpdateProfile, onClose, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Local form states
  const [medicalCondition, setMedicalCondition] = useState(myProfile?.medicalCondition || 'Không có');
  const [allergies, setAllergies] = useState(myProfile?.allergies || 'Không có');
  const [selectedDays, setSelectedDays] = useState(myProfile?.trainingDays || ['Thứ 2', 'Thứ 4', 'Thứ 6']);
  const [trainingTime, setTrainingTime] = useState(myProfile?.trainingTime || '18:00');

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        medicalCondition: medicalCondition.trim() || 'Không có',
        allergies: allergies.trim() || 'Không có',
        trainingDays: selectedDays.length > 0 ? selectedDays : ['Thứ 2', 'Thứ 4', 'Thứ 6'],
        trainingTime: trainingTime || '18:00'
      });
      if (showToast) {
        showToast('Đã lưu thông tin chuyên sâu thành công!', 'success');
      }
      setIsEditing(false);
    }
  };

  return (
    <div className="screen-content animate-slide-up" style={{ padding: '0 0 80px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(18, 24, 30, 0.5)',
        backdropFilter: 'var(--glass-blur)',
        zIndex: 10
      }}>
        <button 
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Hồ sơ chuyên sâu</h3>
          <p className="subtitle" style={{ fontSize: '10px' }}>Y tế, dị ứng và thời gian hoạt động</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Info Card Summary */}
        <div className="glass-card" style={{ 
          background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, rgba(0,0,0,0) 100%)',
          borderColor: 'rgba(57, 255, 20, 0.15)',
          padding: '16px',
          borderRadius: '16px'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔒 Bảo mật thông tin</span>
          </h4>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.4' }}>
            Thông tin chuyên sâu này giúp HLV của bạn nắm rõ sức khỏe của bạn để điều chỉnh cường độ tập và dinh dưỡng an toàn nhất.
          </p>
        </div>

        {!isEditing ? (
          /* View Mode */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Medical Condition Block */}
            <div className="glass-card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(235, 87, 87, 0.1)', color: '#eb5757', flexShrink: 0 }}>
                <HeartPulse size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h5 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Bệnh lý nền / Chấn thương</h5>
                <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'white', marginTop: '4px', lineHeight: '1.4' }}>
                  {myProfile?.medicalCondition || 'Không có'}
                </p>
              </div>
            </div>

            {/* Allergies Block */}
            <div className="glass-card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(242, 153, 74, 0.1)', color: '#f2994a', flexShrink: 0 }}>
                <ShieldAlert size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h5 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Dị ứng thức ăn / kích thích</h5>
                <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'white', marginTop: '4px', lineHeight: '1.4' }}>
                  {myProfile?.allergies || 'Không có'}
                </p>
              </div>
            </div>

            {/* Training Days Block */}
            <div className="glass-card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(57, 255, 20, 0.1)', color: 'var(--accent-green)', flexShrink: 0 }}>
                <Calendar size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h5 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Lịch tập luyện trong tuần</h5>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {(myProfile?.trainingDays || ['Thứ 2', 'Thứ 4', 'Thứ 6']).map((day) => (
                    <span 
                      key={day} 
                      style={{ 
                        fontSize: '10.5px', 
                        background: 'rgba(57, 255, 20, 0.08)', 
                        border: '1px solid rgba(57, 255, 20, 0.2)', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        color: 'var(--accent-green)',
                        fontWeight: 700
                      }}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Training Time Block */}
            <div className="glass-card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(47, 128, 237, 0.1)', color: '#2f80ed', flexShrink: 0 }}>
                <Clock size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h5 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Khung giờ tập hàng ngày</h5>
                <p style={{ fontSize: '14px', fontWeight: 800, color: 'white', marginTop: '4px' }}>
                  {myProfile?.trainingTime || '18:00'}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsEditing(true)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--accent-green)',
                color: 'var(--bg-dark)',
                marginTop: '10px'
              }}
            >
              <Edit3 size={15} /> Chỉnh sửa chuyên sâu
            </button>

          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Bệnh lý nền / Chấn thương:</label>
              <textarea 
                placeholder="Ví dụ: Tim mạch, huyết áp, xương khớp... (Hoặc để trống)"
                value={medicalCondition}
                onChange={(e) => setMedicalCondition(e.target.value)}
                style={{
                  width: '100%',
                  height: '70px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Dị ứng thực phẩm / Kích thích:</label>
              <textarea 
                placeholder="Ví dụ: Dị ứng sữa tươi, hải sản, đậu phộng... (Hoặc để trống)"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                style={{
                  width: '100%',
                  height: '70px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Lịch tập luyện mong muốn:</label>
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
                        border: isSelected ? '1px solid var(--accent-green)' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        color: isSelected ? 'var(--accent-green)' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Giờ tập mong muốn hàng ngày:</label>
              <input 
                type="time"
                value={trainingTime}
                onChange={(e) => setTrainingTime(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  colorScheme: 'dark'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                className="btn-primary"
                style={{ 
                  flex: 1,
                  padding: '12px', 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '6px',
                  background: 'var(--accent-green)',
                  color: 'var(--bg-dark)'
                }}
              >
                <Save size={15} /> Lưu thay đổi
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
