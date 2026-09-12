import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Search, MessageSquare, Info, UserCheck, Sparkles } from 'lucide-react';
import { ALL_SYSTEM_USERS } from './UserSearchModal';

const DEFAULT_CONVERSATIONS = {
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
    { id: 1, text: 'Chào bạn! Cùng nhau tập luyện và giữ streak đều đặn nhé! 💪🔥', sender: 'friend', time: '08:30' },
    { id: 2, text: 'Ok người anh em, cùng cố gắng nào!', sender: 'user', time: '08:35' }
  ],
  'Mai Xuân Tú': [
    { id: 1, text: 'Chào bạn, mình đã xem qua mục tiêu tập luyện của bạn rồi nhé. Rất khả thi!', sender: 'friend', time: '08:00' },
    { id: 2, text: 'Dạ vâng cảm ơn HLV, có gì nhờ thầy hướng dẫn thêm ạ.', sender: 'user', time: '08:10' }
  ],
  'Nguyễn Minh Khang': [
    { id: 1, text: 'Nhớ ăn đủ protein sau buổi tập nặng nhé bạn.', sender: 'friend', time: 'Hôm qua' }
  ]
};

export default function Messenger({ 
  onClose, 
  setScreen, 
  myProfile, 
  currentUserEmail,
  friendsList = [],
  activeChatFriend = null,
  setActiveChatFriend,
  onOpenProfile,
  conversations: externalConversations,
  setConversations: externalSetConversations,
  onSendMessageCrossUser
}) {
  const [activeFriend, setActiveFriend] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Local fallback conversations if not provided
  const [localConversations, setLocalConversations] = useState(DEFAULT_CONVERSATIONS);

  const conversations = externalConversations !== undefined ? externalConversations : localConversations;
  const setConversations = externalSetConversations !== undefined ? externalSetConversations : setLocalConversations;

  // Helper to get detailed metadata for any friend name
  const getFriendInfo = (friendName) => {
    if (!friendName) return null;
    const cleanName = typeof friendName === 'string' ? friendName.replace(' (Bạn)', '').trim() : friendName.name;
    const found = ALL_SYSTEM_USERS.find(u => 
      u.name === cleanName || 
      u.name.toLowerCase() === cleanName.toLowerCase() ||
      u.name.includes(cleanName) || 
      cleanName.includes(u.name)
    );

    if (found) {
      return {
        name: found.name,
        role: found.role || (found.isPt ? 'Huấn luyện viên' : 'Thành viên'),
        avatar: found.avatar,
        online: true,
        isPt: found.isPt,
        bio: found.bio,
        rawUser: found
      };
    }

    return {
      name: cleanName,
      role: 'Thành viên',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
      online: true,
      isPt: false,
      rawUser: { name: cleanName, role: 'Thành viên' }
    };
  };

  // Build the list of active friends from friendsList
  const dynamicFriends = (friendsList || []).map(getFriendInfo).filter(Boolean);

  // Auto-select friend if activeChatFriend is passed
  useEffect(() => {
    if (activeChatFriend) {
      const targetName = typeof activeChatFriend === 'string' ? activeChatFriend : activeChatFriend.name;
      const cleanTarget = targetName.replace(' (Bạn)', '').trim();
      
      const foundInList = dynamicFriends.find(f => 
        f.name === cleanTarget || 
        f.name.toLowerCase() === cleanTarget.toLowerCase() ||
        cleanTarget.includes(f.name)
      );

      if (foundInList) {
        setActiveFriend(foundInList);
      } else {
        setActiveFriend(getFriendInfo(cleanTarget));
      }
    }
  }, [activeChatFriend, friendsList]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (activeFriend) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeFriend, conversations]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeFriend) return;

    const userText = inputText.trim();
    const timeString = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: Date.now(),
      text: userText,
      sender: 'user',
      time: timeString
    };

    const friendName = activeFriend.name;

    setConversations(prev => ({
      ...prev,
      [friendName]: [...(prev[friendName] || []), newMsg]
    }));

    if (onSendMessageCrossUser) {
      onSendMessageCrossUser(friendName, newMsg);
    }

    setInputText('');

    // Simulate realistic auto reply after 1000ms
    setTimeout(() => {
      const replies = activeFriend.isPt ? [
        "Chào bạn, mình đã ghi nhận câu hỏi. Để mình xem xét và tư vấn kỹ hơn nhé! 💪",
        "Buổi tập tới bạn nhớ chú ý hít thở sâu và gồng core thật chắc nhé!",
        "Chế độ dinh dưỡng sau tập rất quan trọng, nhớ bổ sung đủ protein và uống nhiều nước nha!",
        "Tuyệt vời bạn ơi! Cứ duy trì phong độ và kiên trì theo giáo án nhé 🔥"
      ] : [
        "Oke người anh em, cùng cố gắng giữ streak nào! 🔥",
        "Chuẩn luôn, nay tập bài này phê thật sự!",
        "Ok bạn nha, lát tập xong mình nhắn lại nhé.",
        "Cố lên bạn ơi, form tập hôm nay chuẩn lắm đấy! 💪",
        "Hôm nay tui cũng vừa hoàn thành xong bài tập, mệt nhưng đã ghê!"
      ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg = {
        id: Date.now() + 1,
        text: randomReply,
        sender: 'friend',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prev => ({
        ...prev,
        [friendName]: [...(prev[friendName] || []), replyMsg]
      }));
    }, 1000);
  };

  // Filter friends based on search query
  const filteredFriends = dynamicFriends.filter(f => 
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
      if (setActiveChatFriend) setActiveChatFriend(null);
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
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(18, 24, 30, 0.8)',
        backdropFilter: 'var(--glass-blur)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>{activeFriend.name}</h3>
                <p className="subtitle" style={{ fontSize: '9.5px', margin: 0, color: activeFriend.online ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                  {activeFriend.online ? 'Đang hoạt động' : 'Ngoại tuyến'}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Tin nhắn bạn bè</h3>
              <p className="subtitle" style={{ fontSize: '10px', margin: 0 }}>Trò chuyện & thảo luận tập luyện ({dynamicFriends.length})</p>
            </div>
          )}
        </div>

        {activeFriend && onOpenProfile && (
          <button
            onClick={() => onOpenProfile(activeFriend.rawUser || { name: activeFriend.name })}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
            title="Xem trang cá nhân"
          >
            <Info size={14} />
            <span>Hồ sơ</span>
          </button>
        )}
      </div>

      {activeFriend ? (
        /* ==================== CHAT WINDOW VIEW ==================== */
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#0a0d10' }}>
          
          {/* Messages Flow Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <div style={{ textAlign: 'center', margin: '10px 0 20px' }}>
              <img 
                src={activeFriend.avatar} 
                alt={activeFriend.name} 
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.08)' }}
              />
              <h4 style={{ fontSize: '15px', fontWeight: 800, marginTop: '8px', marginBottom: '2px' }}>{activeFriend.name}</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>{activeFriend.role}</p>
              <div style={{ fontSize: '10px', color: 'var(--accent-green)', background: 'rgba(57, 255, 20, 0.08)', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '10px', marginTop: '6px' }}>
                <UserCheck size={11} /> Bạn bè trên FitMate
              </div>
            </div>

            {((conversations[activeFriend.name] || [])).length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px', fontSize: '12px' }}>
                <Sparkles size={20} color="var(--accent-green)" style={{ marginBottom: '6px', opacity: 0.8 }} />
                <p>Hãy gửi lời chào đầu tiên để bắt đầu trò chuyện với {activeFriend.name}!</p>
              </div>
            ) : (
              (conversations[activeFriend.name] || []).map((msg) => (
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
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Message Input form */}
          <form onSubmit={handleSendMessage} style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 16px 20px',
            background: 'rgba(12, 15, 18, 0.95)',
            borderTop: '1px solid var(--border-color)'
          }}>
            <input 
              type="text"
              placeholder={`Nhắn tin cho ${activeFriend.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
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
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                opacity: inputText.trim() ? 1 : 0.5,
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      ) : (
        /* ==================== CONVERSATIONS LIST VIEW ==================== */
        dynamicFriends.length === 0 ? (
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
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>Chưa có bạn bè để trò chuyện</h4>
            <p style={{ fontSize: '12px', marginTop: '6px', lineHeight: '1.4', maxWidth: '260px' }}>
              Hãy tìm kiếm và kết bạn từ mục <b>Bạn bè</b>, <b>Cộng đồng</b> hoặc <b>Chợ PT</b> để bắt đầu trò chuyện cùng nhau!
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
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Bạn bè đang hoạt động ({dynamicFriends.length})</span>
              <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', padding: '8px 2px 2px', width: '100%' }}>
                {dynamicFriends.filter(f => f.online).map((friend, idx) => (
                  <div 
                    key={idx}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', flexShrink: 0 }}
                    onClick={() => setActiveFriend(friend)}
                  >
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={friend.avatar} 
                        alt={friend.name}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-green)' }}
                      />
                      <div style={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        right: 0, 
                        width: '11px', 
                        height: '11px', 
                        background: 'var(--accent-green)', 
                        border: '2px solid var(--bg-dark)', 
                        borderRadius: '50%' 
                      }} />
                    </div>
                    <span style={{ fontSize: '10px', color: 'white', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  const previewMsg = hasMsgs ? latestMsg.text : (friend.isPt ? 'Chào bạn, cần hỗ trợ gì về lịch tập không?' : 'Chào bạn! Cùng tập luyện nhé!');
                  const previewTime = hasMsgs ? latestMsg.time : 'Bạn bè';
                  
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
                        background: 'rgba(255, 255, 255, 0.02)',
                        transition: 'background 0.2s ease'
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
                          <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {friend.name}
                          </h4>
                          <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{previewTime}</span>
                        </div>
                        <p style={{ 
                          fontSize: '11px', 
                          color: latestMsg?.sender === 'user' ? 'var(--text-secondary)' : 'rgba(255,255,255,0.7)', 
                          marginTop: '3px',
                          marginBottom: 0,
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
                    Không tìm thấy bạn bè nào khớp với "{searchQuery}".
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
