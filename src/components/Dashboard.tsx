'use client';

import React from 'react';
import { 
  Play, 
  Search, 
  FileCheck, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle,
  Bookmark,
  Calendar,
  Layers,
  ArrowRight,
  UserCheck,
  StopCircle
} from 'lucide-react';
import { ChecklistItem, TransactionCode, DailyNote } from '@/types';

interface DashboardProps {
  username: string;
  status: 'opening' | 'operational' | 'closing' | 'completed';
  reminders: ChecklistItem[];
  toggleReminder: (id: string) => void;
  resetReminders: () => void;
  openingProgress: number;
  closingProgress: number;
  openingCount: string;
  closingCount: string;
  dailyNotes: DailyNote[];
  transactions: TransactionCode[];
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({
  username,
  status,
  reminders,
  toggleReminder,
  resetReminders,
  openingProgress,
  closingProgress,
  openingCount,
  closingCount,
  dailyNotes,
  transactions,
  setActiveTab
}: DashboardProps) {

  // Statistics calculation
  const totalOpening = openingCount;
  const totalClosing = closingCount;
  
  // Count daily notes written today
  const todayStr = new Date().toISOString().split('T')[0];
  const notesCountToday = dailyNotes.filter(note => note.date.startsWith(todayStr)).length;
  
  // Count favorite transaction codes
  const favoriteCodesCount = transactions.filter(t => t.isFavorite).length;

  const getStatusColor = () => {
    switch (status) {
      case 'opening':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'operational':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'closing':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'completed':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'opening': return 'Opening';
      case 'operational': return 'Operasional';
      case 'closing': return 'Closing';
      case 'completed': return 'Selesai';
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome & Status Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Selamat Bekerja, {username}! 👋</h2>
          <p className="text-sm opacity-85 mt-2 max-w-xl">
            Teller Copilot adalah &ldquo;Second Brain&rdquo; Anda. Akses semua informasi, kalkulator, warkat bank, dan SOP kurang dari 3 detik.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3.5 rounded-xl text-left min-w-[150px] shadow-sm">
          <span className="text-[10px] font-bold opacity-75 tracking-wider block">STATUS HARI KERJA</span>
          <h3 className="text-lg font-extrabold mt-1 uppercase tracking-wide flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${status === 'completed' ? 'bg-blue-400' : status === 'closing' ? 'bg-rose-400' : status === 'operational' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
            {getStatusLabel()}
          </h3>
        </div>
      </div>

      {/* Progress Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opening Progress */}
        <div 
          onClick={() => setActiveTab('opening')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 group"
        >
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Opening Progress</span>
            <span className="font-bold text-emerald-500 text-sm">{totalOpening}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden my-3">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${openingProgress * 100}%` }} />
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-blue-500 transition-colors duration-150">
            <span>Lanjutkan Opening Wizard</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Closing Progress */}
        <div 
          onClick={() => setActiveTab('closing')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 group"
        >
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Closing Progress</span>
            <span className="font-bold text-rose-500 text-sm">{totalClosing}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden my-3">
            <div className="bg-rose-500 h-full rounded-full transition-all duration-300" style={{ width: `${closingProgress * 100}%` }} />
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-blue-500 transition-colors duration-150">
            <span>Lanjutkan Closing Wizard</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Play className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block">OPENING WIZARD</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{totalOpening}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
            <StopCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block">CLOSING WIZARD</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{totalClosing}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block">CATATAN HARI INI</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{notesCountToday} catatan</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Bookmark className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block">KODE FAVORIT</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{favoriteCodesCount} kode</span>
          </div>
        </div>
      </div>

      {/* Reminders Card (Jika belum dicentang, ada badge merah!) */}
      <div className="flex flex-col gap-3.5">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">CARD REMINDER (PENGINGAT KUNCI)</h3>
          <button 
            onClick={resetReminders}
            className="text-[11px] font-bold text-blue-500 hover:underline cursor-pointer"
          >
            Reset Checklist
          </button>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {reminders.map(item => (
              <div 
                key={item.id}
                className={`flex items-center justify-between px-6 py-3.5 transition-colors duration-150 ${
                  item.checked ? 'bg-emerald-500/[0.01]' : 'bg-rose-500/[0.01]'
                }`}
              >
                <label className="flex items-center gap-3.5 cursor-pointer select-none flex-grow py-1">
                  <input 
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleReminder(item.id)}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className={`text-sm font-medium transition-all ${
                    item.checked 
                      ? 'text-emerald-600 dark:text-emerald-400 line-through' 
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {item.title}
                  </span>
                </label>
                
                {/* Badge indicator */}
                {!item.checked && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/10">
                    <AlertTriangle className="h-3 w-3" />
                    Belum Dicentang
                  </span>
                )}
                {item.checked && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">
                    <CheckCircle2 className="h-3 w-3" />
                    OK
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Menu shortcuts */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">PINTASAN MENU CEPAT</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveTab('opening')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all duration-200 flex flex-col items-start gap-4"
          >
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Play className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Opening Wizard</h4>
          </div>

          <div 
            onClick={() => setActiveTab('teller-mode')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all duration-200 flex flex-col items-start gap-4"
          >
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
              <Search className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Teller Mode</h4>
          </div>

          <div 
            onClick={() => setActiveTab('doc-checker')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all duration-200 flex flex-col items-start gap-4"
          >
            <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-xl">
              <FileCheck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Doc Checker</h4>
          </div>

          <div 
            onClick={() => setActiveTab('money-counter')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all duration-200 flex flex-col items-start gap-4"
          >
            <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <Calculator className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Kalkulator Uang</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
