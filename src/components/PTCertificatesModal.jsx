import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Award, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Upload, 
  Eye, 
  X, 
  Check, 
  FileText, 
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const DEFAULT_SAMPLE_CERTS = {
  'Mai Xuân Tú': [
    {
      id: 'cert_1',
      name: 'Chứng chỉ Huấn Luyện Viên Quốc Tế (NASM - CPT)',
      organization: 'National Academy of Sports Medicine (NASM)',
      issueDate: '15/06/2023',
      code: 'NASM-CPT-892301',
      type: 'Chứng chỉ quốc tế',
      image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=1000&auto=format&fit=crop&q=80'
    },
    {
      id: 'cert_2',
      name: 'Chứng chỉ Calisthenics Master Trainer Level 3',
      organization: 'World Street Workout & Calisthenics Federation (WSWCF)',
      issueDate: '10/01/2024',
      code: 'WSWCF-VN-2024-04',
      type: 'Chứng nhận chuyên môn',
      image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1000&auto=format&fit=crop&q=80'
    }
  ],
  'Nguyễn Minh Khang': [
    {
      id: 'cert_1',
      name: 'Chứng chỉ HLV Thể hình & Powerlifting Quốc Gia Level 2',
      organization: 'Liên đoàn Thể hình & Cử tạ Việt Nam (VBFF)',
      issueDate: '20/08/2023',
      code: 'VBFF-PT-45129',
      type: 'Chứng chỉ quốc gia',
      image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=1000&auto=format&fit=crop&q=80'
    }
  ],
  'Phạm Tấn': [
    {
      id: 'cert_1',
      name: 'Chứng nhận HLV Thể hình Cơ bản & Chỉnh Form',
      organization: 'FitMate Academy & International Sports Science',
      issueDate: '05/03/2024',
      code: 'FMA-2024-118',
      type: 'Chứng chỉ chuyên môn',
      image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1000&auto=format&fit=crop&q=80'
    }
  ]
};

export default function PTCertificatesModal({
  profile,
  isSelf,
  onClose,
  onUpdateVerification,
  showToast
}) {
  const cleanProfileName = (profile?.name || '').replace(/\s*\(Bạn\)/g, '').trim();
  
  // Resolve initial certificates
  const initialCerts = profile?.certificates && profile.certificates.length > 0
    ? profile.certificates
    : (DEFAULT_SAMPLE_CERTS[cleanProfileName] || [
        {
          id: 'cert_default',
          name: 'Chứng chỉ Huấn Luyện Viên Fitness & Thể Hình Chuẩn Quốc Gia',
          organization: 'FitMate Professional Trainer Accreditation',
          issueDate: '12/04/2024',
          code: `FM-VERIFIED-${Math.floor(10000 + Math.random() * 90000)}`,
          type: 'Chứng chỉ chuyên môn',
          image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=1000&auto=format&fit=crop&q=80'
        }
      ]);

  const [certificates, setCertificates] = useState(initialCerts);
  
  // Status: 'verified' | 'pending' | 'unverified'
  const currentStatus = profile?.certificateStatus || (profile?.isVerified ? 'verified' : 'unverified');
  const [status, setStatus] = useState(currentStatus);
  const [previewImage, setPreviewImage] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newCertOrg, setNewCertOrg] = useState('');
  const [newCertCode, setNewCertCode] = useState('');
  const [newCertImage, setNewCertImage] = useState('https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1000&auto=format&fit=crop&q=80');

  // Handle send verification request
  const handleRequestVerification = () => {
    setStatus('pending');
    if (onUpdateVerification) {
      onUpdateVerification({
        certificateStatus: 'pending',
        isVerified: false,
        certificates: certificates
      });
    }
    if (showToast) {
      showToast('Đã gửi hồ sơ chứng chỉ lên Ban Quản Trị để kiểm định! ⏳', 'success');
    }
  };

  // Handle admin approval (simulation for testing)
  const handleAdminApprove = () => {
    setStatus('verified');
    if (onUpdateVerification) {
      onUpdateVerification({
        certificateStatus: 'verified',
        isVerified: true,
        certificates: certificates
      });
    }
    if (showToast) {
      showToast('Chúc mừng! Hồ sơ đã được kiểm định & cấp Tích Xanh! 🎉', 'success');
    }
  };

  // Handle admin reset / revoke
  const handleAdminReset = (newSt = 'unverified') => {
    setStatus(newSt);
    if (onUpdateVerification) {
      onUpdateVerification({
        certificateStatus: newSt,
        isVerified: newSt === 'verified',
        certificates: certificates
      });
    }
    if (showToast) {
      showToast(newSt === 'unverified' ? 'Đã thu hồi trạng thái kiểm định.' : 'Đã chuyển về trạng thái chờ duyệt.', 'orange');
    }
  };

  // Handle adding a new certificate
  const handleAddNewCert = (e) => {
    e.preventDefault();
    if (!newCertName.trim()) {
      if (showToast) showToast('Vui lòng nhập tên chứng chỉ!', 'orange');
      return;
    }

    const newCert = {
      id: `cert_${Date.now()}`,
      name: newCertName.trim(),
      organization: newCertOrg.trim() || 'Tổ chức đào tạo Thể hình & Fitness',
      issueDate: new Date().toLocaleDateString('vi-VN'),
      code: newCertCode.trim() || `CERT-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Chứng chỉ chuyên môn',
      image: newCertImage
    };

    const updated = [newCert, ...certificates];
    setCertificates(updated);
    setShowAddForm(false);
    setNewCertName('');
    setNewCertOrg('');
    setNewCertCode('');

    if (onUpdateVerification) {
      onUpdateVerification({
        certificates: updated
      });
    }

    if (showToast) {
      showToast('Đã thêm chứng chỉ mới vào hồ sơ! 📜', 'success');
    }
  };

  // Handle file upload simulation
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewCertImage(reader.result);
        if (showToast) showToast('Đã tải ảnh chứng chỉ lên thành công!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(12, 15, 18, 0.98)',
      backdropFilter: 'blur(16px)',
      zIndex: 2500,
      borderRadius: '30px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Scrollable Content Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={18} color="#2f80ed" /> Bằng cấp & Chứng chỉ
            </h3>
            <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
              HLV {cleanProfileName}
            </p>
          </div>
        </div>

        {/* Verification Pill */}
        {status === 'verified' && (
          <span style={{
            fontSize: '10px',
            background: 'rgba(47, 128, 237, 0.15)',
            color: '#2f80ed',
            border: '1px solid rgba(47, 128, 237, 0.4)',
            padding: '3px 8px',
            borderRadius: '12px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Check size={11} strokeWidth={3} /> Đã kiểm định
          </span>
        )}
        {status === 'pending' && (
          <span style={{
            fontSize: '10px',
            background: 'rgba(255, 179, 0, 0.15)',
            color: '#ffb300',
            border: '1px solid rgba(255, 179, 0, 0.4)',
            padding: '3px 8px',
            borderRadius: '12px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Clock size={11} /> Đang kiểm định
          </span>
        )}
        {status === 'unverified' && (
          <span style={{
            fontSize: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            padding: '3px 8px',
            borderRadius: '12px',
            fontWeight: 700
          }}>
            Chưa kiểm định
          </span>
        )}
      </div>


      {status === 'pending' && (
        <div style={{
          background: 'rgba(255, 179, 0, 0.1)',
          border: '1px solid rgba(255, 179, 0, 0.3)',
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(255, 179, 0, 0.2)',
            color: '#ffb300',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Clock size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#ffb300' }}>
              Hồ sơ đang trong quá trình kiểm định
            </h4>
            <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.3' }}>
              Yêu cầu của bạn đã được gửi tới Ban Quản Trị web page. Tích xanh sẽ tự động kích hoạt ngay sau khi được duyệt.
            </p>
          </div>
        </div>
      )}

      {status === 'unverified' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldAlert size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: 'white' }}>
              Chưa gửi kiểm định chứng chỉ
            </h4>
            <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.3' }}>
              Hãy gửi hình ảnh chứng chỉ để ban quản trị duyệt và cấp Tích Xanh uy tín cho hồ sơ của bạn.
            </p>
          </div>
        </div>
      )}

      {/* PT Owner Action Buttons */}
      {isSelf && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {status === 'unverified' && (
            <button
              onClick={handleRequestVerification}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle size={15} /> Bấm để gửi kiểm định lên Admin
            </button>
          )}

          {status === 'pending' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(255, 179, 0, 0.15)',
                  border: '1px solid rgba(255, 179, 0, 0.4)',
                  color: '#ffb300',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'not-allowed'
                }}
              >
                <Clock size={14} /> Đang chờ duyệt từ Admin Web
              </button>
            </div>
          )}

          {/* Admin Demo Simulation Controls */}
          <div style={{
            background: 'rgba(57, 255, 20, 0.04)',
            border: '1px dashed rgba(57, 255, 20, 0.25)',
            borderRadius: '12px',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={11} /> Bảng điều khiển mô phỏng Admin (Dành cho Dev / Test flow)
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {status !== 'verified' ? (
                <button
                  type="button"
                  onClick={handleAdminApprove}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: '8px',
                    background: 'rgba(47, 128, 237, 0.2)',
                    border: '1px solid #2f80ed',
                    color: '#2f80ed',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Check size={12} strokeWidth={3} /> Admin Duyệt & Cấp Tích Xanh
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAdminReset('unverified')}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: '8px',
                    background: 'rgba(255, 87, 34, 0.15)',
                    border: '1px solid rgba(255, 87, 34, 0.4)',
                    color: 'var(--accent-orange)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={11} /> Thu hồi Tích Xanh (Test lại)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List of Certificates */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FileText size={13} color="var(--accent-green)" /> Danh sách bằng cấp & chứng chỉ ({certificates.length})
          </span>

          {isSelf && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--accent-green)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Upload size={11} /> {showAddForm ? 'Đóng form' : '+ Tải thêm bằng cấp'}
            </button>
          )}
        </div>

        {/* Add Certificate Form */}
        {showAddForm && (
          <form onSubmit={handleAddNewCert} className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', borderColor: 'rgba(57, 255, 20, 0.3)' }}>
            <h5 style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--accent-green)' }}>Thêm chứng chỉ mới</h5>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Tên chứng chỉ / Bằng cấp:</label>
              <input
                type="text"
                placeholder="Ví dụ: Chứng chỉ Huấn Luyện Viên Quốc Tế ACE..."
                value={newCertName}
                onChange={(e) => setNewCertName(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: 'white',
                  fontSize: '11.5px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Tổ chức cấp bằng:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: American Council on Exercise"
                  value={newCertOrg}
                  onChange={(e) => setNewCertOrg(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    color: 'white',
                    fontSize: '11.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Mã số chứng chỉ:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: ACE-8912"
                  value={newCertCode}
                  onChange={(e) => setNewCertCode(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    color: 'white',
                    fontSize: '11.5px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Tải file ảnh chứng chỉ từ máy:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '6px', fontSize: '11px' }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 2, padding: '6px', fontSize: '11px' }}
              >
                Lưu vào hồ sơ
              </button>
            </div>
          </form>
        )}

        {/* Certificate Cards */}
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="glass-card"
            style={{
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderColor: status === 'verified' ? 'rgba(47, 128, 237, 0.3)' : 'var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{
                  fontSize: '9px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--accent-green)',
                  border: '1px solid rgba(57, 255, 20, 0.2)',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  fontWeight: 700
                }}>
                  {cert.type || 'Chứng chỉ chuyên môn'}
                </span>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'white', marginTop: '4px' }}>
                  {cert.name}
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Đơn vị cấp: <strong style={{ color: 'white' }}>{cert.organization}</strong>
                </p>
              </div>

              {status === 'verified' && (
                <div style={{
                  background: 'rgba(47, 128, 237, 0.15)',
                  color: '#2f80ed',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }} title="Đã đối chiếu xác thực">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)' }}>
              <span>Ngày cấp: <strong style={{ color: 'white' }}>{cert.issueDate}</strong></span>
              <span>Mã chứng chỉ: <strong style={{ color: 'var(--accent-green)' }}>{cert.code}</strong></span>
            </div>

            {/* Certificate Image Preview Container */}
            <div 
              style={{
                position: 'relative',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                background: '#000',
                height: '140px'
              }}
              onClick={() => setPreviewImage(cert.image)}
            >
              <img
                src={cert.image}
                alt={cert.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.9,
                  transition: 'transform 0.3s ease'
                }}
              />

              {/* Watermark badge */}
              {status === 'verified' && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(47, 128, 237, 0.9)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '9px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backdropFilter: 'blur(4px)'
                }}>
                  <Check size={10} strokeWidth={3} /> FITMATE VERIFIED
                </div>
              )}

              {/* Hover overlay hint */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '6px 10px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '10px', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={12} color="var(--accent-green)" /> Bấm để xem ảnh chứng chỉ gốc
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* End List of Certificates */}
      </div>
      {/* End Scrollable Content Container */}

      {/* Fullscreen Certificate Viewer Screen */}
      {previewImage && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: '#090c10',
            zIndex: 99999,
            borderRadius: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px 16px 24px 16px',
            boxSizing: 'border-box'
          }}
          onClick={() => setPreviewImage(null)}
        >
          {/* Top Navigation Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={16} />
              </button>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>
                Ảnh Chứng Chỉ Gốc
              </span>
            </div>
          </div>

          {/* Certificate Image Canvas */}
          <div 
            style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '16px 0',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Bằng cấp chứng chỉ"
              style={{
                maxWidth: '100%',
                maxHeight: '440px',
                width: 'auto',
                height: 'auto',
                borderRadius: '14px',
                border: '1.5px solid rgba(47, 128, 237, 0.4)',
                objectFit: 'contain',
                boxShadow: '0 24px 60px rgba(0,0,0,0.95)',
                background: '#000'
              }}
            />
          </div>

          {/* Bottom Info Footer */}
          <div style={{ textAlign: 'center', width: '100%', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <p style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>
              Hồ sơ chứng chỉ xác thực của HLV {cleanProfileName}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '10.5px', marginTop: '3px' }}>
              Chạm vào bất kỳ đâu hoặc bấm nút Quay lại để đóng
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
