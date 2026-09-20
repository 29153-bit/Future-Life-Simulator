import React, { useState, useEffect } from 'react';
import { GameHistoryRecord, User } from '../types';
import { dbService } from '../services/db';
import { 
  Trophy, 
  History, 
  BarChart3, 
  Coins, 
  Smile, 
  Heart, 
  Cpu, 
  Calendar, 
  Sparkles, 
  Medal, 
  ArrowUpRight,
  TrendingUp,
  Gamepad2,
  Filter,
  CheckCircle
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User | null;
  onNavigateToGame: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onNavigateToGame
}) => {
  const [history, setHistory] = useState<GameHistoryRecord[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'leaderboard' | 'my_history'>('leaderboard');

  useEffect(() => {
    const loaded = dbService.getHistory();
    setHistory(loaded);
  }, []);

  // Filter player history
  const myRecords = currentUser 
    ? history.filter(h => h.userId === currentUser.id || h.username === currentUser.username)
    : [];

  // Sort by score for leaderboard
  const sortedLeaderboard = [...history].sort((a, b) => b.score - a.score);

  // Overall statistics
  const totalGames = history.length;
  const bestScore = history.length > 0 ? Math.max(...history.map(h => h.score)) : 0;
  
  // Calculate average stats from all records
  const avgStats = history.length > 0 ? {
    wealth: Math.round(history.reduce((sum, h) => sum + h.finalStats.wealth, 0) / history.length),
    happiness: Math.round(history.reduce((sum, h) => sum + h.finalStats.happiness, 0) / history.length),
    health: Math.round(history.reduce((sum, h) => sum + h.finalStats.health, 0) / history.length),
    techSkill: Math.round(history.reduce((sum, h) => sum + h.finalStats.techSkill, 0) / history.length),
  } : { wealth: 50, happiness: 50, health: 50, techSkill: 50 };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S': return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black';
      case 'A': return 'bg-cyan-500 text-black font-bold';
      case 'B': return 'bg-blue-500 text-white font-bold';
      case 'C': return 'bg-purple-500 text-white font-medium';
      default: return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
              Live Analytics & Leaderboard
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Online Database Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Kanit'] text-white">
            แดชบอร์ดสรุปผล & สถิติผู้เล่น
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            วิเคราะห์ความสำเร็จในอนาคต ประวัติการเล่นย้อนหลัง และอันดับยอดเยี่ยมระดับโลก
          </p>
        </div>

        <button
          onClick={onNavigateToGame}
          className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/20 text-sm transition"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>จำลองชีวิตใหม่อีกรอบ</span>
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Simulations */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>จำนวนรอบที่จำลองแล้ว</span>
            <History className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {totalGames} <span className="text-xs font-normal text-slate-400">รอบ</span>
          </div>
          <p className="text-[11px] text-cyan-400/80 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> บันทึกสถิติแบบเรียลไทม์
          </p>
        </div>

        {/* Highest Score */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>คะแนนสูงสุด (High Score)</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-300">
            {bestScore} <span className="text-xs font-normal text-slate-400">/ 400</span>
          </div>
          <p className="text-[11px] text-amber-400/80 mt-1">
            เกรด S: อัตราความสำเร็จสูงสุด
          </p>
        </div>

        {/* Average Wealth */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>ค่าเฉลี่ยความมั่งคั่ง</span>
            <Coins className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {avgStats.wealth} <span className="text-xs font-normal text-slate-400">/100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${avgStats.wealth}%` }} />
          </div>
        </div>

        {/* Average Happiness & Health */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>ค่าเฉลี่ยความสุข & สุขภาพ</span>
            <Smile className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {Math.round((avgStats.happiness + avgStats.health) / 2)} <span className="text-xs font-normal text-slate-400">/100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full bg-sky-400 rounded-full" style={{ width: `${Math.round((avgStats.happiness + avgStats.health) / 2)}%` }} />
          </div>
        </div>

      </div>

      {/* Sub-tabs: Leaderboard vs My History */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            id="tab-leaderboard"
            onClick={() => setActiveSubTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeSubTab === 'leaderboard'
                ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>อันดับผู้เล่นสูงสุด (Global Leaderboard)</span>
            <span className="text-xs font-mono bg-slate-800 px-1.5 py-0.5 rounded-full">
              {sortedLeaderboard.length}
            </span>
          </button>

          <button
            id="tab-my-history"
            onClick={() => setActiveSubTab('my_history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeSubTab === 'my_history'
                ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span>ประวัติของฉัน ({currentUser ? currentUser.username : 'Guest'})</span>
            <span className="text-xs font-mono bg-slate-800 px-1.5 py-0.5 rounded-full">
              {myRecords.length}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Leaderboard Table */}
      {activeSubTab === 'leaderboard' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-400" />
              <span>ทำเนียบผู้ประสบความสำเร็จในชีวิตอนาคต</span>
            </h2>
            <span className="text-xs text-slate-400">เรียงตามคะแนนรวม (Score / 400)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-4 py-3 text-center">อันดับ</th>
                  <th className="px-4 py-3">ผู้เล่น</th>
                  <th className="px-4 py-3">บทสรุปชีวิตที่ได้</th>
                  <th className="px-4 py-3 text-center">สถิติ (W / H / H / T)</th>
                  <th className="px-4 py-3 text-center">เกรด</th>
                  <th className="px-4 py-3 text-right">คะแนน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {sortedLeaderboard.map((item, idx) => {
                  const isTop3 = idx < 3;
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-850/80 transition ${
                        currentUser && (item.userId === currentUser.id || item.username === currentUser.username) 
                          ? 'bg-cyan-950/20' 
                          : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="px-4 py-3.5 text-center font-bold">
                        {idx === 0 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-black font-mono text-xs font-black shadow-md shadow-amber-400/30">
                            1
                          </span>
                        ) : idx === 1 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-black font-mono text-xs font-black">
                            2
                          </span>
                        ) : idx === 2 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-mono text-xs font-bold">
                            3
                          </span>
                        ) : (
                          <span className="font-mono text-slate-500 text-xs">#{idx + 1}</span>
                        )}
                      </td>

                      {/* Player */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.userAvatar}
                            alt={item.username}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                              <span>{item.username}</span>
                              {currentUser && (item.userId === currentUser.id || item.username === currentUser.username) && (
                                <span className="text-[10px] bg-cyan-950 border border-cyan-600/40 text-cyan-300 px-1.5 py-0.2 rounded">
                                  คุณ
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(item.endedAt).toLocaleDateString('th-TH')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Ending Title */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-medium text-slate-200 line-clamp-1">{item.endingTitle}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{item.endingDescription}</div>
                      </td>

                      {/* Stats Breakdown */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono">
                          <span className="text-amber-400" title="Wealth">{item.finalStats.wealth}</span>
                          <span className="text-slate-600">/</span>
                          <span className="text-sky-400" title="Happiness">{item.finalStats.happiness}</span>
                          <span className="text-slate-600">/</span>
                          <span className="text-rose-400" title="Health">{item.finalStats.health}</span>
                          <span className="text-slate-600">/</span>
                          <span className="text-emerald-400" title="Tech">{item.finalStats.techSkill}</span>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-mono uppercase ${getGradeColor(item.grade)}`}>
                          {item.grade}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-base text-cyan-300">
                        {item.score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: My Personal History */}
      {activeSubTab === 'my_history' && (
        <div className="space-y-4">
          {myRecords.length === 0 ? (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center space-y-4">
              <History className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-semibold text-slate-300">
                ยังไม่พบประวัติการเล่นของคุณ
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                เริ่มต้นจำลองชีวิตครั้งแรกของคุณตอนนี้ เลือกช้อยส์แห่งอนาคต แล้วผลสรุปจะมาปรากฏที่นี่โดยอัตโนมัติ!
              </p>
              <button
                onClick={onNavigateToGame}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>เล่นเกมจำลองชีวิตเดี๋ยวนี้</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRecords.map((record) => (
                <div 
                  key={record.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${getGradeColor(record.grade)}`}>
                            เกรด {record.grade}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {new Date(record.endedAt).toLocaleString('th-TH')}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          {record.endingTitle}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">คะแนน</span>
                        <div className="text-xl font-mono font-bold text-cyan-400">
                          {record.score}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                      {record.endingDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-center font-mono text-xs">
                    <div className="bg-slate-950/40 p-2 rounded-lg">
                      <span className="text-[10px] text-amber-400 block">เงิน</span>
                      <span className="font-bold text-slate-200">{record.finalStats.wealth}</span>
                    </div>
                    <div className="bg-slate-950/40 p-2 rounded-lg">
                      <span className="text-[10px] text-sky-400 block">สุข</span>
                      <span className="font-bold text-slate-200">{record.finalStats.happiness}</span>
                    </div>
                    <div className="bg-slate-950/40 p-2 rounded-lg">
                      <span className="text-[10px] text-rose-400 block">กาย</span>
                      <span className="font-bold text-slate-200">{record.finalStats.health}</span>
                    </div>
                    <div className="bg-slate-950/40 p-2 rounded-lg">
                      <span className="text-[10px] text-emerald-400 block">ไอที</span>
                      <span className="font-bold text-slate-200">{record.finalStats.techSkill}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
