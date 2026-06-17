import React from 'react';
import { Star, Award, Sparkles } from 'lucide-react';

export default function PtMarketplace({ onOpenProfile, showToast }) {
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

  const handleBookPt = (ptName) => {
    if (showToast) {
      showToast(`Đăng ký thành công! HLV ${ptName} sẽ liên hệ bạn qua SĐT/Zalo.`, 'success');
    }
  };

  return (
    <div className="screen-content animate-slide-up">
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

            <button className="btn-primary" onClick={() => handleBookPt(pt.name)} style={{ padding: '10px' }}>
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
    </div>
  );
}
