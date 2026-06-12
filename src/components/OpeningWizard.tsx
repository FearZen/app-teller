'use client';

import React, { useState } from 'react';
import { Check, HelpCircle, Lock, RefreshCw, GripVertical } from 'lucide-react';
import { ChecklistItem } from '@/types';

interface OpeningWizardProps {
  checklist: ChecklistItem[];
  toggleStep: (id: string, index: number) => void;
  resetSteps: () => void;
  onReorder: (newList: ChecklistItem[]) => void;
}

export default function OpeningWizard({
  checklist,
  toggleStep,
  resetSteps,
  onReorder
}: OpeningWizardProps) {

  const checkedCount = checklist.filter(s => s.checked).length;
  const progress = checkedCount / checklist.length;

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

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

  return (
    <div className="flex flex-col gap-6">
      {/* Wizard Intro */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-800 rounded-2xl p-6 text-white shadow-md flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-bold">Langkah Opening Berurutan (Pagi)</h3>
          <p className="text-xs opacity-85 mt-1 max-w-xl">
            Selesaikan langkah pembukaan harian di bawah ini secara runtut. Langkah berikutnya akan terbuka (unlocked) setelah langkah sebelumnya selesai dicentang. Anda dapat menyeret (drag) baris untuk mengubah urutan.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Apakah Anda yakin ingin mengulang semua langkah opening dari awal?")) {
              resetReminders();
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
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
            {checkedCount} dari {checklist.length} ({Math.round(progress * 100)}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
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
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={`border rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 ${
                isChecked
                  ? 'bg-emerald-500/[0.02] border-emerald-500/30'
                  : isEnabled
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200/40 dark:border-slate-900/60 opacity-50'
              } ${draggedItemIndex === index ? 'opacity-30 border-dashed border-blue-500' : ''}`}
            >
              <div className="flex items-start md:items-center gap-3">
                {/* Drag handle */}
                <div 
                  className="cursor-grab active:cursor-grabbing p-1 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 self-center"
                  title="Seret untuk mengubah urutan"
                >
                  <GripVertical className="h-4.5 w-4.5" />
                </div>

                <div className="flex items-start md:items-center gap-4.5">
                  {/* Status indicator badge */}
                  <div 
                    className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-500 text-white'
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
                        ? 'text-emerald-700 dark:text-emerald-400 line-through' 
                        : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {step.title}
                    </h4>
                    {step.note && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{step.note}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Checkbox */}
              <div className="flex items-center self-end md:self-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={!isEnabled}
                  onChange={() => toggleStep(step.id, index)}
                  className={`h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  function resetReminders() {
    resetSteps();
  }
}
