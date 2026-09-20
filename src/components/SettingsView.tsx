import React, { useState, useEffect } from 'react';
import { GameSettings, User } from '../types';
import { dbService } from '../services/db';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Music, 
  Type, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Sliders,
  Smartphone,
  Eye
} from 'lucide-react';

interface SettingsViewProps {
  currentUser: User | null;
  onNavigateToGame: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onNavigateToGame,
}) => {
  const [settings, setSettings] = useState<GameSettings>(dbService.getSettings());
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    setSettings(dbService.getSettings());
  }, []);

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    dbService.saveSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleResetDefaults = () => {
    const defaultSettings: GameSettings = {
      soundEnabled: true,
      musicEnabled: false,
      textSize: 'normal',
      autoScroll: true,
      themeStyle: 'cyberpunk',
    };
    setSettings(defaultSettings);
    dbService.saveSettings(defaultSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800/60 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              Game Preferences
            </span>
            {saveSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> บันทึกการตั้งค่าแล้ว
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Kanit'] text-white">
            การตั้งค่าระบบ & ประสบการณ์จำลองชีวิต
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            ปรับแต่งเสียง เอฟเฟกต์การแสดงผล ขนาดตัวอักษร และรูปแบบธีมแห่งอนาคต
          </p>
        </div>

        <button
          onClick={onNavigateToGame}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/20 text-sm transition"
        >
          กลับไปเล่นเกม
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Audio Settings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2 font-['Kanit']">
            <Volume2 className="w-5 h-5 text-cyan-400" />
            <span>การตั้งค่าเสียงและดนตรี (Audio Settings)</span>
          </h2>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-850">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">เสียงเอฟเฟกต์ (Sound Effects)</div>
                <div className="text-xs text-slate-400">เสียงกดปุ่ม เสียงตัวเลือก และเสียงสังเคราะห์</div>
              </div>
            </div>

            <button
              onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Background Ambient Synth */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-850">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">ดนตรีคลื่นแอมเบียนต์ (Ambient Drone)</div>
                <div className="text-xs text-slate-400">เสียงบรรยากาศโลกไซเบอร์ประกอบการตัดสินใจ</div>
              </div>
            </div>

            <button
              onClick={() => updateSetting('musicEnabled', !settings.musicEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.musicEnabled ? 'bg-purple-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 2: Display & Typography Settings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2 font-['Kanit']">
            <Eye className="w-5 h-5 text-emerald-400" />
            <span>การแสดงผล & ขนาดตัวอักษร (Display & Text)</span>
          </h2>

          {/* Text Size */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Type className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">ขนาดตัวอักษรเนื้อเรื่อง</div>
                  <div className="text-xs text-slate-400">ช่วยให้อ่านสถานการณ์ได้ชัดเจนยิ่งขึ้น</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => updateSetting('textSize', 'normal')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  settings.textSize === 'normal'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ขนาดมาตรฐาน (Normal)
              </button>

              <button
                onClick={() => updateSetting('textSize', 'large')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  settings.textSize === 'large'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ขนาดใหญ่ (Large Text +20%)
              </button>
            </div>
          </div>

          {/* Auto-scroll on choice */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-850">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">เลื่อนหน้าจออัตโนมัติ (Auto-scroll)</div>
                <div className="text-xs text-slate-400">เลื่อนโฟกัสไปที่ช้อยส์ถัดไปอัตโนมัติบนมือถือ</div>
              </div>
            </div>

            <button
              onClick={() => updateSetting('autoScroll', !settings.autoScroll)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.autoScroll ? 'bg-blue-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.autoScroll ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 3: Visual Theme Palette */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl md:col-span-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2 font-['Kanit']">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>สไตล์เฉดสีและบรรยากาศ (Theme Atmosphere)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Theme 1: Cyberpunk Blue */}
            <button
              onClick={() => updateSetting('themeStyle', 'cyberpunk')}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                settings.themeStyle === 'cyberpunk'
                  ? 'bg-gradient-to-br from-cyan-950/70 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-cyan-300">Cyberpunk Neon</span>
                {settings.themeStyle === 'cyberpunk' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
              <p className="text-xs text-slate-400">
                เฉดสีครามฟ้าและม่วงนีออนมาตรฐานโลกอนาคต ให้ความรู้สึกไฮเทคและแม่นยำ
              </p>
            </button>

            {/* Theme 2: Deep Sky */}
            <button
              onClick={() => updateSetting('themeStyle', 'neon_blue')}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                settings.themeStyle === 'neon_blue'
                  ? 'bg-gradient-to-br from-sky-950/70 to-slate-900 border-sky-400 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-sky-300">Deep Quantum Sky</span>
                {settings.themeStyle === 'neon_blue' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                )}
              </div>
              <p className="text-xs text-slate-400">
                เฉดสีฟ้าเข้มท้องฟ้าอวกาศ มองสบายตา เหมาะสำหรับการเล่นยาวนาน
              </p>
            </button>

            {/* Theme 3: Matrix Green */}
            <button
              onClick={() => updateSetting('themeStyle', 'matrix_green')}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                settings.themeStyle === 'matrix_green'
                  ? 'bg-gradient-to-br from-emerald-950/70 to-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-emerald-300">Matrix Synthetics</span>
                {settings.themeStyle === 'matrix_green' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <p className="text-xs text-slate-400">
                เฉดสีเขียวมรกตชีวภาพสไตล์ Terminal และ Cyber-Organic
              </p>
            </button>

          </div>
        </div>

      </div>

      {/* Account Info & Reset Settings */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400 text-center sm:text-left">
          <div>เข้าสู่ระบบในฐานะ: <span className="font-semibold text-white">{currentUser?.username || 'Guest'}</span> ({currentUser?.role === 'admin' ? 'Admin' : 'Player'})</div>
          <div className="text-[11px] text-slate-500 mt-0.5">การตั้งค่าทั้งหมดจะถูกบันทึกไว้ในเบราว์เซอร์ของคุณโดยอัตโนมัติ</div>
        </div>

        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>คืนค่าเริ่มต้นทั้งหมด (Reset Defaults)</span>
        </button>
      </div>

    </div>
  );
};
