export interface TransactionCode {
  code: string;
  name: string;
  category: string;
  documents: string[];
  warning?: string;
  notes: string[];
  isFavorite: boolean;
}

export interface KbArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface DailyNote {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Error' | 'Reminder' | 'Supervisor' | 'Operasional' | 'Pribadi';
}

export interface ChecklistItem {
  id: string;
  title: string;
  checked: boolean;
  note?: string;
  warning?: string;
  type?: string;
  orderIndex?: number;
}

export interface TellerSettings {
  darkMode: boolean;
  username: string;
  drawerReserve: number;
}

export interface KlopLog {
  id: string;
  timestamp: string;
  systemCash: number;
  physicalCash: number;
  difference: number;
  status: 'klop' | 'selisih';
}
