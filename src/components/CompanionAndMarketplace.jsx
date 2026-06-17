import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Users, Star, Award, Check, Sparkles } from 'lucide-react';

export default function CompanionAndMarketplace({ messages, setMessages, onCompleteTask }) {
  const [activeTab, setActiveTab] = useState('companion'); // 'companion' or 'marketplace'
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // User message
    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI Responses Pool
    const responses = [
      "Tuyệt vời lắm! Sự kiên trì chính là chìa khóa để thay đổi bản thân. Cố lên nhé! 💪",
      "Hôm nay bạn đã hoàn thành nhiệm vụ rất xuất sắc đó. Đừng quên uống đủ nước nhé! 💧",
      "Nếu cảm thấy hơi đuối sức, bạn hãy thử bật 'Chế độ mệt mỏi' trong mục Lịch tập nha, tớ sẽ điều chỉnh ngay. ⚡",
      "Dinh dưỡng chiếm 70% kết quả đấy! Tớ thấy bạn vừa quét calo bữa ăn, chỉ số rất đẹp! 🍳",
      "Tớ luôn đồng hành cùng bạn trên con đường chinh phục FitMate. Keep fighting! 🎯"
    ];

    setTimeout(() => {
      setIsTyping(false);
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      const botMsg = { id: Date.now() + 1, text: randomReply, sender: 'buddy' };
      setMessages(prev => [...prev, botMsg]);
      onCompleteTask(3); // Complete task ID 3: Trò chuyện với Buddy
    }, 1200);
  };

  // PT data
  const pts = [
    {
      id: 1,
      name: 'Mai Xuân Tú',
      rating: '4.9',
      exp: '3 năm kinh nghiệm',
      price: '300.000đ/buổi',
      spec: ['Calisthenics', 'Giảm cân nhanh', 'Sức bền'],
      avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      name: 'Nguyễn Minh Khang',
      rating: '4.8',
      exp: '1.5 năm kinh nghiệm',
      price: '250.000đ/buổi',
      spec: ['Tăng cơ', 'Dinh dưỡng chuyên sâu', 'Powerlifting'],
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=60'
    }
  ];

  const handleBookPt = (ptName) => {
    const confirm = window.confirm(`Bạn muốn đăng ký buổi tập thử miễn phí với HLV ${ptName}?`);
    if (confirm) {
      alert(`Đăng ký thành công! HLV ${ptName} sẽ liên hệ hỗ trợ bạn qua SĐT/Zalo trong ít phút.`);
    }
  };

  return (
    <div className="screen-content animate-slide-up" style={{ paddingBottom: '10px' }}>
      {/* Tabs Navigator */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '14px',
        padding: '4px',
        border: '1px solid var(--border-color)'
      }}>
        <button
          onClick={() => setActiveTab('companion')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'companion' ? 'rgba(57, 255, 20, 0.12)' : 'transparent',
            color: activeTab === 'companion' ? 'var(--accent-green)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <MessageSquare size={14} />
          Trợ lý AI
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'marketplace' ? 'rgba(57, 255, 20, 0.12)' : 'transparent',
            color: activeTab === 'marketplace' ? 'var(--accent-green)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <Users size={14} />
          Chợ PT (Huấn luyện viên)
        </button>
      </div>

      {/* Screen body depending on active tab */}
      {activeTab === 'companion' ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', height: '520px' }}>
          {/* Chat message history window */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px 2px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {/* Bubble */}
                <div style={{
                  background: msg.sender === 'user' 
                    ? 'linear-gradient(135deg, var(--accent-green) 0%, #1ecc0d 100%)' 
                    : 'var(--bg-card)',
                  color: msg.sender === 'user' ? '#050608' : 'var(--text-primary)',
                  fontWeight: msg.sender === 'user' ? 600 : 500,
                  fontSize: '13px',
                  lineHeight: '1.4',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  boxShadow: msg.sender === 'user' ? '0 2px 10px rgba(57, 255, 20, 0.15)' : 'none'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '3px', padding: '0 4px' }}>
                  {msg.sender === 'user' ? 'Bạn' : 'Buddy AI'}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  padding: '10px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  border: '1px solid var(--border-color)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}>
                  <span className="animate-pulse-slow">Buddy đang gõ...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input messaging */}
          <form onSubmit={handleSendMessage} style={{
            display: 'flex',
            gap: '8px',
            marginTop: '10px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '12px'
          }}>
            <input
              type="text"
              placeholder="Hỏi Buddy cách giảm cân, tập tay..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: 'white',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-green)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              style={{
                background: 'var(--accent-green)',
                color: '#050608',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                opacity: inputText.trim() ? 1 : 0.5,
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        /* PT Marketplace view */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '520px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>PT Phổ Biến Tại TP.HCM</span>
            <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} /> Đã kiểm duyệt
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pts.map((pt) => (
              <div key={pt.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img 
                    src={pt.avatar} 
                    alt={pt.name} 
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      objectFit: 'cover',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700 }}>HLV {pt.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#ffb300', fontSize: '12px', fontWeight: 700 }}>
                        <Star size={14} fill="#ffb300" stroke="none" />
                        {pt.rating}
                      </div>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {pt.exp} • <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{pt.price}</span>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {pt.spec.map((s, idx) => (
                    <span 
                      key={idx}
                      style={{
                        fontSize: '9px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-color)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <button className="btn-primary" onClick={() => handleBookPt(pt.name)} style={{ padding: '10px' }}>
                  Đặt lịch tập thử miễn phí
                </button>
              </div>
            ))}
          </div>

          {/* PT Marketplace benefit alert */}
          <div className="glass-card" style={{ display: 'flex', gap: '10px', background: 'rgba(57, 255, 20, 0.03)', borderColor: 'rgba(57, 255, 20, 0.1)' }}>
            <Award size={18} color="var(--accent-green)" style={{ flexShrink: 0 }} />
            <div>
              <h5 style={{ fontSize: '12px', fontWeight: 700 }}>Cam kết của FitMate</h5>
              <p className="subtitle" style={{ fontSize: '10px', marginTop: '2px' }}>
                100% PT trên hệ thống đều có chứng chỉ quốc tế và được đánh giá thực tế bởi học viên.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
