'use client';

import React, { useState } from 'react';
import { 
  Info, 
  ChevronDown, 
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  FileCheck2
} from 'lucide-react';

interface DocChecks {
  [key: string]: boolean[];
}

export default function DocChecker() {
  const categories = [
    {
      id: 'cek-mandiri',
      title: 'CEK MANDIRI',
      icon: '🏛',
      color: 'text-blue-500',
      checklist: [
        'Fotokopi KTP Penarik',
        'Verifikasi Tanda Tangan',
        'Stempel SV (Supervisor)',
        'Paraf Pejabat/Teller',
        'Stempel Lunas'
      ]
    },
    {
      id: 'cek-bank-lain',
      title: 'CEK BANK LAIN',
      icon: '💵',
      color: 'text-rose-500',
      warning: [
        'Jangan dicoret',
        'Jangan distempel',
        'Jangan ditulis apapun di bagian depan warkat!'
      ],
      checklist: [
        'Verifikasi Nominal',
        'Verifikasi Keaslian'
      ]
    },
    {
      id: 'slip-oranye',
      title: 'SLIP ORANYE',
      icon: '📙',
      color: 'text-orange-500',
      checklist: [
        'Fotokopi KTP',
        'Fotokopi ATM',
        'Fotokopi Buku Tabungan',
        'Verifikasi Tanda Tangan'
      ]
    },
    {
      id: 'rtgs',
      title: 'RTGS (Di atas 100 Juta)',
      icon: '⚡',
      color: 'text-purple-500',
      note: 'Catatan: Biasanya untuk nominal transaksi di atas 100 juta rupiah.',
      checklist: [
        'Fotokopi KTP',
        '2 Materai (Sudah ditempel & ditandatangani)',
        'Verifikasi Data'
      ]
    },
    {
      id: 'skn',
      title: 'SKN (Di bawah 100 Juta)',
      icon: '📅',
      color: 'text-indigo-500',
      note: 'Catatan: Biasanya untuk nominal transaksi di bawah 100 juta rupiah.',
      checklist: [
        'Verifikasi Data'
      ]
    }
  ];

  // Initialize checks state
  const [checks, setChecks] = useState<DocChecks>(() => {
    const initial: DocChecks = {};
    categories.forEach(cat => {
      initial[cat.id] = Array(cat.checklist.length).fill(false);
    });
    return initial;
  });

  const [openAccordion, setOpenAccordion] = useState<string | null>('cek-mandiri');

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const toggleCheck = (catId: string, idx: number) => {
    setChecks(prev => {
      const updated = [...prev[catId]];
      updated[idx] = !updated[idx];
      return { ...prev, [catId]: updated };
    });
  };

  const resetCategoryChecks = (catId: string) => {
    setChecks(prev => ({
      ...prev,
      [catId]: Array(prev[catId].length).fill(false)
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Description Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-4.5 rounded-2xl text-blue-600 dark:text-blue-400 text-xs flex gap-3 font-medium">
        <Info className="h-5 w-5 flex-shrink-0" />
        <p>
          Gunakan panduan checklist dokumen di bawah ini sebelum mengeksekusi warkat fisik. Pastikan kelengkapan berkas fisik nasabah sesuai dengan SOP operasional.
        </p>
      </div>

      {/* Accordion List */}
      <div className="flex flex-col gap-4">
        {categories.map(cat => {
          const isOpen = openAccordion === cat.id;
          const isComplete = checks[cat.id].every(x => x);
          
          return (
            <div 
              key={cat.id} 
              className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${
                isOpen ? 'border-blue-500 dark:border-blue-500/50' : 'border-slate-200 dark:border-slate-800/80'
              }`}
            >
              {/* Accordion Title Header */}
              <div 
                onClick={() => toggleAccordion(cat.id)}
                className="p-5 flex justify-between items-center cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{cat.title}</h4>
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${isComplete ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {isComplete ? 'LENGKAP (OK)' : 'BELUM LENGKAP'}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
              </div>

              {/* Accordion Expand Content */}
              {isOpen && (
                <div className="border-t border-slate-100 dark:border-slate-800/60 p-5 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-150">
                  {/* Warning Box */}
                  {cat.warning && (
                    <div className="bg-rose-500/10 dark:bg-rose-500/5 border border-rose-500/30 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
                        <AlertOctagon className="h-4 w-4" />
                        PENTING: KETENTUAN WARKAT CEK BANK LAIN!
                      </div>
                      <div className="flex flex-col gap-1.5 font-bold text-xs pl-6">
                        {cat.warning.map((w, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>{w}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes Block */}
                  {cat.note && (
                    <div className="bg-blue-50 dark:bg-blue-900/10 px-4 py-2.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {cat.note}
                    </div>
                  )}

                  {/* Checklist wrapper */}
                  <div className="flex flex-col gap-1">
                    {cat.checklist.map((item, idx) => {
                      const isChecked = checks[cat.id][idx];
                      return (
                        <label 
                          key={item} 
                          className="flex items-center gap-3.5 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/20"
                        >
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCheck(cat.id, idx)}
                            className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`text-xs font-medium ${isChecked ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Reset action row */}
                  <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <button
                      onClick={() => resetCategoryChecks(cat.id)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset Checklist
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
