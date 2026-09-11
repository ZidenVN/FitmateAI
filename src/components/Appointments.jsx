import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Check, X, Trash2, AlertCircle, Sparkles, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Appointments({ appointments, setAppointments, onClose, setScreen, myProfile }) {
  // Initialize to June 2026 (Month 5 because 0-indexed)
  const [currentMonth, setCurrentMonth] = useState(5);
  const [currentYear, setCurrentYear] = useState(2026);
  const [activeModalDate, setActiveModalDate] = useState(null); // 'YYYY-MM-DD' when modal is opened

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  
  const monthNamesEnglish = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthName = `${monthNames[currentMonth]}, ${currentYear}`;
  const monthEnglish = `${monthNamesEnglish[currentMonth]} ${currentYear}`;

  // Helper to calculate days in currently viewed month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper to calculate the start day offset (Monday starting)
  const getStartingOffset = (year, month) => {
    const day = new Date(year, month, 1).getDay(); // Sun = 0, Mon = 1, ...
    return day === 0 ? 6 : day - 1;
  };

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const startingOffset = getStartingOffset(currentYear, currentMonth);

  const formatDateStr = (year, month, day) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Filter list of appointments to show either the selected day or all appointments of the active month
  const activeMonthAppointments = (appointments || []).filter(app => {
    if (!app.date) return false;
    const [appY, appM] = app.date.split('-');
    const matchesDate = parseInt(appY) === currentYear && parseInt(appM) === (currentMonth + 1);
    if (!matchesDate) return false;

    // If logged in as PT, only show requests made to this PT
    if (myProfile?.isPt) {
      const cleanPtName = (myProfile.name || '').replace('(Bạn)', '').trim().toLowerCase();
      const cleanApptPtName = (app.ptName || '').replace('(Bạn)', '').trim().toLowerCase();
      return cleanPtName === cleanApptPtName;
    }
    return true;
  });

  // Helper to check if a day in the currently viewed month has appointments
  const getAppointmentsForDay = (dayNum) => {
    const dateStr = formatDateStr(currentYear, currentMonth, dayNum);
    return activeMonthAppointments.filter(app => app.date === dateStr);
  };

  const handleDayClick = (dayNum) => {
    const dateStr = formatDateStr(currentYear, currentMonth, dayNum);
    setActiveModalDate(dateStr);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // PT Actions Simulation
  const updateStatus = (id, newStatus) => {
    if (setAppointments && appointments) {
      setAppointments(
        appointments.map(app => (app.id === id ? { ...app, status: newStatus } : app))
      );
    }
  };

  const deleteAppointment = (id) => {
    if (setAppointments && appointments) {
      setAppointments(appointments.filter(app => app.id !== id));
    }
  };

  // Status Badge Colors & Info
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Từ chối':
        return {
          bg: 'rgba(255, 87, 34, 0.1)',
          color: 'var(--accent-orange)',
          border: '1px solid rgba(255, 87, 34, 0.2)',
          dot: 'var(--accent-orange)'
        };
      case 'Đợi xác nhận':
        return {
          bg: 'rgba(255, 87, 34, 0.15)',
          color: 'var(--accent-orange)',
          border: '1px solid rgba(255, 87, 34, 0.3)',
          dot: 'var(--accent-orange)'
        };
      case 'Đã hẹn':
        return {
          bg: 'rgba(57, 255, 20, 0.12)',
          color: 'var(--accent-green)',
          border: '1px solid rgba(57, 255, 20, 0.3)',
          dot: 'var(--accent-green)'
        };
      case 'Đã xong':
        return {
          bg: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)',
          dot: 'var(--text-secondary)'
        };
      case 'Trễ hẹn':
        return {
          bg: 'rgba(255, 61, 0, 0.15)',
          color: '#ff3d00',
          border: '1px solid rgba(255, 61, 0, 0.3)',
          dot: '#ff3d00'
        };
      default:
        return {
          bg: 'rgba(255,255,255,0.05)',
          color: 'white',
          border: '1px solid var(--border-color)',
          dot: 'white'
        };
    }
  };

  // Appointments for the currently opened modal date
  const modalAppointments = activeModalDate 
    ? activeMonthAppointments.filter(app => app.date === activeModalDate)
    : [];

  // Calendar dates generation
  const daysArray = [];
  for (let i = 0; i < startingOffset; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    daysArray.push(i);
  }

  // Count total appointments in currently viewed month
  const monthAppointmentsCount = activeMonthAppointments.length;

  return (
    <div className="screen-content animate-slide-up" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflowY: activeModalDate ? 'hidden' : 'auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(18, 24, 30, 0.5)',
        backdropFilter: 'var(--glass-blur)',
        flexShrink: 0
      }}>
        <button 
          onClick={onClose}
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
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Lịch hẹn PT</h3>
          <p className="subtitle" style={{ fontSize: '10px' }}>Theo dõi & Quản lý các buổi hẹn tập</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px 80px', display: 'flex', flexDirection: 'column', gap: '16px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {/* Month Selector header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button 
              onClick={handlePrevMonth}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: 800, 
              fontFamily: 'var(--font-title)', 
              letterSpacing: '0.5px',
              minWidth: '110px',
              textAlign: 'center'
            }}>
              {monthName}
            </span>
            <button 
              onClick={handleNextMonth}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '6px', color: 'var(--text-secondary)' }}>
            {monthEnglish}
          </span>
        </div>

        {/* Calendar Card */}
        <div className="glass-card" style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
            <span style={{ color: 'rgba(255, 87, 34, 0.8)' }}>CN</span>
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px 4px', textAlign: 'center' }}>
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} style={{ height: '42px' }} />;
              }

              const dayAppts = getAppointmentsForDay(day);
              const hasAppts = dayAppts.length > 0;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => handleDayClick(day)}
                  style={{
                    height: '42px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    background: hasAppts ? 'rgba(57, 255, 20, 0.06)' : 'rgba(255,255,255,0.02)',
                    border: hasAppts 
                      ? '1px solid rgba(57, 255, 20, 0.35)' 
                      : '1px solid transparent',
                    borderRadius: '10px',
                    color: hasAppts ? 'white' : 'var(--text-primary)',
                    fontWeight: hasAppts ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ marginTop: hasAppts ? '-4px' : '0' }}>{day}</span>
                  
                  {/* Status Dots */}
                  {hasAppts && (
                    <div style={{ 
                      display: 'flex', 
                      gap: '3px', 
                      position: 'absolute', 
                      bottom: '5px' 
                    }}>
                      {dayAppts.slice(0, 3).map((appt) => {
                        const style = getStatusStyle(appt.status);
                        return (
                          <span 
                            key={appt.id} 
                            style={{ 
                              width: '5px', 
                              height: '5px', 
                              borderRadius: '50%', 
                              background: style.dot,
                              boxShadow: `0 0 4px ${style.dot}`
                            }} 
                          />
                        );
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calendar Legend & Tips */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Chú thích trạng thái:</span>
            <span style={{ fontSize: '10.5px', color: 'var(--accent-green)', fontWeight: 600 }}>{monthAppointmentsCount} cuộc hẹn tháng này</span>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)' }} />
              <span>Đã hẹn</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-orange)' }} />
              <span>Đợi xác nhận</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)' }} />
              <span>Đã xong / Khác</span>
            </div>
          </div>
        </div>

        {/* Quick Action / Guide */}
        <div className="glass-card" style={{ 
          background: 'rgba(57, 255, 20, 0.02)', 
          borderColor: 'rgba(57, 255, 20, 0.15)',
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Sparkles size={18} color="var(--accent-green)" style={{ flexShrink: 0 }} />
            <div>
              <h5 style={{ fontSize: '12px', fontWeight: 700 }}>Đặt thêm lịch tập mới</h5>
              <p className="subtitle" style={{ fontSize: '10px', marginTop: '2px' }}>
                Chọn HLV chuyên nghiệp tại Chợ PT
              </p>
            </div>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => setScreen('marketplace')}
            style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '8px', background: 'var(--accent-green)', color: 'var(--bg-dark)', fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            Chợ PT
          </button>
        </div>

      </div>

      {/* Day Appointments Modal / Overlay */}
      {activeModalDate && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(12, 15, 18, 0.98)',
          zIndex: 3000,
          borderRadius: '30px',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {/* Modal Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} /> Lịch hẹn ngày {activeModalDate.split('-').reverse().join('/')}
              </h4>
              <p className="subtitle" style={{ fontSize: '10.5px', marginTop: '2px' }}>
                {modalAppointments.length > 0 ? `${modalAppointments.length} cuộc hẹn trong ngày` : 'Không có lịch hẹn'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModalDate(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                color: 'var(--text-secondary)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal List of Appointments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {modalAppointments.length > 0 ? (
              modalAppointments.map((appt) => {
                const statusStyle = getStatusStyle(appt.status);
                const isPT = myProfile?.isPt;
                const titleText = isPT 
                  ? `Học viên: ${appt.userName || 'Hùng'}` 
                  : `HLV ${appt.ptName}`;
                const avatarUrl = isPT 
                  ? (appt.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60')
                  : (appt.ptName === 'Mai Xuân Tú' 
                      ? 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=60'
                      : (appt.ptName === 'Nguyễn Minh Khang'
                          ? 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=60'
                          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60'));

                return (
                  <div 
                    key={appt.id} 
                    className="glass-card" 
                    style={{ 
                      padding: '14px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px',
                      borderColor: appt.status === 'Đợi xác nhận' ? 'rgba(255, 87, 34, 0.3)' : 'var(--border-color)'
                    }}
                  >
                    {/* Top card metadata */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <img 
                        src={avatarUrl} 
                        alt={titleText} 
                        style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 700 }}>{titleText}</span>
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            border: statusStyle.border
                          }}>
                            {appt.status}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} />
                            {appt.date.split('-').reverse().join('/')}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            {appt.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Container */}
                    <div style={{ 
                      marginTop: '2px', 
                      background: 'rgba(0,0,0,0.15)', 
                      padding: '10px', 
                      borderRadius: '10px', 
                      border: '1px solid rgba(255,255,255,0.03)' 
                    }}>
                      {isPT ? (
                        // PT Role Action Controls
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '9.5px', color: 'var(--text-secondary)', fontWeight: 700 }}>
                            <CheckCircle2 size={11} color="var(--accent-green)" />
                            <span>HÀNH ĐỘNG CỦA BẠN (HLV)</span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {appt.status === 'Đợi xác nhận' && (
                              <>
                                <button
                                  onClick={() => updateStatus(appt.id, 'Đã hẹn')}
                                  style={{
                                    flex: 1.5,
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: 'rgba(57, 255, 20, 0.1)',
                                    border: '1px solid rgba(57, 255, 20, 0.3)',
                                    color: 'var(--accent-green)',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <Check size={11} /> Xác nhận hẹn
                                </button>
                                <button
                                  onClick={() => updateStatus(appt.id, 'Từ chối')}
                                  style={{
                                    flex: 1,
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    background: 'rgba(255, 87, 34, 0.1)',
                                    border: '1px solid rgba(255, 87, 34, 0.3)',
                                    color: 'var(--accent-orange)',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <X size={11} /> Từ chối
                                </button>
                              </>
                            )}

                            {appt.status === 'Đã hẹn' && (
                              <>
                                <button
                                  onClick={() => updateStatus(appt.id, 'Đã xong')}
                                  style={{
                                    flex: 1,
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: 'rgba(57, 255, 20, 0.1)',
                                    border: '1px solid rgba(57, 255, 20, 0.3)',
                                    color: 'var(--accent-green)',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <CheckCircle2 size={11} /> Đã hoàn thành
                                </button>
                                <button
                                  onClick={() => updateStatus(appt.id, 'Trễ hẹn')}
                                  style={{
                                    flex: 1,
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: 'rgba(255, 61, 0, 0.1)',
                                    border: '1px solid rgba(255, 61, 0, 0.3)',
                                    color: '#ff3d00',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <AlertCircle size={11} /> Trễ / Vắng mặt
                                </button>
                              </>
                            )}

                            {(appt.status === 'Đã xong' || appt.status === 'Trễ hẹn' || appt.status === 'Từ chối') && (
                              <button
                                onClick={() => deleteAppointment(appt.id)}
                                style={{
                                  flex: 1,
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  background: 'rgba(255, 255, 255, 0.03)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-secondary)',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Trash2 size={11} /> Xóa lịch sử cuộc hẹn
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        // User Role Action Controls
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '9.5px', color: 'var(--text-secondary)', fontWeight: 700 }}>
                            <User size={11} color="var(--accent-green)" />
                            <span>HÀNH ĐỘNG CỦA BẠN (HỘI VIÊN)</span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {appt.status === 'Đợi xác nhận' && (
                              <button
                                onClick={() => deleteAppointment(appt.id)}
                                style={{
                                  flex: 1,
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  background: 'rgba(255, 87, 34, 0.08)',
                                  border: '1px solid rgba(255, 87, 34, 0.2)',
                                  color: 'var(--accent-orange)',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px'
                                }}
                              >
                                <X size={11} /> Hủy yêu cầu đặt lịch
                              </button>
                            )}

                            {appt.status === 'Đã hẹn' && (
                              <button
                                onClick={() => deleteAppointment(appt.id)}
                                style={{
                                  flex: 1,
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  background: 'rgba(255, 87, 34, 0.08)',
                                  border: '1px solid rgba(255, 87, 34, 0.2)',
                                  color: 'var(--accent-orange)',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px'
                                }}
                              >
                                <X size={11} /> Hủy lịch tập này
                              </button>
                            )}

                            {(appt.status === 'Đã xong' || appt.status === 'Trễ hẹn' || appt.status === 'Từ chối') && (
                              <button
                                onClick={() => deleteAppointment(appt.id)}
                                style={{
                                  flex: 1,
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  background: 'rgba(255, 255, 255, 0.03)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-secondary)',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Trash2 size={11} /> Xóa lịch sử cuộc hẹn
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="glass-card" style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px' }}>
                <Calendar size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p style={{ fontSize: '12.5px' }}>Không có cuộc hẹn nào trong ngày này.</p>
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    setActiveModalDate(null);
                    setScreen('marketplace');
                  }}
                  style={{ marginTop: '12px', fontSize: '11px', padding: '6px 12px' }}
                >
                  Đặt lịch với PT ngay
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
