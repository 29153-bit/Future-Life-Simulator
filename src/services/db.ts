import { User, Scenario, GameHistoryRecord, DatabaseConfig, PlayerStats, GameSettings } from '../types';
import { INITIAL_SCENARIOS } from '../data/initialScenarios';

const STORAGE_KEYS = {
  USERS: 'fls_users_v1',
  CURRENT_USER: 'fls_current_user_v1',
  SCENARIOS: 'fls_scenarios_v1',
  HISTORY: 'fls_history_v1',
  DB_CONFIG: 'fls_db_config_v1',
  SETTINGS: 'fls_settings_v1',
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: false,
  textSize: 'normal',
  autoScroll: true,
  themeStyle: 'cyberpunk',
};

// Initial Seed Users (Admin & Demo Player)
const DEFAULT_USERS: User[] = [
  {
    id: 'usr_admin',
    username: 'admin',
    email: 'admin@futurelife.dev',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'ผู้ดูแลระบบสูงสุด Future Life Simulator',
    playerTitle: 'Cyber Administrator',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'usr_player1',
    username: 'Sirapop_AI',
    email: 'sirapop@student.ac.th',
    role: 'player',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'ผู้เล่นมุ่งมั่นสายเทคโนโลยีและควอนตัม',
    playerTitle: 'AI Pioneer',
    createdAt: '2026-02-15T10:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'usr_player2',
    username: 'Kittipat_Green',
    email: 'kittipat@eco.future',
    role: 'player',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    bio: 'นักฟื้นฟูโลกและเกษตรอัจฉริยะ',
    playerTitle: 'Green Earth Hero',
    createdAt: '2026-03-01T12:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
  }
];

// Initial Seed Leaderboard
const DEFAULT_HISTORY: GameHistoryRecord[] = [
  {
    id: 'rec_01',
    userId: 'usr_player1',
    username: 'Sirapop_AI',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    endedAt: '2026-03-15T14:30:00.000Z',
    finalAge: 65,
    finalYear: 2073,
    finalStats: { wealth: 95, happiness: 85, health: 70, techSkill: 98 },
    endingTitle: 'มหาเศรษฐีผู้บุกเบิกควอนตัมและอวกาศ (Quantum Space Tycoon)',
    endingDescription: 'สร้างอาณาจักรเทคโนโลยีที่เชื่อมโลกกับอวกาศ มีความมั่งคั่งและปัญญาสูงส่ง',
    choicesCount: 6,
    score: 348,
    grade: 'S'
  },
  {
    id: 'rec_02',
    userId: 'usr_player2',
    username: 'Kittipat_Green',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    endedAt: '2026-03-16T09:15:00.000Z',
    finalAge: 65,
    finalYear: 2073,
    finalStats: { wealth: 75, happiness: 96, health: 92, techSkill: 65 },
    endingTitle: 'ปราชญ์แห่งผืนป่าและผู้เยียวยาโลก (Earth Healer Sage)',
    endingDescription: 'เลือกความสุขที่แท้จริง สุขภาพแข็งแรงยืนยาว และได้รับการจารึกเป็นผู้นำด้านสิ่งแวดล้อม',
    choicesCount: 6,
    score: 328,
    grade: 'A'
  },
  {
    id: 'rec_03',
    userId: 'usr_admin',
    username: 'admin',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    endedAt: '2026-03-14T18:00:00.000Z',
    finalAge: 65,
    finalYear: 2073,
    finalStats: { wealth: 88, happiness: 82, health: 80, techSkill: 90 },
    endingTitle: 'สถาปนิกไซเบอร์ผู้สร้างรากฐานยุคใหม่ (Cyber Architect)',
    endingDescription: 'สมดุลระหว่างปัญญา ความมั่งคั่ง และการปกครองระบบไอทีแห่งอนาคต',
    choicesCount: 6,
    score: 340,
    grade: 'S'
  }
];

const DEFAULT_DB_CONFIG: DatabaseConfig = {
  provider: 'local_cloud_mock',
  supabaseUrl: 'https://xyzcompany.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.mock_key',
  firebaseApiKey: 'AIzaSyA_Mock_Key_For_Evaluation_Only',
  firebaseProjectId: 'future-life-simulator-db',
  status: 'mock_active',
  lastSyncedAt: new Date().toISOString()
};

// Safe storage getters and setters
export const dbService = {
  // --- USERS & AUTH ---
  getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USERS;
    }
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      // Auto login as default demo student player on first launch
      const users = this.getUsers();
      const defaultUser = users[1] || users[0];
      if (defaultUser) {
        this.setCurrentUser(defaultUser);
        return defaultUser;
      }
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  login(usernameOrEmail: string, _password?: string): { success: boolean; user?: User; message: string } {
    const users = this.getUsers();
    const query = usernameOrEmail.trim().toLowerCase();
    const found = users.find(u => u.username.toLowerCase() === query || u.email.toLowerCase() === query);

    if (!found) {
      return { success: false, message: 'ไม่พบชื่อผู้ใช้หรืออีเมลนี้ในระบบ' };
    }

    found.lastLoginAt = new Date().toISOString();
    this.updateUser(found);
    this.setCurrentUser(found);
    return { success: true, user: found, message: 'เข้าสู่ระบบสำเร็จ' };
  },

  register(username: string, email: string, role: 'admin' | 'player' = 'player'): { success: boolean; user?: User; message: string } {
    const users = this.getUsers();
    const uClean = username.trim();
    const eClean = email.trim().toLowerCase();

    if (!uClean || !eClean) {
      return { success: false, message: 'กรุณากรอกชื่อผู้ใช้และอีเมลให้ครบถ้วน' };
    }

    if (users.some(u => u.username.toLowerCase() === uClean.toLowerCase())) {
      return { success: false, message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' };
    }

    if (users.some(u => u.email.toLowerCase() === eClean)) {
      return { success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' };
    }

    const newUser: User = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      username: uClean,
      email: eClean,
      role: role,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(uClean)}`,
      bio: 'ผู้เล่นใหม่แห่งโลกอนาคต',
      playerTitle: 'Future Explorer',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);

    return { success: true, user: newUser, message: 'สมัครสมาชิกสำเร็จและเข้าสู่ระบบแล้ว' };
  },

  updateUser(updated: User): void {
    const users = this.getUsers().map(u => u.id === updated.id ? updated : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    const current = this.getCurrentUser();
    if (current && current.id === updated.id) {
      this.setCurrentUser(updated);
    }
  },

  deleteUser(userId: string): boolean {
    let users = this.getUsers();
    if (users.length <= 1) return false;
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    const cur = this.getCurrentUser();
    if (cur && cur.id === userId) {
      this.setCurrentUser(users[0] || null);
    }
    return true;
  },

  // --- SCENARIOS (SIMULATION QUESTIONS & CHOICES) ---
  getScenarios(): Scenario[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SCENARIOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(INITIAL_SCENARIOS));
      return INITIAL_SCENARIOS;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SCENARIOS;
    } catch {
      return INITIAL_SCENARIOS;
    }
  },

  saveScenarios(scenarios: Scenario[]): void {
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(scenarios));
  },

  resetScenarios(): Scenario[] {
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(INITIAL_SCENARIOS));
    return INITIAL_SCENARIOS;
  },

  addScenario(sc: Scenario): void {
    const list = this.getScenarios();
    list.push(sc);
    this.saveScenarios(list);
  },

  updateScenario(updated: Scenario): void {
    const list = this.getScenarios().map(s => s.id === updated.id ? updated : s);
    this.saveScenarios(list);
  },

  deleteScenario(id: string): void {
    const list = this.getScenarios().filter(s => s.id !== id);
    this.saveScenarios(list);
  },

  // --- GAME HISTORY & LEADERBOARD ---
  getHistory(): GameHistoryRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(DEFAULT_HISTORY));
      return DEFAULT_HISTORY;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_HISTORY;
    }
  },

  saveGameRecord(record: GameHistoryRecord): void {
    const history = this.getHistory();
    history.unshift(record);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  clearHistory(): void {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
  },

  // --- DATABASE CONFIGURATION & CONNECTORS ---
  getDatabaseConfig(): DatabaseConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.DB_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DB_CONFIG, JSON.stringify(DEFAULT_DB_CONFIG));
      return DEFAULT_DB_CONFIG;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_DB_CONFIG;
    }
  },

  saveDatabaseConfig(config: DatabaseConfig): void {
    config.lastSyncedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.DB_CONFIG, JSON.stringify(config));
  },

  // --- GAME SETTINGS ---
  getSettings(): GameSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: GameSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  exportDatabaseBackup(): string {
    const backup = {
      users: this.getUsers(),
      scenarios: this.getScenarios(),
      history: this.getHistory(),
      config: this.getDatabaseConfig(),
      exportedAt: new Date().toISOString(),
      app: 'Future Life Simulator'
    };
    return JSON.stringify(backup, null, 2);
  },

  importDatabaseBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (data.users) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
      if (data.scenarios) localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(data.scenarios));
      if (data.history) localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
      if (data.config) localStorage.setItem(STORAGE_KEYS.DB_CONFIG, JSON.stringify(data.config));
      return { success: true, message: 'นำเข้าฐานข้อมูลสำเร็จ เรียบร้อยแล้ว' };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return { success: false, message: 'ไฟล์ข้อมูล JSON ไม่ถูกต้อง: ' + errorMessage };
    }
  },

  // Utility to calculate end-game grade & title
  evaluateEnding(stats: PlayerStats): { title: string; description: string; score: number; grade: 'S' | 'A' | 'B' | 'C' | 'D' } {
    const score = Math.round(stats.wealth + stats.happiness + stats.health + stats.techSkill);
    let grade: 'S' | 'A' | 'B' | 'C' | 'D' = 'C';
    let title = 'ผู้มีชีวิตเรียบง่ายในยุคอนาคต';
    let description = 'คุณใช้ชีวิตผ่านช่วงเวลาแห่งความผันผวนได้อย่างราบรื่น มีสุขและทุกข์ปะปนกันตามวิถีทาง';

    if (score >= 320) {
      grade = 'S';
      if (stats.techSkill >= 80 && stats.wealth >= 75) {
        title = 'มหาเศรษฐีไซเบอร์ & ผู้นำโลกดิจิทัล (Cyber Titan)';
        description = 'คุณประสบความสำเร็จสูงสุดในฐานะผู้สร้างนวัตกรรมระดับโลก ทรัพย์สินมหาศาล และเป็นที่ยกย่องของอนุชนรุ่นหลัง';
      } else if (stats.happiness >= 85 && stats.health >= 85) {
        title = 'ปราชญ์ผู้บรรลุความสุขอันบริสุทธิ์ (Enlightened Pioneer)';
        description = 'คุณค้นพบสมดุลชีวิตที่สมบูรณ์แบบ ร่างกายแข็งแรง จิตใจเบิกบาน มั่งคั่งด้วยมิตรภาพและความรัก';
      } else {
        title = 'ตำนานผู้พิชิตอนาคต (Future Legend)';
        description = 'คุณทำคะแนนระดับสุดยอดรอบด้าน กลายเป็นหนึ่งในบุคคลต้นแบบแห่งศตวรรษที่ 21';
      }
    } else if (score >= 260) {
      grade = 'A';
      if (stats.wealth >= 70) {
        title = 'นักลงทุนมือทองแห่งยุค AI (AI Wealth Strategist)';
        description = 'บริหารสินทรัพย์ได้อย่างชาญฉลาด มีเสถียรภาพทางการเงินระดับสูงมาก';
      } else {
        title = 'ผู้บุกเบิกชีวิตวิถีใหม่ (Adaptive Trailblazer)';
        description = 'ก้าวทันเทคโนโลยีและรักษาความสุขไว้ได้อย่างน่าชื่นชม';
      }
    } else if (score >= 200) {
      grade = 'B';
      title = 'พลเมืองคนเก่งแห่งโลกอนาคต (Skilled Citizen)';
      description = 'ปรับตัวเข้ากับคลื่นความเปลี่ยนแปลงได้ดี มีทักษะชีวิตที่มั่นคง';
    } else if (score >= 140) {
      grade = 'C';
      title = 'ผู้เอาชีวิตรอดจากคลื่นเทคโนโลยี (Resilient Survivor)';
      description = 'แม้จะเผชิญกับอุปสรรคหลายด้าน แต่คุณก็ฟันฝ่ามาจนถึงบั้นปลายชีวิตได้';
    } else {
      grade = 'D';
      title = 'บทเรียนชีวิตแห่งความพยายาม (Striving Challenger)';
      description = 'ชีวิตเต็มไปด้วยบททดสอบที่ท้าทาย แต่ทุกการตัดสินใจคือบทเรียนอันล้ำค่า';
    }

    return { title, description, score, grade };
  }
};
