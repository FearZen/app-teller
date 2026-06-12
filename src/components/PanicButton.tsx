'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, BookOpen, FileCheck, HelpCircle, Calculator, X } from 'lucide-react';

interface PanicButtonProps {
  onTriggerAction: (action: 'code' | 'sop' | 'doc' | 'tx' | 'money') => void;
}

export default function PanicButton({ onTriggerAction }: PanicButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcut listener: Alt + P triggers the Panic button!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleActionClick = (action: 'code' | 'sop' | 'doc' | 'tx' | 'money') => {
    onTriggerAction(action);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Panic Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs tracking-wider uppercase px-5 py-3 rounded-full shadow-lg shadow-rose-600/30 panic-pulse cursor-pointer border-none z-50 relative transition-transform hover:scale-105"
        title="Panic Button (Alt+P)"
      >
        {isOpen ? <X className="h-4.5 w-4.5 text-white" /> : <AlertTriangle className="h-4.5 w-4.5 text-white" />}
        <span>{isOpen ? 'Tutup' : 'PANIC'}</span>
      </button>

      {/* Panic Menu Bottom Sheet / Popup */}
      {isOpen && (
        <>
          {/* Backdrop mask */}
          <div 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-30"
          />
          
          {/* Action List panel */}
          <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-slate-900 border border-rose-500/30 dark:border-rose-500/20 rounded-2xl shadow-xl p-5 flex flex-col gap-3.5 z-40 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center gap-2.5 text-rose-600 border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <AlertTriangle className="h-5 w-5 animate-bounce" />
              <h3 className="font-extrabold text-xs tracking-wider uppercase">PANIC BUTTON - QUICK HELPER</h3>
            </div>
            
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-1">
              Menu bantuan darurat teller. Dapatkan informasi instan saat antrean nasabah ramai:
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleActionClick('code')}
                className="flex items-center gap-3 px-4 py-2.5 bg-rose-500/5 hover:bg-rose-600 border border-rose-500/20 text-rose-600 hover:text-white rounded-xl text-xs font-bold text-left cursor-pointer transition-all duration-150"
              >
                <Search className="h-4 w-4 shrink-0" />
                <span>1. Cari Kode Transaksi</span>
              </button>

              <button
                onClick={() => handleActionClick('sop')}
                className="flex items-center gap-3 px-4 py-2.5 bg-rose-500/5 hover:bg-rose-600 border border-rose-500/20 text-rose-600 hover:text-white rounded-xl text-xs font-bold text-left cursor-pointer transition-all duration-150"
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>2. Cari SOP Ketentuan</span>
              </button>

              <button
                onClick={() => handleActionClick('doc')}
                className="flex items-center gap-3 px-4 py-2.5 bg-rose-500/5 hover:bg-rose-600 border border-rose-500/20 text-rose-600 hover:text-white rounded-xl text-xs font-bold text-left cursor-pointer transition-all duration-150"
              >
                <FileCheck className="h-4 w-4 shrink-0" />
                <span>3. Cari Panduan Dokumen</span>
              </button>

              <button
                onClick={() => handleActionClick('tx')}
                className="flex items-center gap-3 px-4 py-2.5 bg-rose-500/5 hover:bg-rose-600 border border-rose-500/20 text-rose-600 hover:text-white rounded-xl text-xs font-bold text-left cursor-pointer transition-all duration-150"
              >
                <HelpCircle className="h-4 w-4 shrink-0" />
                <span>4. Cari Detail Transaksi</span>
              </button>

              <button
                onClick={() => handleActionClick('money')}
                className="flex items-center gap-3 px-4 py-2.5 bg-rose-500/5 hover:bg-rose-600 border border-rose-500/20 text-rose-600 hover:text-white rounded-xl text-xs font-bold text-left cursor-pointer transition-all duration-150"
              >
                <Calculator className="h-4 w-4 shrink-0" />
                <span>5. Money Counter (Kalkulator)</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
