'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Star, 
  AlertOctagon, 
  FileCheck, 
  Layers, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { TransactionCode, KbArticle } from '@/types';

interface TellerModeProps {
  transactions: TransactionCode[];
  kbArticles: KbArticle[];
  toggleFavorite: (code: string) => void;
  initialQuery?: string;
  initialFocus?: boolean;
}

export default function TellerMode({
  transactions,
  kbArticles,
  toggleFavorite,
  initialQuery = '',
  initialFocus = false
}: TellerModeProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedTx, setSelectedTx] = useState<TransactionCode | null>(null);
  const [selectedKb, setSelectedKb] = useState<KbArticle | null>(null);
  const [docChecks, setDocChecks] = useState<boolean[]>([]);

  // Auto-focus search input if initialFocus is true
  useEffect(() => {
    if (initialFocus) {
      const el = document.getElementById('teller-mode-search-bar');
      if (el) el.focus();
    }
  }, [initialFocus]);

  // Sync with initialQuery when it changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const shortcutTerms = ['potdal', 'angsuran', 'setor', 'tarik', 'giro', 'deposito', 'va', 'transfer', 'kliring', 'rtgs'];

  // Smart search filter logic
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    if (q === '') {
      // Return favorite transactions first, then rest
      const favs = transactions.filter(t => t.isFavorite);
      const others = transactions.filter(t => !t.isFavorite);
      return { txs: [...favs, ...others], kbs: [] };
    }

    // Filter transactions
    const txs = transactions.filter(tx => {
      return tx.code.includes(q) || 
             tx.name.toLowerCase().includes(q) || 
             tx.category.toLowerCase().includes(q) || 
             tx.documents.some(doc => doc.toLowerCase().includes(q)) ||
             tx.notes.some(note => note.toLowerCase().includes(q)) ||
             (tx.warning && tx.warning.toLowerCase().includes(q));
    });

    // Filter Knowledge Base
    const kbs = kbArticles.filter(kb => {
      return kb.title.toLowerCase().includes(q) ||
             kb.content.toLowerCase().includes(q) ||
             kb.category.toLowerCase().includes(q) ||
             kb.tags.some(tag => tag.toLowerCase().includes(q));
    });

    return { txs, kbs };
  }, [query, transactions, kbArticles]);

  const openTxDetail = (tx: TransactionCode) => {
    setSelectedTx(tx);
    setSelectedKb(null);
    setDocChecks(Array(tx.documents.length).fill(false));
  };

  const openKbDetail = (kb: KbArticle) => {
    setSelectedKb(kb);
    setSelectedTx(null);
  };

  const toggleDocCheck = (idx: number) => {
    const next = [...docChecks];
    next[idx] = !next[idx];
    setDocChecks(next);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex flex-col gap-4">
        <div className="relative flex items-center">
          <Search className="absolute left-4.5 text-slate-400 h-5 w-5" />
          <input
            id="teller-mode-search-bar"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari transaksi, kode, dokumen, SOP, atau prosedur..."
            className="w-full pl-13 pr-12 py-3.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-sm outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Shortcut Chip Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-slate-400 tracking-wider">CARI CEPAT:</span>
          <div className="flex gap-2 flex-wrap">
            {shortcutTerms.map(term => {
              const isActive = query.toLowerCase() === term;
              return (
                <button
                  key={term}
                  onClick={() => setQuery(isActive ? '' : term)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  #{term}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Results Display */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          {query ? `Hasil Pencarian (${searchResults.txs.length + searchResults.kbs.length} Cocok)` : 'Database Kode Transaksi'}
        </h3>
        
        {searchResults.txs.length === 0 && searchResults.kbs.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-slate-400 flex flex-col items-center justify-center gap-2 shadow-sm">
            <Search className="h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="font-semibold text-slate-500 dark:text-slate-400">Tidak ada hasil ditemukan</p>
            <span className="text-xs text-slate-400">Cobalah kata kunci lain seperti &quot;potdal&quot;, &quot;2101&quot;, atau &quot;RTGS&quot;.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Transaction Cards */}
            {searchResults.txs.map(tx => (
              <div
                key={tx.code}
                onClick={() => openTxDetail(tx)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex items-start gap-4 hover:shadow-md hover:border-blue-500/50 cursor-pointer transition-all duration-150 relative group"
              >
                {/* Code Badge */}
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-mono font-bold text-sm px-3 py-1.5 rounded-lg flex-shrink-0">
                  {tx.code}
                </div>

                <div className="flex-grow flex flex-col gap-1 pr-6">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tx.name}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{tx.category}</span>
                  {tx.warning && (
                    <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-rose-500/10 text-rose-500 border border-rose-500/10 w-fit">
                      <AlertOctagon className="h-3 w-3" />
                      Warning
                    </div>
                  )}
                </div>

                {/* Favorite Star button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(tx.code);
                  }}
                  className={`absolute top-4 right-4 cursor-pointer p-1 rounded-lg transition-colors ${
                    tx.isFavorite 
                      ? 'text-amber-500 hover:bg-amber-500/10' 
                      : 'text-slate-300 dark:text-slate-700 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Star className="h-4 w-4" fill={tx.isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            ))}

            {/* Knowledge Base Results */}
            {searchResults.kbs.map(kb => (
              <div
                key={kb.id}
                onClick={() => openKbDetail(kb)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 border-l-4 border-l-teal-500 rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md cursor-pointer transition-all duration-150"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{kb.title}</h4>
                  <span className="text-[9px] font-extrabold tracking-wider bg-teal-500/10 text-teal-600 px-2 py-0.5 rounded border border-teal-500/10 uppercase">
                    WIKI
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                  {kb.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* DETAILED DIALOG MODALS */}
      {/* ========================================== */}

      {/* 1. Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white font-mono font-bold text-sm px-3 py-1.5 rounded-lg">
                  {selectedTx.code}
                </span>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">{selectedTx.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
              {/* Warnings Block (Alert Merah jika ada warning) */}
              {selectedTx.warning && (
                <div className="bg-rose-500/10 dark:bg-rose-500/5 border border-rose-500/30 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="font-bold block tracking-wider uppercase text-[10px] mb-1">WARNING PENTING!</strong>
                    <span className="font-semibold">{selectedTx.warning}</span>
                  </div>
                </div>
              )}

              {/* Special alert override for Code 0917 */}
              {selectedTx.code === '0917' && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 p-4 rounded-xl flex items-start gap-3">
                  <AlertOctagon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-semibold">
                    ⚠ Digunakan saat alokasi naik turun kas
                  </div>
                </div>
              )}

              {/* Document Checklist */}
              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Dokumen yang Diperlukan (Checklist):</h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20">
                  {selectedTx.documents.map((doc, idx) => (
                    <label 
                      key={doc}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-xs font-medium"
                    >
                      <input 
                        type="checkbox"
                        checked={docChecks[idx] || false}
                        onChange={() => toggleDocCheck(idx)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={docChecks[idx] ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}>
                        {doc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SOP / Notes */}
              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Prosedur &amp; Catatan Penting:</h4>
                <ol className="list-decimal pl-5 text-xs text-slate-600 dark:text-slate-300 flex flex-col gap-2 leading-relaxed font-medium">
                  {selectedTx.notes.map(note => (
                    <li key={note}>{note}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Knowledge Base Detail Modal */}
      {selectedKb && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-teal-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">{selectedKb.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedKb(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div>
                <span className="text-[10px] font-bold tracking-wider bg-teal-500/10 text-teal-600 px-2.5 py-1 rounded-md border border-teal-500/10 uppercase">
                  {selectedKb.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                {selectedKb.content}
              </p>
              <div className="flex gap-2 flex-wrap mt-2">
                {selectedKb.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
