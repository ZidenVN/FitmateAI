import React, { useState } from 'react';
import { ArrowLeft, UserCheck, UserPlus, Check, X, Clock, Users, Trash2, Search, MessageCircle } from 'lucide-react';

export default function FriendRequestsModal({
  friendRequests,
  friendsList,
  sentRequests,
  onClose,
  onAcceptRequest,
  onRejectRequest,
  onCancelSentRequest,
  onOpenProfile,
  onOpenSearchUsers,
  onOpenChat,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'friends' | 'sent'

  const pendingRequests = (friendRequests || []).filter(r => r.status === 'pending');

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              <UserCheck size={17} color="var(--accent-green)" /> Lời mời kết bạn
              {pendingRequests.length > 0 && (
                <span style={{ fontSize: '10px', background: 'var(--accent-orange)', color: 'white', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
                  {pendingRequests.length}
                </span>
              )}
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            if (onOpenSearchUsers) onOpenSearchUsers();
          }}
          style={{
            background: 'rgba(57, 255, 20, 0.1)',
            border: '1px solid rgba(57, 255, 20, 0.3)',
            color: 'var(--accent-green)',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Search size={12} /> Tìm bạn
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '3px',
        gap: '2px'
      }}>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            flex: 1.2,
            padding: '6px',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'requests' ? 'var(--accent-green)' : 'transparent',
            color: activeTab === 'requests' ? 'var(--bg-dark)' : 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Đã nhận ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          style={{
            flex: 1,
            padding: '6px',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'friends' ? 'var(--accent-green)' : 'transparent',
            color: activeTab === 'friends' ? 'var(--bg-dark)' : 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Bạn bè ({(friendsList || []).length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          style={{
            flex: 1,
            padding: '6px',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'sent' ? 'var(--accent-green)' : 'transparent',
            color: activeTab === 'sent' ? 'var(--bg-dark)' : 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Đã gửi ({(sentRequests || []).length})
        </button>
      </div>

      {/* Main Tab Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {activeTab === 'requests' && (
          pendingRequests.length > 0 ? (
            pendingRequests.map(req => (
              <div
                key={req.id}
                className="glass-card"
                style={{
                  padding: '12px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  borderColor: 'rgba(57, 255, 20, 0.25)',
                  background: 'rgba(57, 255, 20, 0.03)'
                }}
              >
                <img
                  src={req.avatar}
                  alt={req.name}
                  onClick={() => onOpenProfile && onOpenProfile({ name: req.name, avatar: req.avatar, role: req.role, bio: req.bio })}
                  style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover', cursor: 'pointer', flexShrink: 0 }}
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span 
                        onClick={() => onOpenProfile && onOpenProfile({ name: req.name, avatar: req.avatar, role: req.role, bio: req.bio })}
                        style={{ fontSize: '13px', fontWeight: 700, color: 'white', cursor: 'pointer' }}
                      >
                        {req.name}
                      </span>
                      <div style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 600 }}>
                        {req.role || 'Thành viên'}
                      </div>
                    </div>
                    <span style={{ fontSize: '9.5px', color: 'var(--text-secondary)' }}>
                      {req.time || 'Vừa xong'}
                    </span>
                  </div>

                  {req.bio && (
                    <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: '1.3' }}>
                      {req.bio}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={() => onAcceptRequest && onAcceptRequest(req)}
                      style={{
                        flex: 1,
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
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <Check size={12} /> Đồng ý
                    </button>
                    <button
                      onClick={() => onRejectRequest && onRejectRequest(req)}
                      style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <X size={12} /> Từ chối
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px' }}>
              <UserCheck size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontSize: '12.5px' }}>Hiện tại không có lời mời kết bạn nào.</p>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenSearchUsers) onOpenSearchUsers();
                }}
                className="btn-secondary"
                style={{ marginTop: '12px', fontSize: '11px', padding: '6px 14px' }}
              >
                Tìm thêm bạn bè mới
              </button>
            </div>
          )
        )}

        {activeTab === 'friends' && (
          (friendsList || []).length > 0 ? (
            (friendsList || []).map((friendName, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '12px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(57, 255, 20, 0.1)',
                    border: '1px solid rgba(57, 255, 20, 0.3)',
                    color: 'var(--accent-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '14px'
                  }}>
                    {friendName.charAt(0)}
                  </div>
                  <div>
                    <span 
                      onClick={() => onOpenProfile && onOpenProfile({ name: friendName })}
                      style={{ fontSize: '13px', fontWeight: 700, color: 'white', cursor: 'pointer' }}
                    >
                      {friendName}
                    </span>
                    <div style={{ fontSize: '10px', color: 'var(--accent-green)' }}>
                      ✓ Bạn bè
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenChat) onOpenChat(friendName);
                    }}
                    style={{
                      background: 'rgba(30, 117, 255, 0.15)',
                      border: '1px solid rgba(30, 117, 255, 0.4)',
                      color: '#4da3ff',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <MessageCircle size={12} />
                    Nhắn tin
                  </button>
                  <button
                    onClick={() => onOpenProfile && onOpenProfile({ name: friendName })}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-color)',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Xem trang
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px' }}>
              <Users size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontSize: '12.5px' }}>Bạn chưa có bạn bè nào.</p>
            </div>
          )
        )}

        {activeTab === 'sent' && (
          (sentRequests || []).length > 0 ? (
            (sentRequests || []).map((targetName, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '12px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(255, 87, 34, 0.1)',
                    border: '1px solid rgba(255, 87, 34, 0.3)',
                    color: 'var(--accent-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '14px'
                  }}>
                    {targetName.charAt(0)}
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>
                      {targetName}
                    </span>
                    <div style={{ fontSize: '10px', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={10} /> Đang đợi đối phương phản hồi
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onCancelSentRequest && onCancelSentRequest(targetName)}
                  style={{
                    background: 'rgba(255, 87, 34, 0.08)',
                    border: '1px solid rgba(255, 87, 34, 0.25)',
                    color: 'var(--accent-orange)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '10.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hủy lời mời
                </button>
              </div>
            ))
          ) : (
            <div className="glass-card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px' }}>
              <Clock size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontSize: '12.5px' }}>Không có lời mời nào đang chờ duyệt.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
