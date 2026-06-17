import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Users, Heart, Flame, Smile, User, Plus, Image, X, ArrowLeft, MessageCircle, Menu, Edit2, Check } from 'lucide-react';

export default function CompanionAndSocial({ 
  aiChats, 
  setAiChats, 
  activeChatId, 
  setActiveChatId, 
  posts, 
  setPosts, 
  onCompleteTask, 
  onOpenProfile 
}) {
  const [activeSubTab, setActiveSubTab] = useState('companion'); // 'companion' or 'social'
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitleText, setEditingTitleText] = useState('');
  const chatEndRef = useRef(null);

  // Mini Social Network States
  const [newPostText, setNewPostText] = useState('');
  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  const [activePostId, setActivePostId] = useState(null); // ID of post in detailed comment view
  const [commentText, setCommentText] = useState('');
  const fileInputRef = useRef(null);

  // Get active chat from parent prop
  const currentChat = aiChats.find(chat => chat.id === activeChatId) || aiChats[0];
  const messages = currentChat ? currentChat.messages : [];

  // Scroll chat to bottom
  useEffect(() => {
    if (activeSubTab === 'companion') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChats, isTyping, activeSubTab, activeChatId]);

  // Chat message submit
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !currentChat) return;

    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    
    // Update local messages in parent's state
    setAiChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        let newTitle = chat.title;
        // Dynamically rename from default if it was newly created
        if (chat.title.startsWith("Cuộc trò chuyện mới")) {
          newTitle = inputText.length > 20 ? inputText.substring(0, 18) + '...' : inputText;
        }
        return {
          ...chat,
          title: newTitle,
          messages: [...chat.messages, userMsg]
        };
      }
      return chat;
    }));

    setInputText('');
    setIsTyping(true);

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

      setAiChats(prevChats => prevChats.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, botMsg]
          };
        }
        return chat;
      }));

      onCompleteTask(3); // Complete daily task for companion chat/social post
    }, 1200);
  };

  const handleSaveTitle = (chatId) => {
    if (!editingTitleText.trim()) return;
    setAiChats(prevChats => prevChats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          title: editingTitleText.trim()
        };
      }
      return chat;
    }));
    setEditingChatId(null);
  };

  // Handle local image attachment
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedFileUrl(url);
    }
  };

  // Remove attached image preview
  const handleRemoveImage = () => {
    setSelectedFileUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Social Post submit
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedFileUrl) return;

    const newPost = {
      id: Date.now(),
      author: 'Hùng (Bạn)',
      role: 'Hội viên',
      time: 'Vừa xong',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
      content: newPostText,
      image: selectedFileUrl || null,
      reactions: { love: 0, fire: 0, haha: 0 },
      userReacted: { love: false, fire: false, haha: false },
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setSelectedFileUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onCompleteTask(3); // Completing social post also completes daily task
  };

  // React to post
  const handleReact = (postId, type) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const hasReacted = post.userReacted[type];
        const newReactions = { ...post.reactions };
        const newUserReacted = { ...post.userReacted };

        if (hasReacted) {
          newReactions[type] -= 1;
          newUserReacted[type] = false;
        } else {
          newReactions[type] += 1;
          newUserReacted[type] = true;
        }

        return {
          ...post,
          reactions: newReactions,
          userReacted: newUserReacted
        };
      }
      return post;
    }));
  };

  // Comment submit
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !activePostId) return;

    const newComment = {
      id: Date.now(),
      author: 'Hùng (Bạn)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
      content: commentText,
      time: 'Vừa xong'
    };

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === activePostId) {
        return {
          ...post,
          comments: [...(post.comments || []), newComment]
        };
      }
      return post;
    }));

    setCommentText('');
    onCompleteTask(3); // Commenting also completes daily task
  };

  // Return specific post for detailed view
  const activePost = posts.find(p => p.id === activePostId);

  return (
    <div className="screen-content animate-slide-up" style={{ paddingBottom: '10px' }}>
      {/* Sub-view: Detailed Post and Comments */}
      {activePostId && activePost ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', height: '600px' }}>
          {/* Post Detail Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '12px'
          }}>
            <button 
              onClick={() => setActivePostId(null)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={14} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>Chi tiết bài viết</span>
          </div>

          {/* Scrollable Post Content and Comments List */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '2px' }}>
            {/* The Expanded Post Card */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.02)' }}>
              {/* Author */}
              <div 
                style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => onOpenProfile({
                  name: activePost.author,
                  role: activePost.role,
                  avatar: activePost.avatar,
                  isPt: activePost.role.includes('Huấn luyện viên'),
                  isSelf: activePost.author.includes('Bạn')
                })}
              >
                <img 
                  src={activePost.avatar} 
                  alt={activePost.author} 
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{activePost.author}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{activePost.role} • {activePost.time}</div>
                </div>
              </div>

              {/* Body */}
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                {activePost.content}
              </p>

              {/* Image if any */}
              {activePost.image && (
                <img 
                  src={activePost.image} 
                  alt="Post attachment" 
                  style={{ width: '100%', maxHeight: '180px', borderRadius: '12px', objectFit: 'cover', marginTop: '4px' }}
                />
              )}

              {/* Reactions Row */}
              <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                <button 
                  onClick={() => handleReact(activePost.id, 'love')}
                  style={{
                    background: activePost.userReacted.love ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: activePost.userReacted.love ? 'rgba(255, 0, 0, 0.3)' : 'var(--border-color)',
                    color: activePost.userReacted.love ? '#ff3b30' : 'var(--text-secondary)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Heart size={12} fill={activePost.userReacted.love ? "#ff3b30" : "none"} stroke={activePost.userReacted.love ? "none" : "currentColor"} /> 
                  <span>{activePost.reactions.love}</span>
                </button>

                <button 
                  onClick={() => handleReact(activePost.id, 'fire')}
                  style={{
                    background: activePost.userReacted.fire ? 'rgba(255, 87, 34, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: activePost.userReacted.fire ? 'rgba(255, 87, 34, 0.4)' : 'var(--border-color)',
                    color: activePost.userReacted.fire ? 'var(--accent-orange)' : 'var(--text-secondary)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Flame size={12} fill={activePost.userReacted.fire ? "var(--accent-orange)" : "none"} stroke={activePost.userReacted.fire ? "none" : "currentColor"} />
                  <span>{activePost.reactions.fire}</span>
                </button>

                <button 
                  onClick={() => handleReact(activePost.id, 'haha')}
                  style={{
                    background: activePost.userReacted.haha ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: activePost.userReacted.haha ? 'rgba(255, 215, 0, 0.4)' : 'var(--border-color)',
                    color: activePost.userReacted.haha ? '#ffd700' : 'var(--text-secondary)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Smile size={12} />
                  <span>{activePost.reactions.haha}</span>
                </button>
              </div>
            </div>

            {/* Comments List Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)', paddingLeft: '4px' }}>
                Bình luận ({activePost.comments?.length || 0})
              </div>

              {activePost.comments && activePost.comments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activePost.comments.map((comment) => (
                    <div 
                      key={comment.id}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        padding: '10px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid var(--border-color)',
                        alignItems: 'flex-start'
                      }}
                    >
                      <img 
                        src={comment.avatar} 
                        alt={comment.author} 
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', marginTop: '2px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700 }}>{comment.author}</span>
                          <span style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>{comment.time}</span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: 'var(--text-primary)', marginTop: '3px', lineHeight: '1.3' }}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="subtitle" style={{ textAlign: 'center', padding: '16px 0', fontSize: '11px' }}>
                  Chưa có bình luận nào. Hãy trở thành người đầu tiên!
                </p>
              )}
            </div>
          </div>

          {/* Floating/Bottom Comment Input Box */}
          <form onSubmit={handleAddComment} style={{
            display: 'flex',
            gap: '8px',
            marginTop: '10px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '10px'
          }}>
            <input 
              type="text" 
              placeholder="Viết bình luận của bạn..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              disabled={!commentText.trim()}
              style={{
                background: 'var(--accent-green)',
                color: '#050608',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                opacity: commentText.trim() ? 1 : 0.5
              }}
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      ) : (
        /* Tabs Switcher and Chat/Social views */
        <>
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '14px',
            padding: '4px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setActiveSubTab('companion')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '10px',
                border: 'none',
                background: activeSubTab === 'companion' ? 'rgba(57, 255, 20, 0.12)' : 'transparent',
                color: activeSubTab === 'companion' ? 'var(--accent-green)' : 'var(--text-secondary)',
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
              onClick={() => setActiveSubTab('social')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '10px',
                border: 'none',
                background: activeSubTab === 'social' ? 'rgba(57, 255, 20, 0.12)' : 'transparent',
                color: activeSubTab === 'social' ? 'var(--accent-green)' : 'var(--text-secondary)',
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
              Cộng đồng FitMate
            </button>
          </div>

          {activeSubTab === 'companion' ? (
            /* Trợ lý AI Chat View */
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', height: '520px', position: 'relative' }}>
              
              {/* AI Chat Header with Sidebar Menu Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0 12px',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '10px'
              }}>
                <button 
                  onClick={() => setAiSidebarOpen(true)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Menu size={16} />
                </button>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-green)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                  {currentChat ? currentChat.title : "Trợ lý AI"}
                </span>
                <div style={{ width: '32px' }} /> {/* spacer */}
              </div>

              {/* Sidebar/Drawer List of Conversations (Overlay inside the chat container) */}
              {aiSidebarOpen && (
                <>
                  {/* Local Backdrop */}
                  <div 
                    onClick={() => setAiSidebarOpen(false)}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.5)',
                      backdropFilter: 'blur(3px)',
                      zIndex: 90
                    }}
                  />
                  {/* Local Sidebar Panel */}
                  <div className="animate-slide-in" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '240px',
                    height: '100%',
                    background: 'var(--bg-card-solid)',
                    borderRight: '1px solid var(--border-color)',
                    zIndex: 91,
                    padding: '16px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    boxShadow: '8px 0 24px rgba(0,0,0,0.5)',
                    borderRadius: '16px 0 0 16px'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--accent-green)' }}>Danh sách đoạn chat</span>
                      <button 
                        onClick={() => setAiSidebarOpen(false)}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* New Chat Button */}
                    <button 
                      onClick={() => {
                        const newId = Date.now();
                        const newChat = {
                          id: newId,
                          title: `Cuộc trò chuyện mới ${aiChats.length + 1}`,
                          messages: [
                            { id: 1, text: "Chào Hùng! Mình có thể tư vấn gì về luyện tập hay dinh dưỡng hôm nay?", sender: 'buddy' }
                          ]
                        };
                        setAiChats(prev => [...prev, newChat]);
                        setActiveChatId(newId);
                        setAiSidebarOpen(false);
                      }}
                      style={{
                        background: 'rgba(57, 255, 20, 0.1)',
                        border: '1px solid rgba(57, 255, 20, 0.25)',
                        color: 'var(--accent-green)',
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '10px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Plus size={14} />
                      Cuộc trò chuyện mới
                    </button>

                    {/* Chat Conversations List */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {aiChats.map((chat) => (
                        <div 
                          key={chat.id}
                          onClick={() => {
                            if (editingChatId !== chat.id) {
                              setActiveChatId(chat.id);
                              setAiSidebarOpen(false);
                            }
                          }}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: chat.id === activeChatId ? 'rgba(57, 255, 20, 0.08)' : 'rgba(255,255,255,0.02)',
                            border: '1px solid',
                            borderColor: chat.id === activeChatId ? 'var(--accent-green)' : 'var(--border-color)',
                            cursor: editingChatId === chat.id ? 'default' : 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {editingChatId === chat.id ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                              <input 
                                type="text"
                                value={editingTitleText}
                                onChange={(e) => setEditingTitleText(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveTitle(chat.id);
                                  }
                                }}
                                style={{
                                  flex: 1,
                                  background: 'rgba(0,0,0,0.2)',
                                  border: '1px solid var(--accent-green)',
                                  borderRadius: '6px',
                                  color: 'white',
                                  fontSize: '11px',
                                  padding: '2px 6px',
                                  outline: 'none',
                                  minWidth: 0
                                }}
                                autoFocus
                              />
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveTitle(chat.id);
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                              >
                                <Check size={12} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingChatId(null);
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <span style={{ 
                                fontSize: '11.5px', 
                                fontWeight: chat.id === activeChatId ? 700 : 500, 
                                color: chat.id === activeChatId ? 'var(--accent-green)' : 'var(--text-primary)',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                maxWidth: '120px'
                              }}>
                                {chat.title}
                              </span>
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingChatId(chat.id);
                                    setEditingTitleText(chat.title);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '2px',
                                    opacity: 0.7
                                  }}
                                  title="Đổi tên"
                                >
                                  <Edit2 size={11} />
                                </button>
                                {aiChats.length > 1 && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const remaining = aiChats.filter(c => c.id !== chat.id);
                                      setAiChats(remaining);
                                      if (activeChatId === chat.id && remaining.length > 0) {
                                        setActiveChatId(remaining[0].id);
                                      }
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--text-secondary)',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      padding: '2px'
                                    }}
                                    title="Xóa"
                                  >
                                    <X size={12} />
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

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
            /* Mạng Xã Hội Mini View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '520px', overflowY: 'auto' }}>
              {/* Post Creation Box */}
              <form onSubmit={handleCreatePost} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'var(--accent-green)',
                      cursor: 'pointer'
                    }}
                    onClick={() => onOpenProfile({
                      name: 'Hùng (Bạn)',
                      role: 'Hội viên',
                      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
                      isPt: false,
                      isSelf: true
                    })}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60" 
                      alt="Current User" 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                  <input 
                    type="text"
                    placeholder="Hôm nay bạn tập thế nào? Chia sẻ nhé..."
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'white',
                      fontSize: '13px'
                    }}
                  />
                </div>

                {/* Attached Image Preview */}
                {selectedFileUrl && (
                  <div style={{ position: 'relative', width: 'fit-content', marginTop: '6px' }}>
                    <img 
                      src={selectedFileUrl} 
                      alt="Attachment preview" 
                      style={{
                        maxHeight: '120px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        display: 'block'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        border: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* Bottom Actions of post creator */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-color)', 
                  paddingTop: '8px' 
                }}>
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      id="post-image-uploader"
                      style={{ display: 'none' }}
                    />
                    <label 
                      htmlFor="post-image-uploader"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        color: 'var(--accent-green)',
                        background: 'rgba(57, 255, 20, 0.05)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(57, 255, 20, 0.1)',
                        cursor: 'pointer'
                      }}
                    >
                      <Image size={14} />
                      Thêm ảnh
                    </label>
                  </div>

                  <button 
                    type="submit"
                    disabled={!newPostText.trim() && !selectedFileUrl}
                    className="btn-primary" 
                    style={{ 
                      width: 'auto', 
                      padding: '6px 16px', 
                      borderRadius: '10px', 
                      fontSize: '11px',
                      opacity: (newPostText.trim() || selectedFileUrl) ? 1 : 0.5
                    }}
                  >
                    <Plus size={12} />
                    Đăng bài
                  </button>
                </div>
              </form>

              {/* Social Feed List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {posts.map((post) => (
                  <div key={post.id} className="glass-card animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Author Info (Clickable) */}
                    <div 
                      style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => onOpenProfile({
                        name: post.author,
                        role: post.role,
                        avatar: post.avatar,
                        isPt: post.role.includes('Huấn luyện viên') || post.author.includes('Tú') || post.author.includes('Khang'),
                        isSelf: post.author.includes('Bạn')
                      })}
                    >
                      <img 
                        src={post.avatar}
                        alt={post.author}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{post.author}</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{post.role} • {post.time}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      {post.content}
                    </p>

                    {/* Attached Post Image */}
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Post media" 
                        style={{
                          width: '100%',
                          maxHeight: '180px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          marginTop: '4px'
                        }}
                      />
                    )}

                    {/* Reaction & Comment Action Bar */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      borderTop: '1px solid var(--border-color)', 
                      paddingTop: '8px', 
                      marginTop: '4px',
                      alignItems: 'center'
                    }}>
                      {/* Love Reaction */}
                      <button 
                        onClick={() => handleReact(post.id, 'love')}
                        style={{
                          background: post.userReacted.love ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid',
                          borderColor: post.userReacted.love ? 'rgba(255, 0, 0, 0.3)' : 'var(--border-color)',
                          color: post.userReacted.love ? '#ff3b30' : 'var(--text-secondary)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Heart size={12} fill={post.userReacted.love ? "#ff3b30" : "none"} stroke={post.userReacted.love ? "none" : "currentColor"} /> 
                        <span>{post.reactions.love}</span>
                      </button>

                      {/* Fire Reaction */}
                      <button 
                        onClick={() => handleReact(post.id, 'fire')}
                        style={{
                          background: post.userReacted.fire ? 'rgba(255, 87, 34, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid',
                          borderColor: post.userReacted.fire ? 'rgba(255, 87, 34, 0.4)' : 'var(--border-color)',
                          color: post.userReacted.fire ? 'var(--accent-orange)' : 'var(--text-secondary)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Flame size={12} fill={post.userReacted.fire ? "var(--accent-orange)" : "none"} stroke={post.userReacted.fire ? "none" : "currentColor"} />
                        <span>{post.reactions.fire}</span>
                      </button>

                      {/* Haha Reaction */}
                      <button 
                        onClick={() => handleReact(post.id, 'haha')}
                        style={{
                          background: post.userReacted.haha ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid',
                          borderColor: post.userReacted.haha ? 'rgba(255, 215, 0, 0.4)' : 'var(--border-color)',
                          color: post.userReacted.haha ? '#ffd700' : 'var(--text-secondary)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Smile size={12} />
                        <span>{post.reactions.haha}</span>
                      </button>

                      {/* Comment Action Button (Enlarges post to detail view) */}
                      <button 
                        onClick={() => setActivePostId(post.id)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-secondary)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginLeft: 'auto',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <MessageCircle size={12} />
                        <span>{post.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
