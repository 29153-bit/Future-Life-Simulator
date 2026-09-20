import React, { useState, useEffect } from 'react';
import { Scenario, GameChoice, PlayerStats, User, GameHistoryRecord } from '../types';
import { dbService } from '../services/db';
import confetti from 'canvas-confetti';
import { 
  Coins, 
  Heart, 
  Smile, 
  Cpu, 
  RotateCcw, 
  ChevronRight, 
  Trophy, 
  Calendar, 
  User as UserIcon, 
  CheckCircle2, 
  Sparkles,
  Share2,
  Volume2,
  VolumeX,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  LogIn,
  Settings as SettingsIcon,
  History as HistoryIcon
} from 'lucide-react';

interface GameViewProps {
  currentUser: User | null;
  onNavigateToDashboard: () => void;
  onNavigateToHistory?: () => void;
  onNavigateToSettings?: () => void;
  onOpenAuthModal: () => void;
}

const INITIAL_STATS: PlayerStats = {
  wealth: 50,
  happiness: 55,
  health: 70,
  techSkill: 35,
};

export const GameView: React.FC<GameViewProps> = ({
  currentUser,
  onNavigateToDashboard,
  onNavigateToHistory,
  onNavigateToSettings,
  onOpenAuthModal
}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [stats, setStats] = useState<PlayerStats>(INITIAL_STATS);
  const [historyLog, setHistoryLog] = useState<{ step: number; choiceText: string; outcomeText: string; age: number; year: number }[]>([]);
  const [lastOutcome, setLastOutcome] = useState<{ title: string; outcomeText: string; effects: Partial<PlayerStats> } | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [finalEvaluation, setFinalEvaluation] = useState<ReturnType<typeof dbService.evaluateEnding> | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => dbService.getSettings().soundEnabled);

  // Load scenarios and settings on mount
  useEffect(() => {
    const loaded = dbService.getScenarios();
    setScenarios(loaded);
    setSoundEnabled(dbService.getSettings().soundEnabled);
  }, []);

  const currentScenario = scenarios[currentIndex];

  const playBeep = (freq = 440, type: OscillatorType = 'sine', duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Ignore if audioContext not permitted yet
    }
  };

  const handleSelectChoice = (choice: GameChoice) => {
    playBeep(587, 'triangle', 0.2);

    // Apply stat effects clamped between 0 and 100
    const newStats: PlayerStats = {
      wealth: Math.min(100, Math.max(0, stats.wealth + (choice.statEffects.wealth || 0))),
      happiness: Math.min(100, Math.max(0, stats.happiness + (choice.statEffects.happiness || 0))),
      health: Math.min(100, Math.max(0, stats.health + (choice.statEffects.health || 0))),
      techSkill: Math.min(100, Math.max(0, stats.techSkill + (choice.statEffects.techSkill || 0))),
    };

    setStats(newStats);

    const logEntry = {
      step: currentIndex + 1,
      choiceText: choice.text,
      outcomeText: choice.outcomeText,
      age: currentScenario.age,
      year: currentScenario.year,
    };

    const nextLogs = [...historyLog, logEntry];
    setHistoryLog(nextLogs);

    setLastOutcome({
      title: currentScenario.title,
      outcomeText: choice.outcomeText,
      effects: choice.statEffects
    });

    // Check if end of simulation
    if (currentIndex + 1 >= scenarios.length) {
      // Evaluate ending
      const evaluation = dbService.evaluateEnding(newStats);
      setFinalEvaluation(evaluation);
      setIsGameOver(true);

      // Save to database
      const userToSave = currentUser || {
        id: 'guest_user',
        username: 'นักท่องเวลาอิสระ (Guest)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      };

      const record: GameHistoryRecord = {
        id: 'rec_' + Date.now().toString(36),
        userId: userToSave.id,
        username: userToSave.username,
        userAvatar: userToSave.avatar,
        endedAt: new Date().toISOString(),
        finalAge: currentScenario.age + 5,
        finalYear: currentScenario.year + 5,
        finalStats: newStats,
        endingTitle: evaluation.title,
        endingDescription: evaluation.description,
        choicesCount: nextLogs.length,
        score: evaluation.score,
        grade: evaluation.grade
      };

      dbService.saveGameRecord(record);

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRestart = () => {
    playBeep(330, 'sine', 0.15);
    setStats(INITIAL_STATS);
    setCurrentIndex(0);
    setHistoryLog([]);
    setLastOutcome(null);
    setIsGameOver(false);
    setFinalEvaluation(null);
  };

  const handleShareSummary = () => {
    if (!finalEvaluation) return;
    const text = `🎮 Future Life Simulator: ผลจำลองชีวิตในอนาคตของฉัน!\n🏆 เกรด: ${finalEvaluation.grade} (คะแนน: ${finalEvaluation.score}/400)\n🌟 ฉายา: ${finalEvaluation.title}\n💰 ทุน: ${stats.wealth} | 😊 ความสุข: ${stats.happiness} | ❤️ สุขภาพ: ${stats.health} | ⚡ ทักษะเทค: ${stats.techSkill}\nลองเล่นได้ที่: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // GATE: User must login first before playing
  if (!currentUser) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-20 h-20 rounded-3xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-950/80">
            <Lock className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ระบบป้องกันข้อมูลผู้เล่น (Authentication Required)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Kanit'] text-white">
              กรุณาเข้าสู่ระบบก่อนเริ่มเล่น
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 max-w-md mx-auto leading-relaxed">
              เพื่อให้ระบบสามารถ <strong>บันทึกประวัติการตัดสินใจชีวิต</strong>, จัดเก็บ <strong>สถิติและคะแนน High Score</strong>, และใช้ <strong>การตั้งค่าส่วนบุคคล</strong> ของคุณได้อย่างแม่นยำ
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="gameview-login-btn"
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบ / สมัครสมาชิกเพื่อเริ่มเล่น</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
            <span>หรือกดสลับไปดู</span>{' '}
            <button
              onClick={onNavigateToDashboard}
              className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
            >
              อันดับบนกระดานคะแนน (Leaderboard)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-6">
      
      {/* Top Status & Life Meters Header */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          
          {/* Current Timeline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono text-sm font-semibold">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>ปี ค.ศ. {currentScenario ? currentScenario.year : 2068}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono text-sm font-semibold">
              <UserIcon className="w-4 h-4 text-purple-400" />
              <span>อายุ {currentScenario ? currentScenario.age : 65} ปี</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
              <span>ด่าน {Math.min(currentIndex + 1, scenarios.length)} / {scenarios.length}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onNavigateToHistory && (
              <button
                onClick={onNavigateToHistory}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-cyan-300 border border-slate-700/60 text-xs transition"
                title="ดูประวัติการเล่นของคุณ"
              >
                <HistoryIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">ประวัติ</span>
              </button>
            )}

            {onNavigateToSettings && (
              <button
                onClick={onNavigateToSettings}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-cyan-300 border border-slate-700/60 text-xs transition"
                title="การตั้งค่าเกม"
              >
                <SettingsIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">ตั้งค่า</span>
              </button>
            )}

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition"
              title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              id="game-restart-btn"
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>เริ่มใหม่</span>
            </button>
          </div>
        </div>

        {/* 4 Core Stat Meters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4">
          
          {/* Wealth */}
          <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 font-medium text-amber-300">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>เงินทุน (Wealth)</span>
              </div>
              <span className="font-mono font-bold text-amber-200">{stats.wealth}/100</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-500"
                style={{ width: `${stats.wealth}%` }}
              />
            </div>
          </div>

          {/* Happiness */}
          <div className="bg-slate-950/60 border border-sky-500/20 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 font-medium text-sky-300">
                <Smile className="w-4 h-4 text-sky-400" />
                <span>ความสุข (Joy)</span>
              </div>
              <span className="font-mono font-bold text-sky-200">{stats.happiness}/100</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-300 rounded-full transition-all duration-500"
                style={{ width: `${stats.happiness}%` }}
              />
            </div>
          </div>

          {/* Health */}
          <div className="bg-slate-950/60 border border-rose-500/20 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 font-medium text-rose-300">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>สุขภาพ (Health)</span>
              </div>
              <span className="font-mono font-bold text-rose-200">{stats.health}/100</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full transition-all duration-500"
                style={{ width: `${stats.health}%` }}
              />
            </div>
          </div>

          {/* Tech Skill */}
          <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 font-medium text-emerald-300">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>ทักษะไอที (Tech)</span>
              </div>
              <span className="font-mono font-bold text-emerald-200">{stats.techSkill}/100</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-500"
                style={{ width: `${stats.techSkill}%` }}
              />
            </div>
          </div>

        </div>

        {/* Progress Bar through life */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3">
          <span className="text-[11px] text-slate-400 whitespace-nowrap">ความคืบหน้าของชีวิต:</span>
          <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((currentIndex) / (scenarios.length || 1)) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            {Math.round(((currentIndex) / (scenarios.length || 1)) * 100)}%
          </span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {!isGameOver && currentScenario ? (
        <div className="space-y-6">
          
          {/* Scenario Question Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 p-5 sm:p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                    {currentScenario.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    การตัดสินใจครั้งที่ {currentIndex + 1}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Kanit'] text-white">
                  {currentScenario.title}
                </h2>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {currentScenario.description}
            </p>

            {/* Choices list */}
            <div className="space-y-3 sm:space-y-4">
              <div className="text-xs font-semibold text-cyan-300 tracking-wider uppercase">
                เลือกทิศทางที่คุณต้องการ:
              </div>

              {currentScenario.choices.map((choice, idx) => (
                <button
                  key={choice.id}
                  id={`choice-btn-${idx}`}
                  onClick={() => handleSelectChoice(choice)}
                  className="w-full group text-left p-4 sm:p-5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-950/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700/60 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h3 className="font-medium text-slate-100 group-hover:text-cyan-200 text-sm sm:text-base">
                          {choice.text}
                        </h3>
                      </div>
                      {choice.description && (
                        <p className="text-xs text-slate-400 pl-8 leading-relaxed">
                          {choice.description}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 pt-1">
                      <div className="w-8 h-8 rounded-lg bg-slate-800/80 group-hover:bg-cyan-500 group-hover:text-black text-slate-400 flex items-center justify-center transition">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Impact preview pill tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pl-8">
                    {choice.statEffects.wealth !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-0.5 ${
                        choice.statEffects.wealth >= 0 ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50' : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                      }`}>
                        <Coins className="w-3 h-3" />
                        <span>เงิน {choice.statEffects.wealth >= 0 ? `+${choice.statEffects.wealth}` : choice.statEffects.wealth}</span>
                      </span>
                    )}
                    {choice.statEffects.happiness !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-0.5 ${
                        choice.statEffects.happiness >= 0 ? 'bg-sky-950/60 text-sky-300 border border-sky-800/50' : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                      }`}>
                        <Smile className="w-3 h-3" />
                        <span>สุข {choice.statEffects.happiness >= 0 ? `+${choice.statEffects.happiness}` : choice.statEffects.happiness}</span>
                      </span>
                    )}
                    {choice.statEffects.health !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-0.5 ${
                        choice.statEffects.health >= 0 ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                      }`}>
                        <Heart className="w-3 h-3" />
                        <span>สุขภาพ {choice.statEffects.health >= 0 ? `+${choice.statEffects.health}` : choice.statEffects.health}</span>
                      </span>
                    )}
                    {choice.statEffects.techSkill !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-0.5 ${
                        choice.statEffects.techSkill >= 0 ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50' : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                      }`}>
                        <Cpu className="w-3 h-3" />
                        <span>เทค {choice.statEffects.techSkill >= 0 ? `+${choice.statEffects.techSkill}` : choice.statEffects.techSkill}</span>
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Last Outcome Feedback Banner */}
          {lastOutcome && (
            <div className="bg-slate-900/70 border border-cyan-900/40 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-cyan-300">ผลลัพธ์จากการตัดสินใจก่อนหน้า: </span>
                <span className="text-slate-300">{lastOutcome.outcomeText}</span>
              </div>
            </div>
          )}

        </div>
      ) : isGameOver && finalEvaluation ? (
        /* End of Game & Evaluation Screen */
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-cyan-500/40 p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
            
            {/* Grade Badge */}
            <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/30 text-white font-black text-5xl sm:text-6xl font-['Kanit'] mb-4 ring-4 ring-cyan-400/20">
              {finalEvaluation.grade}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-['Kanit'] text-white mb-2">
              {finalEvaluation.title}
            </h2>
            
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
              {finalEvaluation.description}
            </p>

            {/* Score pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 mb-8">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-slate-300 text-sm">คะแนนรวมความสำเร็จของชีวิต:</span>
              <span className="font-mono font-bold text-lg text-cyan-400">{finalEvaluation.score}</span>
              <span className="text-xs text-slate-500">/ 400</span>
            </div>

            {/* Final Stats Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 text-left">
                <span className="text-xs text-amber-400">เงินทุนบั้นปลาย</span>
                <p className="text-xl font-mono font-bold text-white">{stats.wealth}/100</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-sky-500/30 text-left">
                <span className="text-xs text-sky-400">ความสุขแท้จริง</span>
                <p className="text-xl font-mono font-bold text-white">{stats.happiness}/100</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/30 text-left">
                <span className="text-xs text-rose-400">สุขภาพร่างกาย</span>
                <p className="text-xl font-mono font-bold text-white">{stats.health}/100</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-left">
                <span className="text-xs text-emerald-400">ทักษะเทคโนโลยี</span>
                <p className="text-xl font-mono font-bold text-white">{stats.techSkill}/100</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                id="replay-button"
                onClick={handleRestart}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-lg shadow-cyan-500/20 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ลองเส้นทางใหม่ (Play Again)</span>
              </button>

              {onNavigateToHistory && (
                <button
                  id="go-history-button"
                  onClick={onNavigateToHistory}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-cyan-300 font-semibold border border-cyan-500/30 transition"
                >
                  <HistoryIcon className="w-4 h-4 text-cyan-400" />
                  <span>ดูประวัติการเล่น</span>
                </button>
              )}

              <button
                id="go-dashboard-button"
                onClick={onNavigateToDashboard}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 transition"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>ดูอันดับ Dashboard</span>
              </button>

              <button
                id="share-button"
                onClick={handleShareSummary}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 transition"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedNotification ? 'คัดลอกแล้ว!' : 'แชร์ผลลัพธ์'}</span>
              </button>
            </div>

            {!currentUser && (
              <div className="mt-6 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 inline-flex items-center gap-2 text-xs text-blue-300">
                <span>💡 เข้าสู่ระบบเพื่อบันทึกชื่อของคุณขึ้นบนตาราง Leaderboard อย่างเป็นทางการ</span>
                <button
                  onClick={onOpenAuthModal}
                  className="underline font-semibold hover:text-white"
                >
                  เข้าสู่ระบบเลย
                </button>
              </div>
            )}
          </div>

          {/* Timeline of decisions made */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>บันทึกเส้นทางชีวิตที่คุณได้เลือกก้าวผ่านมา</span>
            </h3>
            <div className="space-y-3">
              {historyLog.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950/80 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{item.choiceText}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        (ปี {item.year} / อายุ {item.age})
                      </span>
                    </div>
                    <p className="text-slate-300">{item.outcomeText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
};
