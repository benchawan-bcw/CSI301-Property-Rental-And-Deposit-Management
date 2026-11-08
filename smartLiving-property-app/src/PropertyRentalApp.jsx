import React, { useState } from 'react';
import {
  Building2,
  FileCheck2,
  Scale,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  Clock,
  ShieldCheck,
  User,
  MapPin,
  ArrowRight,
  Sparkles,
  Info,
  XCircle,
  FileText
} from 'lucide-react';
import './PropertyRentalApp.css';

// ==========================================
// MOCK DATA & ENUM DEFINITIONS
// ==========================================

const ROLES = {
  LANDLORD: 'LANDLORD',
  TENANT: 'TENANT',
  ARBITER: 'ARBITER'
};

const STATUS_MAP = {
  CREATED: { label: 'รอผู้เช่ายืนยันสัญญา', badgeClass: 'badge-created' },
  CONFIRMED: { label: 'รอมัดจำเงินประกัน', badgeClass: 'badge-confirmed' },
  ACTIVE: { label: 'สัญญาเช่าปกติ (Active)', badgeClass: 'badge-active' },
  COMPLETED: { label: 'สิ้นสุดสัญญา / คืนเงินแล้ว', badgeClass: 'badge-completed' },
  DISPUTED: { label: 'มีข้อพิพาท (In Dispute)', badgeClass: 'badge-disputed' }
};

const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: 'SmartLiving Condo Sukhumvit 21 (Studio)',
    location: 'สุขุมวิท 21 (อโศก) เขตวัฒนา กรุงเทพฯ',
    rentEth: 0.05,
    depositEth: 0.1,
    isAvailable: false
  },
  {
    id: 2,
    title: 'SmartLiving Apartment Ari Phase 2 (1 Bed)',
    location: 'ซอยพหลโยธิน 7 (อารีย์) เขตพญาไท กรุงเทพฯ',
    rentEth: 0.08,
    depositEth: 0.16,
    isAvailable: true
  },
  {
    id: 3,
    title: 'SmartLiving Park Residence Ladprao',
    location: 'ถนนลาดพร้าว ซอย 15 เขตจตุจักร กรุงเทพฯ',
    rentEth: 0.04,
    depositEth: 0.08,
    isAvailable: true
  }
];

const INITIAL_AGREEMENTS = [
  {
    id: 101,
    propertyId: 1,
    title: 'SmartLiving Condo Sukhumvit 21 (Studio)',
    landlordAddr: '0x1A8b...902A',
    landlordName: 'คุณสมชาย (เจ้าของห้อง)',
    tenantAddr: '0x77F2...110B',
    tenantName: 'คุณวิภา (ผู้เช่า)',
    rentEth: 0.05,
    depositEth: 0.1,
    depositedAmount: 0.1,
    status: 'ACTIVE',
    startDate: '2026-11-01',
    endDate: '2027-10-31',
    history: [
      { period: 'งวดที่ 1 (11/2026)', amount: '0.05 ETH', timestamp: '2026-11-01 10:30 น.', txHash: '0x9fa1...22b1' }
    ]
  },
  {
    id: 102,
    propertyId: 2,
    title: 'SmartLiving Apartment Ari Phase 2 (1 Bed)',
    landlordAddr: '0x1A8b...902A',
    landlordName: 'คุณสมชาย (เจ้าของห้อง)',
    tenantAddr: '0x3cD1...8899',
    tenantName: 'คุณธนกฤต (ผู้เช่า)',
    rentEth: 0.08,
    depositEth: 0.16,
    depositedAmount: 0.16,
    status: 'DISPUTED',
    startDate: '2026-05-01',
    endDate: '2026-10-31',
    history: [
      { period: 'งวดสุดท้าย (10/2026)', amount: '0.08 ETH', timestamp: '2026-10-01 09:15 น.', txHash: '0x33aa...99bc' }
    ]
  }
];

export default function PropertyRentalApp() {
  const [activeTab, setActiveTab] = useState('properties'); // properties | agreements | disputes
  const [currentRole, setCurrentRole] = useState(ROLES.LANDLORD);
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [agreements, setAgreements] = useState(INITIAL_AGREEMENTS);

  // Form Modals / Inputs
  const [isNewPropModalOpen, setIsNewPropModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Helper for adding new property
  const handleCreateProperty = (e) => {
    e.preventDefault();
    const form = e.target;
    const newProp = {
      id: properties.length + 1,
      title: form.title.value,
      location: form.location.value,
      rentEth: parseFloat(form.rentEth.value),
      depositEth: parseFloat(form.depositEth.value),
      isAvailable: true
    };
    setProperties([newProp, ...properties]);
    setIsNewPropModalOpen(false);
    showToast('ลงทะเบียนห้องสำเร็จ!', `เพิ่มทรัพย์สิน "${newProp.title}" เข้าสู่ระบบบล็อกเชนแล้ว`);
  };

  // Helper for creating agreement from property
  const handleCreateAgreement = (prop) => {
    const newAgr = {
      id: agreements.length + 101,
      propertyId: prop.id,
      title: prop.title,
      landlordAddr: '0x1A8b...902A',
      landlordName: 'คุณสมชาย (เจ้าของห้อง)',
      tenantAddr: '0x77F2...110B',
      tenantName: 'คุณวิภา (ผู้เช่า)',
      rentEth: prop.rentEth,
      depositEth: prop.depositEth,
      depositedAmount: 0,
      status: 'CREATED',
      startDate: '2026-11-10',
      endDate: '2027-11-09',
      history: []
    };
    setAgreements([newAgr, ...agreements]);
    // Mark property unavailable
    setProperties(properties.map(p => p.id === prop.id ? { ...p, isAvailable: false } : p));
    setActiveTab('agreements');
    showToast('สร้างสัญญาเช่าสำเร็จ', `สร้างร่างสัญญาสำหรับ ${prop.title} เรียบร้อย รอผู้เช่ายืนยัน`);
  };

  return (
    <div className="app-shell">
      
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="app-header">
        <div className="header-container">
          
          {/* Brand Logo */}
          <div className="brand-box" onClick={() => setActiveTab('properties')}>
            <div className="brand-icon">
              <Building2 size={24} />
            </div>
            <div>
              <div className="brand-title">
                <span>SmartLiving Property</span>
                <span className="network-tag">Sepolia Testnet</span>
              </div>
              <p className="brand-subtitle">ระบบจัดการสัญญาเช่าและเงินประกันบน Blockchain</p>
            </div>
          </div>

          {/* Role Switching Control */}
          <div className="role-switcher-box">
            <span className="role-switcher-label">สิทธิ์การใช้งานปัจจุบัน:</span>
            <div className="role-btn-group">
              <button
                className={`role-btn ${currentRole === ROLES.LANDLORD ? 'active' : ''}`}
                onClick={() => { setCurrentRole(ROLES.LANDLORD); showToast('สลับสิทธิ์', 'ขณะนี้คุณใช้งานในสิทธิ์: เจ้าของห้อง (Landlord)', 'info'); }}
              >
                👨‍💼 เจ้าของห้อง
              </button>
              <button
                className={`role-btn ${currentRole === ROLES.TENANT ? 'active' : ''}`}
                onClick={() => { setCurrentRole(ROLES.TENANT); showToast('สลับสิทธิ์', 'ขณะนี้คุณใช้งานในสิทธิ์: ผู้เช่า (Tenant)', 'info'); }}
              >
                🏠 ผู้เช่า
              </button>
              <button
                className={`role-btn ${currentRole === ROLES.ARBITER ? 'active' : ''}`}
                onClick={() => { setCurrentRole(ROLES.ARBITER); showToast('สลับสิทธิ์', 'ขณะนี้คุณใช้งานในสิทธิ์: ผู้ไกล่เกลี่ย (Arbiter)', 'info'); }}
              >
                ⚖️ ผู้ไกล่เกลี่ย
              </button>
            </div>
          </div>

        </div>

        {/* Tab Links Bar */}
        <div className="tabs-bar">
          <div className="tabs-container">
            <button
              className={`tab-link ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              <Building2 size={16} />
              <span>1. รายการห้องเช่า (Properties)</span>
            </button>
            <button
              className={`tab-link ${activeTab === 'agreements' ? 'active' : ''}`}
              onClick={() => setActiveTab('agreements')}
            >
              <FileCheck2 size={16} />
              <span>2. สัญญาเช่า & เงินประกัน (Escrow)</span>
            </button>
            <button
              className={`tab-link ${activeTab === 'disputes' ? 'active' : ''}`}
              onClick={() => setActiveTab('disputes')}
            >
              <Scale size={16} />
              <span>3. ศูนย์จัดการข้อพิพาท (Disputes)</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= TOAST NOTIFICATION ================= */}
      {toast && (
        <div className={`toast-box toast-${toast.type}`}>
          {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
          <div>
            <h4>{toast.title}</h4>
            <p>{toast.message}</p>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="main-layout">

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PROPERTIES MANAGEMENT                                 */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'properties' && (
          <div className="tab-pane">
            
            {/* Header Action Banner */}
            <div className="banner-card">
              <div>
                <h2>รายการทรัพย์สินและห้องพักให้เช่า</h2>
                <p>เจ้าของห้องลงทะเบียนห้องเช่าพร้อมกำหนดค่าเช่าและเงินประกัน Smart Contract จะควบคุมความปลอดภัยของเงินประกัน 100%</p>
              </div>
              {currentRole === ROLES.LANDLORD && (
                <button className="btn-primary" onClick={() => setIsNewPropModalOpen(true)}>
                  <PlusCircle size={16} />
                  <span>+ ลงทะเบียนห้องเช่าใหม่</span>
                </button>
              )}
            </div>

            {/* Property Cards Grid */}
            <div className="properties-grid">
              {properties.map((prop) => (
                <div key={prop.id} className="property-card">
                  <div className="card-top flex-between">
                    <span className="prop-id-badge">Property ID: #{prop.id}</span>
                    <span className={`status-pill ${prop.isAvailable ? 'pill-available' : 'pill-rented'}`}>
                      {prop.isAvailable ? '● ว่าง (พร้อมปล่อยเช่า)' : '● มีผู้เช่าแล้ว'}
                    </span>
                  </div>

                  <h3 className="prop-title">{prop.title}</h3>
                  <p className="prop-location"><MapPin size={14} /> {prop.location}</p>

                  <div className="prop-financials-box">
                    <div className="fin-item">
                      <span className="fin-label">ค่าเช่ารายเดือน</span>
                      <span className="fin-value">{prop.rentEth} ETH</span>
                    </div>
                    <div className="fin-item">
                      <span className="fin-label">เงินประกัน (Security Deposit)</span>
                      <span className="fin-value highlight">{prop.depositEth} ETH</span>
                    </div>
                  </div>

                  {prop.isAvailable && currentRole === ROLES.LANDLORD && (
                    <button className="btn-secondary block-btn" onClick={() => handleCreateAgreement(prop)}>
                      สร้างร่างสัญญาเช่า (Create Agreement)
                    </button>
                  )}

                  {!prop.isAvailable && (
                    <div className="occupied-note">
                      ห้องนี้อยู่ระหว่างการทำสัญญาเช่าในระบบ
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: AGREEMENTS & SECURITY DEPOSITS                         */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'agreements' && (
          <div className="tab-pane">
            
            <div className="banner-card">
              <div>
                <h2>สัญญาเช่าและการจัดการเงินประกัน Escrow</h2>
                <p>เงินประกันจะถูกล็อกไว้อย่างปลอดภัยใน Smart Contract บน Sepolia Testnet และจะคืนตามยอดที่ผ่านการอนุมัติหลังตรวจสภาพห้อง</p>
              </div>
            </div>

            <div className="agreements-list">
              {agreements.map((agr) => (
                <div key={agr.id} className="agreement-card">
                  
                  {/* Agreement Card Header */}
                  <div className="agreement-header flex-between">
                    <div>
                      <span className="agr-id-tag">Agreement ID: #{agr.id}</span>
                      <h3 className="agr-title">{agr.title}</h3>
                    </div>
                    <span className={`status-badge ${STATUS_MAP[agr.status]?.badgeClass}`}>
                      ● {STATUS_MAP[agr.status]?.label}
                    </span>
                  </div>

                  {/* Contract Details Grid */}
                  <div className="agr-details-grid">
                    <div className="detail-box">
                      <span className="detail-label">เจ้าของห้อง (Landlord)</span>
                      <span className="detail-val">{agr.landlordName}</span>
                      <code className="addr-code">{agr.landlordAddr}</code>
                    </div>

                    <div className="detail-box">
                      <span className="detail-label">ผู้เช่า (Tenant)</span>
                      <span className="detail-val">{agr.tenantName}</span>
                      <code className="addr-code">{agr.tenantAddr}</code>
                    </div>

                    <div className="detail-box">
                      <span className="detail-label">ระยะเวลาสัญญา</span>
                      <span className="detail-val">{agr.startDate} ถึง {agr.endDate}</span>
                    </div>

                    <div className="detail-box highlight-box">
                      <span className="detail-label">เงินประกันล็อกใน Smart Contract</span>
                      <span className="detail-val-large">{agr.depositedAmount} ETH</span>
                    </div>
                  </div>

                  {/* Interactive Workflow Controls */}
                  <div className="agr-actions-panel">
                    <h4 className="panel-title">ดำเนินการตามขั้นตอนสัญญา (Smart Contract Controls)</h4>
                    
                    <div className="actions-flex">
                      
                      {/* Step 3: Confirm Agreement */}
                      {agr.status === 'CREATED' && currentRole === ROLES.TENANT && (
                        <button
                          className="btn-primary"
                          onClick={() => {
                            setAgreements(agreements.map(a => a.id === agr.id ? { ...a, status: 'CONFIRMED' } : a));
                            showToast('ยืนยันสัญญาสำเร็จ', 'ผู้เช่ายืนยันยอมรับเงื่อนไขสัญญาผ่าน Wallet เรียบร้อย');
                          }}
                        >
                          <UserCheck size={16} />
                          <span>3. ยืนยันสัญญาด้วย Wallet (Confirm Agreement)</span>
                        </button>
                      )}

                      {/* Step 4: Deposit Security */}
                      {agr.status === 'CONFIRMED' && currentRole === ROLES.TENANT && (
                        <button
                          className="btn-coral"
                          onClick={() => {
                            setAgreements(agreements.map(a => a.id === agr.id ? { ...a, status: 'ACTIVE', depositedAmount: a.depositEth } : a));
                            showToast('ฝากเงินประกันสำเร็จ', `โอนเงินประกัน ${agr.depositEth} ETH เข้าสู่ Smart Contract เรียบร้อย`);
                          }}
                        >
                          <Wallet size={16} />
                          <span>4. โอนเงินประกัน {agr.depositEth} ETH เข้า Smart Contract (Deposit Security)</span>
                        </button>
                      )}

                      {/* Step 5: Pay Rent */}
                      {agr.status === 'ACTIVE' && currentRole === ROLES.TENANT && (
                        <button
                          className="btn-primary"
                          onClick={() => {
                            const newHist = [
                              ...agr.history,
                              {
                                period: `งวดที่ ${agr.history.length + 1}`,
                                amount: `${agr.rentEth} ETH`,
                                timestamp: new Date().toLocaleString('th-TH'),
                                txHash: '0x' + Math.random().toString(16).substring(2, 10)
                              }
                            ];
                            setAgreements(agreements.map(a => a.id === agr.id ? { ...a, history: newHist } : a));
                            showToast('ชำระค่าเช่าสำเร็จ', `โอนเงินค่าเช่า ${agr.rentEth} ETH ตรงไปยังเจ้าของห้อง`);
                          }}
                        >
                          <Wallet size={16} />
                          <span>5. ชำระค่าเช่างวดนี้ ({agr.rentEth} ETH)</span>
                        </button>
                      )}

                      {/* Step 6: Refund Deposit */}
                      {agr.status === 'ACTIVE' && currentRole === ROLES.LANDLORD && (
                        <button
                          className="btn-secondary"
                          onClick={() => {
                            setAgreements(agreements.map(a => a.id === agr.id ? { ...a, status: 'COMPLETED', depositedAmount: 0 } : a));
                            showToast('คืนเงินประกันสำเร็จ', 'อนุมัติคืนเงินประกันเต็มจำนวนส่งกลับไปยังผู้เช่า');
                          }}
                        >
                          <ShieldCheck size={16} />
                          <span>6. ตรวจสภาพห้องผ่าน / อนุมัติคืนเงินประกัน (Refund Deposit)</span>
                        </button>
                      )}

                      {/* Step 7: Dispute */}
                      {agr.status === 'ACTIVE' && (
                        <button
                          className="btn-danger"
                          onClick={() => {
                            setAgreements(agreements.map(a => a.id === agr.id ? { ...a, status: 'DISPUTED' } : a));
                            showToast('ยื่นข้อพิพาทเรียบร้อย', 'ส่งเรื่องให้ผู้ไกล่เกลี่ย (Arbiter) พิจารณาหักเงินประกันค่าเสียหาย', 'error');
                          }}
                        >
                          <AlertTriangle size={16} />
                          <span>7. ยื่นข้อพิพาทเกี่ยวกับความเสียหาย (Rental Dispute)</span>
                        </button>
                      )}

                    </div>
                  </div>

                  {/* Payment History List */}
                  {agr.history.length > 0 && (
                    <div className="payment-history-box">
                      <h4 className="history-title"><Clock size={14} /> ประวัติการชำระค่าเช่า (Payment Transaction Records)</h4>
                      <div className="history-list">
                        {agr.history.map((h, i) => (
                          <div key={i} className="history-item flex-between">
                            <div>
                              <span className="hist-period">{h.period}</span>
                              <span className="hist-time">{h.timestamp}</span>
                            </div>
                            <div className="hist-right">
                              <span className="hist-amount">{h.amount}</span>
                              <code className="hist-tx">TX: {h.txHash}</code>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: DISPUTE MANAGEMENT & ARBITRATION                        */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'disputes' && (
          <div className="tab-pane">
            
            <div className="banner-card danger-theme">
              <div>
                <h2>ศูนย์พิจารณาและจัดการข้อพิพาท (Rental Dispute Center)</h2>
                <p>กรณีมีข้อพิพาทเรื่องความเสียหายของห้องพักเมื่อสิ้นสุดสัญญา ผู้มีอำนาจ (Arbiter) จะพิจารณาหลักฐานและสั่งจ่ายเงินประกันตามสัดส่วนที่ถูกต้อง</p>
              </div>
            </div>

            {agreements.filter(a => a.status === 'DISPUTED').length === 0 ? (
              <div className="empty-state-box">
                <CheckCircle2 size={40} className="empty-icon" />
                <h3>ไม่มีรายการข้อพิพาทในระบบขณะนี้</h3>
                <p>สัญญาทั้งหมดอยู่ในสถานะปกติหรือดำเนินรายการเสร็จสิ้นแล้ว</p>
              </div>
            ) : (
              <div className="disputes-list">
                {agreements.filter(a => a.status === 'DISPUTED').map((agr) => (
                  <div key={agr.id} className="dispute-card">
                    
                    <div className="dispute-header flex-between">
                      <div>
                        <span className="dispute-tag">DISPUTE CASE #{agr.id}</span>
                        <h3 className="dispute-title">{agr.title}</h3>
                      </div>
                      <span className="dispute-deposit-locked">
                        เงินประกันค้างใน Smart Contract: {agr.depositEth} ETH
                      </span>
                    </div>

                    <p className="dispute-desc">
                      คู่สัญญามีข้อโต้แย้งเกี่ยวกับสภาพห้องพักหลังย้ายออก โดยเจ้าของห้องเรียกร้องค่าซ่อมแซม อุปกรณ์ชำรุด
                    </p>

                    {currentRole === ROLES.ARBITER ? (
                      <div className="arbiter-decision-box">
                        <h4>⚖️ สำหรับ Arbiter: เลือกคำตัดสินและตัดจ่ายเงินประกัน</h4>
                        <div className="decision-buttons">
                          <button
                            className="btn-secondary"
                            onClick={() => {
                              setAgreements(agreements.map(a => a.id === agr.id ? { ...a, status: 'COMPLETED', depositedAmount: 0 } : a));
                              showToast('คำตัดสินเสร็จสิ้น', `คืนเงินประกันเต็มจำนวน ${agr.depositEth} ETH ให้แก่ผู้เช่า`);
                            }}
                          >
                            คืนเงินประกันทั้งหมดให้ผู้เช่า (Refund Full Deposit to Tenant)
                          </button>

                          <button
                            className="btn-coral"
                            onClick={() => {
                              setAgreements(agreements.map(a => a.id === agr.id ? { ...a, status: 'COMPLETED', depositedAmount: 0 } : a));
                              showToast('คำตัดสินเสร็จสิ้น', `หักค่าเสียหาย 50% ให้เจ้าของห้อง และคืนเงินประกันที่เหลือ 50% ให้ผู้เช่า`);
                            }}
                          >
                            แบ่งสัดส่วนหักค่าเสียหาย 50 / 50 (Partial Refund & Repair Fee)
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="arbiter-warning-note">
                        ⚠️ สิทธิ์ปัจจุบันของคุณไม่ใช่ Arbiter โปรดสลับสิทธิ์ด้านบนเป็น <strong>"ผู้ไกล่เกลี่ย (Arbiter)"</strong> เพื่อทำการพิจารณาและอนุมัติการจ่ายเงิน
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* ================= MODAL: NEW PROPERTY ================= */}
      {isNewPropModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header flex-between">
              <h3>ลงทะเบียนห้องพักใหม่ (Register Property)</h3>
              <button className="close-btn" onClick={() => setIsNewPropModalOpen(false)}>
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="modal-form">
              <div className="form-group">
                <label>ชื่อห้องพัก / อพาร์ตเมนต์ *</label>
                <input name="title" required placeholder="เช่น SmartLiving Condo Asok Room 402" />
              </div>

              <div className="form-group">
                <label>ที่ตั้ง / พิกัดทรัพย์สิน *</label>
                <input name="location" required placeholder="เช่น สุขุมวิท 21 เขตวัฒนา กรุงเทพฯ" />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>ค่าเช่ารายเดือน (ETH) *</label>
                  <input type="number" step="0.01" name="rentEth" required defaultValue="0.05" />
                </div>
                <div className="form-group">
                  <label>เงินประกัน (Security Deposit ETH) *</label>
                  <input type="number" step="0.01" name="depositEth" required defaultValue="0.10" />
                </div>
              </div>

              <button type="submit" className="btn-primary block-btn margin-top-md">
                ลงทะเบียนห้องเช่าเข้าสู่ Smart Contract
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}