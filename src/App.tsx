import { useState, useEffect } from 'react';
import { TabType, User } from './types';
import { dbService } from './services/db';
import { Navbar } from './components/Navbar';
import { GameView } from './components/GameView';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { MembersView } from './components/MembersView';
import { AdminView } from './components/AdminView';
import { ShieldCheck, Sparkles, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('game');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const user = dbService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Protect admin view: redirect to game if currentTab is admin but user is not admin
  useEffect(() => {
    if (currentTab === 'admin' && currentUser?.role !== 'admin') {
      setCurrentTab('game');
    }
  }, [currentUser, currentTab]);

  const handleLogout = () => {
    dbService.setCurrentUser(null);
    setCurrentUser(null);
    if (currentTab === 'admin') {
      setCurrentTab('game');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Prompt',sans-serif] selection:bg-cyan-500 selection:text-black">
      
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuthModal={() => {
          setCurrentTab('members');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-12">
        {currentTab === 'game' && (
          <GameView
            currentUser={currentUser}
            onNavigateToDashboard={() => setCurrentTab('dashboard')}
            onNavigateToHistory={() => setCurrentTab('history')}
            onNavigateToSettings={() => setCurrentTab('settings')}
            onOpenAuthModal={() => setCurrentTab('members')}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            currentUser={currentUser}
            onNavigateToGame={() => setCurrentTab('game')}
            onOpenAuthModal={() => setCurrentTab('members')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            onNavigateToGame={() => setCurrentTab('game')}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            currentUser={currentUser}
            onNavigateToGame={() => setCurrentTab('game')}
          />
        )}

        {currentTab === 'members' && (
          <MembersView
            currentUser={currentUser}
            onUserChange={setCurrentUser}
            onNavigateToGame={() => setCurrentTab('game')}
          />
        )}

        {currentTab === 'admin' && currentUser?.role === 'admin' && (
          <AdminView
            currentUser={currentUser}
            onNavigateToMembers={() => setCurrentTab('members')}
          />
        )}
      </main>

      {/* Quick Auth Modal (if triggered directly) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <MembersView
              currentUser={currentUser}
              onUserChange={(u) => {
                setCurrentUser(u);
                if (u) setIsAuthModalOpen(false);
              }}
              onNavigateToGame={() => {
                setIsAuthModalOpen(false);
                setCurrentTab('game');
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-slate-500 text-xs text-center hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 font-medium">Future Life Simulator</span>
            <span>— โครงงานเว็บแอปพลิเคชันจำลองชีวิตในอนาคต</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin')}
                className="hover:text-cyan-300 flex items-center gap-1 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ตั้งค่าหลังบ้าน</span>
              </button>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
}
