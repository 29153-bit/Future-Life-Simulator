import React, { useState } from 'react';
import { TabType, User } from '../types';
import { 
  Gamepad2, 
  BarChart3, 
  User as UserIcon, 
  ShieldCheck, 
  History,
  Settings,
  Menu, 
  X, 
  Sparkles,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const baseNavItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'game', label: 'จำลองชีวิต', icon: Gamepad2 },
    { id: 'history', label: 'ประวัติการเล่น', icon: History },
    { id: 'dashboard', label: 'แดชบอร์ด & สถิติ', icon: BarChart3 },
    { id: 'settings', label: 'การตั้งค่า', icon: Settings },
    { id: 'members', label: 'ระบบสมาชิก', icon: UserIcon },
  ];

  // Show "หลังบ้าน (Admin)" only when an Admin is logged in
  const navItems = currentUser?.role === 'admin'
    ? [
        ...baseNavItems,
        { id: 'admin' as TabType, label: 'หลังบ้าน (Admin)', icon: ShieldCheck, badge: 'Admin' },
      ]
    : baseNavItems;

  const handleNavClick = (tab: TabType) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-900/30 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('game')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <Sparkles className="w-5 h-5 text-white" />
              <div className="absolute -inset-0.5 rounded-xl bg-cyan-400 opacity-20 blur-sm group-hover:opacity-50 transition" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold font-['Kanit'] text-lg sm:text-xl tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                  Future Life Simulator
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-light hidden sm:block">
                เกมจำลองชีวิตในอนาคตผ่านการเลือกช้อยส์
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 shadow-sm shadow-cyan-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Side: User Profile / Auth State */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="user-profile-button"
                  onClick={() => handleNavClick('members')}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition text-left"
                  title="ดูโปรไฟล์ส่วนตัว"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.username}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/40"
                  />
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="text-xs font-semibold text-slate-200">{currentUser.username}</span>
                      {currentUser.role === 'admin' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50 font-bold">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-cyan-400/80 font-mono">
                      {currentUser.playerTitle || 'Player'}
                    </span>
                  </div>
                </button>

                <button
                  id="logout-button"
                  onClick={onLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-register-button"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบ / สมัคร</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-1.5 animate-in slide-in-from-top-3 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/70 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 font-mono">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Ultra-responsive for Smartphone) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="text-[10px] whitespace-nowrap">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
