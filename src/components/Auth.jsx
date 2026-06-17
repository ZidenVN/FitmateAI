import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, Calendar, Ruler, Scale, Target, ArrowRight } from 'lucide-react';

export default function Auth({ onLoginSuccess, onRegisterSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register states
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('Nam');
  const [birthday, setBirthday] = useState('');
  const [goal, setGoal] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ Email và Mật khẩu! ⚠️');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự! ⚠️');
      return;
    }

    // Check specific credentials for default accounts
    if (email === 'pt@fitmate.vn' && password === '123456') {
      onLoginSuccess({
        name: 'Mai Xuân Tú',
        role: 'Huấn luyện viên',
        bio: 'Giúp học viên đạt mục tiêu hình thể Calisthenics tối ưu, xây dựng lối sống lành mạnh.',
        height: '174 cm',
        weight: '68 kg',
        gender: 'Nam',
        phone: '0368947538',
        birthday: '20/10/1998',
        avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=60',
        isPt: true,
        spec: ['Calisthenics', 'Giảm cân nhanh', 'Sức bền'],
        exp: '3 năm kinh nghiệm',
        price: '300.000đ/buổi'
      });
    } else if (email === 'user@fitmate.vn' && password === '123456') {
      onLoginSuccess({
        name: 'Hùng',
        role: 'Hội viên',
        bio: 'Đạt body 6 múi, cải thiện sức bền bỉ và thâm hụt mỡ bụng! 🏋️‍♂️🔥',
        height: '175 cm',
        weight: '70 kg',
        gender: 'Nam',
        phone: '0912345678',
        birthday: '15/05/2004',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
        isPt: false
      });
    } else {
      // Simulate login success - passing custom user details
      onLoginSuccess({
        name: email.split('@')[0],
        role: 'Hội viên',
        bio: 'Sẵn sàng chinh phục mọi giới hạn cùng FitMate! 🏋️‍♂️🔥',
        height: '175 cm',
        weight: '70 kg',
        gender: 'Nam',
        phone: '0912345678',
        birthday: '15/05/2004',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
        isPt: false
      });
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword || !height || !weight || !goal || !birthday) {
      setError('Vui lòng điền đầy đủ tất cả các trường! ⚠️');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp! ⚠️');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự! ⚠️');
      return;
    }

    // Pass the newly registered details back to the app state
    onRegisterSuccess({
      name,
      email,
      phone: '09' + Math.floor(10000000 + Math.random() * 90000000),
      birthday,
      gender,
      height: height.includes('cm') ? height : `${height} cm`,
      weight: weight.includes('kg') ? weight : `${weight} kg`,
      goal
    });
  };

  return (
    <div className="screen-content animate-slide-up" style={{ 
      padding: '24px 20px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px', 
      height: '100%', 
      overflowY: 'auto',
      background: 'linear-gradient(180deg, rgba(18, 24, 32, 0.95) 0%, rgba(12, 16, 22, 0.98) 100%)'
    }}>
      {/* App Branding */}
      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '10px' }}>
        <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '16px', background: 'rgba(57, 255, 20, 0.1)', border: '1px solid rgba(57, 255, 20, 0.2)', marginBottom: '8px' }}>
          <Sparkles size={28} color="var(--accent-green)" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '1px' }}>
          Fit<span style={{ color: 'var(--accent-green)' }}>Mate</span>
        </h2>
        <p className="subtitle" style={{ fontSize: '11px', marginTop: '4px' }}>
          Trợ lý huấn luyện & thực đơn thích ứng AI
        </p>
      </div>

      {/* Auth Toggle Tabs */}
      <div style={{ 
        display: 'flex', 
        background: 'rgba(255, 255, 255, 0.03)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '12px', 
        padding: '3px' 
      }}>
        <button
          onClick={() => {
            setIsLoginMode(true);
            setError('');
          }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '9px',
            border: 'none',
            background: isLoginMode ? 'rgba(57, 255, 20, 0.12)' : 'transparent',
            color: isLoginMode ? 'var(--accent-green)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '12.5px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Đăng nhập
        </button>
        <button
          onClick={() => {
            setIsLoginMode(false);
            setError('');
          }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '9px',
            border: 'none',
            background: !isLoginMode ? 'rgba(57, 255, 20, 0.12)' : 'transparent',
            color: !isLoginMode ? 'var(--accent-green)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '12.5px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Đăng ký
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="glass-card animate-pulse-slow" style={{ 
          background: 'rgba(255, 87, 34, 0.08)', 
          borderColor: 'rgba(255, 87, 34, 0.3)', 
          color: 'var(--accent-orange)', 
          fontSize: '12px', 
          fontWeight: 600, 
          padding: '10px 12px',
          borderRadius: '10px'
        }}>
          {error}
        </div>
      )}

      {isLoginMode ? (
        /* Login Form */
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Email hoặc tên tài khoản:</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 12px 10px 38px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Mật khẩu:</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password"
                placeholder="Nhập 6+ ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 12px 10px 38px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="btn-primary"
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '13.5px', 
              fontWeight: 700, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '6px',
              marginTop: '10px',
              background: 'var(--accent-green)',
              color: 'var(--bg-dark)'
            }}
          >
            Đăng nhập ngay <ArrowRight size={16} />
          </button>

          {/* Quick Login Helpers */}
          <div className="glass-card" style={{ 
            marginTop: '12px', 
            padding: '12px', 
            background: 'rgba(255, 255, 255, 0.01)',
            borderColor: 'rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>
              Dùng thử tài khoản mẫu (Click đăng nhập nhanh):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('user@fitmate.vn');
                  setPassword('123456');
                  onLoginSuccess({
                    name: 'Hùng',
                    role: 'Hội viên',
                    bio: 'Đạt body 6 múi, cải thiện sức bền bỉ và thâm hụt mỡ bụng! 🏋️‍♂️🔥',
                    height: '175 cm',
                    weight: '70 kg',
                    gender: 'Nam',
                    phone: '0912345678',
                    birthday: '15/05/2004',
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
                    isPt: false
                  });
                }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '8px',
                  background: 'rgba(57, 255, 20, 0.08)',
                  border: '1px solid rgba(57, 255, 20, 0.2)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <span style={{ color: 'var(--accent-green)' }}>👤 Hội viên</span>
                <span style={{ fontSize: '8.5px', color: 'var(--text-secondary)', fontWeight: 400 }}>user@fitmate.vn</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('pt@fitmate.vn');
                  setPassword('123456');
                  onLoginSuccess({
                    name: 'Mai Xuân Tú',
                    role: 'Huấn luyện viên',
                    bio: 'Giúp học viên đạt mục tiêu hình thể Calisthenics tối ưu, xây dựng lối sống lành mạnh.',
                    height: '174 cm',
                    weight: '68 kg',
                    gender: 'Nam',
                    phone: '0368947538',
                    birthday: '20/10/1998',
                    avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=60',
                    isPt: true,
                    spec: ['Calisthenics', 'Giảm cân nhanh', 'Sức bền'],
                    exp: '3 năm kinh nghiệm',
                    price: '300.000đ/buổi'
                  });
                }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '8px',
                  background: 'rgba(255, 87, 34, 0.08)',
                  border: '1px solid rgba(255, 87, 34, 0.2)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <span style={{ color: 'var(--accent-orange)' }}>🏋️‍♂️ Huấn luyện viên</span>
                <span style={{ fontSize: '8.5px', color: 'var(--text-secondary)', fontWeight: 400 }}>pt@fitmate.vn</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Register Form */
        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Họ và tên của bạn:</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder="Ví dụ: Nguyễn Văn Hùng"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 12px 10px 38px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Địa chỉ Email:</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 12px 10px 38px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Grid Layout for Height & Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Chiều cao:</label>
              <div style={{ position: 'relative' }}>
                <Ruler size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  placeholder="Ví dụ: 175 cm"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 12px 10px 38px',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Cân nặng:</label>
              <div style={{ position: 'relative' }}>
                <Scale size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  placeholder="Ví dụ: 70 kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 12px 10px 38px',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Grid Layout for Gender & Birthday */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Giới tính:</label>
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  height: '38px',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Ngày sinh:</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  placeholder="Ví dụ: 15/05/2004"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 12px 10px 38px',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Mục tiêu tập luyện:</label>
            <div style={{ position: 'relative' }}>
              <Target size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '15px' }} />
              <textarea 
                placeholder="Ví dụ: Tăng cơ giảm mỡ, đạt body 6 múi..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 12px 10px 38px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  minHeight: '50px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  resize: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Mật khẩu:</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 12px 10px 38px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Nhập lại mật khẩu:</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 12px 10px 38px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="btn-primary"
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '13.5px', 
              fontWeight: 700, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '6px',
              marginTop: '10px',
              background: 'var(--accent-green)',
              color: 'var(--bg-dark)'
            }}
          >
            Đăng ký tài khoản <ArrowRight size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
