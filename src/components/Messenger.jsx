import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Search, MessageSquare } from 'lucide-react';

export default function Messenger({ onClose, setScreen, myProfile, currentUserEmail }) {
  const [activeFriend, setActiveFriend] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const isInitialUser = currentUserEmail === 'user@fitmate.vn' || myProfile?.email === 'user@fitmate.vn' || myProfile?.name?.includes('Hùng');

  // Conversations history stored in local state
  const [conversations, setConversations] = useState({
    'Hoàng Gia Bảo': [
      { id: 1, text: 'Hôm nay tập ngực không ông?', sender: 'friend', time: '09:15' },
      { id: 2, text: 'Tui mới đi làm về xong, tí ra phòng nhé', sender: 'friend', time: '09:16' },
      { id: 3, text: 'Ok ông nha, tí tui qua!', sender: 'user', time: '09:18' }
    ],
    'Nguyễn Phúc Thịnh': [
      { id: 1, text: 'Tô phở nãy quét calo chuẩn không ông?', sender: 'friend', time: 'Hôm qua' },
      { id: 2, text: 'Chuẩn đét luôn ấy chứ, app xịn ghê', sender: 'user', time: 'Hôm qua' }
    ],
    'Nguyễn Đào Tùng Lâm': [
      { id: 1, text: 'Tập mệt thật sự luôn', sender: 'friend', time: 'Thứ 2' }
    ],
    'HLV Mai Xuân Tú': [
      { id: 1, text: 'Chào Hùng, lịch tập của em hôm nay đã được chuẩn bị rồi nhé.', sender: 'friend', time: '08:00' },
      { id: 2, text: 'Dạ vâng HLV.', sender: 'user', time: '08:10' }
    ],
    'HLV Nguyễn Minh Khang': [
      { id: 1, text: 'Nhớ ăn đủ protein sau tập nhé Hùng.', sender: 'friend', time: 'Hôm qua' }
    ]
  });

  const friends = [
    { name: 'Hoàng Gia Bảo', role: 'Leader CoreCrafter', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60', online: true, initialMsg: 'Tui mới đi làm về xong, tí ra phòng nhé' },
    { name: 'Nguyễn Phúc Thịnh', role: 'Thành viên', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60', online: true, initialMsg: 'Tô phở nãy quét calo chuẩn không ông?' },
    { name: 'Nguyễn Đào Tùng Lâm', role: 'Thành viên', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=60', online: false, initialMsg: 'Tập mệt thật sự luôn' },
    { name: 'HLV Mai Xuân Tú', role: 'Huấn luyện viên', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=60', online: true, initialMsg: 'Chào Hùng, lịch tập của em hôm nay...' },
    { name: 'HLV Nguyễn Minh Khang', role: 'Huấn luyện viên', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=60', online: false, initialMsg: 'Nhớ ăn đủ protein sau tập nhé Hùng.' }
  ];

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (activeFriend) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeFriend, conversations]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeFriend) return;

    const timeString = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      time: timeString
    };

    setConversations({
      ...conversations,
      [activeFriend.name]: [...(conversations[activeFriend.name] || []), newMsg]
    });
    setInputText('');
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLatestMessage = (friendName) => {
    const list = conversations[friendName];
    if (list && list.length > 0) {
      return list[list.length - 1];
    }
    return null;
  };

  const handleBackAction = () => {
    if (activeFriend) {
      setActiveFriend(null);
    } else {
      if (setScreen) {
        setScreen('dashboard');
      } else if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div className="screen-content animate-slide-up" style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Top Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(18, 24, 30, 0.5)',
        backdropFilter: 'var(--glass-blur)',
        zIndex: 10
      }}>
        <button 
          onClick={handleBackAction}
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
        {activeFriend ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={activeFriend.avatar} 
                alt={activeFriend.name} 
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              {activeFriend.online && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  width: '10px', 
                  height: '10px', 
                  background: 'var(--accent-green)', 
                  border: '2px solid var(--bg-dark)', 
                  borderRadius: '50%' 
                }} />
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '13.5px', fontWeight: 700 }}>{activeFriend.name}</h3>
              <p className="subtitle" style={{ fontSize: '9.5px', color: activeFriend.online ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                {activeFriend.online ? 'Đang hoạt động' : 'Ngoại tuyến'}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Tin nhắn bạn bè</h3>
            <p className="subtitle" style={{ fontSize: '10px' }}>Trò chuyện & thảo luận tập luyện</p>
          </div>
        )}
      </div>

      {activeFriend ? (
        /* ==================== CHAT WINDOW VIEW ==================== */
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', height: '580px', background: '#0a0d10' }}>
          
          {/* Messages Flow Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <div style={{ textAlign: 'center', margin: '10px 0 20px' }}>
              <img 
                src={activeFriend.avatar} 
                alt={activeFriend.name} 
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.05)' }}
              />
              <h4 style={{ fontSize: '15px', fontWeight: 800, marginTop: '8px' }}>{activeFriend.name}</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{activeFriend.role}</p>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', display: 'inline-block', padding: '2px 10px', borderRadius: '10px', marginTop: '6px' }}>
                Bắt đầu cuộc trò chuyện
              </div>
            </div>

            {(conversations[activeFriend.name] || []).map((msg) => (
              <div 
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  background: msg.sender === 'user' 
                    ? 'linear-gradient(135deg, #1e75ff 0%, #0052d4 100%)' 
                    : 'rgba(255, 255, 255, 0.06)',
                  color: 'white',
                  fontSize: '13px',
                  lineHeight: '1.4',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.04)',
                  wordBreak: 'break-word'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '8px', color: 'var(--text-secondary)', marginTop: '2px', padding: '0 4px' }}>
                  {msg.time}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Message Input form */}
          <form onSubmit={handleSendMessage} style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 16px 24px',
            background: 'rgba(12, 15, 18, 0.9)',
            borderTop: '1px solid var(--border-color)'
          }}>
            <input 
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '10px 16px',
                color: 'white',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              style={{
                background: inputText.trim() ? '#1e75ff' : 'rgba(255,255,255,0.04)',
                color: 'white',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                opacity: inputText.trim() ? 1 : 0.5,
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      ) : (
        /* ==================== CONVERSATIONS LIST VIEW ==================== */
        !isInitialUser ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '480px', 
            padding: '24px', 
            textAlign: 'center', 
            color: 'var(--text-secondary)' 
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'rgba(57, 255, 20, 0.05)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '16px' 
            }}>
              <MessageSquare size={32} color="var(--accent-green)" />
            </div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>Chưa có cuộc trò chuyện nào</h4>
            <p style={{ fontSize: '12px', marginTop: '6px', lineHeight: '1.4', maxWidth: '240px' }}>
              Hãy kết bạn tại tab **Cộng đồng** hoặc đặt lịch với PT tại **Chợ PT** để bắt đầu trò chuyện!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '16px 20px 80px', gap: '16px' }}>
          
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Tìm kiếm bạn bè..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '10px 14px 10px 38px',
                color: 'white',
                fontSize: '12.5px',
                outline: 'none'
              }}
            />
            <Search size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Active Row (Horizontal Scroll) */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Bạn bè đang hoạt động</span>
            <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', padding: '8px 2px 2px', width: '100%' }}>
              {friends.filter(f => f.online).map((friend, idx) => (
                <div 
                  key={idx}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', flexShrink: 0 }}
                  onClick={() => setActiveFriend(friend)}
                >
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={friend.avatar} 
                      alt={friend.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-green)' }}
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      right: 0, 
                      width: '10px', 
                      height: '10px', 
                      background: 'var(--accent-green)', 
                      border: '2px solid var(--bg-dark)', 
                      borderRadius: '50%' 
                    }} />
                  </div>
                  <span style={{ fontSize: '9.5px', color: 'white', maxWidth: '55px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {friend.name.split(' ').pop()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversations Chat List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Hội thoại gần đây</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredFriends.map((friend, idx) => {
                const latestMsg = getLatestMessage(friend.name);
                const hasMsgs = !!latestMsg;
                const previewMsg = hasMsgs ? latestMsg.text : friend.initialMsg;
                const previewTime = hasMsgs ? latestMsg.time : 'Trống';
                
                return (
                  <div 
                    key={idx}
                    onClick={() => setActiveFriend(friend)}
                    className="glass-card" 
                    style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      padding: '12px 14px',
                      background: 'rgba(255, 255, 255, 0.01)'
                    }}
                  >
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img 
                        src={friend.avatar} 
                        alt={friend.name} 
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      {friend.online && (
                        <div style={{ 
                          position: 'absolute', 
                          bottom: 0, 
                          right: 0, 
                          width: '10px', 
                          height: '10px', 
                          background: 'var(--accent-green)', 
                          border: '2px solid var(--bg-dark)', 
                          borderRadius: '50%' 
                        }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{friend.name}</h4>
                        <span style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>{previewTime}</span>
                      </div>
                      <p style={{ 
                        fontSize: '11px', 
                        color: latestMsg?.sender === 'user' ? 'var(--text-secondary)' : 'var(--text-primary)', 
                        marginTop: '2px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        fontWeight: latestMsg?.sender === 'user' ? 400 : 500
                      }}>
                        {latestMsg?.sender === 'user' ? `Bạn: ${previewMsg}` : previewMsg}
                      </p>
                    </div>
                  </div>
                );
              })}
              {filteredFriends.length === 0 && (
                <p className="subtitle" style={{ textAlign: 'center', padding: '20px' }}>
                  Không tìm thấy bạn bè nào khớp.
                </p>
              )}
            </div>
          </div>
        </div>
      )
    )}

    </div>
  );
}
