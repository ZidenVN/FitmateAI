import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, UserPlus, Star, Award, Heart, Flame, Smile, Check, X } from 'lucide-react';

export default function UserProfile({ profile, onClose, posts, onUpdateProfile, showToast, appointments, setAppointments }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00');
  
  // Local edit states
  const [editBio, setEditBio] = useState(profile.bio || '');
  const [editPhone, setEditPhone] = useState(profile.phone || '');
  const [editBirthday, setEditBirthday] = useState(profile.birthday || '');
  const [editGender, setEditGender] = useState(profile.gender || 'Nam');

  // Filter posts created by this profile
  const authorName = profile.name;
  const userPosts = posts.filter(p => p.author.toLowerCase().includes(authorName.split(' ')[0].toLowerCase()) || (profile.isSelf && p.author.includes('Bạn')));

  const handleConnect = () => {
    if (showToast) {
      showToast(`Đã gửi yêu cầu kết bạn với ${profile.name}!`, 'success');
    }
  };

  const handleBook = () => {
    setShowBookingModal(true);
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
      ptName: profile.name,
      date: bookingDate,
      time: bookingTime,
      status: 'Đợi xác nhận'
    };

    if (setAppointments && appointments) {
      setAppointments([...appointments, newAppt]);
    }

    setShowBookingModal(false);

    if (showToast) {
      showToast(`Đã gửi yêu cầu đặt lịch với HLV ${profile.name}!`, 'success');
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        bio: editBio,
        phone: editPhone,
        birthday: editBirthday,
        gender: editGender
      });
    }
    setIsEditing(false);
    if (showToast) {
      showToast('Cập nhật thông tin cá nhân thành công! ✨', 'success');
    }
  };

  return (
    <div className="screen-content animate-slide-up" style={{ padding: 0, position: 'relative' }}>
      {/* Header with Back Button */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(18, 24, 30, 0.5)',
        backdropFilter: 'var(--glass-blur)'
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
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>
            {profile.isSelf ? (isEditing ? 'Chỉnh sửa hồ sơ' : 'Trang cá nhân của bạn') : 'Trang cá nhân'}
          </h3>
          <p className="subtitle" style={{ fontSize: '10px' }}>{profile.name}</p>
        </div>
      </div>

      {/* Profile Info Container */}
      <div style={{ overflowY: 'auto', height: '620px', padding: '16px 20px 80px' }}>
        {/* Cover & Avatar Area */}
        <div style={{ position: 'relative', marginBottom: '60px' }}>
          {/* Cover Photo */}
          <div style={{
            height: '110px',
            borderRadius: '16px',
            background: profile.isPt 
              ? 'linear-gradient(135deg, #1f120c 0%, var(--accent-orange) 150%)'
              : 'linear-gradient(135deg, #0c1c11 0%, var(--accent-green) 150%)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '10px'
          }}>
            {profile.isPt && (
              <span style={{
                fontSize: '9px',
                background: 'rgba(255, 87, 34, 0.2)',
                color: 'var(--accent-orange)',
                border: '1px solid var(--accent-orange)',
                padding: '2px 8px',
                borderRadius: '8px',
                fontWeight: 700
              }}>
                HLV ĐÃ XÁC MINH
              </span>
            )}
          </div>

          {/* Avatar */}
          <img 
            src={profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60'} 
            alt={profile.name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '24px',
              border: '4px solid var(--bg-dark)',
              objectFit: 'cover',
              position: 'absolute',
              bottom: '-42px',
              left: '16px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
            }}
          />
        </div>

        {/* Editing Mode Form */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Lời giới thiệu (Bio):</label>
              <textarea 
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px',
                  color: 'white',
                  fontSize: '12.5px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  minHeight: '60px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Số điện thoại:</label>
              <input 
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  color: 'white',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Ngày sinh:</label>
              <input 
                type="text"
                placeholder="Ví dụ: 15/05/2004"
                value={editBirthday}
                onChange={(e) => setEditBirthday(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  color: 'white',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Giới tính:</label>
              <select 
                value={editGender}
                onChange={(e) => setEditGender(e.target.value)}
                style={{
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  color: 'white',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setIsEditing(false)} 
                style={{ flex: 1, padding: '8px' }}
              >
                <X size={14} /> Hủy
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ flex: 2, padding: '8px' }}
              >
                <Check size={14} /> Lưu thay đổi
              </button>
            </div>
          </form>
        ) : (
          /* Static Display Mode */
          <>
            {/* User Stats & Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <h2 className="title-large" style={{ fontSize: '20px', fontWeight: 800 }}>{profile.name}</h2>
                <p className="subtitle" style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{profile.role}</p>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {profile.bio || 'Chưa cập nhật giới thiệu.'}
              </p>

              {profile.isPt && (
                /* PT Specific Info Card */
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Kinh nghiệm:</span>
                      <span style={{ fontWeight: 700, marginLeft: '4px' }}>{profile.exp}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Giá thuê:</span>
                      <span style={{ fontWeight: 700, color: 'var(--accent-green)', marginLeft: '4px' }}>{profile.price}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {profile.spec?.map((s, idx) => (
                      <span key={idx} style={{ fontSize: '9px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '6px' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {profile.isSelf ? (
                  <button 
                    className="btn-primary" 
                    onClick={() => setIsEditing(true)}
                    style={{ flex: 1 }}
                  >
                    Chỉnh sửa trang cá nhân
                  </button>
                ) : profile.isPt ? (
                  <>
                    <button className="btn-primary" onClick={handleBook} style={{ flex: 2 }}>
                      Đặt lịch hẹn miễn phí
                    </button>
                    <button className="btn-secondary" onClick={handleConnect} style={{ padding: '12px' }}>
                      <MessageCircle size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-primary" onClick={handleConnect} style={{ flex: 1 }}>
                      <UserPlus size={16} />
                      Kết bạn
                    </button>
                    <button className="btn-secondary" style={{ flex: 1 }}>
                      Nhắn tin
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Personal Details Card */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '12.5px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '4px' }}>
                Thông tin chi tiết
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>📞 Số điện thoại:</span>
                <span style={{ fontWeight: 600 }}>{profile.phone || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>🎂 Ngày sinh:</span>
                <span style={{ fontWeight: 600 }}>{profile.birthday || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>🚻 Giới tính:</span>
                <span style={{ fontWeight: 600 }}>{profile.gender || 'Chưa cập nhật'}</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="glass-card" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              textAlign: 'center', 
              padding: '12px 6px',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>{userPosts.length}</div>
                <div className="subtitle" style={{ fontSize: '10px' }}>Bài đăng</div>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>{profile.isPt ? '48' : '15'}</div>
                <div className="subtitle" style={{ fontSize: '10px' }}>{profile.isPt ? 'Học viên' : 'Streak tập'}</div>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-green)' }}>
                  {profile.isPt ? '4.9★' : '120'}
                </div>
                <div className="subtitle" style={{ fontSize: '10px' }}>{profile.isPt ? 'Đánh giá' : 'Điểm kết nối'}</div>
              </div>
            </div>

            {/* User's Post Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 className="title-medium" style={{ fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                Bài đăng của {profile.name.split(' ').pop()}
              </h3>

              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <div key={post.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <img 
                        src={post.avatar}
                        alt={post.author}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>{post.author}</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{post.time}</div>
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      {post.content}
                    </p>

                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Attached media" 
                        style={{
                          width: '100%',
                          maxHeight: '160px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          marginTop: '4px',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      />
                    )}

                    <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '6px', marginTop: '2px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        ❤️ {post.reactions.love}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        🔥 {post.reactions.fire}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        😆 {post.reactions.haha}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="subtitle" style={{ textAlign: 'center', padding: '20px 0' }}>
                  Chưa có bài đăng nào trên cộng đồng.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Booking Selector Modal Overlay */}
      {showBookingModal && (
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
              onClick={() => setShowBookingModal(false)}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>

          {/* PT Info Brief */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>HLV {profile.name}</div>
              <p className="subtitle" style={{ fontSize: '9px' }}>{profile.price || 'Tập thử miễn phí'}</p>
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
