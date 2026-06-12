'use client';

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Menu, 
  Bot, 
  HelpCircle, 
  Keyboard, 
  CheckCircle, 
  AlertTriangle,
  Play,
  Search,
  FileCheck,
  Calculator,
  StopCircle,
  BookOpen,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Settings as SettingsIcon,
  X
} from 'lucide-react';

import { TransactionCode, KbArticle, DailyNote, ChecklistItem, TellerSettings, KlopLog } from '@/types';
import { db } from '@/lib/database';
import { supabase } from '@/lib/supabase';

// Import UI sub-components
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import OpeningWizard from '@/components/OpeningWizard';
import TellerMode from '@/components/TellerMode';
import DocChecker from '@/components/DocChecker';
import MoneyCounter from '@/components/MoneyCounter';
import ClosingWizard from '@/components/ClosingWizard';
import KnowledgeBase from '@/components/KnowledgeBase';
import DailyNotes from '@/components/DailyNotes';
import AdminPanel from '@/components/AdminPanel';
import Settings from '@/components/Settings';
import PanicButton from '@/components/PanicButton';
import AiAssistant from '@/components/AiAssistant';

export default function RootPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(sessionStorage.getItem('tc_logged_in') === 'true');
    }
    setHasHydrated(true);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_APP_PASSWORD || 'ferza123';
    if (passwordInput === correctPassword) {
      setIsLoggedIn(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tc_logged_in', 'true');
      }
      setLoginError('');
    } else {
      setLoginError('Kata sandi salah! Silakan coba lagi.');
    }
  };

  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState<'opening' | 'operational' | 'closing' | 'completed'>('opening');
  
  // Real-time Clock
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Core Database lists
  const [transactions, setTransactions] = useState<TransactionCode[]>([]);
  const [kbArticles, setKbArticles] = useState<KbArticle[]>([]);
  const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([]);
  const [openingList, setOpeningList] = useState<ChecklistItem[]>([]);
  const [closingList, setClosingList] = useState<ChecklistItem[]>([]);
  const [reminders, setReminders] = useState<ChecklistItem[]>([]);
  const [klopLogs, setKlopLogs] = useState<KlopLog[]>([]);
  
  // Settings & Reconciliations
  const [settings, setSettings] = useState<TellerSettings>({ darkMode: false, username: 'Yang Mulia Ferza', drawerReserve: 1000000 });
  const [systemCash, setSystemCash] = useState(0);
  const [physicalCash, setPhysicalCash] = useState(0);

  // Overlays
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);
  const [searchInitialFocus, setSearchInitialFocus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Success Splash popup state
  const [splashState, setSplashState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    btnLabel: string;
    onClose?: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    btnLabel: 'OK'
  });

  // 1. Initial Load Database
  useEffect(() => {
    async function loadData() {
      const dbSettings = await db.getSettings();
      setSettings(dbSettings);
      
      const dbTxs = await db.getTransactions();
      setTransactions(dbTxs);

      const dbKb = await db.getKb();
      setKbArticles(dbKb);

      const dbNotes = await db.getDailyNotes();
      setDailyNotes(dbNotes);

      const dbOpening = await db.getOpeningChecklist();
      setOpeningList(dbOpening);

      const dbClosing = await db.getClosingChecklist();
      setClosingList(dbClosing);

      const dbReminders = await db.getReminders();
      setReminders(dbReminders);

      const dbKlop = await db.getKlopLogs();
      setKlopLogs(dbKlop);

      // Determine starting status based on wizards completion
      const opComplete = dbOpening.every(x => x.checked);
      const clComplete = dbClosing.every(x => x.checked);

      if (clComplete) setStatus('completed');
      else if (dbClosing.some(x => x.checked)) setStatus('closing');
      else if (opComplete) setStatus('operational');
      else setStatus('opening');
    }
    loadData();
  }, []);

  // Sync Dark mode toggle on HTML body
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // 2. Real-time digital clock updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      setDateStr(new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        e.preventDefault();
        switch (e.key.toLowerCase()) {
          case 'a': setIsAiOpen(prev => !prev); break;
          case 'd': setActiveTab('dashboard'); break;
          case 'o': setActiveTab('opening'); break;
          case 'c': setActiveTab('closing'); break;
          case 'm': setActiveTab('money-counter'); break;
          case 'k': setActiveTab('kb'); break;
          case 'n': setActiveTab('notes'); break;
          case 'g': setActiveTab('settings'); break;
          case 's': 
            setActiveTab('teller-mode'); 
            setSearchInitialFocus(true);
            setSearchQuery('');
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 4. Checklist Steps sequential toggle controllers
  const toggleOpeningStep = useCallback((id: string, index: number) => {
    setOpeningList(prev => {
      const updated = prev.map((step, idx) => {
        if (step.id === id) {
          const isChecked = !step.checked;
          if (isChecked) {
            // Check if final step checked
            if (idx === prev.length - 1) {
              setTimeout(() => {
                setStatus('operational');
                confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
                setSplashState({
                  isOpen: true,
                  title: 'Opening Sukses! 🟢',
                  description: 'Seluruh tahapan pembukaan laci kas Anda telah selesai. Status Anda diperbarui menjadi OPERASIONAL.',
                  btnLabel: 'Mulai Bekerja',
                  onClose: () => setActiveTab('dashboard')
                });
              }, 100);
            }
            return { ...step, checked: true };
          } else {
            // Unchecking unchecks subsequent steps
            return { ...step, checked: false };
          }
        }
        
        // Disable checks if subsequent elements are touched
        if (idx > index) {
          return { ...step, checked: false };
        }
        return step;
      });

      db.saveOpeningChecklist(updated);
      
      const allChecked = updated.every(x => x.checked);
      if (allChecked) setStatus('operational');
      else setStatus('opening');

      return updated;
    });
  }, []);

  const resetOpeningList = useCallback(() => {
    const reset = openingList.map(step => ({ ...step, checked: false }));
    setOpeningList(reset);
    db.saveOpeningChecklist(reset);
    setStatus('opening');
  }, [openingList]);

  const toggleClosingStep = useCallback((id: string, index: number) => {
    setClosingList(prev => {
      const updated = prev.map((step, idx) => {
        if (step.id === id) {
          const isChecked = !step.checked;
          if (isChecked) {
            if (idx === prev.length - 1) {
              setTimeout(() => {
                setStatus('completed');
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                setSplashState({
                  isOpen: true,
                  title: 'Hari Kerja Selesai! ✅',
                  description: 'Seluruh tahapan closing telah diverifikasi klop dan aman. Terima kasih atas kerja keras Anda hari ini.',
                  btnLabel: 'Kembali Ke Dashboard',
                  onClose: () => setActiveTab('dashboard')
                });
              }, 100);
            }
            return { ...step, checked: true };
          } else {
            return { ...step, checked: false };
          }
        }
        if (idx > index) {
          return { ...step, checked: false };
        }
        return step;
      });

      db.saveClosingChecklist(updated);

      const allChecked = updated.every(x => x.checked);
      if (allChecked) setStatus('completed');
      else setStatus('closing');

      return updated;
    });
  }, []);

  const resetClosingList = useCallback(() => {
    const reset = closingList.map(step => ({ ...step, checked: false }));
    setClosingList(reset);
    db.saveClosingChecklist(reset);
    setStatus('closing');
  }, [closingList]);

  const handleReorderOpening = useCallback((newList: ChecklistItem[]) => {
    const updated = newList.map((item, idx) => ({ ...item, orderIndex: idx }));
    setOpeningList(updated);
    db.saveOpeningChecklist(updated);
  }, []);

  const handleReorderClosing = useCallback((newList: ChecklistItem[]) => {
    const updated = newList.map((item, idx) => ({ ...item, orderIndex: idx }));
    setClosingList(updated);
    db.saveClosingChecklist(updated);
  }, []);

  // Dashboard reminders
  const toggleReminder = useCallback((id: string) => {
    setReminders(prev => {
      const next = prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
      db.saveReminders(next);
      return next;
    });
  }, []);

  const resetReminders = useCallback(() => {
    setReminders(prev => {
      const next = prev.map(item => ({ ...item, checked: false }));
      db.saveReminders(next);
      return next;
    });
  }, []);

  // KB CRUD
  const handleAddOrUpdateKb = useCallback(async (art: KbArticle) => {
    await db.addOrUpdateKb(art);
    const dbKb = await db.getKb();
    setKbArticles(dbKb);
  }, []);

  const handleDeleteKb = useCallback(async (id: string) => {
    await db.deleteKb(id);
    const dbKb = await db.getKb();
    setKbArticles(dbKb);
  }, []);

  // Daily Notes CRUD
  const handleAddDailyNote = useCallback(async (note: DailyNote) => {
    await db.addDailyNote(note);
    const dbNotes = await db.getDailyNotes();
    setDailyNotes(dbNotes);
  }, []);

  const handleDeleteDailyNote = useCallback(async (id: string) => {
    await db.deleteDailyNote(id);
    const dbNotes = await db.getDailyNotes();
    setDailyNotes(dbNotes);
  }, []);

  // Settings
  const handleSaveSettings = useCallback(async (nextSettings: TellerSettings) => {
    setSettings(nextSettings);
    await db.saveSettings(nextSettings);
  }, []);

  // Admin Panel Transaction CRUD
  const handleAddOrUpdateTx = useCallback(async (tx: TransactionCode) => {
    await db.addOrUpdateTransaction(tx);
    const dbTxs = await db.getTransactions();
    setTransactions(dbTxs);
  }, []);

  const handleDeleteTx = useCallback(async (code: string) => {
    await db.deleteTransaction(code);
    const dbTxs = await db.getTransactions();
    setTransactions(dbTxs);
  }, []);

  // Klop logs CRUD
  const handleAddKlopLog = useCallback(async (log: KlopLog) => {
    await db.addKlopLog(log);
    const dbKlop = await db.getKlopLogs();
    setKlopLogs(dbKlop);
  }, []);

  const handleDeleteKlopLog = useCallback(async (id: string) => {
    await db.deleteKlopLog(id);
    const dbKlop = await db.getKlopLogs();
    setKlopLogs(dbKlop);
  }, []);

  // Backup & Restore
  const handleExportBackup = useCallback(() => {
    const payload = {
      dailyNotes,
      kbArticles,
      status,
      settings,
      reminders,
      klopLogs
    };
    return btoa(JSON.stringify(payload));
  }, [dailyNotes, kbArticles, status, settings, reminders, klopLogs]);

  const handleImportBackup = useCallback((b64Str: string) => {
    try {
      const raw = atob(b64Str);
      const parsed = JSON.parse(raw);
      
      if (parsed.dailyNotes || parsed.kbArticles) {
        if (parsed.dailyNotes) {
          setDailyNotes(parsed.dailyNotes);
          db.saveDailyNotes(parsed.dailyNotes);
        }
        if (parsed.kbArticles) {
          setKbArticles(parsed.kbArticles);
          db.saveKb(parsed.kbArticles);
        }
        if (parsed.settings) {
          setSettings(parsed.settings);
          db.saveSettings(parsed.settings);
        }
        if (parsed.reminders) {
          setReminders(parsed.reminders);
          db.saveReminders(parsed.reminders);
        }
        if (parsed.klopLogs) {
          setKlopLogs(parsed.klopLogs);
          db.saveKlopLogs(parsed.klopLogs);
        }
        if (parsed.status) {
          setStatus(parsed.status);
        }
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }, []);

  // Panic button helper selection
  const handlePanicAction = (action: 'code' | 'sop' | 'doc' | 'tx' | 'money') => {
    switch (action) {
      case 'code':
        setActiveTab('teller-mode');
        setSearchInitialFocus(true);
        setSearchQuery('');
        break;
      case 'sop':
        setActiveTab('kb');
        break;
      case 'doc':
        setActiveTab('doc-checker');
        break;
      case 'tx':
        setActiveTab('teller-mode');
        setSearchInitialFocus(true);
        setSearchQuery('angsuran'); // search common transactions
        break;
      case 'money':
        setActiveTab('money-counter');
        break;
    }
  };

  // Header Title mapping
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'opening': return 'Opening Wizard';
      case 'teller-mode': return 'Teller Mode (Pencarian SOP)';
      case 'doc-checker': return 'Doc Checker (Warkat)';
      case 'money-counter': return 'Kalkulator Uang';
      case 'closing': return 'Closing Wizard';
      case 'kb': return 'Knowledge Base';
      case 'notes': return 'Catatan Harian Jurnal';
      case 'admin': return 'Admin Panel Management';
      case 'settings': return 'Pengaturan Sistem';
      default: return 'Teller Copilot';
    }
  };

  const openingCompleted = openingList.filter(x => x.checked).length;
  const closingCompleted = closingList.filter(x => x.checked).length;

  if (!hasHydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 font-sans p-4 relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-700/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-700/10 blur-[120px]" />
        
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase animate-pulse">Memuat Sistem...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 font-sans p-4 relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-700/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-700/10 blur-[120px]" />

        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col gap-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shadow-inner animate-pulse">
              <ShieldCheck className="h-9 w-9" />
            </div>
            <h1 className="font-extrabold text-white text-2xl tracking-tight mt-2">Teller Copilot</h1>
            <p className="text-xs text-slate-400 max-w-[280px]">
              Masukkan kata sandi akses untuk membuka dashboard operasional bank.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kata Sandi Akses</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white rounded-xl text-sm font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-850"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/10 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-900/20 hover:shadow-lg cursor-pointer transition mt-2"
            >
              Masuk
            </button>
          </form>

          <div className="text-center border-t border-slate-800/60 pt-4 mt-2">
            {supabase ? (
              <p className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Mode Sinkronisasi Cloud Aktif
              </p>
            ) : (
              <p className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Mode Lokal (Offline)
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* Sidebar Nav */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        status={status}
        username={settings.username}
        darkMode={settings.darkMode}
        setDarkMode={(val) => handleSaveSettings({ ...settings, darkMode: val })}
        isCloudConnected={!!supabase}
      />

      {/* Main Workspace */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        
        {/* Header Bar */}
        <header className="h-[70px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80 px-8 flex items-center justify-between shrink-0">
          <h1 className="font-extrabold text-slate-800 dark:text-white text-lg tracking-tight">
            {getHeaderTitle()}
          </h1>
          
          <div className="flex items-center gap-4">
            {/* Clock Widget */}
            <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 px-4 py-2 rounded-xl">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{timeStr}</span>
                <span className="text-[9px] font-bold text-slate-400">{dateStr}</span>
              </div>
            </div>

            {/* Keyboard Help widget */}
            <button
              onClick={() => setIsKeyboardHelpOpen(true)}
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer transition shadow-sm"
              title="Shortcut Keyboard"
            >
              <Keyboard className="h-4.5 w-4.5" />
            </button>

            {/* AI Assistant button */}
            <button
              onClick={() => setIsAiOpen(true)}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-900/10 hover:shadow-lg cursor-pointer transition"
            >
              <Bot className="h-4 w-4" />
              <span>Tanya AI</span>
            </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard
                username={settings.username}
                status={status}
                reminders={reminders}
                toggleReminder={toggleReminder}
                resetReminders={resetReminders}
                openingProgress={openingList.length > 0 ? openingCompleted / openingList.length : 0}
                closingProgress={closingList.length > 0 ? closingCompleted / closingList.length : 0}
                openingCount={`${openingCompleted}/${openingList.length}`}
                closingCount={`${closingCompleted}/${closingList.length}`}
                dailyNotes={dailyNotes}
                transactions={transactions}
                setActiveTab={setActiveTab}
              />
            )}
            
            {activeTab === 'opening' && (
              <OpeningWizard
                checklist={openingList}
                toggleStep={toggleOpeningStep}
                resetSteps={resetOpeningList}
                onReorder={handleReorderOpening}
              />
            )}

            {activeTab === 'teller-mode' && (
              <TellerMode
                transactions={transactions}
                kbArticles={kbArticles}
                toggleFavorite={(code) => {
                  setTransactions(prev => {
                    const next = prev.map(t => t.code === code ? { ...t, isFavorite: !t.isFavorite } : t);
                    db.saveTransactions(next);
                    return next;
                  });
                }}
                initialFocus={searchInitialFocus}
                initialQuery={searchQuery}
              />
            )}

            {activeTab === 'doc-checker' && <DocChecker />}

            {activeTab === 'money-counter' && (
              <MoneyCounter
                klopLogs={klopLogs}
                addKlopLog={handleAddKlopLog}
                deleteKlopLog={handleDeleteKlopLog}
              />
            )}

            {activeTab === 'closing' && (
              <ClosingWizard
                checklist={closingList}
                toggleStep={toggleClosingStep}
                resetSteps={resetClosingList}
                systemCash={systemCash}
                setSystemCash={setSystemCash}
                physicalCash={physicalCash}
                setPhysicalCash={setPhysicalCash}
                onReorder={handleReorderClosing}
              />
            )}

            {activeTab === 'kb' && (
              <KnowledgeBase
                articles={kbArticles}
                addOrUpdateArticle={handleAddOrUpdateKb}
                deleteArticle={handleDeleteKb}
              />
            )}

            {activeTab === 'notes' && (
              <DailyNotes
                notes={dailyNotes}
                addNote={handleAddDailyNote}
                deleteNote={handleDeleteDailyNote}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPanel
                transactions={transactions}
                addOrUpdateTx={handleAddOrUpdateTx}
                deleteTx={handleDeleteTx}
              />
            )}

            {activeTab === 'settings' && (
              <Settings
                settings={settings}
                saveSettings={handleSaveSettings}
                dailyNotes={dailyNotes}
                kbArticles={kbArticles}
                status={status}
                importBackup={handleImportBackup}
                exportBackup={handleExportBackup}
                openingList={openingList}
                closingList={closingList}
                klopLogs={klopLogs}
              />
            )}
          </div>
        </main>
      </div>

      {/* ======================================================== */}
      {/* FLOATING & OVERLAY FLOATING ITEMS */}
      {/* ======================================================== */}

      {/* 1. Panic Button FAB */}
      <PanicButton onTriggerAction={handlePanicAction} />

      {/* 2. Slideout AI Chatbox */}
      <AiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        transactions={transactions}
        kbArticles={kbArticles}
      />

      {/* 3. Keyboard Shortcuts Guide Modal */}
      {isKeyboardHelpOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Shortcut Keyboard</h3>
              <button 
                onClick={() => setIsKeyboardHelpOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Akses fitur instan tanpa mouse:</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { keys: 'Alt + P', desc: 'Buka / Tutup Panic Button' },
                  { keys: 'Alt + A', desc: 'Buka / Tutup AI Assistant Chat' },
                  { keys: 'Alt + S', desc: 'Teller Mode & Fokus Kolom Cari' },
                  { keys: 'Alt + D', desc: 'Buka Halaman Dashboard' },
                  { keys: 'Alt + O', desc: 'Buka Halaman Opening Wizard' },
                  { keys: 'Alt + C', desc: 'Buka Halaman Closing Wizard' },
                  { keys: 'Alt + M', desc: 'Buka Halaman Money Counter' },
                  { keys: 'Alt + K', desc: 'Buka Halaman Knowledge Base' },
                  { keys: 'Alt + N', desc: 'Buka Halaman Catatan Harian' },
                  { keys: 'Alt + G', desc: 'Buka Halaman Pengaturan' },
                ].map(hk => (
                  <div key={hk.keys} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{hk.desc}</span>
                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-[10px] font-bold text-slate-700 dark:text-slate-200">
                      {hk.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Global Success Splash screen Modal */}
      {splashState.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-xl flex flex-col items-center gap-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-md">
              ✓
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">
              {splashState.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {splashState.description}
            </p>
            <button
              onClick={() => {
                setSplashState(prev => ({ ...prev, isOpen: false }));
                if (splashState.onClose) splashState.onClose();
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-md shadow-blue-900/10"
            >
              {splashState.btnLabel}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
