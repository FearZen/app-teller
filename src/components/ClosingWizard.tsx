'use client';

import React, { useState, useEffect } from 'react';
import { Check, HelpCircle, Lock, RefreshCw, AlertTriangle, AlertOctagon, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { ChecklistItem } from '@/types';

interface ClosingWizardProps {
  checklist: ChecklistItem[];
  toggleStep: (id: string, index: number) => void;
  resetSteps: () => void;
  systemCash: number;
  setSystemCash: (val: number) => void;
  physicalCash: number;
  setPhysicalCash: (val: number) => void;
  onReorder: (newList: ChecklistItem[]) => void;
}

export default function ClosingWizard({
  checklist,
  toggleStep,
  resetSteps,
  systemCash,
  setSystemCash,
  physicalCash,
  setPhysicalCash,
  onReorder
}: ClosingWizardProps) {

  const checkedCount = checklist.filter(s => s.checked).length;
  const progress = checkedCount / checklist.length;

  const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  const formatRupiah = (val: number) => currencyFormatter.format(val).replace(/,00$/, '');

  const cashDiff = physicalCash - systemCash;

  // Local string state for formatted values
  const [localSystemInput, setLocalSystemInput] = useState(() => systemCash ? new Intl.NumberFormat('id-ID').format(systemCash) : '');
  const [localPhysicalInput, setLocalPhysicalInput] = useState(() => physicalCash ? new Intl.NumberFormat('id-ID').format(physicalCash) : '');

  // Keep in sync with props changes
  useEffect(() => {
    setLocalSystemInput(systemCash ? new Intl.NumberFormat('id-ID').format(systemCash) : '');
  }, [systemCash]);

  useEffect(() => {
    setLocalPhysicalInput(physicalCash ? new Intl.NumberFormat('id-ID').format(physicalCash) : '');
  }, [physicalCash]);

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [touchStartIndex, setTouchStartIndex] = useState<number | null>(null);
  const [touchTargetIndex, setTouchTargetIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    const newList = [...checklist];
    const draggedItem = newList[draggedItemIndex];
    newList.splice(draggedItemIndex, 1);
    newList.splice(targetIndex, 0, draggedItem);

    onReorder(newList);
    setDraggedItemIndex(null);
  };

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    setTouchStartIndex(index);
    setTouchTargetIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartIndex === null) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    const stepEl = element.closest('[data-index]');
    if (stepEl) {
      const idxAttr = stepEl.getAttribute('data-index');
      if (idxAttr !== null) {
        const idx = parseInt(idxAttr, 10);
        if (idx !== touchTargetIndex) {
          setTouchTargetIndex(idx);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchStartIndex !== null && touchTargetIndex !== null && touchStartIndex !== touchTargetIndex) {
      const newList = [...checklist];
      const draggedItem = newList[touchStartIndex];
      newList.splice(touchStartIndex, 1);
      newList.splice(touchTargetIndex, 0, draggedItem);
      onReorder(newList);
    }
    setTouchStartIndex(null);
    setTouchTargetIndex(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...checklist];
    const item = newList[index];
    newList.splice(index, 1);
    newList.splice(index - 1, 0, item);
    onReorder(newList);
  };

  const handleMoveDown = (index: number) => {
    if (index === checklist.length - 1) return;
    const newList = [...checklist];
    const item = newList[index];
    newList.splice(index, 1);
    newList.splice(index + 1, 0, item);
    onReorder(newList);
  };

  // Step 4 (Naik Kas) Sheet Tallier
  const [naikQtys, setNaikQtys] = useState<Record<number, string>>({
    100000: '',
    50000: '',
    20000: '',
    10000: '',
    5000: ''
  });

  const naikTotal = Object.keys(naikQtys).reduce((sum, denStr) => {
    const den = parseInt(denStr);
    const qty = parseInt(naikQtys[den]) || 0;
    return sum + (den * qty);
  }, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Wizard Intro */}
      <div className="bg-gradient-to-r from-rose-600 to-amber-700 rounded-2xl p-6 text-white shadow-md flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-bold">Langkah Closing Berurutan (Sore)</h3>
          <p className="text-xs opacity-85 mt-1 max-w-xl">
            Selesaikan checklist penutupan kas laci di bawah ini. Harap teliti menghitung fisik uang untuk menghindari selisih harian.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Apakah Anda yakin ingin mengulang semua langkah closing dari awal?")) {
              resetSteps();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-semibold cursor-pointer transition"
        >
          <RefreshCw className="h-4.5 w-4.5" />
          <span>Reset Wizard</span>
        </button>
      </div>

      {/* Progress bar info */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
          <span>Progres Penyelesaian</span>
          <span className="font-bold text-rose-500 dark:text-rose-400 text-sm">
            {checkedCount} dari {checklist.length} ({Math.round(progress * 100)}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-rose-500 h-full rounded-full transition-all duration-300" 
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="flex flex-col gap-3">
        {checklist.map((step, index) => {
          const isChecked = step.checked;
          const isEnabled = index === 0 || checklist[index - 1].checked;
          
          return (
            <div
              key={step.id}
              data-index={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={`border rounded-2xl p-4.5 flex flex-col gap-4 transition-all duration-200 ${
                isChecked
                  ? 'bg-rose-500/[0.02] border-rose-500/30'
                  : isEnabled
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200/40 dark:border-slate-900/60 opacity-50'
              } ${draggedItemIndex === index ? 'opacity-30 border-dashed border-blue-500' : ''} ${
                touchStartIndex !== null && touchTargetIndex === index && touchStartIndex !== index
                  ? 'border-dashed border-blue-550 bg-blue-50/40 dark:bg-blue-950/20'
                  : ''
              }`}
            >
              {/* Header Step row */}
              <div className="flex items-start md:items-center justify-between gap-4.5 w-full">
                <div className="flex items-start md:items-center gap-3 w-full md:w-auto">
                  {/* Drag handle & Mobile buttons */}
                  <div className="flex items-center gap-2 self-stretch md:self-center">
                    <div 
                      className="cursor-grab active:cursor-grabbing p-2 text-slate-400 dark:text-slate-650 hover:text-slate-600 dark:hover:text-slate-350 touch-none"
                      title="Seret untuk mengubah urutan (bisa disentuh)"
                      onTouchStart={(e) => handleTouchStart(e, index)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex flex-row md:flex-col items-center bg-slate-100/60 dark:bg-slate-800/60 rounded-xl p-0.5 border border-slate-200/40 dark:border-slate-700/40">
                      <button 
                        onClick={() => handleMoveUp(index)} 
                        disabled={index === 0}
                        className="p-2 md:p-1 hover:bg-white dark:hover:bg-slate-900 rounded-lg text-slate-450 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                        title="Pindahkan Ke Atas"
                      >
                        <ChevronUp className="h-5 w-5 md:h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleMoveDown(index)} 
                        disabled={index === checklist.length - 1}
                        className="p-2 md:p-1 hover:bg-white dark:hover:bg-slate-900 rounded-lg text-slate-450 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                        title="Pindahkan Ke Bawah"
                      >
                        <ChevronDown className="h-5 w-5 md:h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start md:items-center gap-4.5">
                    <div 
                      className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-rose-500 border-rose-500 text-white'
                          : isEnabled
                            ? 'bg-blue-500/10 dark:bg-blue-500/5 border-blue-500/20 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      {isChecked ? (
                        <Check className="h-4 w-4" />
                    ) : !isEnabled ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div>
                    <h4 className={`text-sm font-bold transition-all ${
                      isChecked 
                        ? 'text-rose-700 dark:text-rose-400 line-through' 
                        : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {step.title}
                    </h4>
                    {step.note && !isChecked && (
                      <p className="text-xs text-slate-400 mt-1">{step.note}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={!isEnabled}
                    onChange={() => toggleStep(step.id, index)}
                    className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Inline custom modules */}
              {isEnabled && !isChecked && (
                <div className="ml-12 border-l border-slate-100 dark:border-slate-800/80 pl-6 flex flex-col gap-3">
                  {/* Step 1: Combined Reconciliation */}
                  {step.type === 'custom-reconciliation' && (
                    <div className="flex flex-col gap-4 max-w-md bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Kas Sistem (Inquiry):</label>
                          <div className="relative flex items-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden focus-within:border-blue-500 transition-all">
                            <span className="px-3 py-2 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-400 border-r border-slate-200 dark:border-slate-800">Rp</span>
                            <input
                              type="text"
                              value={localSystemInput}
                              onChange={(e) => {
                                const val = e.target.value;
                                const cleanVal = val.replace(/\D/g, '');
                                setLocalSystemInput(cleanVal ? new Intl.NumberFormat('id-ID').format(parseInt(cleanVal)) : '');
                                setSystemCash(parseFloat(cleanVal) || 0);
                              }}
                              placeholder="0"
                              className="w-full px-3 py-2 bg-transparent text-slate-900 dark:text-slate-100 font-bold text-xs outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Kas Fisik (Laci):</label>
                          <div className="relative flex items-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden focus-within:border-blue-500 transition-all">
                            <span className="px-3 py-2 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-400 border-r border-slate-200 dark:border-slate-800">Rp</span>
                            <input
                              type="text"
                              value={localPhysicalInput}
                              onChange={(e) => {
                                const val = e.target.value;
                                const cleanVal = val.replace(/\D/g, '');
                                setLocalPhysicalInput(cleanVal ? new Intl.NumberFormat('id-ID').format(parseInt(cleanVal)) : '');
                                setPhysicalCash(parseFloat(cleanVal) || 0);
                              }}
                              placeholder="0"
                              className="w-full px-3 py-2 bg-transparent text-slate-900 dark:text-slate-100 font-bold text-xs outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Reconciliation result display */}
                      {systemCash > 0 && physicalCash > 0 && (
                        <div className="mt-1">
                          {cashDiff === 0 ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold">
                              <Check className="h-4.5 w-4.5" />
                              <span>✓ KAS KLOP (SALDO SESUAI)</span>
                            </div>
                          ) : (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-3 py-2.5 rounded-xl flex items-start gap-2.5 text-xs">
                              <AlertTriangle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                              <div>
                                <strong className="font-bold block text-[10px] tracking-wider uppercase mb-0.5">ALERT: SELISIH KAS DETEKSI!</strong>
                                <span className="font-semibold">
                                  Selisih: {formatRupiah(cashDiff)} ({cashDiff > 0 ? 'Kelebihan Kas' : 'Kekurangan Kas'})
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Potdal Warning */}
                  {step.type === 'custom-potdal-obds' && (
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 p-4 rounded-xl flex items-start gap-3 max-w-md">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="font-bold block tracking-wider uppercase text-[10px] mb-1">PENTING:</strong>
                        <span className="font-semibold">{step.warning}</span>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Naik Kas Besar (automatic calculation helper) */}
                  {step.type === 'custom-naik-kas' && (
                    <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 p-4 rounded-xl max-w-md flex flex-col gap-3.5 shadow-inner">
                      <strong className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tally Denominasi Naik Kas</strong>
                      <div className="grid grid-cols-2 gap-3">
                        {[100000, 50000, 20000, 10000, 5000].map(den => (
                          <div key={den} className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400">{formatRupiah(den).replace('Rp', '')} Lembar</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={naikQtys[den]}
                              onChange={(e) => {
                                const val = e.target.value;
                                setNaikQtys(prev => ({ ...prev, [den]: val }));
                              }}
                              className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg outline-none focus:border-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="text-right text-xs font-bold text-rose-500 mt-2">
                        Total Alokasi Naik Kas: <span className="text-sm font-extrabold">{formatRupiah(naikTotal)}</span>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Code 0917 Alert */}
                  {step.type === 'custom-pembulatan-obds' && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl flex items-start gap-3 max-w-md">
                      <AlertOctagon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="text-xs font-semibold">
                        🚨 ALERT BESAR: Gunakan Kode 0917 untuk input pembulatan kas laci kecil di OBDS!
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
