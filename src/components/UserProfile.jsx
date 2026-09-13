import React, { useState, useRef } from 'react';
import { ArrowLeft, MessageCircle, UserPlus, UserX, Star, Award, Heart, Flame, Smile, Check, X, HeartPulse, ArrowRight, Clock, ShieldCheck, Pencil, Edit3, Camera, Trash2, Eye, Sparkles } from 'lucide-react';
import ChuyenSau from './ChuyenSau';
import PTCertificatesModal from './PTCertificatesModal';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
];

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60';

export default function UserProfile({ 
  profile, 
  onClose, 
  posts, 
  onUpdateProfile, 
  showToast, 
  appointments, 
  setAppointments, 
  myProfile,
  friendsList = [],
  sentRequests = [],
  onSendFriendRequest,
  onCancelSentRequest,
  onUnfriend,
  onOpenChat
}) {
  const mockReviews = {
    'Mai Xuân Tú': [
      { id: 1, student: 'Nguyễn Đào Tùng Lâm', rating: 5, comment: 'HLV chuyên môn cực tốt, hướng dẫn kỹ thuật Calisthenics rất bài bản, nhiệt tình.', date: '3 ngày trước' },
      { id: 2, student: 'Nguyễn Phúc Thịnh', rating: 5, comment: 'Thầy Tú giúp mình lên Planche rất nhanh, giáo án nhẹ nhàng nhưng hiệu quả cao!', date: '1 tuần trước' },
      { id: 3, student: 'Hoàng Gia Bảo', rating: 4.8, comment: 'Tác phong chuyên nghiệp, luôn nhắc nhở gồng core kĩ. Chấm 5 sao!', date: '2 tuần trước' }
    ],
    'Nguyễn Minh Khang': [
      { id: 1, student: 'Lê Hoàng Long', rating: 5, comment: 'HLV tập tạ cực kì cẩn thận, đỡ tạ rất an toàn. Chế độ dinh dưỡng gợi ý ăn ngon dễ theo.', date: '5 ngày trước' },
      { id: 2, student: 'Phạm Minh Đức', rating: 4.5, comment: 'Nhờ anh Khang hướng dẫn mà bench press của mình tăng thêm 15kg trong 1 tháng.', date: '2 tuần trước' }
    ]
  };

  const [isEditing, setIsEditing] = useState(false);
  const [showChuyenSau, setShowChuyenSau] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const avatarInputRef = useRef(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00');
  
  // Parse initial trainingTime if available
  const parseTime = (timeStr) => {
    if (!timeStr) return { startH: '08', startM: '00', startAP: 'AM', endH: '09', endM: '00', endAP: 'PM' };
    
    // Check range format "08:00 AM - 09:00 PM" or "08:00 - 21:00"
    const matchRange = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (matchRange) {
      let sH = parseInt(matchRange[1], 10);
      let sM = matchRange[2];
      let sAP = matchRange[3] ? matchRange[3].toUpperCase() : (sH >= 12 ? 'PM' : 'AM');
      let displaySH = matchRange[3] ? sH : (sH > 12 ? sH - 12 : (sH === 0 ? 12 : sH));

      let eH = parseInt(matchRange[4], 10);
      let eM = matchRange[5];
      let eAP = matchRange[6] ? matchRange[6].toUpperCase() : (eH >= 12 ? 'PM' : 'AM');
      let displayEH = matchRange[6] ? eH : (eH > 12 ? eH - 12 : (eH === 0 ? 12 : eH));

      return {
        startH: String(displaySH).padStart(2, '0'),
        startM: sM,
        startAP: sAP,
        endH: String(displayEH).padStart(2, '0'),
        endM: eM,
        endAP: eAP
      };
    }

    // Check single format "08:00" or "08:00 AM" or "18:00"
    const matchSingle = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (matchSingle) {
      let h = parseInt(matchSingle[1], 10);
      let ap = matchSingle[3] ? matchSingle[3].toUpperCase() : (h >= 12 ? 'PM' : 'AM');
      let displayH = matchSingle[3] ? h : (h > 12 ? h - 12 : (h === 0 ? 12 : h));
      return {
        startH: String(displayH).padStart(2, '0'),
        startM: matchSingle[2],
        startAP: ap,
        endH: '09',
        endM: '00',
        endAP: 'PM'
      };
    }

    return { startH: '08', startM: '00', startAP: 'AM', endH: '09', endM: '00', endAP: 'PM' };
  };

  const initialTime = parseTime(profile.trainingTime || (profile.trainingTimes && profile.trainingTimes[0]));
  const [editStartHour, setEditStartHour] = useState(initialTime.startH);
  const [editStartMinute, setEditStartMinute] = useState(initialTime.startM);
  const [editStartAmPm, setEditStartAmPm] = useState(initialTime.startAP);
  const [editEndHour, setEditEndHour] = useState(initialTime.endH);
  const [editEndMinute, setEditEndMinute] = useState(initialTime.endM);
  const [editEndAmPm, setEditEndAmPm] = useState(initialTime.endAP);

  // Available days state
  const defaultDays = profile.trainingDays && profile.trainingDays.length > 0 
    ? profile.trainingDays 
    : (profile.isPt ? ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'] : ['Thứ 2', 'Thứ 4', 'Thứ 6']);
  const [editDays, setEditDays] = useState(defaultDays);

  const toggleDay = (day) => {
    if (editDays.includes(day)) {
      if (editDays.length === 1) return; // Keep at least 1 day
      setEditDays(editDays.filter(d => d !== day));
    } else {
      setEditDays([...editDays, day]);
    }
  };

  // Local edit states
  const [editBio, setEditBio] = useState(profile.bio || '');
  const [editPhone, setEditPhone] = useState(profile.phone || '');
  const [editBirthday, setEditBirthday] = useState(profile.birthday || '');
  const [editGender, setEditGender] = useState(profile.gender || 'Nam');
  const [editHeight, setEditHeight] = useState(profile.height || '');
  const [editWeight, setEditWeight] = useState(profile.weight || '');

  // PT Specific states
  const [editExp, setEditExp] = useState(profile.exp || '');
  const [editPrice, setEditPrice] = useState(profile.price || '');
  const [editTag1, setEditTag1] = useState(profile.spec?.[0] || '');
  const [editTag2, setEditTag2] = useState(profile.spec?.[1] || '');
  const [editTag3, setEditTag3] = useState(profile.spec?.[2] || '');
  const [editTag4, setEditTag4] = useState(profile.spec?.[3] || '');

  // Filter posts created by this profile
  const authorName = profile.name;
  const cleanName = (name) => name.replace('(Bạn)', '').replace('HLV', '').trim().toLowerCase();
  
  const userPosts = posts.filter(p => {
    if (profile.isSelf && (p.author.includes('Bạn') || p.author.includes('Hùng'))) {
      return true;
    }
    const cleanAuthor = cleanName(p.author);
    const cleanProfile = cleanName(authorName);
    return cleanAuthor.includes(cleanProfile) || cleanProfile.includes(cleanAuthor);
  });

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
      userName: myProfile?.name?.replace('(Bạn)', '').trim() || 'Hùng',
      userAvatar: myProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
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
      const formattedTrainingTime = `${editStartHour}:${editStartMinute} ${editStartAmPm} - ${editEndHour}:${editEndMinute} ${editEndAmPm}`;
      const updatedFields = {
        bio: editBio,
        phone: editPhone,
        birthday: editBirthday,
        gender: editGender,
        height: editHeight,
        weight: editWeight,
        trainingTime: formattedTrainingTime,
        trainingTimes: [formattedTrainingTime],
        trainingDays: editDays
      };

      if (profile.isPt) {
        updatedFields.exp = editExp;
        updatedFields.price = editPrice;
        
        // Filter out empty tag inputs
        const specTags = [editTag1, editTag2, editTag3, editTag4]
          .map(t => t.trim())
          .filter(t => t !== '');
        updatedFields.spec = specTags;
      }

      onUpdateProfile(updatedFields);
    }
    setIsEditing(false);
    if (showToast) {
      showToast('Cập nhật thông tin cá nhân thành công! ✨', 'success');
    }
  };

  const handleUploadAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (onUpdateProfile) {
          onUpdateProfile({ avatar: reader.result });
        }
        if (showToast) showToast('Cập nhật ảnh đại diện thành công! 📸', 'success');
        setShowAvatarModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    if (onUpdateProfile) {
      onUpdateProfile({ avatar: DEFAULT_AVATAR });
    }
    if (showToast) showToast('Đã xóa ảnh đại diện và đặt lại mặc định.', 'orange');
    setShowAvatarModal(false);
  };

  const handleSelectPreset = (url) => {
    if (onUpdateProfile) {
      onUpdateProfile({ avatar: url });
    }
    if (showToast) showToast('Đã đổi ảnh đại diện phong cách mới! ✨', 'success');
    setShowPresetPicker(false);
    setShowAvatarModal(false);
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
          type="button"
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
            } else {
              onClose();
            }
          }}
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

          {/* Interactive Avatar Container */}
          <div 
            onClick={() => setShowAvatarModal(true)}
            style={{
              position: 'absolute',
              bottom: '-42px',
              left: '16px',
              cursor: 'pointer',
              zIndex: 10
            }}
            title={profile.isSelf ? "Bấm để xem và chỉnh sửa ảnh hồ sơ" : "Xem ảnh hồ sơ"}
          >
            <img 
              src={profile.avatar || DEFAULT_AVATAR} 
              alt={profile.name}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '24px',
                border: '4px solid var(--bg-dark)',
                objectFit: 'cover',
                boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                display: 'block'
              }}
            />
            {profile.isSelf && (
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                background: 'var(--accent-green)',
                color: '#000',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-dark)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
              }}>
                <Camera size={12} strokeWidth={2.5} />
              </div>
            )}
          </div>

          {/* Edit Profile Pencil Icon for Profile Owner */}
          {profile.isSelf && !isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              title="Chỉnh sửa thông tin cá nhân"
              style={{
                position: 'absolute',
                bottom: '-38px',
                right: '4px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                zIndex: 10
              }}
            >
              <Pencil size={17} color="var(--accent-green)" />
            </button>
          )}
        </div>

        {/* Editing Mode Form */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Mục tiêu tập luyện:</label>
              <textarea 
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Ví dụ: Đạt body 6 múi, tăng cơ giảm mỡ..."
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
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Chiều cao:</label>
              <input 
                type="text"
                placeholder="Ví dụ: 175 cm"
                value={editHeight}
                onChange={(e) => setEditHeight(e.target.value)}
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
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Cân nặng:</label>
              <input 
                type="text"
                placeholder="Ví dụ: 70 kg"
                value={editWeight}
                onChange={(e) => setEditWeight(e.target.value)}
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

            {profile.isPt && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Kinh nghiệm:</label>
                  <input 
                    type="text"
                    placeholder="Ví dụ: 3 năm kinh nghiệm"
                    value={editExp}
                    onChange={(e) => setEditExp(e.target.value)}
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
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Giá thuê:</label>
                  <input 
                    type="text"
                    placeholder="Ví dụ: 300.000đ/buổi"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Chuyên môn (Tối đa 4 tags):</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input 
                      type="text"
                      placeholder="Tag 1 (Ví dụ: Calisthenics)"
                      value={editTag1}
                      onChange={(e) => setEditTag1(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        color: 'white',
                        fontSize: '11.5px',
                        outline: 'none'
                      }}
                    />
                    <input 
                      type="text"
                      placeholder="Tag 2 (Ví dụ: Giảm cân)"
                      value={editTag2}
                      onChange={(e) => setEditTag2(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        color: 'white',
                        fontSize: '11.5px',
                        outline: 'none'
                      }}
                    />
                    <input 
                      type="text"
                      placeholder="Tag 3 (Ví dụ: Tăng cơ)"
                      value={editTag3}
                      onChange={(e) => setEditTag3(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        color: 'white',
                        fontSize: '11.5px',
                        outline: 'none'
                      }}
                    />
                    <input 
                      type="text"
                      placeholder="Tag 4 (Ví dụ: Sức bền)"
                      value={editTag4}
                      onChange={(e) => setEditTag4(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        color: 'white',
                        fontSize: '11.5px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Days of Week Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {profile.isPt ? 'Ngày đứng lớp trong tuần:' : 'Ngày tập trong tuần:'}
              </label>
              <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                {[
                  { label: 'T2', full: 'Thứ 2' },
                  { label: 'T3', full: 'Thứ 3' },
                  { label: 'T4', full: 'Thứ 4' },
                  { label: 'T5', full: 'Thứ 5' },
                  { label: 'T6', full: 'Thứ 6' },
                  { label: 'T7', full: 'Thứ 7' },
                  { label: 'CN', full: 'Chủ Nhật' }
                ].map(d => {
                  const isSelected = editDays.includes(d.full);
                  return (
                    <button
                      key={d.full}
                      type="button"
                      onClick={() => toggleDay(d.full)}
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid var(--accent-green)' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        color: isSelected ? 'var(--accent-green)' : 'var(--text-secondary)',
                        fontWeight: isSelected ? 800 : 500,
                        fontSize: '11px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Training Time / Available Slots Input - SINGLE ROW */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {profile.isPt ? 'Giờ đứng lớp trống:' : 'Khung giờ tập:'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                {/* Start Time */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '6px 4px'
                }}>
                  <select 
                    value={editStartHour} 
                    onChange={(e) => setEditStartHour(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '11.5px', fontWeight: 700, outline: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => (
                      <option key={h} value={h} style={{ background: '#161c22', color: 'white' }}>{h}</option>
                    ))}
                  </select>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '11px' }}>:</span>
                  <select 
                    value={editStartMinute} 
                    onChange={(e) => setEditStartMinute(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '11.5px', fontWeight: 700, outline: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {['00','15','30','45'].map(m => (
                      <option key={m} value={m} style={{ background: '#161c22', color: 'white' }}>{m}</option>
                    ))}
                  </select>
                  <select 
                    value={editStartAmPm} 
                    onChange={(e) => setEditStartAmPm(e.target.value)}
                    style={{ 
                      background: 'rgba(57, 255, 20, 0.12)', 
                      border: '1px solid rgba(57, 255, 20, 0.3)', 
                      borderRadius: '6px', 
                      color: 'var(--accent-green)', 
                      fontSize: '10.5px', 
                      fontWeight: 800, 
                      padding: '1px 3px', 
                      outline: 'none', 
                      cursor: 'pointer',
                      marginLeft: '2px'
                    }}
                  >
                    <option value="AM" style={{ background: '#161c22', color: 'white' }}>AM</option>
                    <option value="PM" style={{ background: '#161c22', color: 'white' }}>PM</option>
                  </select>
                </div>

                <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, flexShrink: 0 }}>đến</span>

                {/* End Time */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '6px 4px'
                }}>
                  <select 
                    value={editEndHour} 
                    onChange={(e) => setEditEndHour(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '11.5px', fontWeight: 700, outline: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => (
                      <option key={h} value={h} style={{ background: '#161c22', color: 'white' }}>{h}</option>
                    ))}
                  </select>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '11px' }}>:</span>
                  <select 
                    value={editEndMinute} 
                    onChange={(e) => setEditEndMinute(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '11.5px', fontWeight: 700, outline: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {['00','15','30','45'].map(m => (
                      <option key={m} value={m} style={{ background: '#161c22', color: 'white' }}>{m}</option>
                    ))}
                  </select>
                  <select 
                    value={editEndAmPm} 
                    onChange={(e) => setEditEndAmPm(e.target.value)}
                    style={{ 
                      background: 'rgba(57, 255, 20, 0.12)', 
                      border: '1px solid rgba(57, 255, 20, 0.3)', 
                      borderRadius: '6px', 
                      color: 'var(--accent-green)', 
                      fontSize: '10.5px', 
                      fontWeight: 800, 
                      padding: '1px 3px', 
                      outline: 'none', 
                      cursor: 'pointer',
                      marginLeft: '2px'
                    }}
                  >
                    <option value="AM" style={{ background: '#161c22', color: 'white' }}>AM</option>
                    <option value="PM" style={{ background: '#161c22', color: 'white' }}>PM</option>
                  </select>
                </div>
              </div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 className="title-large" style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {profile.name}
                    {profile.isVerified && (
                      <span 
                        title="HLV đã xác thực chuyên môn" 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#2f80ed',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          color: 'white',
                          padding: '2px'
                        }}
                      >
                        <Check size={11} strokeWidth={4} />
                      </span>
                    )}
                  </h2>

                  {/* Certificate Button for PT */}
                  {profile.isPt && (
                    <button
                      type="button"
                      onClick={() => setShowCertificates(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: profile.isVerified 
                          ? 'rgba(47, 128, 237, 0.12)' 
                          : profile.certificateStatus === 'pending'
                          ? 'rgba(255, 179, 0, 0.15)'
                          : 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid',
                        borderColor: profile.isVerified 
                          ? 'rgba(47, 128, 237, 0.4)' 
                          : profile.certificateStatus === 'pending'
                          ? 'rgba(255, 179, 0, 0.4)'
                          : 'var(--border-color)',
                        color: profile.isVerified 
                          ? '#2f80ed' 
                          : profile.certificateStatus === 'pending'
                          ? '#ffb300'
                          : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                    >
                      <Award size={13} color={profile.isVerified ? '#2f80ed' : profile.certificateStatus === 'pending' ? '#ffb300' : 'var(--text-secondary)'} />
                      Chứng chỉ {profile.isVerified ? '✓' : (profile.certificateStatus === 'pending' ? '⏳' : '')}
                    </button>
                  )}
                </div>
                <p className="subtitle" style={{ color: 'var(--accent-green)', fontWeight: 600, marginTop: '2px' }}>{profile.role}</p>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>Mục tiêu:</span> {profile.bio || 'Chưa cập nhật mục tiêu.'}
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

                  {/* Certificate Quick Link Banner */}
                  <button
                    type="button"
                    onClick={() => setShowCertificates(true)}
                    style={{
                      marginTop: '6px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'rgba(47, 128, 237, 0.08)',
                      border: '1px solid rgba(47, 128, 237, 0.25)',
                      color: '#2f80ed',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={14} /> Hồ sơ Bằng cấp & Chứng chỉ HLV
                    </span>
                    <span style={{ fontSize: '10px', color: profile.isVerified ? 'var(--accent-green)' : '#ffb300', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {profile.isVerified ? 'Đã kiểm định ✓' : (profile.certificateStatus === 'pending' ? 'Đang kiểm định ⏳' : 'Chưa kiểm định')} <ArrowRight size={12} />
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Personal Details Card ("Thông tin chi tiết" - Placed above Reviews) */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', fontSize: '12.5px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '4px' }}>
                Thông tin chi tiết
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Chiều cao:</span>
                <span style={{ fontWeight: 600 }}>{profile.height || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cân nặng:</span>
                <span style={{ fontWeight: 600 }}>{profile.weight || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Số điện thoại:</span>
                <span style={{ fontWeight: 600 }}>{profile.phone || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Ngày sinh:</span>
                <span style={{ fontWeight: 600 }}>{profile.birthday || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Giới tính:</span>
                <span style={{ fontWeight: 600 }}>{profile.gender || 'Chưa cập nhật'}</span>
              </div>
              {!profile.isPt ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '2px', borderTop: '1px dashed var(--border-color)', paddingTop: '6px', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Bệnh nền & Chấn thương:</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-orange)' }}>{profile.medicalCondition || 'Không có'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Dị ứng thức ăn:</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-green)' }}>{profile.allergies || 'Không có'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Ngày tập trong tuần:</span>
                    <span style={{ fontWeight: 600 }}>
                      {profile.trainingDays && profile.trainingDays.length > 0 
                        ? profile.trainingDays.join(', ') 
                        : 'Thứ 2, Thứ 4, Thứ 6'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Khung giờ tập:</span>
                    <span style={{ fontWeight: 600 }}>
                      {profile.trainingTimes && profile.trainingTimes.length > 0 
                        ? profile.trainingTimes.join(', ') 
                        : (profile.trainingTime || '06:00 PM - 08:00 PM')}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '2px', borderTop: '1px dashed var(--border-color)', paddingTop: '6px', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Chứng chỉ hành nghề PT:</span>
                    <span style={{ fontWeight: 600, color: '#ffd700' }}>
                      {profile.certificates || "Bằng HLV Quốc tế NASM-CPT, Đại học Y khoa Phạm Ngọc Thạch"}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Ngày đứng lớp trong tuần:</span>
                    <span style={{ fontWeight: 600 }}>
                      {profile.trainingDays && profile.trainingDays.length > 0 
                        ? profile.trainingDays.join(', ') 
                        : 'Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6, Thứ 7'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Giờ đứng lớp trống:</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-green)' }}>
                      {profile.trainingTimes && profile.trainingTimes.length > 0 
                        ? profile.trainingTimes.join(', ') 
                        : (profile.trainingTime || '08:00 AM - 09:00 PM')}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Hồ sơ chuyên sâu Button (For self profiles) */}
            {profile.isSelf && (
              <div 
                onClick={() => setShowChuyenSau(true)}
                className="glass-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  borderColor: 'rgba(57, 255, 20, 0.3)',
                  background: 'rgba(57, 255, 20, 0.05)',
                  cursor: 'pointer',
                  marginBottom: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HeartPulse size={18} color="var(--accent-green)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>Hồ sơ chuyên sâu</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Bệnh nền, dị ứng & lịch hoạt động</div>
                  </div>
                </div>
                <ArrowRight size={16} color="var(--accent-green)" />
              </div>
            )}

            {/* Action Buttons */}
            {(() => {
              const cleanProfileName = profile.name.replace(/\s*\(Bạn\)/g, '').trim();
              const isFriend = (friendsList || []).some(name => name === profile.name || name.replace(/\s*\(Bạn\)/g, '').trim() === cleanProfileName);
              const isSent = (sentRequests || []).some(name => name === profile.name || name.replace(/\s*\(Bạn\)/g, '').trim() === cleanProfileName);

              if (profile.isSelf) {
                return null;
              }

              return (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {profile.isPt ? (
                    <>
                      <button className="btn-primary" onClick={handleBook} style={{ flex: 1.2 }}>
                        Đặt lịch hẹn
                      </button>
                      {isFriend ? (
                        <>
                          <button 
                            className="btn-secondary" 
                            onClick={() => onOpenChat && onOpenChat(profile.name)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(30, 117, 255, 0.12)', borderColor: 'rgba(30, 117, 255, 0.4)', color: '#4da3ff' }}
                          >
                            <MessageCircle size={15} /> Nhắn tin
                          </button>
                          <button 
                            className="btn-secondary" 
                            onClick={() => onUnfriend && onUnfriend(profile.name)}
                            title="Hủy kết bạn"
                            style={{ padding: '12px', background: 'rgba(255, 87, 34, 0.1)', color: 'var(--accent-orange)', borderColor: 'rgba(255, 87, 34, 0.3)' }}
                          >
                            <UserX size={15} />
                          </button>
                        </>
                      ) : isSent ? (
                        <button className="btn-secondary" onClick={() => onCancelSentRequest && onCancelSentRequest(profile.name)} style={{ padding: '12px', background: 'rgba(255, 87, 34, 0.1)', color: 'var(--accent-orange)' }}>
                          <Clock size={16} />
                        </button>
                      ) : (
                        <button className="btn-secondary" onClick={() => onSendFriendRequest && onSendFriendRequest(profile)} style={{ padding: '12px' }}>
                          <UserPlus size={16} />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {isFriend ? (
                        <>
                          <button 
                            className="btn-primary" 
                            onClick={() => onOpenChat && onOpenChat(profile.name)}
                            style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                          >
                            <MessageCircle size={16} />
                            Nhắn tin
                          </button>
                          <button 
                            className="btn-secondary" 
                            onClick={() => onUnfriend && onUnfriend(profile.name)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--accent-orange)', borderColor: 'rgba(255, 87, 34, 0.3)', background: 'rgba(255, 87, 34, 0.08)' }}
                          >
                            <UserX size={15} />
                            Hủy kết bạn
                          </button>
                        </>
                      ) : isSent ? (
                        <button className="btn-secondary" onClick={() => onCancelSentRequest && onCancelSentRequest(profile.name)} style={{ flex: 1, background: 'rgba(255, 87, 34, 0.1)', color: 'var(--accent-orange)' }}>
                          <Clock size={16} />
                          Đã gửi lời mời
                        </button>
                      ) : (
                        <button className="btn-primary" onClick={() => onSendFriendRequest && onSendFriendRequest(profile)} style={{ flex: 1 }}>
                          <UserPlus size={16} />
                          Kết bạn
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })()}

            {/* Student Reviews Card (For PTs, now below Personal Details & Action buttons) */}
            {profile.isPt && (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} fill="#ffb300" stroke="none" /> Đánh giá từ học viên ({(mockReviews[profile.name.replace(' (Bạn)', '')] || []).length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {(mockReviews[profile.name.replace(' (Bạn)', '')] || []).length > 0 ? (
                    (mockReviews[profile.name.replace(' (Bạn)', '')] || []).map((rev) => (
                      <div key={rev.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '6px 8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{rev.student}</span>
                          <span style={{ fontSize: '10px', color: '#ffb300', fontWeight: 700 }}>★ {rev.rating}</span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.3' }}>{rev.comment}</p>
                        <span style={{ fontSize: '9px', color: 'var(--text-secondary)', alignSelf: 'flex-end' }}>{rev.date}</span>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>
                      Chưa có lượt đánh giá nào dành cho HLV này.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* User Posts Card */}
            {userPosts && userPosts.length > 0 && (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', fontSize: '12.5px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '4px' }}>
                  Bài viết cộng đồng ({userPosts.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '2px' }}>
                  {userPosts.map(post => {
                    const totalReacts = (post.reactions.love || 0) + (post.reactions.fire || 0) + (post.reactions.haha || 0);
                    return (
                      <div key={post.id} style={{ 
                        padding: '8px 10px', 
                        background: 'rgba(255,255,255,0.01)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                          {post.content}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-secondary)' }}>
                          <span>❤️ {totalReacts} tương tác</span>
                          
                          {/* Badges */}
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {post.isKnowledge && !post.isQuality && (
                              <span style={{ color: '#2f80ed', background: 'rgba(47, 128, 237, 0.1)', padding: '1px 4px', borderRadius: '4px', fontSize: '9px', fontWeight: 700 }}>
                                ⏳ Đang duyệt
                              </span>
                            )}
                            {post.isQuality && (
                              <span style={{ color: '#ffd700', background: 'rgba(255, 215, 0, 0.1)', padding: '1px 4px', borderRadius: '4px', fontSize: '9px', fontWeight: 700 }}>
                                📚 Kiến thức chất lượng
                              </span>
                            )}
                            
                            {/* Coin Reward Info: ONLY show when profile.isSelf is true */}
                            {profile.isSelf && post.isKnowledge && (
                              <span style={{ color: 'var(--accent-green)', background: 'rgba(57, 255, 20, 0.1)', padding: '1px 4px', borderRadius: '4px', fontSize: '9px', fontWeight: 700 }}>
                                +{post.isQuality ? (post.pointsAwarded || Math.floor(totalReacts / 5)) : 0} xu
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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

      {/* ChuyenSau Screen Overlay */}
      {showChuyenSau && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--bg-dark)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <ChuyenSau 
            myProfile={profile} 
            onUpdateProfile={(updated) => {
              if (onUpdateProfile) onUpdateProfile(updated);
            }} 
            onClose={() => setShowChuyenSau(false)} 
            showToast={showToast} 
          />
        </div>
      )}

      {/* PT Certificates Modal Overlay */}
      {showCertificates && (
        <PTCertificatesModal
          profile={profile}
          isSelf={profile.isSelf}
          onClose={() => setShowCertificates(false)}
          onUpdateVerification={(updatedVerification) => {
            if (onUpdateProfile) {
              onUpdateProfile(updatedVerification);
            }
          }}
          showToast={showToast}
        />
      )}

      {/* Avatar Profile Modal Overlay ("Ảnh hồ sơ") */}
      {showAvatarModal && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(8, 10, 14, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 3500,
            borderRadius: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px 16px 24px 16px',
            overflow: 'hidden'
          }}
          onClick={() => setShowAvatarModal(false)}
        >
          {/* Top Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'white', margin: 0 }}>
              Ảnh hồ sơ
            </h3>
            <button
              type="button"
              onClick={() => setShowAvatarModal(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Center Circular Avatar Preview */}
          <div 
            style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '16px',
              padding: '16px 0' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Big Circular Avatar Frame */}
            <div style={{
              width: '210px',
              height: '210px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(57, 255, 20, 0.5)',
              boxShadow: '0 0 40px rgba(57, 255, 20, 0.15)',
              position: 'relative',
              background: '#121820'
            }}>
              <img 
                src={profile.avatar || DEFAULT_AVATAR} 
                alt={profile.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Visibility Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '5px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              color: 'var(--text-secondary)'
            }}>
              <Eye size={12} color="var(--accent-green)" />
              <span>Mọi người trên FitMate</span>
            </div>

            {/* Presets List if showPresetPicker is true */}
            {showPresetPicker && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '10px',
                display: 'flex',
                gap: '8px',
                maxWidth: '100%',
                overflowX: 'auto',
                scrollbarWidth: 'none'
              }}>
                {AVATAR_PRESETS.map((preset, idx) => (
                  <img
                    key={idx}
                    src={preset}
                    alt={`Preset ${idx}`}
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(57, 255, 20, 0.4)',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={avatarInputRef} 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleUploadAvatar}
          />

          {/* Bottom Action Buttons (Chỉnh sửa, Cập nhật, Xóa) */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              width: '100%', 
              paddingTop: '16px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.08)' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {profile.isSelf ? (
              <>
                <div style={{ display: 'flex', gap: '28px' }}>
                  {/* Chỉnh sửa (Đổi mẫu preset) */}
                  <button
                    type="button"
                    onClick={() => setShowPresetPicker(!showPresetPicker)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: showPresetPicker ? 'var(--accent-green)' : 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Edit3 size={18} />
                    <span>Chỉnh sửa</span>
                  </button>

                  {/* Cập nhật (Upload ảnh từ máy) */}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Camera size={18} color="var(--accent-green)" />
                    <span>Cập nhật</span>
                  </button>
                </div>

                {/* Xóa ảnh */}
                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-orange)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={18} />
                  <span>Xóa</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="btn-secondary"
                style={{ width: '100%', padding: '10px' }}
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
