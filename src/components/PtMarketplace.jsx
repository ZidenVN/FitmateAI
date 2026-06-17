import React, { useState } from 'react';
import { Star, Award, Sparkles, X, Calendar, Clock, Check } from 'lucide-react';

export default function PtMarketplace({ onOpenProfile, showToast, appointments, setAppointments }) {
  const pts = [
    {
      id: 1,
      name: 'Mai Xuân Tú',
      rating: '4.9',
      exp: '3 năm kinh nghiệm',
      price: '300.000đ/buổi',
      spec: ['Calisthenics', 'Giảm cân nhanh', 'Sức bền'],
      avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      name: 'Nguyễn Minh Khang',
      rating: '4.8',
      exp: '1.5 năm kinh nghiệm',
      price: '250.000đ/buổi',
      spec: ['Tăng cơ', 'Dinh dưỡng chuyên sâu', 'Powerlifting'],
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=60'
    }
  ];

  const [activeBookingPt, setActiveBookingPt] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00');

  const handleBookPt = (pt) => {
    setActiveBookingPt(pt);
    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
    setBookingTime('09:00');
  };

  const executeBooking = () => {
    if (!bookingDate) {
      if (showToast) showToast("Vui lòng chọn ngày hẹn tập!", "orange");
      return;
    }

    const newAppt = {
      id: Date.now(),
      ptName: activeBookingPt.name,
      date: bookingDate,
      time: bookingTime,
      status: 'Đợi xác nhận'
    };

    if (setAppointments && appointments) {
      setAppointments([...appointments, newAppt]);
    }

    setActiveBookingPt(null);

    if (showToast) {
      showToast(`Đã gửi yêu cầu đặt lịch với HLV ${activeBookingPt.name}!`, 'success');
    }
  };

  return (
    <div className="screen-content animate-slide-up" style={{ position: 'relative' }}>
      {/* Title */}
      <div>
        <h2 className="title-large" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award color="var(--accent-green)" size={22} />
          PT Marketplace
        </h2>
        <p className="subtitle">Đặt lịch tập luyện trực tiếp với các chuyên gia hàng đầu</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700 }}>PT Phổ Biến Tại TP.HCM</span>
        <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12} /> Đã kiểm duyệt
        </span>
      </div>

      {/* PT List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto' }}>
        {pts.map((pt) => (
          <div key={pt.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Clickable Info Card */}
            <div 
              style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => onOpenProfile({
                name: pt.name,
                role: 'Huấn luyện viên',
                avatar: pt.avatar,
                isPt: true,
                spec: pt.spec,
                exp: pt.exp,
                price: pt.price
              })}
            >
              <img 
                src={pt.avatar} 
                alt={pt.name} 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  objectFit: 'cover',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700 }}>HLV {pt.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#ffb300', fontSize: '12px', fontWeight: 700 }}>
                    <Star size={14} fill="#ffb300" stroke="none" />
                    {pt.rating}
                  </div>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {pt.exp} • <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{pt.price}</span>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {pt.spec.map((s, idx) => (
                <span 
                  key={idx}
                  style={{
                    fontSize: '9px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            <button className="btn-primary" onClick={() => handleBookPt(pt)} style={{ padding: '10px' }}>
              Đặt lịch tập thử miễn phí
            </button>
          </div>
        ))}
      </div>

      {/* Safety Shield */}
      <div className="glass-card" style={{ display: 'flex', gap: '10px', background: 'rgba(57, 255, 20, 0.03)', borderColor: 'rgba(57, 255, 20, 0.1)' }}>
        <Award size={18} color="var(--accent-green)" style={{ flexShrink: 0 }} />
        <div>
          <h5 style={{ fontSize: '12px', fontWeight: 700 }}>Cam kết của FitMate</h5>
          <p className="subtitle" style={{ fontSize: '10px', marginTop: '2px' }}>
            100% PT trên hệ thống đều có chứng chỉ quốc tế và được đánh giá thực tế bởi học viên.
          </p>
        </div>
      </div>

      {/* Booking Selector Modal Overlay */}
      {activeBookingPt && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(12, 15, 18, 0.95)',
          zIndex: 1000,
          borderRadius: '30px',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--accent-green)' }}>Đặt lịch hẹn tập</span>
            <button 
              onClick={() => setActiveBookingPt(null)}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>

          {/* PT Info Brief */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <img 
              src={activeBookingPt.avatar} 
              alt={activeBookingPt.name} 
              style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>HLV {activeBookingPt.name}</div>
              <p className="subtitle" style={{ fontSize: '9px' }}>{activeBookingPt.price} • Tập thử miễn phí</p>
            </div>
          </div>

          {/* Date Picker Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Chọn ngày hẹn tập:</label>
            <input 
              type="date"
              value={bookingDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBookingDate(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '8px 10px',
                color: 'white',
                fontSize: '12.5px',
                outline: 'none',
                colorScheme: 'dark'
              }}
            />
          </div>

          {/* Time Picker Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Chọn khung giờ:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {['09:00', '10:30', '14:00', '16:30', '19:00', '20:30'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setBookingTime(time)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: '1px solid',
                    background: bookingTime === time ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255,255,255,0.02)',
                    borderColor: bookingTime === time ? 'var(--accent-green)' : 'var(--border-color)',
                    color: bookingTime === time ? 'var(--accent-green)' : 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <button 
            className="btn-primary" 
            onClick={executeBooking} 
            style={{ width: '100%', marginTop: 'auto' }}
          >
            Xác nhận đặt lịch
          </button>
        </div>
      )}
    </div>
  );
}
