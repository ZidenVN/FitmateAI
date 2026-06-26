import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, Calendar, Ruler, Scale, Target, ArrowRight, Activity, HeartPulse, Clock, ShieldAlert } from 'lucide-react';

export default function Auth({ onLoginSuccess, onRegisterSuccess, usersDb }) {
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
  
  // PT registration fields
  const [role, setRole] = useState('user'); // 'user' or 'pt'
  const [ptSpec, setPtSpec] = useState('');
  const [ptExp, setPtExp] = useState('');
  const [ptPrice, setPtPrice] = useState('');
  const [ptCerts, setPtCerts] = useState('');

  // Onboarding states
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedDays, setSelectedDays] = useState(['Thứ 2', 'Thứ 4', 'Thứ 6']);

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

    const db = usersDb || {};
    const user = db[email];

    if (user) {
      if (user.password === password) {
        onLoginSuccess({
          email: user.email,
          ...user.profile
        });
      } else {
        setError('Mật khẩu không chính xác! ⚠️');
      }
    } else {
      setError('Tài khoản không tồn tại! Vui lòng chuyển sang tab Đăng ký để tạo tài khoản mới. ⚠️');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (role === 'pt') {
      if (!name || !email || !password || !confirmPassword || !ptSpec || !ptExp || !ptPrice || !ptCerts || !birthday) {
        setError('Vui lòng điền đầy đủ tất cả các trường cho Huấn luyện viên! ⚠️');
        return;
      }

      const db = usersDb || {};
      if (db[email]) {
        setError('Email này đã được đăng ký! Vui lòng dùng email khác. ⚠️');
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

      const formattedBirthday = birthday.includes('-') 
        ? birthday.split('-').reverse().join('/') 
        : birthday;

      onRegisterSuccess({
        name,
        email,
        password,
        phone: '09' + Math.floor(10000000 + Math.random() * 90000000),
        birthday: formattedBirthday,
        gender,
        isPt: true,
        spec: ptSpec.split(',').map(s => s.trim()),
        exp: ptExp.includes('kinh nghiệm') ? ptExp : `${ptExp} năm kinh nghiệm`,
        price: ptPrice.includes('đ/buổi') ? ptPrice : `${ptPrice}đ/buổi`,
        certificates: ptCerts,
        medicalCondition: 'Không có',
        allergies: 'Không có',
        trainingDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
        trainingTimes: ['08:00']
      });
      return;
    }

    if (!name || !email || !password || !confirmPassword || !height || !weight || !goal || !birthday) {
      setError('Vui lòng điền đầy đủ tất cả các trường! ⚠️');
      return;
    }

    const db = usersDb || {};
    if (db[email]) {
      setError('Email này đã được đăng ký! Vui lòng dùng email khác. ⚠️');
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

    // Advance to onboarding step 2
    setOnboardingStep(2);
  };

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();

    const formattedBirthday = birthday.includes('-') 
      ? birthday.split('-').reverse().join('/') 
      : birthday;

    onRegisterSuccess({
      name,
      email,
      password,
      phone: '09' + Math.floor(10000000 + Math.random() * 90000000),
      birthday: formattedBirthday,
      gender,
      height: height.includes('cm') ? height : `${height} cm`,
      weight: weight.includes('kg') ? weight : `${weight} kg`,
      goal,
      medicalCondition: 'Không có',
      allergies: 'Không có',
      trainingDays: selectedDays.length > 0 ? selectedDays : ['Thứ 2', 'Thứ 4', 'Thứ 6'],
      trainingTimes: ['18:00']
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
            setOnboardingStep(1);
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
            setOnboardingStep(1);
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
                  const user = usersDb?.['user@fitmate.vn'];
                  if (user) {
                    onLoginSuccess({
                      email: user.email,
                      ...user.profile
                    });
                  }
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
                  const pt = usersDb?.['pt@fitmate.vn'];
                  if (pt) {
                    onLoginSuccess({
                      email: pt.email,
                      ...pt.profile
                    });
                  }
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
      ) : onboardingStep === 1 ? (
        /* Register Form */
        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Role selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Bạn đăng ký làm:</label>
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '2px' }}>
              <button
                type="button"
                onClick={() => setRole('user')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: role === 'user' ? 'rgba(57, 255, 20, 0.12)' : 'transparent',
                  color: role === 'user' ? 'var(--accent-green)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                👤 Hội viên
              </button>
              <button
                type="button"
                onClick={() => setRole('pt')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: role === 'pt' ? 'rgba(255, 87, 34, 0.12)' : 'transparent',
                  color: role === 'pt' ? 'var(--accent-orange)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🏋️‍♂️ Huấn luyện viên (PT)
              </button>
            </div>
          </div>
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

          {role === 'user' ? (
            /* User fields: Height & Weight */
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
          ) : (
            /* PT fields: Spec & Price */
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Chuyên môn (phân cách bằng dấu phẩy):</label>
                <input 
                  type="text"
                  placeholder="Vd: Calisthenics, Giảm cân"
                  value={ptSpec}
                  onChange={(e) => setPtSpec(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Chi phí / buổi:</label>
                <input 
                  type="text"
                  placeholder="Vd: 300.000đ/buổi"
                  value={ptPrice}
                  onChange={(e) => setPtPrice(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

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
                  type="date"
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
                    boxSizing: 'border-box',
                    colorScheme: 'dark'
                  }}
                />
              </div>
            </div>
          </div>

          {role === 'user' ? (
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
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Số năm kinh nghiệm:</label>
                <input 
                  type="text"
                  placeholder="Vd: 3 năm"
                  value={ptExp}
                  onChange={(e) => setPtExp(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Chứng chỉ hành nghề:</label>
                <input 
                  type="text"
                  placeholder="Vd: NASM-CPT, Bằng Thể Thao"
                  value={ptCerts}
                  onChange={(e) => setPtCerts(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

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
      ) : (
        /* Onboarding Form */
        <form onSubmit={handleOnboardingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-green)' }}>Lịch tập luyện 📅</h4>
            <p className="subtitle" style={{ fontSize: '10.5px', marginTop: '2px' }}>Thiết lập các ngày tập luyện của bạn trong tuần</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Lịch tập mong muốn trong tuần:</label>
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

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              type="button"
              onClick={() => setOnboardingStep(1)}
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
              Quay lại
            </button>
            <button 
              type="submit"
              className="btn-primary"
              style={{ 
                flex: 2,
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
              Hoàn tất đăng ký 🚀
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
