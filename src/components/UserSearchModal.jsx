import React, { useState } from 'react';
import { ArrowLeft, Search, UserPlus, Check, Clock, Star, Award, X, Sparkles, Filter } from 'lucide-react';

export const ALL_SYSTEM_USERS = [
  {
    id: 'user_0',
    name: 'Hùng',
    role: 'Hội viên',
    category: 'member',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
    bio: 'Đạt body 6 múi, cải thiện sức bền bỉ và thâm hụt mỡ bụng! 🏋️‍♂️🔥',
    spec: ['Tập thể hình', 'Giảm mỡ'],
    isPt: false,
    isVerified: false
  },
  {
    id: 'user_1',
    name: 'Mai Xuân Tú',
    role: 'Huấn luyện viên',
    category: 'pt',
    avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=60',
    bio: 'Giúp học viên đạt mục tiêu hình thể Calisthenics tối ưu, xây dựng lối sống lành mạnh.',
    spec: ['Calisthenics', 'Giảm cân nhanh', 'Sức bền'],
    rating: '4.9',
    exp: '3 năm kinh nghiệm',
    price: '300.000đ/buổi',
    isPt: true,
    isVerified: true
  },
  {
    id: 'user_2',
    name: 'Nguyễn Minh Khang',
    role: 'Huấn luyện viên',
    category: 'pt',
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=60',
    bio: 'Hỗ trợ học viên tăng cơ chuyên sâu, tối ưu hóa dinh dưỡng & tập Powerlifting bài bản.',
    spec: ['Tăng cơ', 'Dinh dưỡng chuyên sâu', 'Powerlifting'],
    rating: '4.8',
    exp: '1.5 năm kinh nghiệm',
    price: '250.000đ/buổi',
    isPt: true,
    isVerified: true
  },
  {
    id: 'user_3',
    name: 'Phạm Tấn',
    role: 'Huấn luyện viên',
    category: 'pt',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60',
    bio: 'Hướng dẫn tập luyện cơ bản và chỉnh form chi tiết cho hội viên mới bắt đầu.',
    spec: ['Chỉnh sửa dáng tập', 'Tập cơ bản', 'Cardio'],
    rating: '4.7',
    exp: '1 năm kinh nghiệm',
    price: '200.000đ/buổi',
    isPt: true,
    isVerified: true
  },
  {
    id: 'user_4',
    name: 'Hoàng Gia Bảo',
    role: 'Leader CoreCrafter',
    category: 'member',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
    bio: 'Tăng 5kg cơ bắp, cải thiện kỹ năng Planche và Handstand! 🔥💪',
    spec: ['Calisthenics Athlete', 'Core Workout'],
    isPt: false,
    isVerified: false
  },
  {
    id: 'user_5',
    name: 'Nguyễn Phúc Thịnh',
    role: 'Thành viên',
    category: 'member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
    bio: 'Giảm 4kg mỡ thừa, duy trì lối sống lành mạnh ăn sạch sống khỏe! 🍜🥗',
    spec: ['Eat Clean', 'Fat Loss'],
    isPt: false,
    isVerified: false
  },
  {
    id: 'user_6',
    name: 'Nguyễn Đào Tùng Lâm',
    role: 'Thành viên',
    category: 'member',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=60',
    bio: 'Đạt mốc Bench Press 100kg và cải thiện sức mạnh thân dưới! 🏋️‍♂️✨',
    spec: ['Hypertrophy', 'Strength'],
    isPt: false,
    isVerified: false
  },
  {
    id: 'user_7',
    name: 'Lê Thị Mai',
    role: 'Mentor Yoga & Giãn cơ',
    category: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60',
    bio: 'Chuyên gia phục hồi cơ bắp, giãn cơ sâu và điều hòa nhịp thở y khoa.',
    spec: ['Yoga Phục Hồi', 'Flexibility', 'Mindfulness'],
    isPt: true,
    isVerified: true
  },
  {
    id: 'user_8',
    name: 'Đỗ Văn Đức',
    role: 'Street Workout Master',
    category: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60',
    bio: 'Vận động viên Street Workout quốc gia, hướng dẫn Muscle-up & Front Lever an toàn.',
    spec: ['Muscle-up', 'Front Lever', 'Bodyweight'],
    isPt: true,
    isVerified: true
  },
  {
    id: 'user_9',
    name: 'Trần Quốc Huy',
    role: 'Chuyên gia Dinh dưỡng',
    category: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60',
    bio: 'Tư vấn chế độ dinh dưỡng thâm hụt calo chuẩn viện dinh dưỡng quốc gia.',
    spec: ['Dinh dưỡng lâm sàng', 'Macro Diet', 'Meal Prep'],
    isPt: false,
    isVerified: true
  },
  {
    id: 'user_10',
    name: 'Lê Hoàng Long',
    role: 'Thành viên',
    category: 'member',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=60',
    bio: 'Yêu thích chạy bộ marathon và rèn luyện sức bền tim mạch.',
    spec: ['Running', 'Endurance'],
    isPt: false,
    isVerified: false
  },
  {
    id: 'user_11',
    name: 'Phạm Minh Đức',
    role: 'Thành viên',
    category: 'member',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60',
    bio: 'Tập luyện để tăng thể lực và cải thiện vóc dáng sau giờ làm việc.',
    spec: ['Fitness', 'Cardio'],
    isPt: false,
    isVerified: false
  }
];

export default function UserSearchModal({
  onClose,
  onOpenProfile,
  onSendFriendRequest,
  onCancelSentRequest,
  sentRequests,
  friendsList,
  myProfile,
  showToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'pt' | 'member' | 'mentor'

  const currentUserName = (myProfile?.name || '').replace('(Bạn)', '').trim().toLowerCase();

  // Search filter logic
  const filteredUsers = ALL_SYSTEM_USERS.filter(user => {
    // Exclude myself from searching
    const isSelf = user.name.toLowerCase() === currentUserName;
    if (isSelf) return false;

    // Category filter
    if (categoryFilter !== 'all' && user.category !== categoryFilter) {
      return false;
    }

    // Search query matching (contain in name, role, bio, spec)
    if (!searchTerm.trim()) return true;

    const term = searchTerm.trim().toLowerCase();
    const matchName = user.name.toLowerCase().includes(term);
    const matchRole = user.role.toLowerCase().includes(term);
    const matchBio = (user.bio || '').toLowerCase().includes(term);
    const matchSpec = (user.spec || []).some(s => s.toLowerCase().includes(term));

    return matchName || matchRole || matchBio || matchSpec;
  });

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(12, 15, 18, 0.98)',
      zIndex: 3000,
      borderRadius: '30px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      overflowY: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
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
          <h3 style={{ fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={17} color="var(--accent-green)" /> Tìm kiếm người dùng
          </h3>
          <p className="subtitle" style={{ fontSize: '10px' }}>Kết nối với HLV, thành viên và chuyên gia thể thao</p>
        </div>
      </div>

      {/* Search Input Box */}
      <div style={{ position: 'relative' }}>
        <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Nhập tên người dùng, HLV, mentor (vd: Bảo, Tú, Thịnh, Yoga...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '10px 36px 10px 38px',
            color: 'white',
            fontSize: '12.5px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Categories Chips */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'pt', label: 'Huấn luyện viên (PT)' },
          { id: 'member', label: 'Hội viên' },
          { id: 'mentor', label: 'Chuyên gia / Mentor' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            style={{
              padding: '5px 12px',
              borderRadius: '20px',
              border: '1px solid',
              background: categoryFilter === cat.id ? 'rgba(57, 255, 20, 0.12)' : 'rgba(255, 255, 255, 0.02)',
              borderColor: categoryFilter === cat.id ? 'var(--accent-green)' : 'var(--border-color)',
              color: categoryFilter === cat.id ? 'var(--accent-green)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* User Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {searchTerm ? `Kết quả tìm kiếm (${filteredUsers.length})` : `Gợi ý người dùng (${filteredUsers.length})`}
          </span>
        </div>

        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => {
            const isSelf = user.name.toLowerCase() === currentUserName;
            const isFriend = (friendsList || []).includes(user.name);
            const isSent = (sentRequests || []).includes(user.name);

            return (
              <div
                key={user.id}
                className="glass-card"
                style={{
                  padding: '12px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderColor: isFriend ? 'rgba(57, 255, 20, 0.25)' : 'var(--border-color)'
                }}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  onClick={() => onOpenProfile && onOpenProfile(user)}
                  style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover', cursor: 'pointer', flexShrink: 0 }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span 
                      onClick={() => onOpenProfile && onOpenProfile(user)}
                      style={{ fontSize: '13px', fontWeight: 700, color: 'white', cursor: 'pointer' }}
                    >
                      {user.name}
                    </span>
                    {user.isVerified && (
                      <span style={{ fontSize: '9px', background: 'rgba(57, 255, 20, 0.1)', color: 'var(--accent-green)', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                        ✓
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '10.5px', color: 'var(--accent-green)', fontWeight: 600, marginTop: '1px' }}>
                    {user.role}
                  </div>

                  <p style={{
                    fontSize: '10px',
                    color: 'var(--text-secondary)',
                    marginTop: '3px',
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {user.bio}
                  </p>
                </div>

                {/* Friend Connection Action */}
                <div style={{ flexShrink: 0 }}>
                  {isSelf ? (
                    <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }}>
                      Bạn
                    </span>
                  ) : isFriend ? (
                    <span style={{
                      fontSize: '10.5px',
                      color: 'var(--accent-green)',
                      background: 'rgba(57, 255, 20, 0.1)',
                      border: '1px solid rgba(57, 255, 20, 0.3)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <Check size={11} /> Bạn bè
                    </span>
                  ) : isSent ? (
                    <button
                      onClick={() => onCancelSentRequest && onCancelSentRequest(user.name)}
                      style={{
                        background: 'rgba(255, 87, 34, 0.08)',
                        border: '1px solid rgba(255, 87, 34, 0.25)',
                        color: 'var(--accent-orange)',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Clock size={11} /> Đã gửi
                    </button>
                  ) : (
                    <button
                      onClick={() => onSendFriendRequest && onSendFriendRequest(user)}
                      style={{
                        background: 'var(--accent-green)',
                        border: 'none',
                        color: 'var(--bg-dark)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(57, 255, 20, 0.2)'
                      }}
                    >
                      <UserPlus size={12} /> Kết bạn
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px' }}>
            <Search size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p style={{ fontSize: '12.5px' }}>Không tìm thấy người dùng nào khớp với "{searchTerm}".</p>
            <p className="subtitle" style={{ fontSize: '10px', marginTop: '4px' }}>Thử tìm theo tên, vai trò hoặc từ khóa khác.</p>
          </div>
        )}
      </div>
    </div>
  );
}
