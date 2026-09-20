import React, { useState, useEffect } from 'react';
import { User, Scenario, DatabaseConfig, GameChoice } from '../types';
import { dbService } from '../services/db';
import { testOnlineDatabaseConnection, SUPABASE_SQL_SCHEMA, FIREBASE_RULES_SCHEMA } from '../services/cloudDatabase';
import { 
  ShieldCheck, 
  Layers, 
  Users, 
  Database, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  RotateCcw, 
  Copy, 
  Activity, 
  Save, 
  Server,
  Cloud,
  FileCode,
  Sparkles
} from 'lucide-react';

interface AdminViewProps {
  currentUser: User | null;
  onNavigateToMembers: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  onNavigateToMembers
}) => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'users' | 'database' | 'backup'>('scenarios');
  
  // Data states
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(dbService.getDatabaseConfig());

  // Connection testing state
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [connTestResult, setConnTestResult] = useState<{ success: boolean; message: string; latencyMs: number } | null>(null);

  // New scenario modal/form state
  const [showAddScenarioModal, setShowAddScenarioModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  
  // New scenario inputs
  const [newTitle, setNewTitle] = useState('');
  const [newAge, setNewAge] = useState(25);
  const [newYear, setNewYear] = useState(2033);
  const [newCategory, setNewCategory] = useState<Scenario['category']>('career');
  const [newDescription, setNewDescription] = useState('');
  const [newChoice1Text, setNewChoice1Text] = useState('');
  const [newChoice1Outcome, setNewChoice1Outcome] = useState('');
  const [newChoice2Text, setNewChoice2Text] = useState('');
  const [newChoice2Outcome, setNewChoice2Outcome] = useState('');

  // Backup / Import state
  const [importJsonText, setImportJsonText] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const refreshData = () => {
    setScenarios(dbService.getScenarios());
    setUsersList(dbService.getUsers());
    setDbConfig(dbService.getDatabaseConfig());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Check admin rights
  const isAdmin = currentUser && currentUser.role === 'admin';

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newChoice1Text.trim()) {
      showNotification('error', 'กรุณากรอกหัวข้อ รายละเอียด และตัวเลือกอย่างน้อย 1 ตัวเลือก');
      return;
    }

    const choices: GameChoice[] = [
      {
        id: 'c_' + Date.now().toString(36) + '_1',
        text: newChoice1Text,
        outcomeText: newChoice1Outcome || 'การตัดสินใจของคุณนำมาซึ่งผลลัพธ์ใหม่',
        statEffects: { wealth: +15, happiness: +10, techSkill: +15 }
      }
    ];

    if (newChoice2Text.trim()) {
      choices.push({
        id: 'c_' + Date.now().toString(36) + '_2',
        text: newChoice2Text,
        outcomeText: newChoice2Outcome || 'คุณเลือกเส้นทางที่เน้นสุขภาพและสมดุล',
        statEffects: { health: +20, happiness: +15, wealth: +5 }
      });
    }

    if (editingScenario) {
      const updated: Scenario = {
        ...editingScenario,
        title: newTitle,
        age: Number(newAge),
        year: Number(newYear),
        category: newCategory,
        description: newDescription,
        choices: choices.length > 0 ? choices : editingScenario.choices
      };
      dbService.updateScenario(updated);
      showNotification('success', 'แก้ไขคำถามเรียบร้อยแล้ว');
    } else {
      const created: Scenario = {
        id: 'sc_' + Date.now().toString(36),
        title: newTitle,
        age: Number(newAge),
        year: Number(newYear),
        category: newCategory,
        description: newDescription,
        iconName: 'Sparkles',
        choices: choices
      };
      dbService.addScenario(created);
      showNotification('success', 'เพิ่มสถานการณ์จำลองใหม่สำเร็จ');
    }

    setShowAddScenarioModal(false);
    setEditingScenario(null);
    resetForm();
    refreshData();
  };

  const resetForm = () => {
    setNewTitle('');
    setNewAge(25);
    setNewYear(2033);
    setNewCategory('career');
    setNewDescription('');
    setNewChoice1Text('');
    setNewChoice1Outcome('');
    setNewChoice2Text('');
    setNewChoice2Outcome('');
  };

  const handleEditClick = (sc: Scenario) => {
    setEditingScenario(sc);
    setNewTitle(sc.title);
    setNewAge(sc.age);
    setNewYear(sc.year);
    setNewCategory(sc.category);
    setNewDescription(sc.description);
    setNewChoice1Text(sc.choices[0]?.text || '');
    setNewChoice1Outcome(sc.choices[0]?.outcomeText || '');
    setNewChoice2Text(sc.choices[1]?.text || '');
    setNewChoice2Outcome(sc.choices[1]?.outcomeText || '');
    setShowAddScenarioModal(true);
  };

  const handleDeleteScenario = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสถานการณ์นี้?')) {
      dbService.deleteScenario(id);
      refreshData();
      showNotification('success', 'ลบสถานการณ์เรียบร้อยแล้ว');
    }
  };

  const handleResetScenarios = () => {
    if (confirm('ต้องการรีเซ็ตคำถามทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      dbService.resetScenarios();
      refreshData();
      showNotification('success', 'รีเซ็ตสถานการณ์เป็นค่าเริ่มต้นเรียบร้อยแล้ว');
    }
  };

  const handleToggleUserRole = (u: User) => {
    const newRole = u.role === 'admin' ? 'player' : 'admin';
    const updated = { ...u, role: newRole as 'admin' | 'player' };
    dbService.updateUser(updated);
    refreshData();
    showNotification('success', `ปรับสิทธิ์ ${u.username} เป็น ${newRole.toUpperCase()} แล้ว`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('ต้องการลบผู้ใช้นี้ออกจากระบบหรือไม่?')) {
      const ok = dbService.deleteUser(userId);
      if (ok) {
        refreshData();
        showNotification('success', 'ลบผู้ใช้สำเร็จ');
      } else {
        showNotification('error', 'ไม่สามารถลบผู้ใช้คนสุดท้ายได้');
      }
    }
  };

  const handleSaveDbConfig = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.saveDatabaseConfig(dbConfig);
    showNotification('success', 'บันทึกการตั้งค่า Database เรียบร้อยแล้ว');
  };

  const handleTestDatabase = async () => {
    setIsTestingConn(true);
    setConnTestResult(null);

    const key = dbConfig.provider === 'supabase' ? dbConfig.supabaseAnonKey : dbConfig.firebaseApiKey;
    const url = dbConfig.provider === 'supabase' ? dbConfig.supabaseUrl : dbConfig.firebaseProjectId;

    const result = await testOnlineDatabaseConnection(dbConfig.provider, url, key);
    setIsTestingConn(false);
    setConnTestResult(result);
  };

  const handleCopySchema = (type: 'sql' | 'firebase') => {
    const content = type === 'sql' ? SUPABASE_SQL_SCHEMA : FIREBASE_RULES_SCHEMA;
    navigator.clipboard.writeText(content);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
    showNotification('success', type === 'sql' ? 'คัดลอก SQL Schema สำหรับ Supabase แล้ว' : 'คัดลอก Firestore Rules แล้ว');
  };

  const handleExportJson = () => {
    const json = dbService.exportDatabaseBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `future_life_simulator_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showNotification('success', 'ดาวน์โหลดไฟล์สำรองข้อมูล JSON เรียบร้อยแล้ว');
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) {
      showNotification('error', 'กรุณาวางโค้ด JSON ข้อมูลสำรอง');
      return;
    }
    const res = dbService.importDatabaseBackup(importJsonText);
    if (res.success) {
      refreshData();
      setImportJsonText('');
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-['Kanit'] text-white">
            เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            หน้าการตั้งค่าหลังบ้านเปิดให้เข้าถึงเฉพาะบัญชีผู้ดูแลระบบ (Admin) ที่เข้าสู่ระบบแล้วเท่านั้น
          </p>
        </div>
        <button
          onClick={onNavigateToMembers}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/20"
        >
          ไปที่หน้าระบบสมาชิก / เข้าสู่ระบบ Admin
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
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

      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-800/60 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Backend Administrator Center
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ระบบหลังบ้าน v1.2
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Kanit'] text-white">
            หน้าการตั้งค่าหลังบ้าน (Admin Dashboard)
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            จัดการคำถามและช้อยส์จำลองชีวิต, สมาชิกในระบบ, เชื่อมต่อ Database Online (Supabase / Firebase)
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            id="admin-tab-scenarios"
            onClick={() => setActiveTab('scenarios')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === 'scenarios' ? 'bg-cyan-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>คำถาม & ช้อยส์ ({scenarios.length})</span>
          </button>

          <button
            id="admin-tab-users"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === 'users' ? 'bg-cyan-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>สมาชิก ({usersList.length})</span>
          </button>

          <button
            id="admin-tab-database"
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === 'database' ? 'bg-cyan-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database Online</span>
          </button>

          <button
            id="admin-tab-backup"
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === 'backup' ? 'bg-cyan-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>สำรองข้อมูล</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Scenarios Management */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold font-['Kanit'] text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>รายการคำถามและช้อยส์จำลองชีวิต ({scenarios.length} ข้อ)</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetScenarios}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตค่าเริ่มต้น</span>
              </button>
              <button
                id="add-scenario-btn"
                onClick={() => {
                  setEditingScenario(null);
                  resetForm();
                  setShowAddScenarioModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold shadow-md shadow-cyan-500/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มข้อคำถามใหม่</span>
              </button>
            </div>
          </div>

          {/* Scenarios List */}
          <div className="space-y-3">
            {scenarios.map((sc, idx) => (
              <div 
                key={sc.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-md bg-cyan-950 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center border border-cyan-800/60">
                        {idx + 1}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-mono">
                        {sc.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        (อายุ {sc.age} ปี / ปี ค.ศ. {sc.year})
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {sc.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditClick(sc)}
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition"
                      title="แก้ไขข้อนี้"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteScenario(sc.id)}
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-700 transition"
                      title="ลบข้อนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  {sc.description}
                </p>

                {/* Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {sc.choices.map((c, cIdx) => (
                    <div key={c.id || cIdx} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800 text-xs">
                      <div className="font-medium text-cyan-200 mb-1">
                        ช้อยส์ {cIdx + 1}: {c.text}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        ผลลัพธ์: {c.outcomeText}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add / Edit Scenario Modal */}
          {showAddScenarioModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200 my-8">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <h3 className="text-lg font-bold font-['Kanit'] text-white">
                    {editingScenario ? 'แก้ไขสถานการณ์จำลอง' : 'เพิ่มสถานการณ์จำลองชีวิตใหม่'}
                  </h3>
                  <button
                    onClick={() => setShowAddScenarioModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveScenario} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      หัวข้อสถานการณ์ (Title)
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="เช่น วิกฤตพลังงานโลกครั้งใหม่"
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        อายุผู้เล่น (Age)
                      </label>
                      <input
                        type="number"
                        value={newAge}
                        onChange={(e) => setNewAge(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ปี ค.ศ. (Year)
                      </label>
                      <input
                        type="number"
                        value={newYear}
                        onChange={(e) => setNewYear(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        หมวดหมู่ (Category)
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as Scenario['category'])}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="education">การศึกษา (Education)</option>
                        <option value="career">การงาน (Career)</option>
                        <option value="investment">การเงิน (Investment)</option>
                        <option value="future_tech">เทคโนโลยี (Future Tech)</option>
                        <option value="lifestyle">วิถีชีวิต (Lifestyle)</option>
                        <option value="crisis">วิกฤต (Crisis)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      เนื้อเรื่องและคำอธิบายสถานการณ์ (Description)
                    </label>
                    <textarea
                      rows={3}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="อธิบายสิ่งที่เกิดขึ้นในโลกอนาคตช่วงเวลานั้น..."
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Choice 1 */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-cyan-300">
                      ตัวเลือกที่ 1 (Choice A)
                    </label>
                    <input
                      type="text"
                      value={newChoice1Text}
                      onChange={(e) => setNewChoice1Text(e.target.value)}
                      placeholder="เช่น เลือกเรียนคอร์ส AI ขั้นสูง"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={newChoice1Outcome}
                      onChange={(e) => setNewChoice1Outcome(e.target.value)}
                      placeholder="ผลลัพธ์: คุณได้รับความรู้ไอทีล้ำหน้า แต่เสียเงินทุนเพิ่ม"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  {/* Choice 2 */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-sky-300">
                      ตัวเลือกที่ 2 (Choice B)
                    </label>
                    <input
                      type="text"
                      value={newChoice2Text}
                      onChange={(e) => setNewChoice2Text(e.target.value)}
                      placeholder="เช่น เลือกใช้ชีวิตสงบสุขและรักษาสุขภาพ"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={newChoice2Outcome}
                      onChange={(e) => setNewChoice2Outcome(e.target.value)}
                      placeholder="ผลลัพธ์: สุขภาพร่างกายและจิตใจแข็งแรงมาก"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddScenarioModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition"
                    >
                      บันทึกสถานการณ์
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>รายชื่อสมาชิกในระบบทั้งหมด ({usersList.length} คน)</span>
            </h2>
            <span className="text-xs text-slate-400">สามารถปรับเปลี่ยนสิทธิ์ Admin / Player ได้</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-4 py-3">ผู้ใช้</th>
                  <th className="px-4 py-3">อีเมล</th>
                  <th className="px-4 py-3">ฉายา</th>
                  <th className="px-4 py-3 text-center">สิทธิ์ (Role)</th>
                  <th className="px-4 py-3 text-center">วันที่สร้าง</th>
                  <th className="px-4 py-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/80 transition">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.username}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                        />
                        <span className="font-semibold text-white">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs font-mono">{u.email}</td>
                    <td className="px-4 py-3.5 text-xs text-cyan-300 font-mono">{u.playerTitle || '-'}</td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleUserRole(u)}
                        className={`px-2.5 py-1 rounded text-xs font-bold font-mono transition ${
                          u.role === 'admin'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                            : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                        }`}
                        title="คลิกเพื่อสลับสิทธิ์ Admin / Player"
                      >
                        {u.role.toUpperCase()}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center text-xs text-slate-400 font-mono">
                      {new Date(u.createdAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="ลบผู้ใช้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Database Online Integration (Supabase / Firebase) */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          
          <div className="bg-gradient-to-r from-slate-900 to-cyan-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold font-['Kanit'] text-white mb-2 flex items-center gap-2">
              <Database className="w-6 h-6 text-cyan-400" />
              <span>การเชื่อมต่อฐานข้อมูลออนไลน์ (Online Database Connection)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              เว็บแอปพลิเคชันรองรับการเชื่อมต่อกับฐานข้อมูล Cloud ออนไลน์ระดับโลก เช่น <strong>Supabase (PostgreSQL)</strong> และ <strong>Google Firebase (Firestore)</strong> พร้อมระบบสลับการทำงานอัตโนมัติ เพื่อให้ผู้ตรวจและคุณครูสามารถประเมินผลได้ทันที
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Database Provider Settings Form */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>กำหนดค่า Provider และ API Credentials</span>
              </h3>

              <form onSubmit={handleSaveDbConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    เลือกฐานข้อมูลออนไลน์หลัก
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDbConfig({ ...dbConfig, provider: 'local_cloud_mock' })}
                      className={`p-3 rounded-xl text-left border transition ${
                        dbConfig.provider === 'local_cloud_mock'
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-semibold text-xs mb-0.5">High-Speed Cloud</div>
                      <div className="text-[10px] text-slate-400">Zero-Config Ready</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDbConfig({ ...dbConfig, provider: 'supabase' })}
                      className={`p-3 rounded-xl text-left border transition ${
                        dbConfig.provider === 'supabase'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-semibold text-xs mb-0.5">Supabase</div>
                      <div className="text-[10px] text-slate-400">PostgreSQL Cloud</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDbConfig({ ...dbConfig, provider: 'firebase' })}
                      className={`p-3 rounded-xl text-left border transition ${
                        dbConfig.provider === 'firebase'
                          ? 'bg-amber-950 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-semibold text-xs mb-0.5">Google Firebase</div>
                      <div className="text-[10px] text-slate-400">Firestore NoSQL</div>
                    </button>
                  </div>
                </div>

                {/* Supabase inputs */}
                {dbConfig.provider === 'supabase' && (
                  <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-emerald-900/40">
                    <div>
                      <label className="block text-xs font-semibold text-emerald-300 mb-1">
                        Supabase Project URL
                      </label>
                      <input
                        type="text"
                        value={dbConfig.supabaseUrl}
                        onChange={(e) => setDbConfig({ ...dbConfig, supabaseUrl: e.target.value })}
                        placeholder="https://xyzcompany.supabase.co"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-emerald-300 mb-1">
                        Supabase Anon Public Key
                      </label>
                      <input
                        type="text"
                        value={dbConfig.supabaseAnonKey}
                        onChange={(e) => setDbConfig({ ...dbConfig, supabaseAnonKey: e.target.value })}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Firebase inputs */}
                {dbConfig.provider === 'firebase' && (
                  <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-amber-900/40">
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">
                        Firebase Project ID
                      </label>
                      <input
                        type="text"
                        value={dbConfig.firebaseProjectId}
                        onChange={(e) => setDbConfig({ ...dbConfig, firebaseProjectId: e.target.value })}
                        placeholder="future-life-simulator-db"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">
                        Firebase API Key
                      </label>
                      <input
                        type="text"
                        value={dbConfig.firebaseApiKey}
                        onChange={(e) => setDbConfig({ ...dbConfig, firebaseApiKey: e.target.value })}
                        placeholder="AIzaSyA_..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleTestDatabase}
                    disabled={isTestingConn}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                  >
                    <Activity className={`w-4 h-4 text-cyan-400 ${isTestingConn ? 'animate-spin' : ''}`} />
                    <span>{isTestingConn ? 'กำลังทดสอบ...' : 'ทดสอบการเชื่อมต่อ (Test Ping)'}</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกการตั้งค่า</span>
                  </button>
                </div>
              </form>

              {/* Ping Result Display */}
              {connTestResult && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
                  connTestResult.success 
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300' 
                    : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {connTestResult.success ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                    <span>{connTestResult.success ? 'สถานะ: เชื่อมต่อสำเร็จ (Connected)' : 'สถานะ: ตรวจพบข้อผิดพลาด'}</span>
                  </div>
                  <p>{connTestResult.message}</p>
                </div>
              )}

            </div>

            {/* Ready-to-use SQL Schemas & Rules for Teacher / Evaluator */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>โค้ด SQL & Rules สำหรับขึ้นระบบ</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  นำไปรันใน Supabase SQL Editor หรือ Firebase Console เพื่อสร้างตารางฐานข้อมูลจริงได้ใน 1 คลิก
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => handleCopySchema('sql')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-emerald-900/40 text-left transition"
                  >
                    <div>
                      <div className="text-xs font-semibold text-emerald-300">Supabase SQL Schema</div>
                      <div className="text-[10px] text-slate-400">ตาราง Users, Scenarios, Game History</div>
                    </div>
                    <Copy className="w-4 h-4 text-emerald-400" />
                  </button>

                  <button
                    onClick={() => handleCopySchema('firebase')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-amber-900/40 text-left transition"
                  >
                    <div>
                      <div className="text-xs font-semibold text-amber-300">Firestore Security Rules</div>
                      <div className="text-[10px] text-slate-400">กฎความปลอดภัย & Role RBAC</div>
                    </div>
                    <Copy className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                💡 ระบบถูกออกแบบให้มี In-Memory Cache สำรอง ทำให้สามารถใช้งานได้ 100% ทันที แม้จะยังไม่ได้กรอก API Keys ของ Supabase
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 4: Backup & Export/Import */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Export */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>ส่งออกข้อมูลสำรอง (Export JSON Backup)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ดาวน์โหลดข้อมูลสมาชิกทั้งหมด สถานการณ์จำลอง ประวัติการเล่นย้อนหลัง และค่าการตั้งค่าระบบ เป็นไฟล์ JSON สมบูรณ์
            </p>
            <button
              onClick={handleExportJson}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดไฟล์ JSON สำรองข้อมูล</span>
            </button>
          </div>

          {/* Import */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>นำเข้าข้อมูลสำรอง (Import JSON Backup)</span>
            </h3>
            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="วางโค้ด JSON สำรองข้อมูลที่นี่..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:border-cyan-500 focus:outline-none resize-none"
            />
            <button
              onClick={handleImportJson}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>กู้คืนข้อมูลจาก JSON</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
