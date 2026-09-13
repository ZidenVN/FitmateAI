import React, { useState, useEffect } from 'react';
import { Home, Camera, Calendar, MessageSquare, Battery, Wifi, Signal, Award, CheckCircle, Flame } from 'lucide-react';
import Dashboard from './components/Dashboard';
import NutritionVision from './components/NutritionVision';
import WorkoutPlanner from './components/WorkoutPlanner';
import CompanionAndSocial from './components/CompanionAndSocial';
import PtMarketplace from './components/PtMarketplace';
import UserProfile from './components/UserProfile';
import Messenger from './components/Messenger';
import Appointments from './components/Appointments';
import Auth from './components/Auth';
import ChuyenSau from './components/ChuyenSau';
import { ALL_SYSTEM_USERS } from './components/UserSearchModal';

const DEFAULT_USERS = {
  'user@fitmate.vn': {
    email: 'user@fitmate.vn',
    password: '123456',
    profile: {
      name: 'Hùng (Bạn)',
      role: 'Hội viên',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
      bio: 'Đạt body 6 múi, cải thiện sức bền bỉ và thâm hụt mỡ bụng! 🏋️‍♂️🔥',
      phone: '0912345678',
      birthday: '15/05/2004',
      gender: 'Nam',
      height: '175 cm',
      weight: '70 kg',
      isPt: false,
      isSelf: true,
      medicalCondition: 'Không có',
      allergies: 'Không có',
      trainingDays: ['Thứ 2', 'Thứ 4', 'Thứ 6'],
      trainingTime: '06:00 PM - 08:00 PM',
      trainingTimes: ['06:00 PM - 08:00 PM']
    },
    streak: 7,
    rewardPoints: 250,
    caloriesConsumed: 1250,
    caloriesBurned: 0,
    workoutSummary: null,
    appointments: [
      { id: 1, ptName: 'Mai Xuân Tú', userName: 'Hùng', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60', date: '2026-06-18', time: '09:00', status: 'Đã hẹn' },
      { id: 2, ptName: 'Nguyễn Minh Khang', userName: 'Hùng', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60', date: '2026-06-15', time: '14:30', status: 'Đã xong' }
    ],
    aiChats: [
      {
        id: 1,
        title: "Tư vấn dinh dưỡng 🍳",
        messages: [{ id: 1, text: "Chào Hùng! Mình có thể giúp gì về thực đơn dinh dưỡng hôm nay?", sender: 'buddy' }]
      },
      {
        id: 2,
        title: "Kế hoạch tập ngực 💪",
        messages: [{ id: 1, text: "Chào Hùng! Hôm nay bạn muốn tập ngực hiệuavor hơn đúng không?", sender: 'buddy' }]
      },
      {
        id: 3,
        title: "Hỏi về Calisthenics 🤸‍♂️",
        messages: [{ id: 1, text: "Chào Hùng! Bạn muốn tìm hiểu kỹ thuật chống đẩy hay lên xà?", sender: 'buddy' }]
      }
    ],
    notifications: [
      {
        id: 1,
        type: 'friend_request',
        senderName: 'Nguyễn Phúc Thịnh',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
        senderRole: 'Thành viên',
        message: 'Nguyễn Phúc Thịnh đã gửi cho bạn một lời mời kết bạn.',
        time: '15 phút trước',
        read: false,
        status: 'pending'
      },
      {
        id: 2,
        type: 'friend_request',
        senderName: 'Hoàng Gia Bảo',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
        senderRole: 'Leader CoreCrafter',
        message: 'Hoàng Gia Bảo đã gửi cho bạn một lời mời kết bạn.',
        time: '1 giờ trước',
        read: false,
        status: 'pending'
      },
      {
        id: 3,
        type: 'streak',
        title: 'Thưởng chuỗi Streak 🔥',
        message: 'Chúc mừng bạn đã duy trì chuỗi Streak 7 ngày tập luyện!',
        time: 'Hôm qua',
        read: true
      }
    ],
    friendRequests: [
      {
        id: 1,
        name: 'Nguyễn Phúc Thịnh',
        role: 'Thành viên',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
        bio: 'Giảm 4kg mỡ thừa, duy trì lối sống lành mạnh ăn sạch sống khỏe! 🍜🥗',
        time: '15 phút trước',
        status: 'pending'
      },
      {
        id: 2,
        name: 'Hoàng Gia Bảo',
        role: 'Leader CoreCrafter',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
        bio: 'Tăng 5kg cơ bắp, cải thiện kỹ năng Planche và Handstand! 🔥💪',
        time: '1 giờ trước',
        status: 'pending'
      }
    ],
    sentRequests: [],
    friendsList: ['Nguyễn Đào Tùng Lâm'],
    conversations: {
      'Nguyễn Đào Tùng Lâm': [
        { id: 1, text: 'Chào bạn! Cùng nhau tập luyện và giữ streak đều đặn nhé! 💪🔥', sender: 'friend', time: '08:30' },
        { id: 2, text: 'Ok người anh em, cùng cố gắng nào!', sender: 'user', time: '08:35' }
      ]
    }
  },
  'pt@fitmate.vn': {
    email: 'pt@fitmate.vn',
    password: '123456',
    profile: {
      name: 'Mai Xuân Tú (Bạn)',
      role: 'Huấn luyện viên',
      avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=60',
      bio: 'Giúp học viên đạt mục tiêu hình thể Calisthenics tối ưu, xây dựng lối sống lành mạnh.',
      phone: '0368947538',
      birthday: '20/10/1998',
      gender: 'Nam',
      height: '174 cm',
      weight: '68 kg',
      isPt: true,
      isSelf: true,
      spec: ['Calisthenics', 'Giảm cân nhanh', 'Sức bền'],
      exp: '3 năm kinh nghiệm',
      isVerified: true,
      certificateStatus: 'verified',
      certificates: [
        {
          id: 'cert_1',
          name: 'Chứng chỉ Huấn Luyện Viên Quốc Tế (NASM - CPT)',
          organization: 'National Academy of Sports Medicine (NASM)',
          issueDate: '15/06/2023',
          code: 'NASM-CPT-892301',
          type: 'Chứng chỉ quốc tế',
          image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=1000&auto=format&fit=crop&q=80'
        },
        {
          id: 'cert_2',
          name: 'Chứng chỉ Calisthenics Master Trainer Level 3',
          organization: 'World Street Workout & Calisthenics Federation (WSWCF)',
          issueDate: '10/01/2024',
          code: 'WSWCF-VN-2024-04',
          type: 'Chứng nhận chuyên môn',
          image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1000&auto=format&fit=crop&q=80'
        }
      ],
      medicalCondition: 'Không có',
      allergies: 'Không có',
      trainingDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
      trainingTime: '08:00 AM - 09:00 PM',
      trainingTimes: ['08:00 AM - 09:00 PM']
    },
    streak: 15,
    rewardPoints: 500,
    caloriesConsumed: 1800,
    caloriesBurned: 350,
    workoutSummary: null,
    appointments: [
      { id: 1, ptName: 'Mai Xuân Tú', userName: 'Hùng', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60', date: '2026-06-18', time: '09:00', status: 'Đã hẹn' }
    ],
    aiChats: [
      {
        id: 1,
        title: "Tư vấn Huấn luyện viên 🤸‍♂️",
        messages: [{ id: 1, text: "Chào HLV Tú! Hôm nay thầy muốn xem giáo án nào?", sender: 'buddy' }]
      }
    ],
    notifications: [
      {
        id: 101,
        type: 'friend_request',
        senderName: 'Lê Hoàng Long',
        senderAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=60',
        senderRole: 'Hội viên mới',
        message: 'Lê Hoàng Long đã gửi lời mời kết bạn để nhờ tư vấn lộ trình.',
        time: '20 phút trước',
        read: false,
        status: 'pending'
      },
      {
        id: 102,
        type: 'appointment',
        title: 'Lịch hẹn mới 📅',
        message: 'Học viên Hùng đã đặt lịch hẹn Calisthenics với bạn lúc 09:00',
        time: '1 giờ trước',
        read: false
      },
      {
        id: 103,
        type: 'streak',
        title: 'HLV Xuất Sắc 🏆',
        message: 'Chúc mừng HLV Tú đã hoàn thành 15 ngày hướng dẫn liên tục!',
        time: 'Hôm qua',
        read: true
      }
    ],
    friendRequests: [
      {
        id: 101,
        name: 'Lê Hoàng Long',
        role: 'Hội viên mới',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=60',
        bio: 'Yêu thích chạy bộ marathon và rèn luyện sức bền tim mạch.',
        time: '20 phút trước',
        status: 'pending'
      }
    ],
    sentRequests: [],
    friendsList: ['Nguyễn Minh Khang'],
    conversations: {
      'Nguyễn Minh Khang': [
        { id: 1, text: 'Thầy Tú ơi, tuần này giao lưu một buổi Calisthenics kết hợp Powerlifting không?', sender: 'friend', time: '08:00' },
        { id: 2, text: 'Ý kiến hay đấy Khang! Chiều thứ 7 nhé!', sender: 'user', time: '08:15' }
      ]
    }
  }
};

export default function App() {
  const [usersDb, setUsersDb] = useState(() => {
    const saved = localStorage.getItem('fitmate_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.keys(DEFAULT_USERS).forEach(email => {
          if (!parsed[email]) {
            parsed[email] = DEFAULT_USERS[email];
          } else {
            parsed[email] = {
              ...DEFAULT_USERS[email],
              ...parsed[email],
              notifications: parsed[email].notifications !== undefined ? parsed[email].notifications : DEFAULT_USERS[email].notifications,
              friendRequests: parsed[email].friendRequests !== undefined ? parsed[email].friendRequests : DEFAULT_USERS[email].friendRequests,
              sentRequests: parsed[email].sentRequests !== undefined ? parsed[email].sentRequests : DEFAULT_USERS[email].sentRequests,
              friendsList: parsed[email].friendsList !== undefined ? parsed[email].friendsList : DEFAULT_USERS[email].friendsList,
              conversations: parsed[email].conversations !== undefined ? parsed[email].conversations : DEFAULT_USERS[email].conversations
            };
          }
        });
        return parsed;
      } catch (e) {}
    }
    return DEFAULT_USERS;
  });

  const [currentUserEmail, setCurrentUserEmail] = useState(() => {
    return localStorage.getItem('fitmate_current_user') || '';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('fitmate_current_user');
  });

  const [screen, setScreen] = useState('dashboard');

  const [caloriesConsumed, setCaloriesConsumed] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || '';
    if (currentUser && db[currentUser]) {
      return db[currentUser].caloriesConsumed !== undefined ? db[currentUser].caloriesConsumed : 1250;
    }
    return 1250;
  });

  const [caloriesBurned, setCaloriesBurned] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || '';
    if (currentUser && db[currentUser]) {
      return db[currentUser].caloriesBurned !== undefined ? db[currentUser].caloriesBurned : 0;
    }
    return 0;
  });

  const [workoutSummary, setWorkoutSummary] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || '';
    if (currentUser && db[currentUser]) {
      return db[currentUser].workoutSummary !== undefined ? db[currentUser].workoutSummary : null;
    }
    return null;
  });

  const [streak, setStreak] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || '';
    if (currentUser && db[currentUser]) {
      return db[currentUser].streak !== undefined ? db[currentUser].streak : 7;
    }
    return 7;
  });

  const [rewardPoints, setRewardPoints] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || '';
    if (currentUser && db[currentUser]) {
      return db[currentUser].rewardPoints !== undefined ? db[currentUser].rewardPoints : 250;
    }
    return 250;
  });

  const [currentTime, setCurrentTime] = useState('09:41');
  const [dietState, setDietState] = useState('normal'); // 'normal', 'skipped_breakfast', 'overeating'
  const [workoutState, setWorkoutState] = useState('normal'); // 'normal', 'skipped', 'completed'
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [justCompletedWorkout, setJustCompletedWorkout] = useState(false);
  const [appToast, setAppToast] = useState(null); // { message: '', type: 'success' | 'orange' }

  const showToast = (message, type = 'success') => {
    setAppToast({ message, type });
  };

  useEffect(() => {
    if (appToast) {
      const timer = setTimeout(() => {
        setAppToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appToast]);

  useEffect(() => {
    const userId = localStorage.getItem('fitmate_user_id');
    if (userId) {
      fetch(`http://localhost:8080/api/user/profile/${userId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setMyProfile(prev => ({
              ...prev,
              ...data,
              name: data.name.includes('(Bạn)') ? data.name : data.name + ' (Bạn)',
              role: data.role
            }));
          }
        })
        .catch(err => console.warn("Failed to auto-fetch profile from BE:", err));
    }
  }, []);

  const [myProfile, setMyProfile] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || '';
    if (currentUser && db[currentUser]) {
      return db[currentUser].profile;
    }
    return DEFAULT_USERS['user@fitmate.vn'].profile;
  });

  // Mock profiles database for other members & PTs (non-login accounts)
  const mockProfiles = {
    'Hùng': {
      name: 'Hùng',
      role: 'Hội viên',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
      bio: 'Đạt body 6 múi, cải thiện sức bền bỉ và thâm hụt mỡ bụng! 🏋️‍♂️🔥',
      phone: '0912345678',
      birthday: '15/05/2004',
      gender: 'Nam',
      height: '175 cm',
      weight: '70 kg',
      isPt: false,
      isSelf: false,
      medicalCondition: 'Không có',
      allergies: 'Không có',
      trainingDays: ['Thứ 2', 'Thứ 4', 'Thứ 6'],
      trainingTime: '06:00 PM - 08:00 PM',
      trainingTimes: ['06:00 PM - 08:00 PM']
    },
    'Hoàng Gia Bảo': {
      name: 'Hoàng Gia Bảo',
      role: 'Leader CoreCrafter',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
      bio: 'Tăng 5kg cơ bắp, cải thiện kỹ năng Planche và Handstand! 🔥💪',
      phone: '0987654321',
      birthday: '12/03/2005',
      gender: 'Nam',
      height: '172 cm',
      weight: '65 kg',
      isPt: false,
      isSelf: false
    },
    'Nguyễn Phúc Thịnh': {
      name: 'Nguyễn Phúc Thịnh',
      role: 'Thành viên',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
      bio: 'Giảm 4kg mỡ thừa, duy trì lối sống lành mạnh ăn sạch sống khỏe! 🍜🥗',
      phone: '0901234567',
      birthday: '25/08/2004',
      gender: 'Nam',
      height: '178 cm',
      weight: '72 kg',
      isPt: false,
      isSelf: false
    },
    'Nguyễn Đào Tùng Lâm': {
      name: 'Nguyễn Đào Tùng Lâm',
      role: 'Thành viên',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=60',
      bio: 'Đạt mốc Bench Press 100kg và cải thiện sức mạnh thân dưới! 🏋️‍♂️✨',
      phone: '0934567890',
      birthday: '09/09/2003',
      gender: 'Nam',
      height: '180 cm',
      weight: '82 kg',
      isPt: false,
      isSelf: false
    },
    'Mai Xuân Tú': {
      name: 'Mai Xuân Tú',
      role: 'Huấn luyện viên',
      avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=60',
      bio: 'Giúp học viên đạt mục tiêu hình thể Calisthenics tối ưu, xây dựng lối sống lành mạnh.',
      phone: '0368947538',
      birthday: '20/10/1998',
      gender: 'Nam',
      height: '174 cm',
      weight: '68 kg',
      isPt: true,
      isSelf: false,
      spec: ['Calisthenics', 'Giảm cân nhanh', 'Sức bền'],
      exp: '3 năm kinh nghiệm',
      price: '300.000đ/buổi',
      isVerified: true
    },
    'Nguyễn Minh Khang': {
      name: 'Nguyễn Minh Khang',
      role: 'Huấn luyện viên',
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=60',
      bio: 'Hỗ trợ học viên tăng cơ chuyên sâu, tối ưu hóa dinh dưỡng & tập Powerlifting bài bản.',
      phone: '0933268918',
      birthday: '17/12/2001',
      gender: 'Nam',
      height: '182 cm',
      weight: '85 kg',
      isPt: true,
      isSelf: false,
      spec: ['Tăng cơ', 'Dinh dưỡng chuyên sâu', 'Powerlifting'],
      exp: '1.5 năm kinh nghiệm',
      price: '250.000đ/buổi',
      isVerified: true
    },
    'Phạm Tấn': {
      name: 'Phạm Tấn',
      role: 'Huấn luyện viên',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60',
      bio: 'Hướng dẫn tập luyện cơ bản và chỉnh form chi tiết cho hội viên mới.',
      phone: '0977254381',
      birthday: '05/06/2000',
      gender: 'Nam',
      height: '176 cm',
      weight: '72 kg',
      isPt: true,
      isSelf: false,
      spec: ['Chỉnh sửa dáng tập', 'Tập cơ bản', 'Cardio'],
      exp: '1 năm kinh nghiệm',
      price: '200.000đ/buổi',
      isVerified: true
    }
  };

  const [aiChats, setAiChats] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || '';
    if (currentUser && db[currentUser]) {
      return db[currentUser].aiChats || [];
    }
    return DEFAULT_USERS['user@fitmate.vn'].aiChats;
  });

  const [activeChatId, setActiveChatId] = useState(1);

  const [appointments, setAppointments] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || '';
    if (currentUser && db[currentUser]) {
      return db[currentUser].appointments || [];
    }
    return DEFAULT_USERS['user@fitmate.vn'].appointments;
  });

  // Friend Requests, Notifications & Messenger per-user state
  const [notifications, setNotifications] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || 'user@fitmate.vn';
    if (currentUser && db[currentUser]) {
      return db[currentUser].notifications || [];
    }
    return DEFAULT_USERS['user@fitmate.vn'].notifications || [];
  });

  const [friendRequests, setFriendRequests] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || 'user@fitmate.vn';
    if (currentUser && db[currentUser]) {
      return db[currentUser].friendRequests || [];
    }
    return DEFAULT_USERS['user@fitmate.vn'].friendRequests || [];
  });

  const [sentRequests, setSentRequests] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || 'user@fitmate.vn';
    if (currentUser && db[currentUser]) {
      return db[currentUser].sentRequests || [];
    }
    return DEFAULT_USERS['user@fitmate.vn'].sentRequests || [];
  });

  const [friendsList, setFriendsList] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || 'user@fitmate.vn';
    if (currentUser && db[currentUser]) {
      return db[currentUser].friendsList || [];
    }
    return DEFAULT_USERS['user@fitmate.vn'].friendsList || [];
  });

  const [conversations, setConversations] = useState(() => {
    const savedDb = localStorage.getItem('fitmate_users');
    const db = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
    const currentUser = localStorage.getItem('fitmate_current_user') || 'user@fitmate.vn';
    if (currentUser && db[currentUser]) {
      return db[currentUser].conversations || {};
    }
    return DEFAULT_USERS['user@fitmate.vn'].conversations || {};
  });

  const handleSendFriendRequest = (targetUser) => {
    const targetName = typeof targetUser === 'string' ? targetUser : targetUser.name;
    const cleanTargetName = targetName.replace(/\s*\(Bạn\)/g, '').trim();
    const myCleanName = myProfile?.name ? myProfile.name.replace(/\s*\(Bạn\)/g, '').trim() : 'Bạn';

    if (sentRequests.includes(targetName) || sentRequests.includes(cleanTargetName) || friendsList.includes(targetName) || friendsList.includes(cleanTargetName)) return;

    const newSent = [...sentRequests, cleanTargetName];
    setSentRequests(newSent);

    const newNotif = {
      id: Date.now(),
      type: 'friend_request',
      senderName: myCleanName,
      senderAvatar: myProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
      senderRole: myProfile?.role || 'Hội viên',
      message: `Đã gửi lời mời kết bạn đến ${cleanTargetName}.`,
      time: 'Vừa xong',
      read: true,
      status: 'pending'
    };
    const newNotifications = [newNotif, ...notifications];
    setNotifications(newNotifications);

    setUsersDb(prevDb => {
      const updatedDb = { ...prevDb };
      const recipientEmail = Object.keys(updatedDb).find(em => {
        const u = updatedDb[em];
        const uClean = u.profile?.name?.replace(/\s*\(Bạn\)/g, '').trim();
        return uClean === cleanTargetName || u.profile?.name === cleanTargetName;
      });

      if (recipientEmail && recipientEmail !== currentUserEmail) {
        const recipient = updatedDb[recipientEmail];
        const incomingReq = {
          id: Date.now(),
          name: myCleanName,
          role: myProfile?.role || 'Hội viên',
          avatar: myProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
          bio: myProfile?.bio || 'Thành viên cộng đồng FitMate.',
          time: 'Vừa xong',
          status: 'pending'
        };
        const incomingNotif = {
          id: Date.now(),
          type: 'friend_request',
          senderName: myCleanName,
          senderAvatar: myProfile?.avatar,
          senderRole: myProfile?.role,
          message: `${myCleanName} đã gửi cho bạn một lời mời kết bạn.`,
          time: 'Vừa xong',
          read: false,
          status: 'pending'
        };
        updatedDb[recipientEmail] = {
          ...recipient,
          friendRequests: [incomingReq, ...(recipient.friendRequests || [])],
          notifications: [incomingNotif, ...(recipient.notifications || [])]
        };
      }

      if (currentUserEmail && updatedDb[currentUserEmail]) {
        updatedDb[currentUserEmail] = {
          ...updatedDb[currentUserEmail],
          sentRequests: newSent,
          notifications: newNotifications
        };
      }

      localStorage.setItem('fitmate_users', JSON.stringify(updatedDb));
      return updatedDb;
    });

    showToast(`Đã gửi lời mời kết bạn tới ${cleanTargetName}! 🤝`, 'success');
  };

  const handleCancelSentRequest = (targetName) => {
    const cleanTargetName = targetName.replace(/\s*\(Bạn\)/g, '').trim();
    const myCleanName = myProfile?.name ? myProfile.name.replace(/\s*\(Bạn\)/g, '').trim() : 'Bạn';
    const newSent = sentRequests.filter(name => name !== targetName && name !== cleanTargetName);
    setSentRequests(newSent);

    setUsersDb(prevDb => {
      const updatedDb = { ...prevDb };
      const recipientEmail = Object.keys(updatedDb).find(em => {
        const u = updatedDb[em];
        const uClean = u.profile?.name?.replace(/\s*\(Bạn\)/g, '').trim();
        return uClean === cleanTargetName || u.profile?.name === cleanTargetName;
      });

      if (recipientEmail && recipientEmail !== currentUserEmail) {
        const recipient = updatedDb[recipientEmail];
        updatedDb[recipientEmail] = {
          ...recipient,
          friendRequests: (recipient.friendRequests || []).filter(r => r.name !== myCleanName && r.name !== myProfile?.name),
          notifications: (recipient.notifications || []).filter(n => n.senderName !== myCleanName && n.senderName !== myProfile?.name)
        };
      }

      if (currentUserEmail && updatedDb[currentUserEmail]) {
        updatedDb[currentUserEmail] = {
          ...updatedDb[currentUserEmail],
          sentRequests: newSent
        };
      }

      localStorage.setItem('fitmate_users', JSON.stringify(updatedDb));
      return updatedDb;
    });

    showToast(`Đã hủy lời mời kết bạn với ${cleanTargetName}.`, 'orange');
  };

  const handleAcceptFriendRequest = (req) => {
    const reqName = typeof req === 'string' ? req : req.name;
    const cleanReqName = reqName.replace(/\s*\(Bạn\)/g, '').trim();
    const myCleanName = myProfile?.name ? myProfile.name.replace(/\s*\(Bạn\)/g, '').trim() : 'Bạn';

    const newRequests = friendRequests.filter(r => r.name !== reqName && r.name !== cleanReqName);
    setFriendRequests(newRequests);

    let newFriends = friendsList;
    if (!friendsList.includes(cleanReqName) && !friendsList.includes(reqName)) {
      newFriends = [...friendsList, cleanReqName];
      setFriendsList(newFriends);
    }

    const newNotifications = notifications.map(n => {
      if ((n.senderName === reqName || n.senderName === cleanReqName) && n.type === 'friend_request') {
        return { ...n, status: 'accepted', read: true };
      }
      return n;
    });

    const acceptedNotif = {
      id: Date.now(),
      type: 'system',
      title: 'Kết bạn thành công 🎉',
      message: `Bạn và ${cleanReqName} đã trở thành bạn bè!`,
      time: 'Vừa xong',
      read: false
    };
    const finalNotifications = [acceptedNotif, ...newNotifications];
    setNotifications(finalNotifications);

    setUsersDb(prevDb => {
      const updatedDb = { ...prevDb };
      const senderEmail = Object.keys(updatedDb).find(em => {
        const u = updatedDb[em];
        const uClean = u.profile?.name?.replace(/\s*\(Bạn\)/g, '').trim();
        return uClean === cleanReqName || u.profile?.name === cleanReqName;
      });

      if (senderEmail && senderEmail !== currentUserEmail) {
        const sender = updatedDb[senderEmail];
        const senderFriends = sender.friendsList || [];
        const senderSent = sender.sentRequests || [];
        const senderNotifs = sender.notifications || [];

        const senderAcceptedNotif = {
          id: Date.now() + 1,
          type: 'system',
          title: 'Lời mời được chấp nhận 🎉',
          message: `${myCleanName} đã đồng ý lời mời kết bạn của bạn!`,
          time: 'Vừa xong',
          read: false
        };

        updatedDb[senderEmail] = {
          ...sender,
          sentRequests: senderSent.filter(s => s !== myCleanName && s !== myProfile?.name),
          friendsList: (!senderFriends.includes(myCleanName) && !senderFriends.includes(myProfile?.name)) ? [...senderFriends, myCleanName] : senderFriends,
          notifications: [senderAcceptedNotif, ...senderNotifs]
        };
      }

      if (currentUserEmail && updatedDb[currentUserEmail]) {
        updatedDb[currentUserEmail] = {
          ...updatedDb[currentUserEmail],
          friendRequests: newRequests,
          friendsList: newFriends,
          notifications: finalNotifications
        };
      }

      localStorage.setItem('fitmate_users', JSON.stringify(updatedDb));
      return updatedDb;
    });

    showToast(`Đã đồng ý kết bạn với ${cleanReqName}! 🎉`, 'success');
  };

  const [activeChatFriend, setActiveChatFriend] = useState(null);

  const handleOpenChat = (friendName) => {
    const targetName = typeof friendName === 'string' ? friendName : friendName?.name;
    setSelectedProfile(null);
    setActiveChatFriend(targetName);
    setScreen('messenger');
  };

  const handleUnfriend = (friendName) => {
    const cleanName = typeof friendName === 'string' ? friendName.replace(/\s*\(Bạn\)/g, '').trim() : friendName?.name?.replace(/\s*\(Bạn\)/g, '').trim();
    const myCleanName = myProfile?.name ? myProfile.name.replace(/\s*\(Bạn\)/g, '').trim() : 'Bạn';
    const newFriends = friendsList.filter(name => name !== friendName && name !== cleanName);
    setFriendsList(newFriends);

    setUsersDb(prevDb => {
      const updatedDb = { ...prevDb };
      const friendEmail = Object.keys(updatedDb).find(em => {
        const u = updatedDb[em];
        const uClean = u.profile?.name?.replace(/\s*\(Bạn\)/g, '').trim();
        return uClean === cleanName || u.profile?.name === cleanName;
      });

      if (friendEmail && friendEmail !== currentUserEmail) {
        const friendAcc = updatedDb[friendEmail];
        updatedDb[friendEmail] = {
          ...friendAcc,
          friendsList: (friendAcc.friendsList || []).filter(name => name !== myCleanName && name !== myProfile?.name)
        };
      }

      if (currentUserEmail && updatedDb[currentUserEmail]) {
        updatedDb[currentUserEmail] = {
          ...updatedDb[currentUserEmail],
          friendsList: newFriends
        };
      }

      localStorage.setItem('fitmate_users', JSON.stringify(updatedDb));
      return updatedDb;
    });

    showToast(`Đã hủy kết bạn với ${cleanName}.`, 'orange');
  };

  const handleRejectFriendRequest = (req) => {
    const reqName = typeof req === 'string' ? req : req.name;
    const cleanReqName = reqName.replace(/\s*\(Bạn\)/g, '').trim();
    const myCleanName = myProfile?.name ? myProfile.name.replace(/\s*\(Bạn\)/g, '').trim() : 'Bạn';

    const newRequests = friendRequests.filter(r => r.name !== reqName && r.name !== cleanReqName);
    setFriendRequests(newRequests);

    const newNotifications = notifications.map(n => {
      if ((n.senderName === reqName || n.senderName === cleanReqName) && n.type === 'friend_request') {
        return { ...n, status: 'rejected', read: true };
      }
      return n;
    });
    setNotifications(newNotifications);

    setUsersDb(prevDb => {
      const updatedDb = { ...prevDb };
      const senderEmail = Object.keys(updatedDb).find(em => {
        const u = updatedDb[em];
        const uClean = u.profile?.name?.replace(/\s*\(Bạn\)/g, '').trim();
        return uClean === cleanReqName || u.profile?.name === cleanReqName;
      });

      if (senderEmail && senderEmail !== currentUserEmail) {
        const sender = updatedDb[senderEmail];
        updatedDb[senderEmail] = {
          ...sender,
          sentRequests: (sender.sentRequests || []).filter(s => s !== myCleanName && s !== myProfile?.name)
        };
      }

      if (currentUserEmail && updatedDb[currentUserEmail]) {
        updatedDb[currentUserEmail] = {
          ...updatedDb[currentUserEmail],
          friendRequests: newRequests,
          notifications: newNotifications
        };
      }

      localStorage.setItem('fitmate_users', JSON.stringify(updatedDb));
      return updatedDb;
    });

    showToast(`Đã từ chối lời mời kết bạn.`, 'orange');
  };

  const handleSendMessageCrossUser = (friendName, newMsg) => {
    const cleanFriendName = typeof friendName === 'string' ? friendName.replace(/\s*\(Bạn\)/g, '').trim() : friendName?.name?.replace(/\s*\(Bạn\)/g, '').trim();
    const myCleanName = myProfile?.name ? myProfile.name.replace(/\s*\(Bạn\)/g, '').trim() : 'Bạn';

    setUsersDb(prevDb => {
      const updatedDb = { ...prevDb };
      const recipientEmail = Object.keys(updatedDb).find(em => {
        const u = updatedDb[em];
        const uClean = u.profile?.name?.replace(/\s*\(Bạn\)/g, '').trim();
        return uClean === cleanFriendName || u.profile?.name === cleanFriendName;
      });

      if (recipientEmail && recipientEmail !== currentUserEmail) {
        const recipient = updatedDb[recipientEmail];
        const recipientConvs = recipient.conversations || {};
        const thread = recipientConvs[myCleanName] || [];
        const incomingMsg = {
          ...newMsg,
          sender: 'friend'
        };
        updatedDb[recipientEmail] = {
          ...recipient,
          conversations: {
            ...recipientConvs,
            [myCleanName]: [...thread, incomingMsg]
          }
        };
        localStorage.setItem('fitmate_users', JSON.stringify(updatedDb));
      }
      return updatedDb;
    });
  };

  // Session Helper to load state for logged-in user
  const loadUserSession = (email, currentDb = usersDb) => {
    const user = currentDb[email];
    if (user) {
      setMyProfile(user.profile);
      setStreak(user.streak !== undefined ? user.streak : (user.profile?.isPt ? 15 : 7));
      setRewardPoints(user.rewardPoints !== undefined ? user.rewardPoints : (user.profile?.isPt ? 500 : 250));
      setCaloriesConsumed(user.caloriesConsumed !== undefined ? user.caloriesConsumed : 1250);
      setCaloriesBurned(user.caloriesBurned !== undefined ? user.caloriesBurned : 0);
      setWorkoutSummary(user.workoutSummary !== undefined ? user.workoutSummary : null);
      setAppointments(user.appointments || []);
      setAiChats(user.aiChats || []);
      setNotifications(user.notifications || []);
      setFriendRequests(user.friendRequests || []);
      setSentRequests(user.sentRequests || []);
      setFriendsList(user.friendsList || []);
      setConversations(user.conversations || {});
      setCurrentUserEmail(email);
      localStorage.setItem('fitmate_current_user', email);
      setIsAuthenticated(true);
    }
  };

  // Registration Helper to add new account to database
  const handleRegisterSuccess = (userData) => {
    const isPt = userData.isPt || false;
    const newProfile = {
      ...userData,
      bio: isPt ? `HLV chuyên nghiệp. Chuyên môn: ${userData.spec?.join(', ') || ''}. ${userData.exp || ''}.` : (userData.goal || 'Thành viên mới của FitMate.'),
      name: userData.name + ' (Bạn)',
      role: isPt ? 'Huấn luyện viên' : 'Hội viên',
      avatar: isPt ? 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=60' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
      isPt: isPt,
      isSelf: true,
      isVerified: false,
      certificateStatus: isPt ? 'unverified' : null,
      certificates: [],
      medicalCondition: 'Không có',
      allergies: 'Không có',
      trainingDays: isPt ? ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'] : ['Thứ 2', 'Thứ 4', 'Thứ 6'],
      trainingTime: isPt ? '08:00 AM - 09:00 PM' : '06:00 PM - 08:00 PM',
      trainingTimes: isPt ? ['08:00 AM - 09:00 PM'] : ['06:00 PM - 08:00 PM']
    };

    const newUser = {
      email: userData.email,
      password: userData.password || '123456',
      profile: newProfile,
      streak: 0,
      rewardPoints: isPt ? 500 : 100,
      caloriesConsumed: isPt ? 1800 : 0,
      caloriesBurned: isPt ? 0 : 0,
      workoutSummary: null,
      appointments: [],
      aiChats: [
        {
          id: 1,
          title: isPt ? "Trợ lý HLV 🤸‍♂️" : "Tư vấn dinh dưỡng 🍳",
          messages: [{ id: 1, text: isPt ? `Chào HLV ${userData.name}! Tớ có thể hỗ trợ gì về giáo án hôm nay?` : `Chào ${userData.name}! Mình có thể giúp gì về thực đơn dinh dưỡng hôm nay?`, sender: 'buddy' }]
        }
      ],
      notifications: [
        {
          id: 1,
          type: 'welcome',
          title: 'Chào mừng gia nhập FitMate 🎉',
          message: `Chào ${userData.name}, chúc bạn có hành trình tập luyện tuyệt vời!`,
          time: 'Vừa xong',
          read: false
        }
      ],
      friendRequests: [],
      sentRequests: [],
      friendsList: [],
      conversations: {}
    };

    setUsersDb(prev => {
      const updated = {
        ...prev,
        [userData.email]: newUser
      };
      localStorage.setItem('fitmate_users', JSON.stringify(updated));
      loadUserSession(userData.email, updated);
      return updated;
    });
  };

  // Sync active states with usersDb & localStorage
  useEffect(() => {
    if (isAuthenticated && currentUserEmail && usersDb[currentUserEmail]) {
      setUsersDb(prev => {
        const updated = {
          ...prev,
          [currentUserEmail]: {
            ...prev[currentUserEmail],
            profile: myProfile,
            streak,
            rewardPoints,
            caloriesConsumed,
            caloriesBurned,
            workoutSummary,
            appointments,
            aiChats,
            notifications,
            friendRequests,
            sentRequests,
            friendsList,
            conversations
          }
        };
        localStorage.setItem('fitmate_users', JSON.stringify(updated));
        return updated;
      });
    }
  }, [
    myProfile,
    streak,
    rewardPoints,
    caloriesConsumed,
    caloriesBurned,
    workoutSummary,
    appointments,
    aiChats,
    notifications,
    friendRequests,
    sentRequests,
    friendsList,
    conversations,
    currentUserEmail,
    isAuthenticated
  ]);

  // Load session on mount if already logged in
  useEffect(() => {
    if (isAuthenticated && currentUserEmail) {
      loadUserSession(currentUserEmail);
    }
  }, []);

  // Simulation of background reactions on user's registered knowledge posts
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      setPosts(prevPosts => {
        let updated = false;
        const newPosts = prevPosts.map(post => {
          if (post.author === 'Hùng (Bạn)' && post.isKnowledge) {
            const total = (post.reactions.love || 0) + (post.reactions.fire || 0) + (post.reactions.haha || 0);
            // Limit simulation to a maximum of 75 reactions
            if (total < 75) {
              const types = ['love', 'fire', 'haha'];
              const randomType = types[Math.floor(Math.random() * types.length)];
              const newReactions = { ...post.reactions };
              newReactions[randomType] = (newReactions[randomType] || 0) + 1;
              
              const newTotal = total + 1;
              let isQuality = post.isQuality || false;
              let pointsAwarded = post.pointsAwarded || 0;
              let bonusPoints = 0;
              
              if (newTotal >= 50) {
                if (!isQuality) {
                  isQuality = true;
                  pointsAwarded = 10;
                  bonusPoints = 10;
                  setTimeout(() => {
                    showToast("Bài viết kiến thức của bạn đạt 50 tương tác! Đạt chứng nhận Chất lượng (+10 xu) 📚🪙", "success");
                  }, 100);
                } else {
                  const expected = 10 + Math.floor((newTotal - 50) / 5);
                  if (expected > pointsAwarded) {
                    bonusPoints = expected - pointsAwarded;
                    pointsAwarded = expected;
                    setTimeout(() => {
                      showToast(`Bài viết chất lượng đạt ${newTotal} tương tác! Nhận thêm +${bonusPoints} xu! 🪙`, "success");
                    }, 100);
                  }
                }
              }
              
              if (bonusPoints > 0) {
                setRewardPoints(p => p + bonusPoints);
              }
              
              updated = true;
              return {
                ...post,
                reactions: newReactions,
                isQuality,
                pointsAwarded
              };
            }
          }
          return post;
        });
        return updated ? newPosts : prevPosts;
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Social Feed State
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Hoàng Gia Bảo',
      role: 'Leader CoreCrafter',
      time: '10 phút trước',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
      content: 'Khoe chuỗi 7 ngày tập luyện không nghỉ! Mục tiêu 30 ngày cơ bắp cuồn cuộn bắt đầu! 🔥💪',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=60',
      reactions: { love: 12, fire: 8, haha: 1 },
      userReacted: { love: false, fire: false, haha: false },
      comments: [
        {
          id: 1,
          author: 'Nguyễn Phúc Thịnh',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
          content: 'Đỉnh quá anh ơi, xin bí kíp siết cơ với! 💪',
          time: '8 phút trước'
        }
      ]
    },
    {
      id: 2,
      author: 'Nguyễn Phúc Thịnh',
      role: 'Thành viên',
      time: '1 giờ trước',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
      content: 'Hôm nay quét thử tô Phở Bò bằng AI Vision, được hẳn 550 calo chuẩn đét luôn. Trông xịn xò thực sự! 🍜✨',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&auto=format&fit=crop&q=60',
      reactions: { love: 5, fire: 4, haha: 0 },
      userReacted: { love: false, fire: false, haha: false },
      comments: [
        {
          id: 1,
          author: 'Hoàng Gia Bảo',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
          content: 'AI nhận diện chuẩn đấy chứ, đỡ phải tra cứu thủ công.',
          time: '45 phút trước'
        }
      ]
    },
    {
      id: 3,
      author: 'Nguyễn Đào Tùng Lâm',
      role: 'Thành viên',
      time: '3 giờ trước',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=60',
      content: 'Mới đặt thử lịch tập gym với HLV Tú Mai trên app. PT chỉ dẫn nhiệt tình lắm, tập mệt xỉu nhưng phê! 👍',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=60',
      reactions: { love: 8, fire: 3, haha: 0 },
      userReacted: { love: false, fire: false, haha: false },
      comments: [
        {
          id: 1,
          author: 'HLV Mai Xuân Tú',
          avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=60',
          content: 'Cố lên Lâm ơi, buổi sau tăng mức tạ nhé! 🏋️‍♂️',
          time: '2 giờ trước'
        }
      ]
    },
    {
      id: 4,
      author: 'Mai Xuân Tú',
      role: 'Huấn luyện viên',
      time: '5 giờ trước',
      avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=60',
      content: 'Chia sẻ một mẹo nhỏ cho các bạn tập Calisthenics mới bắt đầu: Luôn giữ cốt lõi (core) thật chặt khi thực hiện Plank hoặc Push-ups nhé! 🤸‍♂️',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop&q=60',
      reactions: { love: 35, fire: 20, haha: 2 },
      userReacted: { love: false, fire: false, haha: false },
      isKnowledge: true,
      isQuality: true,
      pointsAwarded: 11,
      comments: [
        {
          id: 1,
          author: 'Hùng (Bạn)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
          content: 'Plank toàn bị đau lưng, hóa ra do em chưa gồng core chặt rồi.',
          time: '1 giờ trước'
        }
      ]
    },
    {
      id: 5,
      author: 'Nguyễn Minh Khang',
      role: 'Huấn luyện viên',
      time: '6 giờ trước',
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=60',
      content: 'Dinh dưỡng chiếm 70% sự thành bại. Bổ sung đủ protein chất lượng cao sau tập để cơ bắp phát triển tốt nhất nhé! 🍗🥚',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&auto=format&fit=crop&q=60',
      reactions: { love: 28, fire: 25, haha: 3 },
      userReacted: { love: false, fire: false, haha: false },
      isKnowledge: true,
      isQuality: true,
      pointsAwarded: 11,
      comments: [
        {
          id: 1,
          author: 'Nguyễn Đào Tùng Lâm',
          avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=60',
          content: 'Sau tập em hay ăn 3 quả trứng luộc với 1 hộp sữa chuối ok ko thầy?',
          time: '30 phút trước'
        }
      ]
    }
  ]);

  // Update clock time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAddCalories = (calories) => {
    setCaloriesConsumed(prev => prev + calories);
  };

  // Switch tabs
  const handleTabSwitch = (newScreen) => {
    setSelectedProfile(null);
    setScreen(newScreen);
  };

  // Profile opening handler
  const handleOpenProfile = (profileSummary) => {
    if (!profileSummary) return;
    const name = typeof profileSummary === 'string' ? profileSummary : (profileSummary.name || '');
    if (!name) return;

    const myCleanName = myProfile?.name ? myProfile.name.replace(/\s*\(Bạn\)/g, '').trim() : '';
    const targetCleanName = name.replace(/\s*\(Bạn\)/g, '').trim();

    // Check if opening own profile
    const isOpeningSelf = (profileSummary.isSelf === true && !profileSummary.name) ||
                          name === myProfile?.name || 
                          (myCleanName && targetCleanName.toLowerCase() === myCleanName.toLowerCase());

    if (isOpeningSelf) {
      setSelectedProfile({ ...myProfile, isSelf: true });
      return;
    }

    // Check in usersDb for registered user (e.g. user@fitmate.vn, pt@fitmate.vn)
    const dbEmail = Object.keys(usersDb || {}).find(em => {
      const u = usersDb[em];
      const uClean = u.profile?.name?.replace(/\s*\(Bạn\)/g, '').trim().toLowerCase();
      return uClean === targetCleanName.toLowerCase() || u.profile?.name?.toLowerCase() === targetCleanName.toLowerCase();
    });

    if (dbEmail && dbEmail !== currentUserEmail && usersDb[dbEmail]?.profile) {
      const otherProf = usersDb[dbEmail].profile;
      setSelectedProfile({
        ...otherProf,
        name: otherProf.name.replace(/\s*\(Bạn\)/g, '').trim(),
        isSelf: false
      });
      return;
    }

    // Check mock profiles
    if (mockProfiles[name]) {
      setSelectedProfile({ ...mockProfiles[name], isSelf: false });
    } else if (mockProfiles[targetCleanName]) {
      setSelectedProfile({ ...mockProfiles[targetCleanName], isSelf: false });
    } else {
      // Find in ALL_SYSTEM_USERS
      const sysUser = (ALL_SYSTEM_USERS || []).find(u => 
        u.name === name || 
        u.name === targetCleanName || 
        u.name.toLowerCase() === targetCleanName.toLowerCase()
      );

      if (sysUser) {
        setSelectedProfile({
          name: sysUser.name,
          role: sysUser.role || (sysUser.isPt ? 'Huấn luyện viên' : 'Thành viên'),
          avatar: sysUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
          bio: sysUser.bio || 'Thành viên của cộng đồng FitMate.',
          phone: sysUser.phone || 'Chưa cập nhật',
          birthday: sysUser.birthday || 'Chưa cập nhật',
          gender: sysUser.gender || 'Khác',
          height: sysUser.height || '175 cm',
          weight: sysUser.weight || '70 kg',
          isPt: !!sysUser.isPt,
          spec: sysUser.spec || [],
          exp: sysUser.exp,
          price: sysUser.price,
          isVerified: sysUser.isVerified,
          isSelf: false
        });
      } else {
        setSelectedProfile({
          name: targetCleanName,
          role: profileSummary.role || (profileSummary.isPt ? 'Huấn luyện viên' : 'Thành viên'),
          avatar: profileSummary.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
          bio: profileSummary.bio || 'Thành viên của cộng đồng FitMate.',
          phone: profileSummary.phone || 'Chưa cập nhật',
          birthday: profileSummary.birthday || 'Chưa cập nhật',
          gender: profileSummary.gender || 'Khác',
          isPt: !!profileSummary.isPt,
          isSelf: false
        });
      }
    }
  };

  // Profile edit update callback
  const handleUpdateMyProfile = (updatedFields) => {
    const updated = { ...myProfile, ...updatedFields };
    setMyProfile(updated);
    if (selectedProfile) {
      setSelectedProfile(updated);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserEmail('');
    localStorage.removeItem('fitmate_current_user');
    setSelectedProfile(null);
    showToast('Đã đăng xuất tài khoản! 👋', 'orange');
  };

  // Workout Completion callback - updates calo and rewards streak
  const handleWorkoutComplete = (summary) => {
    setCaloriesBurned(summary.calories);
    setWorkoutSummary(summary);
    setJustCompletedWorkout(true);
    setWorkoutState('completed');

    // Streak logic: at least 2 exercises completed
    if (summary.exercises && summary.exercises.length >= 2) {
      setStreak(prev => prev + 1);
    }
  };

  const renderActiveScreen = () => {
    if (selectedProfile) {
      return (
        <UserProfile 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
          posts={posts}
          onUpdateProfile={handleUpdateMyProfile}
          showToast={showToast}
          appointments={appointments}
          setAppointments={setAppointments}
          myProfile={myProfile}
          friendsList={friendsList}
          sentRequests={sentRequests}
          onSendFriendRequest={handleSendFriendRequest}
          onCancelSentRequest={handleCancelSentRequest}
          onUnfriend={handleUnfriend}
          onOpenChat={handleOpenChat}
        />
      );
    }

    switch (screen) {
      case 'dashboard':
        return (
          <Dashboard 
            streak={streak} 
            setStreak={setStreak}
            rewardPoints={rewardPoints}
            setRewardPoints={setRewardPoints}
            caloriesConsumed={caloriesConsumed} 
            caloriesBurned={caloriesBurned}
            workoutSummary={workoutSummary}
            setScreen={handleTabSwitch}
            onOpenProfile={handleOpenProfile}
            justCompletedWorkout={justCompletedWorkout}
            setJustCompletedWorkout={setJustCompletedWorkout}
            showToast={showToast}
            myProfile={myProfile}
            onLogout={handleLogout}
            dietState={dietState}
            setDietState={setDietState}
            workoutState={workoutState}
            setWorkoutState={setWorkoutState}
            onUpdateProfile={handleUpdateMyProfile}
            notifications={notifications}
            setNotifications={setNotifications}
            friendRequests={friendRequests}
            setFriendRequests={setFriendRequests}
            sentRequests={sentRequests}
            friendsList={friendsList}
            onSendFriendRequest={handleSendFriendRequest}
            onCancelSentRequest={handleCancelSentRequest}
            onAcceptFriendRequest={handleAcceptFriendRequest}
            onRejectFriendRequest={handleRejectFriendRequest}
            onUnfriend={handleUnfriend}
            onOpenChat={handleOpenChat}
          />
        );
      case 'nutrition':
        return (
          <NutritionVision 
            onAddCalories={handleAddCalories}
            onCompleteTask={() => {}} // placeholder
            dietState={dietState}
            setDietState={setDietState}
            workoutState={workoutState}
            myProfile={myProfile}
            onUpdateProfile={handleUpdateMyProfile}
            showToast={showToast}
          />
        );
      case 'workout':
        return (
          <WorkoutPlanner 
            onCompleteTask={() => {}} // placeholder
            onWorkoutComplete={handleWorkoutComplete}
            isWorkoutCompleted={!!workoutSummary}
            setScreen={handleTabSwitch}
            workoutState={workoutState}
            setWorkoutState={setWorkoutState}
            dietState={dietState}
            myProfile={myProfile}
            onUpdateProfile={handleUpdateMyProfile}
            showToast={showToast}
          />
        );
      case 'social':
        return (
          <CompanionAndSocial 
            aiChats={aiChats}
            setAiChats={setAiChats}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            posts={posts}
            setPosts={setPosts}
            onCompleteTask={() => {}} // placeholder
            onOpenProfile={handleOpenProfile}
            rewardPoints={rewardPoints}
            setRewardPoints={setRewardPoints}
            showToast={showToast}
            myProfile={myProfile}
          />
        );
      case 'messenger':
        return (
          <Messenger 
            onClose={() => handleTabSwitch('dashboard')}
            setScreen={handleTabSwitch}
            myProfile={myProfile}
            currentUserEmail={currentUserEmail}
            friendsList={friendsList}
            activeChatFriend={activeChatFriend}
            setActiveChatFriend={setActiveChatFriend}
            onOpenProfile={handleOpenProfile}
            conversations={conversations}
            setConversations={setConversations}
            onSendMessageCrossUser={handleSendMessageCrossUser}
          />
        );
      case 'appointments':
        return (
          <Appointments 
            appointments={appointments}
            setAppointments={setAppointments}
            onClose={() => handleTabSwitch('dashboard')}
            setScreen={handleTabSwitch}
            myProfile={myProfile}
          />
        );
      case 'marketplace':
        return (
          <PtMarketplace 
            onOpenProfile={handleOpenProfile}
            showToast={showToast}
            appointments={appointments}
            setAppointments={setAppointments}
            myProfile={myProfile}
          />
        );
      case 'chuyen-sau':
        return (
          <ChuyenSau 
            myProfile={myProfile}
            onUpdateProfile={handleUpdateMyProfile}
            onClose={() => handleTabSwitch('dashboard')}
            showToast={showToast}
          />
        );
      default:
        return (
          <Dashboard 
            streak={streak} 
            setStreak={setStreak} 
            rewardPoints={rewardPoints}
            setRewardPoints={setRewardPoints}
            caloriesConsumed={caloriesConsumed} 
            caloriesBurned={caloriesBurned} 
            workoutSummary={workoutSummary} 
            setScreen={handleTabSwitch} 
            onOpenProfile={handleOpenProfile} 
            justCompletedWorkout={justCompletedWorkout}
            setJustCompletedWorkout={setJustCompletedWorkout}
            showToast={showToast}
            myProfile={myProfile}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <div className="phone-emulator">
      {/* Notch */}
      <div className="phone-notch">
        <div className="phone-speaker" />
        <div className="phone-camera" />
      </div>

      {/* Global Toast Notification Overlay */}
      {appToast && (
        <div className="animate-slide-up" style={{
          position: 'absolute',
          top: '55px',
          left: '20px',
          right: '20px',
          background: 'var(--bg-card-solid)',
          border: `1px solid ${appToast.type === 'orange' ? 'var(--accent-orange)' : 'var(--accent-green)'}`,
          color: 'var(--text-primary)',
          padding: '12px 16px',
          borderRadius: '14px',
          fontSize: '13px',
          fontWeight: 600,
          zIndex: 2000,
          boxShadow: appToast.type === 'orange' 
            ? '0 8px 32px rgba(255, 87, 34, 0.2)' 
            : '0 8px 32px rgba(57, 255, 20, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: appToast.type === 'orange' ? 'rgba(255, 87, 34, 0.15)' : 'rgba(57, 255, 20, 0.15)', 
            borderRadius: '50%', 
            padding: '5px',
            flexShrink: 0
          }}>
            {appToast.type === 'orange' ? (
              <Flame size={14} color="var(--accent-orange)" />
            ) : (
              <CheckCircle size={14} color="var(--accent-green)" />
            )}
          </span>
          <span style={{ flex: 1, lineHeight: '1.3' }}>{appToast.message}</span>
        </div>
      )}

      {/* Status Bar */}
      <div className="phone-status-bar">
        <span>{currentTime}</span>
        <div className="status-right">
          <Signal size={14} color="var(--text-primary)" />
          <Wifi size={14} color="var(--text-primary)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>88%</span>
            <Battery size={16} color="var(--text-primary)" />
          </div>
        </div>
      </div>

      {/* Main App Screens Container */}
      <div className="app-container">
        {!isAuthenticated ? (
          <Auth 
            usersDb={usersDb}
            onLoginSuccess={(userData) => {
              loadUserSession(userData.email);
            }}
            onRegisterSuccess={(userData) => {
              handleRegisterSuccess(userData);
            }}
          />
        ) : (
          <>
            {renderActiveScreen()}

            {/* Navigation Bar - 5 items */}
            <div className="bottom-nav" style={{ height: '76px', paddingBottom: '10px' }}>
              <button 
                className={`nav-item ${screen === 'dashboard' && !selectedProfile ? 'active' : ''}`}
                onClick={() => handleTabSwitch('dashboard')}
                style={{ width: '50px' }}
              >
                <div className="nav-icon-wrapper" style={{ padding: '4px' }}>
                  <Home size={18} />
                </div>
                <span style={{ fontSize: '9px' }}>Trang chủ</span>
              </button>

              <button 
                className={`nav-item ${screen === 'nutrition' && !selectedProfile ? 'active' : ''}`}
                onClick={() => handleTabSwitch('nutrition')}
                style={{ width: '50px' }}
              >
                <div className="nav-icon-wrapper" style={{ padding: '4px' }}>
                  <Camera size={18} />
                </div>
                <span style={{ fontSize: '9px' }}>Quét món</span>
              </button>

              <button 
                className={`nav-item ${screen === 'workout' && !selectedProfile ? 'active' : ''}`}
                onClick={() => handleTabSwitch('workout')}
                style={{ width: '50px' }}
              >
                <div className="nav-icon-wrapper" style={{ padding: '4px' }}>
                  <Calendar size={18} />
                </div>
                <span style={{ fontSize: '9px' }}>Lịch tập</span>
              </button>

              <button 
                className={`nav-item ${screen === 'social' && !selectedProfile ? 'active' : ''}`}
                onClick={() => handleTabSwitch('social')}
                style={{ width: '50px' }}
              >
                <div className="nav-icon-wrapper" style={{ padding: '4px' }}>
                  <MessageSquare size={18} />
                </div>
                <span style={{ fontSize: '9px' }}>Cộng đồng</span>
              </button>

              <button 
                className={`nav-item ${screen === 'marketplace' && !selectedProfile ? 'active' : ''}`}
                onClick={() => handleTabSwitch('marketplace')}
                style={{ width: '50px' }}
              >
                <div className="nav-icon-wrapper" style={{ padding: '4px' }}>
                  <Award size={18} />
                </div>
                <span style={{ fontSize: '9px' }}>Chợ PT</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="home-indicator" />
    </div>
  );
}
