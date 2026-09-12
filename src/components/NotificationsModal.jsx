import React, { useState } from 'react';
import { ArrowLeft, Bell, Check, X, UserPlus, Flame, Calendar, Trophy, Sparkles, Clock, ChevronRight } from 'lucide-react';

export default function NotificationsModal({ 
  notifications, 
  setNotifications, 
  onClose, 
  onAcceptRequest, 
  onRejectRequest, 
  onOpenFriendRequests,
  onOpenProfile,
  showToast 
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'friend_request' | 'system'

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    if (setNotifications) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      if (showToast) showToast('Đã đánh dấu tất cả là đã đọc! ✅', 'success');
    }
  };

  const handleNotificationClick = (notif) => {
    if (setNotifications) {
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
    if (notif.type === 'friend_request' && onOpenFriendRequests) {
      onOpenFriendRequests();
    }
  };

  const filteredNotifications = (notifications || []).filter(notif => {
    if (filter === 'friend_request') return notif.type === 'friend_request';
    if (filter === 'system') return notif.type !== 'friend_request';
    return true;
  });

  const getNotifIcon = (notif) => {
    if (notif.type === 'friend_request') {
      return (
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(57, 255, 20, 0.12)', border: '1px solid rgba(57, 255, 20, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <UserPlus size={18} color="var(--accent-green)" />
        </div>
      );
    }
    if (notif.type === 'streak') {
      return (
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 87, 34, 0.12)', border: '1px solid rgba(255, 87, 34, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Flame size={18} color="var(--accent-orange)" />
        </div>
      );
    }
    if (notif.type === 'reward') {
      return (
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 215, 0, 0.12)', border: '1px solid rgba(255, 215, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Trophy size={18} color="#ffd700" />
        </div>
      );
    }
    return (
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(47, 128, 237, 0.12)', border: '1px solid rgba(47, 128, 237, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Bell size={18} color="#2f80ed" />
      </div>
    );
  };

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
              <Bell size={17} color="var(--accent-green)" /> Thông báo
              {unreadCount > 0 && (
                <span style={{ fontSize: '10px', background: 'var(--accent-orange)', color: 'white', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
                  {unreadCount} mới
                </span>
              )}
            </h3>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-green)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Đã đọc tất cả
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '3px',
        gap: '2px'
      }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            flex: 1,
            padding: '6px',
            borderRadius: '9px',
            border: 'none',
            background: filter === 'all' ? 'var(--accent-green)' : 'transparent',
            color: filter === 'all' ? 'var(--bg-dark)' : 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilter('friend_request')}
          style={{
            flex: 1.2,
            padding: '6px',
            borderRadius: '9px',
            border: 'none',
            background: filter === 'friend_request' ? 'var(--accent-green)' : 'transparent',
            color: filter === 'friend_request' ? 'var(--bg-dark)' : 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Lời mời kết bạn
        </button>
        <button
          onClick={() => setFilter('system')}
          style={{
            flex: 1,
            padding: '6px',
            borderRadius: '9px',
            border: 'none',
            background: filter === 'system' ? 'var(--accent-green)' : 'transparent',
            color: filter === 'system' ? 'var(--bg-dark)' : 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Hệ thống
        </button>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notif => {
            const isFriendReq = notif.type === 'friend_request';

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className="glass-card"
                style={{
                  padding: '12px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  background: notif.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(57, 255, 20, 0.04)',
                  borderColor: notif.read ? 'var(--border-color)' : 'rgba(57, 255, 20, 0.25)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {!notif.read && (
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent-green)'
                  }} />
                )}

                {/* Avatar or Icon */}
                {notif.senderAvatar ? (
                  <img
                    src={notif.senderAvatar}
                    alt={notif.senderName || 'User'}
                    style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                  />
                ) : (
                  getNotifIcon(notif)
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: notif.read ? 600 : 700, lineHeight: '1.3', color: 'white' }}>
                    {notif.message || notif.title}
                  </div>
                  
                  {notif.body && (
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.3' }}>
                      {notif.body}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={10} /> {notif.time || 'Vừa xong'}
                    </span>

                    {isFriendReq && notif.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            if (onAcceptRequest) onAcceptRequest({ name: notif.senderName });
                          }}
                          style={{
                            background: 'var(--accent-green)',
                            border: 'none',
                            color: 'var(--bg-dark)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Check size={11} /> Đồng ý
                        </button>
                        <button
                          onClick={() => {
                            if (onRejectRequest) onRejectRequest({ name: notif.senderName });
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-secondary)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '10.5px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Từ chối
                        </button>
                      </div>
                    )}

                    {isFriendReq && notif.status === 'accepted' && (
                      <span style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 700 }}>
                        ✓ Đã là bạn bè
                      </span>
                    )}

                    {isFriendReq && notif.status === 'rejected' && (
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                        Đã từ chối
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px' }}>
            <Bell size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p style={{ fontSize: '12.5px' }}>Không có thông báo nào trong mục này.</p>
          </div>
        )}
      </div>

      {/* Quick link to Friend Requests page */}
      <button
        onClick={() => {
          onClose();
          if (onOpenFriendRequests) onOpenFriendRequests();
        }}
        className="glass-card"
        style={{
          padding: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderColor: 'rgba(57, 255, 20, 0.2)',
          background: 'rgba(57, 255, 20, 0.05)',
          cursor: 'pointer',
          marginTop: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={16} color="var(--accent-green)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)' }}>
            Quản lý tất cả yêu cầu kết bạn
          </span>
        </div>
        <ChevronRight size={16} color="var(--accent-green)" />
      </button>
    </div>
  );
}
