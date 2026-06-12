'use client';

import React, { useState, useEffect } from 'react';
import { Coins, Trash2, ShieldCheck, Scale, AlertOctagon } from 'lucide-react';

export default function MoneyCounter() {
  const [activeTab, setActiveTab] = useState<'pecahan' | '50k' | 'kas-naik' | 'kas-kecil'>('pecahan');
  const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  const formatRupiah = (val: number) => currencyFormatter.format(val).replace(/,00$/, '');

  const denominations = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100];

  // TAB 1 State: Pecahan
  const [tab1Qtys, setTab1Qtys] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    denominations.forEach(den => initial[den] = '');
    return initial;
  });

  const tab1Total = Object.keys(tab1Qtys).reduce((sum, denStr) => {
    const den = parseInt(denStr);
    const qty = parseInt(tab1Qtys[den]) || 0;
    return sum + (den * qty);
  }, 0);

  const resetTab1 = () => {
    const next: Record<number, string> = {};
    denominations.forEach(den => next[den] = '');
    setTab1Qtys(next);
  };

  // TAB 2 State: 50K Quick Tally
  const [tab2Qty, setTab2Qty] = useState('');
  const tab2Total = (parseInt(tab2Qty) || 0) * 50000;

  // TAB 3 State: Kas Naik (100k, 50k, 20k, 10k, 5k)
  const kasNaikDenominations = [100000, 50000, 20000, 10000, 5000];
  const [tab3Qtys, setTab3Qtys] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    kasNaikDenominations.forEach(den => initial[den] = '');
    return initial;
  });

  const tab3Total = Object.keys(tab3Qtys).reduce((sum, denStr) => {
    const den = parseInt(denStr);
    const qty = parseInt(tab3Qtys[den]) || 0;
    return sum + (den * qty);
  }, 0);

  const resetTab3 = () => {
    const next: Record<number, string> = {};
    kasNaikDenominations.forEach(den => next[den] = '');
    setTab3Qtys(next);
  };

  // TAB 4 State: Kas Kecil
  const [tab4Input, setTab4Input] = useState('');
  
  const getTab4Calculations = () => {
    const total = parseFloat(tab4Input) || 0;
    const rounded = Math.floor(total / 100) * 100;
    const sisa = total - rounded;
    
    // Naik Kas = rounded balance above 1,000,000 drawer reserve
    const reserve = 1000000;
    const naik = rounded > reserve ? rounded - reserve : 0;
    
    return { rounded, sisa, naik };
  };

  const { rounded: tab4Rounded, sisa: tab4Sisa, naik: tab4Naik } = getTab4Calculations();

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pecahan')}
          className={`px-5 py-3 text-xs font-bold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'pecahan'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Kalkulator Pecahan
        </button>
        <button
          onClick={() => setActiveTab('50k')}
          className={`px-5 py-3 text-xs font-bold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === '50k'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Quick 50K Tally
        </button>
        <button
          onClick={() => setActiveTab('kas-naik')}
          className={`px-5 py-3 text-xs font-bold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'kas-naik'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Naik Kas (BOS)
        </button>
        <button
          onClick={() => setActiveTab('kas-kecil')}
          className={`px-5 py-3 text-xs font-bold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'kas-kecil'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Kas Kecil & Pembulatan
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        
        {/* TAB 1: Pecahan */}
        {activeTab === 'pecahan' && (
          <div className="flex flex-col">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-center text-white">
              <span className="text-[10px] font-bold opacity-80 tracking-wider uppercase block">TOTAL KAS DIHITUNG</span>
              <h2 className="text-3xl font-extrabold mt-1">{formatRupiah(tab1Total)}</h2>
            </div>

            <div className="p-6 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[50vh] overflow-y-auto">
              {denominations.map(den => (
                <div key={den} className="grid grid-cols-12 items-center gap-4 py-3.5">
                  <span className="col-span-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                    {formatRupiah(den)}
                  </span>
                  <span className="col-span-1 text-slate-400 text-center text-xs">x</span>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={tab1Qtys[den]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTab1Qtys(prev => ({ ...prev, [den]: val }));
                      }}
                      placeholder="0"
                      min="0"
                      className="w-full text-center px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                    />
                  </div>
                  <span className={`col-span-4 text-right text-xs font-bold ${
                    parseInt(tab1Qtys[den]) > 0 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-slate-400 dark:text-slate-600'
                  }`}>
                    {formatRupiah(den * (parseInt(tab1Qtys[den]) || 0))}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 flex justify-end">
              <button
                onClick={resetTab1}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Input
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: 50K Quick Tally */}
        {activeTab === '50k' && (
          <div className="flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center text-white">
              <span className="text-[10px] font-bold opacity-80 tracking-wider uppercase block">NOMINAL Rp50.000 TERHITUNG</span>
              <h2 className="text-3xl font-extrabold mt-1">{formatRupiah(tab2Total)}</h2>
            </div>
            
            <div className="p-8 max-w-sm mx-auto w-full flex flex-col gap-6 text-center">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Jumlah Lembar Pecahan 50.000</label>
                <input
                  type="number"
                  value={tab2Qty}
                  onChange={(e) => setTab2Qty(e.target.value)}
                  placeholder="Masukkan lembar (e.g. 37)"
                  min="0"
                  className="w-full text-center py-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-extrabold text-2xl rounded-2xl outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              {parseInt(tab2Qty) > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 p-4 rounded-xl text-xs font-bold border border-blue-100 dark:border-blue-900/20">
                  {tab2Qty} lembar x Rp50.000 = {formatRupiah(tab2Total)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Kas Naik */}
        {activeTab === 'kas-naik' && (
          <div className="flex flex-col">
            <div className="bg-gradient-to-r from-amber-600 to-rose-700 p-6 text-center text-white">
              <span className="text-[10px] font-bold opacity-80 tracking-wider uppercase block">TOTAL KAS NAIK KE BOS</span>
              <h2 className="text-3xl font-extrabold mt-1">{formatRupiah(tab3Total)}</h2>
            </div>

            <div className="p-6 divide-y divide-slate-100 dark:divide-slate-800/60">
              {kasNaikDenominations.map(den => (
                <div key={den} className="grid grid-cols-12 items-center gap-4 py-3.5">
                  <span className="col-span-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                    {formatRupiah(den)}
                  </span>
                  <span className="col-span-1 text-slate-400 text-center text-xs">x</span>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={tab3Qtys[den]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTab3Qtys(prev => ({ ...prev, [den]: val }));
                      }}
                      placeholder="0"
                      min="0"
                      className="w-full text-center px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                    />
                  </div>
                  <span className={`col-span-4 text-right text-xs font-bold ${
                    parseInt(tab3Qtys[den]) > 0 
                      ? 'text-amber-600 dark:text-amber-400' 
                      : 'text-slate-400'
                  }`}>
                    {formatRupiah(den * (parseInt(tab3Qtys[den]) || 0))}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 flex justify-end">
              <button
                onClick={resetTab3}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Input
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Kas Kecil */}
        {activeTab === 'kas-kecil' && (
          <div className="flex flex-col">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-700 p-6 text-center text-white">
              <span className="text-[10px] font-bold opacity-80 tracking-wider uppercase block">PEMBULATAN KAS KECIL</span>
              <h2 className="text-2xl font-extrabold mt-1">Sistem Pecahan Kelipatan Rp100</h2>
            </div>
            
            <div className="p-6 max-w-lg mx-auto w-full flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Kas Kecil di Sistem</label>
                <div className="relative flex items-center border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <span className="px-4 py-3 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={tab4Input}
                    onChange={(e) => setTab4Input(e.target.value)}
                    placeholder="Contoh: 1250475"
                    className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 font-bold text-sm outline-none"
                  />
                </div>
              </div>

              {/* Output Calculation Table */}
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/20 dark:bg-slate-900/10">
                <div className="flex justify-between items-center px-4 py-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Nominal Pembulatan</span>
                    <span className="text-[9px] opacity-75">Dibulatkan ke bawah ke kelipatan Rp100</span>
                  </div>
                  <span className="text-sm font-extrabold">{formatRupiah(tab4Rounded)}</span>
                </div>

                <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nominal Naik Kas</span>
                    <span className="text-[9px] text-slate-400">Kelebihan kas di atas batas laci Rp1.000.000</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatRupiah(tab4Naik)}</span>
                </div>

                <div className="flex justify-between items-center px-4 py-3 text-rose-500 bg-rose-500/5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Nominal Sisa / Selisih</span>
                    <span className="text-[9px] opacity-75">Sisa pembulatan (Jurnal Kode 0417/0917)</span>
                  </div>
                  <span className="text-sm font-extrabold">{formatRupiah(tab4Sisa)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
