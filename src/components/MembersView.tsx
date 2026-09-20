import React, { useState } from 'react';
import { User } from '../types';
import { dbService } from '../services/db';
import { 
  User as UserIcon, 
  LogIn, 
  UserPlus, 
  Shield, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Edit3, 
  Save, 
  LogOut, 
  KeyRound, 
  Mail, 
  BadgeCheck,
  Calendar
} from 'lucide-react';

interface MembersViewProps {
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  onNavigateToGame: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CyberAlpha',
  'https://api.dicebear.com/7.x/bottts/svg?seed=NexusPrime',
];

export const MembersView: React.FC<MembersViewProps> = ({
  currentUser,
  onUserChange,
  onNavigateToGame
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'player' | 'admin'>('player');

  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(currentUser?.username || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editTitle, setEditTitle] = useState(currentUser?.playerTitle || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0]);

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showNotification('error', 'กรุณากรอกชื่อผู้ใช้หรืออีเมล');
      return;
    }

    const res = dbService.login(loginIdentifier, loginPassword);
    if (res.success && res.user) {
      onUserChange(res.user);
      setEditUsername(res.user.username);
      setEditBio(res.user.bio || '');
      setEditTitle(res.user.playerTitle || '');
      setEditAvatar(res.user.avatar);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regEmail.trim()) {
      showNotification('error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const res = dbService.register(regUsername, regEmail, regRole);
    if (res.success && res.user) {
      onUserChange(res.user);
      setEditUsername(res.user.username);
      setEditBio(res.user.bio || '');
      setEditTitle(res.user.playerTitle || '');
      setEditAvatar(res.user.avatar);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated: User = {
      ...currentUser,
      username: editUsername.trim() || currentUser.username,
      bio: editBio.trim(),
      playerTitle: editTitle.trim(),
      avatar: editAvatar,
    };

    dbService.updateUser(updated);
    onUserChange(updated);
    setIsEditing(false);
    showNotification('success', 'อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว');
  };

  const handleQuickDemoLogin = (role: 'admin' | 'player') => {
    const users = dbService.getUsers();
    const target = users.find(u => u.role === role) || users[0];
    if (target) {
      dbService.setCurrentUser(target);
      onUserChange(target);
      setEditUsername(target.username);
      setEditBio(target.bio || '');
      setEditTitle(target.playerTitle || '');
      setEditAvatar(target.avatar);
      showNotification('success', `เข้าสู่ระบบในฐานะ ${target.username} (${target.role}) สำเร็จ`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' 
            : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
        }`}>
          {notification.type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      {currentUser ? (
        /* Logged In: Profile View & Editor */
        <div className="space-y-6">
          
          {/* Profile Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/50 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.username}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-xl"
                  />
                  {currentUser.role === 'admin' && (
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                      ADMIN
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold font-['Kanit'] text-white">
                      {currentUser.username}
                    </h2>
                    <BadgeCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <p className="text-sm font-mono text-cyan-300">
                    {currentUser.playerTitle || 'Future Explorer'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{currentUser.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <button
                  id="edit-profile-btn"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
                >
                  <Edit3 className="w-4 h-4 text-cyan-400" />
                  <span>{isEditing ? 'ยกเลิกแก้ไข' : 'แก้ไขข้อมูล'}</span>
                </button>
                <button
                  id="profile-logout-btn"
                  onClick={() => {
                    dbService.setCurrentUser(null);
                    onUserChange(null);
                    showNotification('success', 'ออกจากระบบเรียบร้อยแล้ว');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 text-rose-300 border border-rose-800/40 text-sm transition"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">ออก</span>
                </button>
              </div>

            </div>

            {currentUser.bio && (
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300">
                <span className="text-slate-500 font-semibold block text-xs mb-1">เกี่ยวกับผู้เล่น (Bio):</span>
                <p className="italic">"{currentUser.bio}"</p>
              </div>
            )}
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-xl animate-in fade-in duration-200">
              <h3 className="text-lg font-bold font-['Kanit'] text-white mb-4 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <span>แก้ไขโปรไฟล์ส่วนตัว</span>
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ชื่อผู้ใช้ (Username)
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ฉายาผู้เล่น (Player Title)
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="เช่น AI Systems Engineer, Quantum Investor"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    คำคมหรือเป้าหมายชีวิต (Bio)
                  </label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="เล่าเป้าหมายชีวิตในอนาคตของคุณสั้นๆ..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    เลือกภาพ Avatar อนาคต
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setEditAvatar(url)}
                        className={`w-12 h-12 rounded-xl overflow-hidden ring-2 transition ${
                          editAvatar === url ? 'ring-cyan-400 scale-105' : 'ring-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold shadow-md shadow-cyan-500/20 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกการเปลี่ยนแปลง</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Quick Actions & Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>ข้อมูลบัญชีสมาชิก</span>
              </h4>
              <div className="text-xs space-y-1.5 text-slate-400 font-mono">
                <div>วันที่ลงทะเบียน: {new Date(currentUser.createdAt).toLocaleDateString('th-TH')}</div>
                <div>สิทธิ์การใช้งาน: {currentUser.role.toUpperCase()}</div>
                <div>สถานะ Database: เชื่อมต่อ Online DB</div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  พร้อมทดสอบเส้นทางใหม่แล้วหรือยัง?
                </h4>
                <p className="text-xs text-slate-400">
                  คุณสามารถเริ่มจำลองชีวิตและเก็บผลคะแนนใหม่ได้ตลอดเวลา
                </p>
              </div>
              <button
                onClick={onNavigateToGame}
                className="mt-4 w-full py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition"
              >
                เข้าเล่นเกมจำลองชีวิต
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Not Logged In: Login or Register Form */
        <div className="max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center justify-center gap-1.5 ${
                authMode === 'login' ? 'bg-cyan-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบ (Login)</span>
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center justify-center gap-1.5 ${
                authMode === 'register' ? 'bg-cyan-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>สมัครสมาชิก (Register)</span>
            </button>
          </div>

          {authMode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ชื่อผู้ใช้ หรือ อีเมล
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="เช่น Sirapop_AI หรือ admin"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  รหัสผ่าน (ถ้ามี)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition"
              >
                เข้าสู่ระบบทันที
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ชื่อผู้ใช้ที่ต้องการ (Username)
                </label>
                <input
                  type="text"
                  placeholder="เช่น FutureLeader2030"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  อีเมล (Email)
                </label>
                <input
                  type="email"
                  placeholder="yourname@domain.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ประเภทบัญชี
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('player')}
                    className={`py-2 rounded-xl text-xs font-medium border transition ${
                      regRole === 'player' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    ผู้เล่นทั่วไป (Player)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('admin')}
                    className={`py-2 rounded-xl text-xs font-medium border transition ${
                      regRole === 'admin' ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    ผู้ดูแลระบบ (Admin)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition"
              >
                ยืนยันการสมัครสมาชิก
              </button>
            </form>
          )}

          {/* 1-Click Quick Demo Accounts for Teacher & Evaluator */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 block text-center">
              ⚡ บัญชีทดสอบด่วน (คลิกเดียวเพื่อเข้าใช้งานทันที):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-rose-900/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>เข้าสู่ระบบ Admin</span>
              </button>
              <button
                onClick={() => handleQuickDemoLogin('player')}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-cyan-900/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>เข้าสู่ระบบ Player</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
