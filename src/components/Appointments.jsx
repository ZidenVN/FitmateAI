import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Check, X, Trash2, AlertCircle, Sparkles, CheckCircle2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Appointments({ appointments, setAppointments, onClose, setScreen, myProfile }) {
  // Initialize to June 2026 (Month 5 because 0-indexed)
  const [currentMonth, setCurrentMonth] = useState(5);
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState('2026-06-18');
  const [viewAll, setViewAll] = useState(true);

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

  // Helper to check if a day in the currently viewed month has appointments
  const getAppointmentsForDay = (dayNum) => {
    const dateStr = formatDateStr(currentYear, currentMonth, dayNum);
    return appointments.filter(app => app.date === dateStr);
  };

  const handleDayClick = (dayNum) => {
    setSelectedDate(formatDateStr(currentYear, currentMonth, dayNum));
    setViewAll(false);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setViewAll(true);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setViewAll(true);
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

  // Filter list of appointments to show either the selected day or all appointments of the active month
  const activeMonthAppointments = appointments.filter(app => {
    const [appY, appM] = app.date.split('-');
    const matchesDate = parseInt(appY) === currentYear && parseInt(appM) === (currentMonth + 1);
    if (!matchesDate) return false;

    // If logged in as PT, only show requests made to this PT
    if (myProfile?.isPt) {
      const cleanPtName = myProfile.name.replace('(Bạn)', '').trim().toLowerCase();
      const cleanApptPtName = app.ptName.replace('(Bạn)', '').trim().toLowerCase();
      return cleanPtName === cleanApptPtName;
    }
    return true;
  });

  const filteredAppointments = viewAll 
    ? activeMonthAppointments
    : activeMonthAppointments.filter(app => app.date === selectedDate);

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
    <div className="screen-content animate-slide-up" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
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

      {/* Main Scroll Area */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px 80px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
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
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
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
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '6px', color: 'var(--text-secondary)' }}>
            {monthEnglish}
          </span>
        </div>

        {/* Calendar Card */}
        <div className="glass-card" style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px 4px', textAlign: 'center' }}>
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} style={{ height: '36px' }} />;
              }

              const dayStr = day.toString().padStart(2, '0');
              const dateStr = formatDateStr(currentYear, currentMonth, day);
              const isSelected = selectedDate === dateStr && !viewAll;
              
              const dayAppts = getAppointmentsForDay(day);
              const hasAppts = dayAppts.length > 0;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => handleDayClick(day)}
                  style={{
                    height: '38px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    background: isSelected ? 'var(--accent-green)' : 'rgba(255,255,255,0.02)',
                    border: isSelected 
                      ? '1px solid var(--accent-green)' 
                      : hasAppts 
                        ? '1px dashed rgba(255,255,255,0.2)' 
                        : '1px solid transparent',
                    borderRadius: '10px',
                    color: isSelected ? 'var(--bg-dark)' : 'var(--text-primary)',
                    fontWeight: isSelected || hasAppts ? 700 : 500,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{day}</span>
                  
                  {/* Status Dots */}
                  {hasAppts && (
                    <div style={{ 
                      display: 'flex', 
                      gap: '2px', 
                      position: 'absolute', 
                      bottom: '4px' 
                    }}>
                      {dayAppts.slice(0, 3).map((appt) => {
                        const style = getStatusStyle(appt.status);
                        return (
                          <span 
                            key={appt.id} 
                            style={{ 
                              width: '4px', 
                              height: '4px', 
                              borderRadius: '50%', 
                              background: isSelected ? 'var(--bg-dark)' : style.dot 
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

        {/* View Options Toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewAll(true)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid',
              background: viewAll ? 'rgba(57, 255, 20, 0.08)' : 'rgba(255,255,255,0.02)',
              borderColor: viewAll ? 'var(--accent-green)' : 'var(--border-color)',
              color: viewAll ? 'var(--accent-green)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            Tháng này ({monthAppointmentsCount})
          </button>
          <button
            onClick={() => setViewAll(false)}
            style={{
              flex: 1.2,
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid',
              background: !viewAll ? 'rgba(57, 255, 20, 0.08)' : 'rgba(255,255,255,0.02)',
              borderColor: !viewAll ? 'var(--accent-green)' : 'var(--border-color)',
              color: !viewAll ? 'var(--accent-green)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            Ngày {selectedDate.split('-')[2] || ''} ({getAppointmentsForDay(parseInt(selectedDate.split('-')[2] || '0')).length})
          </button>
        </div>

        {/* Appointment Cards Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700 }}>
              {viewAll ? `Lịch hẹn tháng ${currentMonth + 1}/${currentYear}` : `Hẹn ngày ${selectedDate.split('-').reverse().join('/')}`}
            </h4>
            {viewAll && monthAppointmentsCount > 0 && (
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                Nhấn ngày trên lịch để lọc nhanh
              </span>
            )}
          </div>

          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => {
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
                    borderColor: appt.status === 'Đợi xác nhận' ? 'rgba(255, 87, 34, 0.15)' : 'var(--border-color)'
                  }}
                >
                  {/* Top card metadata */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img 
                      src={avatarUrl} 
                      alt={titleText} 
                      style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700 }}>{titleText}</span>
                        <span style={{
                          fontSize: '9px',
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
            <div className="glass-card" style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Calendar size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontSize: '12.5px' }}>Không có cuộc hẹn nào trong tháng này.</p>
              <button 
                className="btn-secondary" 
                onClick={() => setScreen('marketplace')}
                style={{ marginTop: '12px', fontSize: '11px', padding: '6px 12px' }}
              >
                Đặt lịch với PT ngay
              </button>
            </div>
          )}
        </div>

        {/* Demo Guide Box */}
        <div className="glass-card" style={{ 
          background: 'rgba(57, 255, 20, 0.02)', 
          borderColor: 'rgba(57, 255, 20, 0.1)',
          display: 'flex', 
          gap: '8px' 
        }}>
          <Sparkles size={16} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h5 style={{ fontSize: '11.5px', fontWeight: 700 }}>Hướng dẫn thử nghiệm</h5>
            <p className="subtitle" style={{ fontSize: '9.5px', marginTop: '2px', lineHeight: '1.3' }}>
              Bạn có thể đặt lịch hẹn tập mới bằng cách vào **Chợ PT** hoặc **Trang cá nhân** của HLV và nhấn **Đặt lịch tập miễn phí**.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
