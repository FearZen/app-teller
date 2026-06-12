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
import { ChecklistItem, TellerSettings, DailyNote, KbArticle } from '@/types';

interface SettingsProps {
  settings: TellerSettings;
  saveSettings: (settings: TellerSettings) => void;
  dailyNotes: DailyNote[];
  kbArticles: KbArticle[];
  status: string;
  importBackup: (backupStr: string) => boolean;
  exportBackup: () => string;
  openingList?: ChecklistItem[];
  closingList?: ChecklistItem[];
}

export default function Settings({
  settings,
  saveSettings,
  dailyNotes,
  kbArticles,
  status,
  importBackup,
  exportBackup,
  openingList = [],
  closingList = []
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

  const handleExportFile = (type: 'pdf' | 'txt' | 'csv') => {
    setExportLoading(type);
    setTimeout(() => {
      setExportLoading(null);
      
      try {
        if (type === 'csv') {
          // Export Daily Notes to CSV
          const csvHeaders = "Tanggal,Kategori,Judul,Catatan\n";
          const csvRows = dailyNotes.map(n => {
            const dateObj = new Date(n.date);
            const dateStr = dateObj.toLocaleDateString('id-ID') + ' ' + dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            const escapedTitle = n.title.replace(/"/g, '""');
            const escapedContent = n.content.replace(/"/g, '""');
            return `"${dateStr}","${n.category}","${escapedTitle}","${escapedContent}"`;
          }).join("\n");
          
          const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", `catatan_jurnal_teller_${new Date().toISOString().split('T')[0]}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } 
        else if (type === 'txt') {
          // Export Checklist to TXT
          let textStr = `==================================================\n`;
          textStr += `         LAPORAN CHECKLIST TELLER COPILOT          \n`;
          textStr += `==================================================\n`;
          textStr += `Nama Teller  : ${settings.username}\n`;
          textStr += `Tanggal      : ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}\n`;
          textStr += `Status Hari  : ${status.toUpperCase()}\n`;
          textStr += `==================================================\n\n`;

          textStr += `[1] OPENING CHECKLIST PROGRESS\n`;
          textStr += `--------------------------------------------------\n`;
          openingList.forEach((item, idx) => {
            const statusChar = item.checked ? '[✓]' : '[ ]';
            textStr += `${String(idx + 1).padStart(2, ' ')}. ${statusChar} ${item.title}\n`;
            if (item.note) textStr += `    * Catatan: ${item.note}\n`;
          });
          textStr += `\n`;

          textStr += `[2] CLOSING CHECKLIST PROGRESS\n`;
          textStr += `--------------------------------------------------\n`;
          closingList.forEach((item, idx) => {
            const statusChar = item.checked ? '[✓]' : '[ ]';
            textStr += `${String(idx + 1).padStart(2, ' ')}. ${statusChar} ${item.title}\n`;
            if (item.note) textStr += `    * Catatan: ${item.note}\n`;
          });
          textStr += `\n==================================================\n`;
          textStr += `Dokumen ini dicetak otomatis dari sistem Teller Copilot.\n`;

          const blob = new Blob([textStr], { type: 'text/plain;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", `checklist_harian_teller_${new Date().toISOString().split('T')[0]}.txt`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
        else if (type === 'pdf') {
          // PDF/Print report
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              <html>
                <head>
                  <title>Laporan Harian Teller - ${settings.username}</title>
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; background-color: #ffffff; }
                    h1 { border-bottom: 3px solid #2563eb; padding-bottom: 12px; color: #1e3a8a; font-size: 24px; margin-top: 0; }
                    .meta { margin-bottom: 30px; font-size: 13px; color: #64748b; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; line-height: 1.6; }
                    .meta strong { color: #334155; }
                    .section { margin-bottom: 35px; page-break-inside: avoid; }
                    .section h2 { font-size: 16px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                    th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; font-size: 11px; }
                    th { background-color: #f1f5f9; font-weight: bold; color: #475569; }
                    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 800; text-transform: uppercase; }
                    .badge-done { background: #dcfce7; color: #15803d; }
                    .badge-todo { background: #fee2e2; color: #b91c1c; }
                    .note-text { color: #64748b; font-style: italic; margin-top: 2px; display: block; }
                  </style>
                </head>
                <body>
                  <h1>Laporan Harian Teller Copilot</h1>
                  <div class="meta">
                    <strong>Nama Teller (ID):</strong> ${settings.username}<br />
                    <strong>Tanggal Cetak:</strong> ${new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}<br />
                    <strong>Status Terakhir Hari Kerja:</strong> ${status.toUpperCase()}
                  </div>
                  
                  <div class="section">
                    <h2>Progres Opening Checklist (${openingList.filter(x => x.checked).length}/${openingList.length})</h2>
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 5%">No</th>
                          <th style="width: 45%">Langkah Kegiatan</th>
                          <th style="width: 35%">Catatan Detail</th>
                          <th style="width: 15%">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        \${openingList.map((item, idx) => \`
                          <tr>
                            <td>\${idx + 1}</td>
                            <td><strong>\${item.title}</strong></td>
                            <td><span class="note-text">\${item.note || '-'}</span></td>
                            <td><span class="badge \${item.checked ? 'badge-done' : 'badge-todo'}">\${item.checked ? 'SELESAI' : 'BELUM'}</span></td>
                          </tr>
                        \`).join('')}
                      </tbody>
                    </table>
                  </div>

                  <div class="section">
                    <h2>Progres Closing Checklist (${closingList.filter(x => x.checked).length}/${closingList.length})</h2>
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 5%">No</th>
                          <th style="width: 45%">Langkah Kegiatan</th>
                          <th style="width: 35%">Catatan Detail</th>
                          <th style="width: 15%">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        \${closingList.map((item, idx) => \`
                          <tr>
                            <td>\${idx + 1}</td>
                            <td><strong>\${item.title}</strong></td>
                            <td><span class="note-text">\${item.note || '-'}</span></td>
                            <td><span class="badge \${item.checked ? 'badge-done' : 'badge-todo'}">\${item.checked ? 'SELESAI' : 'BELUM'}</span></td>
                          </tr>
                        \`).join('')}
                      </tbody>
                    </table>
                  </div>

                  <div class="section">
                    <h2>Daftar Catatan Jurnal Harian (\${dailyNotes.length})</h2>
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 15%">Waktu</th>
                          <th style="width: 15%">Kategori</th>
                          <th style="width: 25%">Judul Ringkasan</th>
                          <th style="width: 45%">Isi Catatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        \${dailyNotes.length === 0 ? \`<tr><td colspan="4" style="text-align: center; color: #94a3b8;">Belum ada catatan hari ini</td></tr>\` : 
                          dailyNotes.map(n => {
                            const dateObj = new Date(n.date);
                            const formattedTime = dateObj.toLocaleDateString('id-ID') + ' ' + dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                            return \`
                              <tr>
                                <td>\${formattedTime}</td>
                                <td><span style="font-weight: bold;">\${n.category}</span></td>
                                <td><strong>\${n.title}</strong></td>
                                <td style="white-space: pre-line;">\${n.content}</td>
                              </tr>
                            \`;
                          }).join('')
                        }
                      </tbody>
                    </table>
                  </div>
                  <script>
                    window.onload = function() {
                      window.print();
                    };
                  </script>
                </body>
              </html>
            `);
            printWindow.document.close();
          }
        }
      } catch (e) {
        console.error("Export failed:", e);
        alert("Terjadi kesalahan saat mengekspor data: " + String(e));
      }
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Profil Pengguna Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Konfigurasi Profil</h3>
        <div className="flex flex-col md:flex-row items-end gap-4 max-w-md">
          <div className="flex flex-col gap-1.5 flex-grow">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Pengguna (Teller ID)</label>
            <div className="relative flex items-center border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
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
            onClick={() => handleExportFile('pdf')}
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
            {exportLoading === 'pdf' ? (
              <span className="w-5 h-5 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
            ) : (
              <ArrowDownToLine className="h-5 w-5 text-slate-400 hover:text-slate-600" />
            )}
          </div>

          {/* Checklist Text Tile */}
          <div 
            onClick={() => handleExportFile('txt')}
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
            {exportLoading === 'txt' ? (
              <span className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            ) : (
              <ArrowDownToLine className="h-5 w-5 text-slate-400 hover:text-slate-600" />
            )}
          </div>

          {/* CSV Tapes Tile */}
          <div 
            onClick={() => handleExportFile('csv')}
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
            {exportLoading === 'csv' ? (
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
