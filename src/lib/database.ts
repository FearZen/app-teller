import { supabase } from './supabase';
import { TransactionCode, KbArticle, DailyNote, ChecklistItem, TellerSettings } from '@/types';
import { DEFAULT_TRANSACTIONS, DEFAULT_KB, DEFAULT_OPENING_CHECKLIST, DEFAULT_CLOSING_CHECKLIST, DEFAULT_REMINDERS } from './constants';

const SETTINGS_KEY = 'tc_settings';
const TRANSACTIONS_KEY = 'tc_transactions';
const KB_KEY = 'tc_kb';
const DAILY_NOTES_KEY = 'tc_daily_notes';
const OPENING_CHECKLIST_KEY = 'tc_opening_checklist';
const CLOSING_CHECKLIST_KEY = 'tc_closing_checklist';
const REMINDERS_KEY = 'tc_reminders';

// Safe localStorage helper
const isClient = typeof window !== 'undefined';

function getLocal<T>(key: string, defaultValue: T): T {
  if (!isClient) return defaultValue;
  const val = localStorage.getItem(key);
  if (!val) return defaultValue;
  try {
    return JSON.parse(val) as T;
  } catch (e) {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const db = {
  // --- SETTINGS ---
  async getSettings(): Promise<TellerSettings> {
    const defaultSettings: TellerSettings = { darkMode: false, username: 'Yang Mulia Ferza', drawerReserve: 1000000 };
    let local = getLocal<TellerSettings>(SETTINGS_KEY, defaultSettings);
    
    // Auto-migrate old default username in local cache
    if (local.username === 'BMB16100') {
      local.username = 'Yang Mulia Ferza';
      setLocal(SETTINGS_KEY, local);
    }
    
    if (supabase) {
      try {
        const { data, error } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
        if (data && !error) {
          let merged = { ...local, ...data };
          // Auto-migrate old username in Supabase database
          if (merged.username === 'BMB16100') {
            merged.username = 'Yang Mulia Ferza';
            await supabase.from('settings').upsert({ id: 1, ...merged });
          }
          local = merged;
          setLocal(SETTINGS_KEY, local);
        } else if (!data) {
          // Seed the settings to Supabase
          await supabase.from('settings').upsert({ id: 1, ...local });
        }
      } catch (e) {
        console.warn("Supabase settings fetch failed. Fallback to localStorage:", e);
      }
    }
    return local;
  },

  async saveSettings(settings: TellerSettings): Promise<void> {
    setLocal(SETTINGS_KEY, settings);
    if (supabase) {
      try {
        await supabase.from('settings').upsert({ id: 1, ...settings });
      } catch (e) {
        console.warn("Supabase settings save failed:", e);
      }
    }
  },

  // --- REMINDERS ---
  async getReminders(): Promise<ChecklistItem[]> {
    let local = getLocal<ChecklistItem[]>(REMINDERS_KEY, DEFAULT_REMINDERS);
    if (supabase) {
      try {
        const { data, error } = await supabase.from('reminders').select('*');
        if (data && data.length > 0 && !error) {
          local = data;
          setLocal(REMINDERS_KEY, local);
        } else if (data && data.length === 0) {
          // Seed reminders to Supabase
          await supabase.from('reminders').upsert(local);
        }
      } catch (e) {
        console.warn("Supabase reminders fetch failed. Fallback to localStorage:", e);
      }
    }
    return local;
  },

  async saveReminders(reminders: ChecklistItem[]): Promise<void> {
    setLocal(REMINDERS_KEY, reminders);
    if (supabase) {
      try {
        // Clear and insert or upsert
        await supabase.from('reminders').upsert(reminders);
      } catch (e) {
        console.warn("Supabase reminders save failed:", e);
      }
    }
  },

  // --- OPENING CHECKLIST ---
  async getOpeningChecklist(): Promise<ChecklistItem[]> {
    let local = getLocal<ChecklistItem[]>(OPENING_CHECKLIST_KEY, DEFAULT_OPENING_CHECKLIST);
    if (supabase) {
      try {
        const { data, error } = await supabase.from('opening_checklists').select('*');
        if (data && data.length > 0 && !error) {
          // Sort to match order
          local = data.sort((a, b) => a.id.localeCompare(b.id));
          setLocal(OPENING_CHECKLIST_KEY, local);
        } else if (data && data.length === 0) {
          // Seed opening checklist to Supabase
          await supabase.from('opening_checklists').upsert(local);
        }
      } catch (e) {
        console.warn("Supabase opening checklist fetch failed. Fallback to localStorage:", e);
      }
    }
    return local;
  },

  async saveOpeningChecklist(list: ChecklistItem[]): Promise<void> {
    setLocal(OPENING_CHECKLIST_KEY, list);
    if (supabase) {
      try {
        await supabase.from('opening_checklists').upsert(list);
      } catch (e) {
        console.warn("Supabase opening checklist save failed:", e);
      }
    }
  },

  // --- CLOSING CHECKLIST ---
  async getClosingChecklist(): Promise<ChecklistItem[]> {
    let local = getLocal<ChecklistItem[]>(CLOSING_CHECKLIST_KEY, DEFAULT_CLOSING_CHECKLIST);
    if (supabase) {
      try {
        const { data, error } = await supabase.from('closing_checklists').select('*');
        if (data && data.length > 0 && !error) {
          local = data.sort((a, b) => a.id.localeCompare(b.id));
          setLocal(CLOSING_CHECKLIST_KEY, local);
        } else if (data && data.length === 0) {
          // Seed closing checklist to Supabase
          await supabase.from('closing_checklists').upsert(local);
        }
      } catch (e) {
        console.warn("Supabase closing checklist fetch failed. Fallback to localStorage:", e);
      }
    }
    return local;
  },

  async saveClosingChecklist(list: ChecklistItem[]): Promise<void> {
    setLocal(CLOSING_CHECKLIST_KEY, list);
    if (supabase) {
      try {
        await supabase.from('closing_checklists').upsert(list);
      } catch (e) {
        console.warn("Supabase closing checklist save failed:", e);
      }
    }
  },

  // --- TRANSACTION CODES ---
  async getTransactions(): Promise<TransactionCode[]> {
    let local = getLocal<TransactionCode[]>(TRANSACTIONS_KEY, DEFAULT_TRANSACTIONS);
    if (supabase) {
      try {
        const { data, error } = await supabase.from('transaction_codes').select('*');
        if (data && data.length > 0 && !error) {
          local = data;
          setLocal(TRANSACTIONS_KEY, local);
        } else if (data && data.length === 0) {
          // Seed transactions to Supabase
          await supabase.from('transaction_codes').upsert(local);
        }
      } catch (e) {
        console.warn("Supabase transaction_codes fetch failed. Fallback to localStorage:", e);
      }
    }
    return local;
  },

  async saveTransactions(list: TransactionCode[]): Promise<void> {
    setLocal(TRANSACTIONS_KEY, list);
    if (supabase) {
      try {
        await supabase.from('transaction_codes').upsert(list);
      } catch (e) {
        console.warn("Supabase transaction_codes save failed:", e);
      }
    }
  },

  async addOrUpdateTransaction(tx: TransactionCode): Promise<void> {
    const list = await this.getTransactions();
    const idx = list.findIndex(t => t.code === tx.code);
    if (idx >= 0) {
      list[idx] = tx;
    } else {
      list.push(tx);
    }
    await this.saveTransactions(list);
  },

  async deleteTransaction(code: string): Promise<void> {
    let list = await this.getTransactions();
    list = list.filter(t => t.code !== code);
    await this.saveTransactions(list);
    if (supabase) {
      try {
        await supabase.from('transaction_codes').delete().eq('code', code);
      } catch (e) {
        console.warn("Supabase transaction delete failed:", e);
      }
    }
  },

  // --- KNOWLEDGE BASE ---
  async getKb(): Promise<KbArticle[]> {
    let local = getLocal<KbArticle[]>(KB_KEY, DEFAULT_KB);
    if (supabase) {
      try {
        const { data, error } = await supabase.from('knowledge_base').select('*');
        if (data && data.length > 0 && !error) {
          local = data;
          setLocal(KB_KEY, local);
        } else if (data && data.length === 0) {
          // Seed knowledge base to Supabase
          await supabase.from('knowledge_base').upsert(local);
        }
      } catch (e) {
        console.warn("Supabase knowledge_base fetch failed. Fallback to localStorage:", e);
      }
    }
    return local;
  },

  async saveKb(list: KbArticle[]): Promise<void> {
    setLocal(KB_KEY, list);
    if (supabase) {
      try {
        await supabase.from('knowledge_base').upsert(list);
      } catch (e) {
        console.warn("Supabase knowledge_base save failed:", e);
      }
    }
  },

  async addOrUpdateKb(article: KbArticle): Promise<void> {
    const list = await this.getKb();
    const idx = list.findIndex(a => a.id === article.id);
    if (idx >= 0) {
      list[idx] = article;
    } else {
      list.push(article);
    }
    await this.saveKb(list);
  },

  async deleteKb(id: string): Promise<void> {
    let list = await this.getKb();
    list = list.filter(a => a.id !== id);
    await this.saveKb(list);
    if (supabase) {
      try {
        await supabase.from('knowledge_base').delete().eq('id', id);
      } catch (e) {
        console.warn("Supabase knowledge delete failed:", e);
      }
    }
  },

  // --- DAILY NOTES ---
  async getDailyNotes(): Promise<DailyNote[]> {
    let local = getLocal<DailyNote[]>(DAILY_NOTES_KEY, []);
    if (supabase) {
      try {
        const { data, error } = await supabase.from('daily_notes').select('*');
        if (data && data.length > 0 && !error) {
          local = data.sort((a, b) => b.date.localeCompare(a.date)); // Sort newest first
          setLocal(DAILY_NOTES_KEY, local);
        } else if (data && data.length === 0 && local.length > 0) {
          // Sync existing offline notes to Supabase
          await supabase.from('daily_notes').upsert(local);
        }
      } catch (e) {
        console.warn("Supabase daily_notes fetch failed. Fallback to localStorage:", e);
      }
    }
    return local;
  },

  async saveDailyNotes(list: DailyNote[]): Promise<void> {
    setLocal(DAILY_NOTES_KEY, list);
    if (supabase) {
      try {
        await supabase.from('daily_notes').upsert(list);
      } catch (e) {
        console.warn("Supabase daily_notes save failed:", e);
      }
    }
  },

  async addDailyNote(note: DailyNote): Promise<void> {
    const list = await this.getDailyNotes();
    list.unshift(note);
    await this.saveDailyNotes(list);
  },

  async deleteDailyNote(id: string): Promise<void> {
    let list = await this.getDailyNotes();
    list = list.filter(n => n.id !== id);
    await this.saveDailyNotes(list);
    if (supabase) {
      try {
        await supabase.from('daily_notes').delete().eq('id', id);
      } catch (e) {
        console.warn("Supabase note delete failed:", e);
      }
    }
  }
};
