import React, { useState, useEffect } from 'react';
import { GameHistoryRecord, User } from '../types';
import { dbService } from '../services/db';
import { 
  History, 
  Gamepad2, 
  Trash2, 
  Calendar, 
  Trophy, 
  Share2, 
  Check, 
  Clock, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';

interface HistoryViewProps {
  currentUser: User | null;
  onNavigateToGame: () => void;
  onOpenAuthModal: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  currentUser,
  onNavigateToGame,
  onOpenAuthModal,
}) => {
  const [history, setHistory] = useState<GameHistoryRecord[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    loadHistory();
  }, [currentUser]);

  const loadHistory = () => {
    const all = dbService.getHistory();
    if (currentUser) {
      const userRecords = all.filter(h => h.userId === currentUser.id || h.username === currentUser.username);
      setHistory(userRecords);
    } else {
      setHistory(all);
    }
  };

  const handleShare = (record: GameHistoryRecord) => {
    const text = `🎮 Future Life Simulator ผลการจำลองชีวิตของฉัน:\n🏆 เกรด: ${record.grade} (คะแนน: ${record.score}/400)\n🌟 ฉายา: ${record.endingTitle}\n💰 ทุน: ${record.finalStats.wealth} | 😊 สุข: ${record.finalStats.happiness} | ❤️ กาย: ${record.finalStats.health} | ⚡ ไอที: ${record.finalStats.techSkill}\nลองเล่นได้ที่: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopiedId(record.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleClearHistory = () => {
    if (!currentUser) return;
    const all = dbService.getHistory();
    const remaining = all.filter(h => h.userId !== currentUser.id && h.username !== currentUser.username);
    localStorage.setItem('fls_history_v1', JSON.stringify(remaining));
    setHistory([]);
    setConfirmDelete(false);
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'S':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black';
      case 'A':
        return 'bg-cyan-500 text-black font-bold';
      case 'B':
        return 'bg-blue-500 text-white font-bold';
      case 'C':
        return 'bg-purple-500 text-white font-medium';
      default:
        return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800/60 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Timeline & Logs
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ผู้เล่น: {currentUser?.username || 'Guest'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Kanit'] text-white">
            ประวัติการจำลองชีวิต (Life History Log)
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            บันทึกเส้นทางชีวิต คะแนน และบทสรุปบั้นปลายชีวิตจากการตัดสินใจในทุกรอบ
          </p>
        </div>

        <div className="flex items-center gap-3">
          {history.length > 0 && currentUser && (
            <button
              onClick={() => setConfirmDelete(!confirmDelete)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/70 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-medium transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างประวัติของฉัน</span>
            </button>
          )}

          <button
            onClick={onNavigateToGame}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/20 text-sm transition"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>จำลองชีวิตใหม่อีกรอบ</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Box */}
      {confirmDelete && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-rose-200 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติการจำลองชีวิตทั้งหมดของบัญชีนี้?</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-850 text-slate-300 text-xs hover:bg-slate-800"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleClearHistory}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-500"
            >
              ยืนยันการล้างประวัติ
            </button>
          </div>
        </div>
      )}

      {/* Guest Notice if not logged in */}
      {!currentUser && (
        <div className="bg-amber-950/50 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-200 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>คุณกำลังดูประวัติรวมทั้งหมด หากเข้าสู่ระบบจะเก็บบันทึกประวัติส่วนตัวของคุณแยกเฉพาะบัญชี</span>
          </div>
          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs shrink-0 self-start sm:self-auto transition"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      )}

      {/* History Records List */}
      {history.length === 0 ? (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <History className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-['Kanit'] text-white">
            ยังไม่มีประวัติการจำลองชีวิต
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            คุณยังไม่ได้เริ่มต้นเส้นทางชีวิตในอนาคต กดปุ่มเริ่มเล่นเกมเพื่อเลือกช้อยส์แห่งอนาคตและบันทึกผลคะแนนประวัติศาสตร์ของคุณ
          </p>
          <button
            onClick={onNavigateToGame}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm shadow-lg shadow-cyan-500/20 transition"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>เริ่มต้นจำลองชีวิตเดี๋ยวนี้</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 flex items-center justify-between px-1">
            <span>แสดงทั้งหมด <strong>{history.length}</strong> รอบการจำลอง</span>
            <span>เรียงจากรอบล่าสุดไปเก่าสุด</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((item, index) => (
              <div 
                key={item.id || index}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Grade, Date, and Score */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono shadow-sm ${getGradeBadge(item.grade)}`}>
                        เกรด {item.grade}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(item.endedAt).toLocaleString('th-TH', { 
                          dateStyle: 'short', 
                          timeStyle: 'short' 
                        })}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-mono font-bold text-cyan-400">
                        {item.score} <span className="text-[10px] text-slate-500 font-normal">/ 400</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold font-['Kanit'] text-white mb-2">
                    {item.endingTitle}
                  </h3>
                  
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-850 mb-4">
                    {item.endingDescription}
                  </p>
                </div>

                <div>
                  {/* Final 4 Stats Badges */}
                  <div className="grid grid-cols-4 gap-2 mb-3 text-center font-mono text-xs">
                    <div className="bg-slate-950/60 border border-amber-500/20 p-2 rounded-xl">
                      <span className="text-[10px] text-amber-400 block font-medium">เงินทุน</span>
                      <span className="font-bold text-slate-200">{item.finalStats.wealth}</span>
                    </div>
                    <div className="bg-slate-950/60 border border-sky-500/20 p-2 rounded-xl">
                      <span className="text-[10px] text-sky-400 block font-medium">ความสุข</span>
                      <span className="font-bold text-slate-200">{item.finalStats.happiness}</span>
                    </div>
                    <div className="bg-slate-950/60 border border-rose-500/20 p-2 rounded-xl">
                      <span className="text-[10px] text-rose-400 block font-medium">สุขภาพ</span>
                      <span className="font-bold text-slate-200">{item.finalStats.health}</span>
                    </div>
                    <div className="bg-slate-950/60 border border-emerald-500/20 p-2 rounded-xl">
                      <span className="text-[10px] text-emerald-400 block font-medium">ทักษะ AI</span>
                      <span className="font-bold text-slate-200">{item.finalStats.techSkill}</span>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                    <span className="font-mono text-[11px]">
                      อายุบั้นปลาย: {item.finalAge} ปี (ปี ค.ศ. {item.finalYear})
                    </span>

                    <button
                      onClick={() => handleShare(item)}
                      className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>แชร์ผลลัพธ์</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
