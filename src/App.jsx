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
      trainingTime: '18:00'
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
        messages: [{ id: 1, text: "Chào Hùng! Hôm nay bạn muốn tập ngực hiệu quả hơn đúng không?", sender: 'buddy' }]
      },
      {
        id: 3,
        title: "Hỏi về Calisthenics 🤸‍♂️",
        messages: [{ id: 1, text: "Chào Hùng! Bạn muốn tìm hiểu kỹ thuật chống đẩy hay lên xà?", sender: 'buddy' }]
      }
    ]
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
      price: '300.000đ/buổi',
      medicalCondition: 'Không có',
      allergies: 'Không có',
      trainingDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
      trainingTime: '08:00'
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
    ]
  }
};

export default function App() {
  const [usersDb, setUsersDb] = useState(() => {
    const saved = localStorage.getItem('fitmate_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
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
      price: '300.000đ/buổi'
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
      price: '250.000đ/buổi'
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

  // Session Helper to load state for logged-in user
  const loadUserSession = (email, currentDb = usersDb) => {
    const user = currentDb[email];
    if (user) {
      setMyProfile(user.profile);
      setStreak(user.streak !== undefined ? user.streak : 7);
      setRewardPoints(user.rewardPoints !== undefined ? user.rewardPoints : 250);
      setCaloriesConsumed(user.caloriesConsumed !== undefined ? user.caloriesConsumed : 1250);
      setCaloriesBurned(user.caloriesBurned !== undefined ? user.caloriesBurned : 0);
      setWorkoutSummary(user.workoutSummary !== undefined ? user.workoutSummary : null);
      setAppointments(user.appointments || []);
      setAiChats(user.aiChats || []);
      setCurrentUserEmail(email);
      localStorage.setItem('fitmate_current_user', email);
      setIsAuthenticated(true);
    }
  };

  // Registration Helper to add new account to database
  const handleRegisterSuccess = (userData) => {
    const newProfile = {
      ...userData,
      bio: userData.goal,
      name: userData.name + ' (Bạn)',
      role: 'Hội viên',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
      isPt: false,
      isSelf: true
    };

    const newUser = {
      email: userData.email,
      password: userData.password || '123456',
      profile: newProfile,
      streak: 0,
      rewardPoints: 100,
      caloriesConsumed: 0,
      caloriesBurned: 0,
      workoutSummary: null,
      appointments: [],
      aiChats: [
        {
          id: 1,
          title: "Tư vấn dinh dưỡng 🍳",
          messages: [{ id: 1, text: `Chào ${userData.name}! Mình có thể giúp gì về thực đơn dinh dưỡng hôm nay?`, sender: 'buddy' }]
        }
      ]
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
            aiChats
          }
        };
        localStorage.setItem('fitmate_users', JSON.stringify(updated));
        return updated;
      });
    }
  }, [myProfile, streak, rewardPoints, caloriesConsumed, caloriesBurned, workoutSummary, appointments, aiChats, currentUserEmail, isAuthenticated]);

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
    const name = profileSummary.name;
    if (name.includes('Bạn') || name.toLowerCase() === 'hùng' || profileSummary.isSelf || name === myProfile.name) {
      setSelectedProfile(myProfile);
    } else if (mockProfiles[name]) {
      setSelectedProfile(mockProfiles[name]);
    } else {
      setSelectedProfile({
        name: name,
        role: profileSummary.role || 'Thành viên',
        avatar: profileSummary.avatar,
        bio: 'Thành viên của cộng đồng FitMate.',
        phone: 'Chưa cập nhật',
        birthday: 'Chưa cập nhật',
        gender: 'Khác',
        isPt: profileSummary.isPt,
        isSelf: false
      });
    }
  };

  // Profile edit update callback
  const handleUpdateMyProfile = (updatedFields) => {
    const updated = { ...myProfile, ...updatedFields };
    setMyProfile(updated);
    setSelectedProfile(updated);
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
          />
        );
      case 'nutrition':
        return (
          <NutritionVision 
            onAddCalories={handleAddCalories}
            onCompleteTask={() => {}} // placeholder
          />
        );
      case 'workout':
        return (
          <WorkoutPlanner 
            onCompleteTask={() => {}} // placeholder
            onWorkoutComplete={handleWorkoutComplete}
            isWorkoutCompleted={!!workoutSummary}
            setScreen={handleTabSwitch}
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
          />
        );
      case 'messenger':
        return (
          <Messenger 
            onClose={() => handleTabSwitch('dashboard')}
            setScreen={handleTabSwitch}
            myProfile={myProfile}
            currentUserEmail={currentUserEmail}
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
