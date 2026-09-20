export type TabType = 'game' | 'dashboard' | 'history' | 'settings' | 'members' | 'admin';

export interface PlayerStats {
  wealth: number;     // เงินทุน / ความมั่งคั่ง (0 - 100)
  happiness: number;  // ความสุข (0 - 100)
  health: number;     // สุขภาพกาย-ใจ (0 - 100)
  techSkill: number;  // ทักษะเทคโนโลยีและ AI (0 - 100)
}

export interface GameChoice {
  id: string;
  text: string;
  description?: string;
  statEffects: Partial<PlayerStats>;
  outcomeText: string;
  nextScenarioId?: string;
}

export interface Scenario {
  id: string;
  title: string;
  age: number;
  year: number;
  category: 'education' | 'career' | 'investment' | 'lifestyle' | 'crisis' | 'future_tech';
  description: string;
  backgroundTheme?: string;
  iconName: string;
  choices: GameChoice[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'player';
  avatar: string;
  bio?: string;
  playerTitle?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface GameHistoryRecord {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  endedAt: string;
  finalAge: number;
  finalYear: number;
  finalStats: PlayerStats;
  endingTitle: string;
  endingDescription: string;
  choicesCount: number;
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  textSize: 'normal' | 'large';
  autoScroll: boolean;
  themeStyle: 'cyberpunk' | 'neon_blue' | 'matrix_green';
}

export interface DatabaseConfig {
  provider: 'local_cloud_mock' | 'supabase' | 'firebase';
  supabaseUrl: string;
  supabaseAnonKey: string;
  firebaseApiKey: string;
  firebaseProjectId: string;
  status: 'connected' | 'mock_active' | 'testing';
  lastSyncedAt?: string;
}
