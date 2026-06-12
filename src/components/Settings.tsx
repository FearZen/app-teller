'use client';

import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Database, 
  FileCheck2, 
  FileText, 
  Table, 
  HelpCircle,
  Copy,
  ArrowDownToLine,
  User,
  ShieldAlert,
  Settings as SettingsIcon,
  RefreshCcw,
  CheckCircle2
} from 'lucide-react';
import { TellerSettings, DailyNote, KbArticle } from '@/types';

interface SettingsProps {
  settings: TellerSettings;
  saveSettings: (settings: TellerSettings) => void;
  dailyNotes: DailyNote[];
  kbArticles: KbArticle[];
  status: string;
  importBackup: (backupStr: string) => boolean;
  exportBackup: () => string;
}

export default function Settings({
  settings,
  saveSettings,
  dailyNotes,
  kbArticles,
  status,
  importBackup,
  exportBackup
}: SettingsProps) {

  const [activeSubTab, setActiveSubTab] = useState<'backup' | 'restore'>('backup');
  const [importStr, setImportStr] = useState('');
  const [exportStr, setExportStr] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [usernameInput, setUsernameInput] = useState(settings.username);
  
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  const handleUsernameSave = () => {
    if (!usernameInput.trim()) return;
    saveSettings({ ...settings, username: usernameInput.trim() });
    alert('Nama pengguna berhasil diperbarui!');
  };

  const handleExportClick = () => {
    const crypt = exportBackup();
    setExportStr(crypt);
    setIsCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportStr);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleImport = () => {
    const raw = importStr.trim();
    if (!raw) return;

    const success = importBackup(raw);
    if (success) {
      alert('Data berhasil dipulihkan!');
      setImportStr('');
    } else {
      alert('Gagal memulihkan data. Format kode backup tidak valid.');
    }
  };

  const simulateExportFile = (type: string) => {
    setExportLoading(type);
    setTimeout(() => {
      setExportLoading(null);
      alert(`Ekspor ${type} selesai. Berkas berhasil diunduh ke folder Downloads lokal Anda.`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Profil Pengguna Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Konfigurasi Profil</h3>
        <div className="flex flex-col md:flex-row items-end gap-4 max-w-md">
          <div className="flex flex-col gap-1.5 flex-grow">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Pengguna (Teller ID)</label>
            <div className="relative flex items-center border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:bg-white transition-all">
              <User className="absolute left-4.5 text-slate-400 h-4.5 w-4.5" />
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Contoh: BMB16100"
                className="w-full pl-11 pr-4 py-2.5 bg-transparent text-slate-900 dark:text-slate-100 font-bold text-xs outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleUsernameSave}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition"
          >
            Simpan Profil
          </button>
        </div>
      </div>

      {/* Database Backup & Restore */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Backup &amp; Pemulihan Data</h3>
        
        {/* Sub tabs selectors */}
        <div className="flex border-b border-slate-100 dark:border-slate-800/60 gap-4 mb-2">
          <button
            onClick={() => {
              setActiveSubTab('backup');
              handleExportClick();
            }}
            className={`pb-2 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'backup'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Ekspor Data
          </button>
          <button
            onClick={() => setActiveSubTab('restore')}
            className={`pb-2 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'restore'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Impor Data
          </button>
        </div>

        {/* Sub tab views */}
        {activeSubTab === 'backup' ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-400 leading-normal">
              Salin kode enkripsi di bawah untuk menyimpan backup database Catatan Harian, Knowledge Base, dan status kerja Anda.
            </p>
            <textarea
              readOnly
              value={exportStr}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono text-[10px] rounded-lg outline-none resize-none cursor-pointer"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm w-fit self-end transition"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-300" />
                  <span>Kode Backup Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4.5 w-4.5" />
                  <span>Salin Kode Backup</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-400 leading-normal">
              Tempel kode backup Anda di bawah ini untuk memulihkan seluruh data aplikasi. Peringatan: Data saat ini akan ditimpa!
            </p>
            <textarea
              value={importStr}
              onChange={(e) => setImportStr(e.target.value)}
              rows={4}
              placeholder="Tempel kode di sini..."
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-[10px] rounded-lg outline-none resize-none"
            />
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm w-fit self-end transition"
            >
              <RefreshCcw className="h-4.5 w-4.5" />
              <span>Mulai Pemulihan Data</span>
            </button>
          </div>
        )}
      </div>

      {/* Export Reports section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Ekspor Laporan Harian</h3>
        
        <div className="flex flex-col gap-2">
          {/* PDF Tile */}
          <div 
            onClick={() => simulateExportFile('PDF Laporan Harian')}
            className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800/60 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/10 cursor-pointer transition"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Export PDF Laporan Harian</h4>
                <p className="text-[10px] text-slate-400 mt-1">Unduh berkas PDF ringkasan seluruh status dan aktivitas teller.</p>
              </div>
            </div>
            {exportLoading === 'PDF Laporan Harian' ? (
              <span className="w-5 h-5 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
            ) : (
              <ArrowDownToLine className="h-5 w-5 text-slate-400 hover:text-slate-600" />
            )}
          </div>

          {/* Checklist Text Tile */}
          <div 
            onClick={() => simulateExportFile('Checklist Harian (TXT)')}
            className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800/60 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/10 cursor-pointer transition"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Export Checklist Opening/Closing</h4>
                <p className="text-[10px] text-slate-400 mt-1">Unduh data checklist opening dan closing dalam format txt.</p>
              </div>
            </div>
            {exportLoading === 'Checklist Harian (TXT)' ? (
              <span className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            ) : (
              <ArrowDownToLine className="h-5 w-5 text-slate-400 hover:text-slate-600" />
            )}
          </div>

          {/* CSV Tapes Tile */}
          <div 
            onClick={() => simulateExportFile('Catatan Harian (CSV)')}
            className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800/60 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/10 cursor-pointer transition"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                <Table className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Export Catatan Harian (CSV)</h4>
                <p className="text-[10px] text-slate-400 mt-1">Unduh riwayat kesalahan, catatan supervisor, dan temuan ke CSV.</p>
              </div>
            </div>
            {exportLoading === 'Catatan Harian (CSV)' ? (
              <span className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            ) : (
              <ArrowDownToLine className="h-5 w-5 text-slate-400 hover:text-slate-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
