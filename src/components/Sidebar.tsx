'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Play, 
  Search, 
  FileCheck, 
  Calculator, 
  StopCircle, 
  BookOpen, 
  FileText, 
  ShieldAlert, 
  Settings,
  Sun,
  Moon,
  ShieldCheck,
  Activity,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  status: 'opening' | 'operational' | 'closing' | 'completed';
  username: string;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  status,
  username,
  darkMode,
  setDarkMode
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'opening', label: 'Opening Wizard', icon: Play },
    { id: 'teller-mode', label: 'Teller Mode', icon: Search },
    { id: 'doc-checker', label: 'Doc Checker', icon: FileCheck },
    { id: 'money-counter', label: 'Money Counter', icon: Calculator },
    { id: 'closing', label: 'Closing Wizard', icon: StopCircle },
    { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
    { id: 'notes', label: 'Catatan Harian', icon: FileText },
    { id: 'admin', label: 'Admin Panel', icon: ShieldAlert },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const getStatusDetails = () => {
    switch (status) {
      case 'opening':
        return { label: 'Opening', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', dot: 'bg-emerald-500' };
      case 'operational':
        return { label: 'Operasional', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', dot: 'bg-amber-500' };
      case 'closing':
        return { label: 'Closing', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20', dot: 'bg-rose-500' };
      case 'completed':
        return { label: 'Hari Selesai', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', dot: 'bg-blue-500' };
    }
  };

  const statusInfo = getStatusDetails();

  return (
    <aside className="w-72 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col flex-shrink-0 border-r border-slate-200 dark:border-slate-800 z-10 transition-all duration-300">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/60">
        <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-500" />
        <div className="flex flex-col">
          <h2 className="font-bold text-base tracking-wide text-slate-900 dark:text-white leading-tight">Teller Copilot</h2>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">Banking Assistant</span>
        </div>
      </div>
      
      {/* User Status Profile */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/40 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">User: {username}</span>
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider w-fit ${statusInfo.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} animate-pulse`} />
          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-grow p-4 flex flex-col gap-1.5 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/10'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer with Theme Toggle */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/60">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center justify-center gap-3 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors duration-200"
        >
          {darkMode ? (
            <>
              <Sun className="h-4 w-4 text-amber-500" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-blue-400" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
