import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  FileText, 
  X, 
  Send, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  BookOpen, 
  HelpCircle,
  Hash,
  Globe,
  Users,
  Lock,
  ChevronDown,
  Coins
} from 'lucide-react';

export default function CreatePostModal({
  onClose,
  onCreatePost,
  myProfile,
  showToast,
  initialText = '',
  initialImage = '',
  initialIsKnowledge = false
}) {
  const [content, setContent] = useState(initialText);
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isKnowledgePost, setIsKnowledgePost] = useState(initialIsKnowledge);
  const [selectedTags, setSelectedTags] = useState([]);
  const [visibility, setVisibility] = useState('public'); // 'public' | 'friends' | 'private'
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  
  // Rule Modals
  const [showCommunityRulesModal, setShowCommunityRulesModal] = useState(false);
  const [showKnowledgeRulesModal, setShowKnowledgeRulesModal] = useState(false);

  const fileInputRef = useRef(null);

  const authorName = myProfile?.name || 'Hùng (Bạn)';
  const authorRole = myProfile?.role || (myProfile?.isPt ? 'Huấn luyện viên' : 'Hội viên');
  const authorAvatar = myProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60';

  const VISIBILITY_OPTIONS = [
    {
      id: 'public',
      label: 'Công khai',
      desc: 'Mọi người trên FitMate đều có thể thấy',
      icon: Globe,
      color: 'var(--accent-green)'
    },
    {
      id: 'friends',
      label: 'Bạn bè',
      desc: 'Chỉ bạn bè trong danh sách của bạn',
      icon: Users,
      color: '#2f80ed'
    },
    {
      id: 'private',
      label: 'Chỉ mình tôi',
      desc: 'Chỉ một mình bạn thấy (nhật ký cá nhân)',
      icon: Lock,
      color: '#ffd700'
    }
  ];

  const currentVisibilityObj = VISIBILITY_OPTIONS.find(v => v.id === visibility) || VISIBILITY_OPTIONS[0];
  const CurrentVisibilityIcon = currentVisibilityObj.icon;

  const SUGGESTED_TAGS = [
    '#Calisthenics',
    '#GymWorkout',
    '#EatClean',
    '#GiamMoTangCo',
    '#DinhDuongChuyenSau',
    '#ChiaSeKinhNghiem',
    '#DongLucMoiNgay'
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
      setContent(prev => prev.replace(tag, '').trim());
    } else {
      setSelectedTags([...selectedTags, tag]);
      setContent(prev => prev ? `${prev} ${tag}` : tag);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      if (showToast) showToast('Đã tải hình ảnh lên! 📸', 'success');
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!content.trim() && !imageUrl && !linkUrl) {
      if (showToast) showToast('Vui lòng nhập nội dung bài viết!', 'orange');
      return;
    }

    if (isKnowledgePost && content.trim().length < 15) {
      if (showToast) showToast('Bài viết kiến thức cần tối thiểu 15 ký tự để đủ điều kiện xét duyệt nhận xu thưởng! ⚠️', 'orange');
      return;
    }

    onCreatePost({
      content: content.trim(),
      image: imageUrl || null,
      link: linkUrl.trim() || null,
      isKnowledge: isKnowledgePost,
      visibility: visibility
    });

    onClose();
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(12, 15, 18, 0.98)',
      backdropFilter: 'blur(20px)',
      zIndex: 2500,
      borderRadius: '30px',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      overflowY: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'white', margin: 0 }}>
            Tạo bài viết mới
          </h3>
        </div>

        {/* Submit Post Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() && !imageUrl && !linkUrl}
          className="btn-primary"
          style={{
            padding: '6px 16px',
            borderRadius: '10px',
            fontSize: '11.5px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            opacity: (content.trim() || imageUrl || linkUrl) ? 1 : 0.5,
            cursor: (content.trim() || imageUrl || linkUrl) ? 'pointer' : 'not-allowed'
          }}
        >
          <Send size={13} /> Đăng bài
        </button>
      </div>

      {/* Author User Info Bar with Interactive Privacy Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
        <img
          src={authorAvatar}
          alt={authorName}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            objectFit: 'cover',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'white' }}>
            {authorName}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', position: 'relative' }}>
            <span style={{
              fontSize: '9.5px',
              background: myProfile?.isPt ? 'rgba(255, 87, 34, 0.15)' : 'rgba(57, 255, 20, 0.1)',
              color: myProfile?.isPt ? 'var(--accent-orange)' : 'var(--accent-green)',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}>
              {authorRole}
            </span>

            {/* Interactive Privacy / Visibility Pill Button */}
            <button
              type="button"
              onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
              style={{
                fontSize: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: currentVisibilityObj.color,
                padding: '2px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              <CurrentVisibilityIcon size={11} color={currentVisibilityObj.color} />
              <span>{currentVisibilityObj.label}</span>
              <ChevronDown size={11} color="var(--text-secondary)" />
            </button>

            {/* Visibility Dropdown Menu */}
            {showVisibilityMenu && (
              <div 
                className="glass-card animate-slide-up"
                style={{
                  position: 'absolute',
                  top: '26px',
                  left: '60px',
                  zIndex: 3000,
                  background: '#161c24',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  minWidth: '220px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
                }}
              >
                {VISIBILITY_OPTIONS.map((opt) => {
                  const OptIcon = opt.icon;
                  const isSelected = visibility === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        setVisibility(opt.id);
                        setShowVisibilityMenu(false);
                        if (showToast) {
                          showToast(`Đã chọn đối tượng: ${opt.label}`, 'info');
                        }
                      }}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(57, 255, 20, 0.1)' : 'transparent',
                        border: isSelected ? '1px solid rgba(57, 255, 20, 0.3)' : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: opt.color
                        }}>
                          <OptIcon size={13} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>
                            {opt.label}
                          </span>
                          <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>
                            {opt.desc}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check size={12} color="var(--accent-green)" strokeWidth={3} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Textarea Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Hôm nay bạn tập luyện ra sao? Hãy chia sẻ cảm nghĩ, giáo án bài tập, thực đơn dinh dưỡng hoặc kinh nghiệm của bạn với cộng đồng FitMate..."
          style={{
            width: '100%',
            minHeight: '140px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '12px 14px',
            color: 'white',
            fontSize: '13px',
            lineHeight: '1.5',
            fontFamily: 'inherit',
            resize: 'none',
            outline: 'none'
          }}
        />

        {/* Hashtags Suggestions */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
          {SUGGESTED_TAGS.map(tag => {
            const isSelected = selectedTags.includes(tag) || content.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  background: isSelected ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid var(--accent-green)' : '1px solid var(--border-color)',
                  color: isSelected ? 'var(--accent-green)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Attached Image Preview */}
        {imageUrl && (
          <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', maxHeight: '180px' }}>
            <img
              src={imageUrl}
              alt="Ảnh bài đăng"
              style={{ width: '100%', height: '100%', maxHeight: '180px', objectFit: 'cover' }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Attached Link Input & Preview */}
        {showLinkInput && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Dán link liên kết (Youtube, bài viết, tài liệu)..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '6px 10px',
                color: 'white',
                fontSize: '11.5px',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={() => { setShowLinkInput(false); setLinkUrl(''); }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                color: 'var(--text-secondary)',
                padding: '6px 8px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Media Attach Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '8px 12px'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Đính kèm vào bài viết:
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              id="create-modal-image-input"
              style={{ display: 'none' }}
            />
            <label
              htmlFor="create-modal-image-input"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: 'var(--accent-green)',
                background: 'rgba(57, 255, 20, 0.08)',
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(57, 255, 20, 0.2)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <ImageIcon size={13} /> Thêm ảnh
            </label>

            <button
              type="button"
              onClick={() => setShowLinkInput(!showLinkInput)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: '#2f80ed',
                background: 'rgba(47, 128, 237, 0.08)',
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(47, 128, 237, 0.2)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <LinkIcon size={13} /> Gắn link
            </button>
          </div>
        </div>

        {/* Quality Knowledge Post Registration Switch */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isKnowledgePost ? 'rgba(255, 215, 0, 0.06)' : 'rgba(255, 255, 255, 0.02)',
          border: isKnowledgePost ? '1px solid rgba(255, 215, 0, 0.35)' : '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '10px 14px',
          transition: 'all 0.25s ease'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isKnowledgePost ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isKnowledgePost ? '#ffd700' : 'var(--text-secondary)'
            }}>
              <BookOpen size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: isKnowledgePost ? '#ffd700' : 'white' }}>
                Đăng ký bài viết kiến thức hữu ích
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '1px' }}>
                Nhận tới <strong style={{ color: 'var(--accent-green)' }}>+10 xu</strong> khi bài viết đạt 50 tương tác hữu ích.
              </span>
            </div>
          </div>

          {/* Toggle Button */}
          <div
            onClick={() => setIsKnowledgePost(!isKnowledgePost)}
            style={{
              width: '38px',
              height: '22px',
              borderRadius: '11px',
              background: isKnowledgePost ? 'var(--accent-green)' : 'rgba(255,255,255,0.12)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.25s ease',
              flexShrink: 0
            }}
          >
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: isKnowledgePost ? '#12151c' : 'white',
              position: 'absolute',
              top: '2px',
              left: isKnowledgePost ? '18px' : '2px',
              transition: 'left 0.25s ease'
            }} />
          </div>
        </div>

        {/* 2 Rule Action Buttons Required by User */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
          {/* Button 1: Quy tắc đăng bài (Blue button) */}
          <button
            type="button"
            onClick={() => setShowCommunityRulesModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 10px',
              borderRadius: '10px',
              background: 'rgba(47, 128, 237, 0.1)',
              border: '1px solid rgba(47, 128, 237, 0.35)',
              color: '#2f80ed',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={14} /> Quy tắc đăng bài
          </button>

          {/* Button 2: Quy tắc bài đăng kiến thức (Yellow button) */}
          <button
            type="button"
            onClick={() => setShowKnowledgeRulesModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 10px',
              borderRadius: '10px',
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.35)',
              color: '#ffd700',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Coins size={14} /> Quy tắc bài kiến thức
          </button>
        </div>
      </div>

      {/* Modal 1: Quy Tắc Ứng Xử Cộng Đồng (Community Rules Modal) */}
      {showCommunityRulesModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 3500,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
          onClick={() => setShowCommunityRulesModal(false)}
        >
          <div 
            className="glass-card animate-slide-up"
            style={{
              width: '100%',
              maxWidth: '380px',
              background: '#161c24',
              borderColor: 'rgba(47, 128, 237, 0.4)',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(47, 128, 237, 0.15)', color: '#2f80ed', borderRadius: '8px', padding: '6px' }}>
                  <ShieldCheck size={18} />
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'white', margin: 0 }}>
                  Quy Tắc Ứng Xử Cộng Đồng
                </h4>
              </div>
              <button
                onClick={() => setShowCommunityRulesModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11.5px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>1.</span>
                <span><strong>Tôn trọng và văn minh:</strong> Luôn thảo luận lịch sự, khuyến khích tinh thần thể thao lành mạnh và hỗ trợ lẫn nhau.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--accent-orange)', fontWeight: 800 }}>2.</span>
                <span><strong>AI kiểm duyệt tự động:</strong> Mọi ngôn từ kích động, thô tục, công kích cá nhân sẽ bị hệ thống AI tự động ẩn hoặc khóa tài khoản.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#2f80ed', fontWeight: 800 }}>3.</span>
                <span><strong>Không spam / Quảng cáo sai sự thật:</strong> Nghiêm cấm chia sẻ thuốc cấm, chất kích thích hoặc liên kết độc hại.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#ffd700', fontWeight: 800 }}>4.</span>
                <span><strong>Bảo vệ quyền riêng tư:</strong> Không đăng tải thông tin cá nhân nhạy cảm của hội viên khác khi chưa được phép.</span>
              </div>
            </div>

            <button
              onClick={() => setShowCommunityRulesModal(false)}
              className="btn-primary"
              style={{ marginTop: '8px', padding: '8px', width: '100%', fontSize: '12px' }}
            >
              Đã hiểu quy tắc
            </button>
          </div>
        </div>
      )}

      {/* Modal 2: Quy Tắc Bài Đăng Kiến Thức (Knowledge Post Rules Modal) */}
      {showKnowledgeRulesModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 3500,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
          onClick={() => setShowKnowledgeRulesModal(false)}
        >
          <div 
            className="glass-card animate-slide-up"
            style={{
              width: '100%',
              maxWidth: '380px',
              background: '#161c24',
              borderColor: 'rgba(255, 215, 0, 0.4)',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(255, 215, 0, 0.15)', color: '#ffd700', borderRadius: '8px', padding: '6px' }}>
                  <Coins size={18} />
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#ffd700', margin: 0 }}>
                  Quy Tắc Bài Viết Kiến Thức
                </h4>
              </div>
              <button
                onClick={() => setShowKnowledgeRulesModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11.5px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#ffd700', fontWeight: 800 }}>⭐</span>
                <span><strong>Tiêu chuẩn nội dung:</strong> Bài viết chia sẻ kiến thức tập luyện thực tế (kỹ thuật form, giáo án, mẹo ăn uống, kiến thức phục hồi).</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#ffd700', fontWeight: 800 }}>⭐</span>
                <span><strong>Độ dài tối thiểu:</strong> Viết rõ ràng, tối thiểu từ <strong>15 ký tự</strong> trở lên để tránh spam nội dung rỗng.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>💰</span>
                <span><strong>Cơ chế trả thưởng xu:</strong> Khi bài viết kiến thức đạt mốc <strong>50 lượt tương tác hữu ích</strong> (Love/Fire/Comment), hệ thống tự động cộng thưởng <strong>5 tương tác = 1 xu</strong> (tối đa +10 xu/bài)!</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>🏷️</span>
                <span><strong>Huy hiệu danh giá:</strong> Bài viết được duyệt sẽ gắn thẻ <span style={{ color: '#ffd700', fontWeight: 700 }}>[Kiến Thức Hữu Ích]</span> nổi bật trên bảng tin cộng đồng.</span>
              </div>
            </div>

            <button
              onClick={() => setShowKnowledgeRulesModal(false)}
              className="btn-primary"
              style={{
                marginTop: '8px',
                padding: '8px',
                width: '100%',
                fontSize: '12px',
                background: 'linear-gradient(135deg, #ffd700, #ff9100)',
                color: '#12151c',
                fontWeight: 800
              }}
            >
              Đã hiểu thể lệ nhận xu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
