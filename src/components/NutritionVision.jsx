import React, { useState } from 'react';
import { Camera, RefreshCw, Check, Sparkles, AlertCircle, Eye } from 'lucide-react';

export default function NutritionVision({ onAddCalories, onCompleteTask }) {
  const [scanState, setScanState] = useState('idle'); // 'idle', 'scanning', 'scanned', 'saved'
  const [portion, setPortion] = useState(1); // portion size multiplier

  const startScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('scanned');
    }, 2000);
  };

  const handleSave = () => {
    const calories = Math.round(550 * portion);
    onAddCalories(calories);
    onCompleteTask(1); // Complete task ID 1: Quét calo bữa trưa
    setScanState('saved');
  };

  const resetScan = () => {
    setScanState('idle');
    setPortion(1);
  };

  return (
    <div className="screen-content animate-slide-up">
      {/* Title */}
      <div>
        <h2 className="title-large" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles color="var(--accent-green)" size={22} />
          AI Nutrition Vision
        </h2>
        <p className="subtitle">Chụp ảnh để AI tự động tính lượng calo & dinh dưỡng</p>
      </div>

      {/* Camera Viewfinder Box */}
      <div 
        className="glass-card" 
        style={{ 
          height: '240px', 
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
        {/* Mock background food image */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'url("https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=60")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: scanState === 'idle' ? 0.8 : scanState === 'scanning' ? 0.5 : 0.9,
          filter: scanState === 'scanning' ? 'blur(1px)' : 'none',
          transition: 'all 0.5s ease'
        }} />

        {/* Camera overlay corners */}
        <div style={{
          position: 'absolute',
          inset: '20px',
          border: '1px dashed rgba(57, 255, 20, 0.3)',
          pointerEvents: 'none'
        }}>
          {/* Top-left corner */}
          <div style={{ position: 'absolute', top: -2, left: -2, width: 15, height: 15, borderTop: '3px solid var(--accent-green)', borderLeft: '3px solid var(--accent-green)' }} />
          {/* Top-right corner */}
          <div style={{ position: 'absolute', top: -2, right: -2, width: 15, height: 15, borderTop: '3px solid var(--accent-green)', borderRight: '3px solid var(--accent-green)' }} />
          {/* Bottom-left corner */}
          <div style={{ position: 'absolute', bottom: -2, left: -2, width: 15, height: 15, borderBottom: '3px solid var(--accent-green)', borderLeft: '3px solid var(--accent-green)' }} />
          {/* Bottom-right corner */}
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 15, height: 15, borderBottom: '3px solid var(--accent-green)', borderRight: '3px solid var(--accent-green)' }} />
        </div>

        {/* Scan line indicator */}
        {scanState === 'scanning' && (
          <div style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(180deg, transparent, var(--accent-green), transparent)',
            boxShadow: '0 0 15px var(--accent-green)',
            animation: 'scan 2s infinite linear',
            zIndex: 10
          }} />
        )}

        {/* Viewfinder states content */}
        {scanState === 'idle' && (
          <button className="btn-primary animate-pulse-slow" onClick={startScan} style={{ width: 'auto', position: 'relative', zIndex: 12 }}>
            <Camera size={18} />
            Chụp & Quét Bữa Ăn
          </button>
        )}

        {scanState === 'scanning' && (
          <div style={{ zIndex: 12, textAlign: 'center' }}>
            <div className="animate-pulse-slow" style={{ fontWeight: 700, color: 'var(--accent-green)', letterSpacing: '0.05em', fontSize: '15px' }}>
              AI ĐANG PHÂN TÍCH...
            </div>
            <p className="subtitle" style={{ color: '#fff', marginTop: '4px' }}>Nhận diện thành phần món ăn</p>
          </div>
        )}

        {scanState === 'scanned' && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(12, 15, 18, 0.85)',
            padding: '6px 12px',
            borderRadius: '10px',
            fontSize: '11px',
            color: 'var(--accent-green)',
            fontWeight: 700,
            border: '1px solid rgba(57, 255, 20, 0.2)',
            zIndex: 12
          }}>
            Nhận diện thành công: Phở Bò (92%)
          </div>
        )}

        {scanState === 'saved' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(12, 15, 18, 0.9)',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(57, 255, 20, 0.1)',
              color: 'var(--accent-green)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px solid var(--accent-green)'
            }}>
              <Check size={24} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: '15px' }}>Đã Lưu Thành Công!</p>
              <p className="subtitle" style={{ marginTop: '2px' }}>Chỉ số dinh dưỡng đã được cộng vào dashboard.</p>
            </div>
            <button className="btn-secondary" onClick={resetScan} style={{ marginTop: '8px' }}>
              <RefreshCw size={14} />
              Quét Bữa Khác
            </button>
          </div>
        )}
      </div>

      {/* Results Detail Form */}
      {scanState === 'scanned' && (
        <div className="glass-card animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="title-medium">Thông tin dinh dưỡng</h3>
              <span style={{ fontSize: '11px', background: 'rgba(57, 255, 20, 0.1)', color: 'var(--accent-green)', padding: '2px 8px', borderRadius: '8px', fontWeight: 600 }}>
                1 Tô tiêu chuẩn
              </span>
            </div>
            <p className="subtitle" style={{ marginTop: '2px' }}>Món ăn: Phở Bò Việt Nam</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span className="subtitle" style={{ fontSize: '10px' }}>Năng lượng</span>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-green)', marginTop: '2px' }}>
                {Math.round(550 * portion)} kcal
              </div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span className="subtitle" style={{ fontSize: '10px' }}>Đạm (Pro)</span>
              <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>
                {Math.round(25 * portion)}g
              </div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span className="subtitle" style={{ fontSize: '10px' }}>Bột (Carb)</span>
              <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>
                {Math.round(65 * portion)}g
              </div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span className="subtitle" style={{ fontSize: '10px' }}>Béo (Fat)</span>
              <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>
                {Math.round(15 * portion)}g
              </div>
            </div>
          </div>

          {/* Portion Adjuster Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Điều chỉnh khẩu phần ăn:</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>{portion}x Tô</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.25" 
              value={portion} 
              onChange={(e) => setPortion(parseFloat(e.target.value))}
              style={{
                accentColor: 'var(--accent-green)',
                width: '100%',
                cursor: 'pointer'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '8px',
            background: 'rgba(255, 87, 34, 0.05)',
            border: '1px solid rgba(255, 87, 34, 0.15)',
            padding: '10px',
            borderRadius: '12px',
            fontSize: '11px',
            alignItems: 'center'
          }}>
            <AlertCircle size={14} color="var(--accent-orange)" style={{ flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)' }}>
              Món này giàu protein, rất hợp để cơ bắp phục hồi sau buổi tập Upper Body hôm nay.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={resetScan} style={{ flex: 1 }}>
              Hủy
            </button>
            <button className="btn-primary" onClick={handleSave} style={{ flex: 2 }}>
              <Check size={16} />
              Lưu Nhật Ký
            </button>
          </div>
        </div>
      )}

      {/* Info Card when idle */}
      {scanState === 'idle' && (
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
  );
}
