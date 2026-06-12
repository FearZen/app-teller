'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Calendar, FileText, X } from 'lucide-react';
import { DailyNote } from '@/types';

interface DailyNotesProps {
  notes: DailyNote[];
  addNote: (note: DailyNote) => void;
  deleteNote: (id: string) => void;
}

export default function DailyNotes({
  notes,
  addNote,
  deleteNote
}: DailyNotesProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<'Error' | 'Reminder' | 'Supervisor' | 'Operasional' | 'Pribadi'>('Operasional');

  const categories = ['Error', 'Reminder', 'Supervisor', 'Operasional', 'Pribadi'];

  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'Error':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/10';
      case 'Reminder':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/10';
      case 'Supervisor':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/10';
      case 'Pribadi':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/10';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    }
  };

  const handleSave = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Judul dan isi catatan wajib diisi!');
      return;
    }

    const note: DailyNote = {
      id: String(Date.now()),
      title: editTitle.trim(),
      content: editContent.trim(),
      date: new Date().toISOString(),
      category: editCategory
    };

    addNote(note);
    setIsEditorOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan harian ini?')) {
      deleteNote(id);
    }
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Jurnal Operasional Teller</h3>
        <button
          onClick={() => {
            setEditTitle('');
            setEditContent('');
            setEditCategory('Operasional');
            setIsEditorOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Tulis Catatan Harian</span>
        </button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-slate-400 flex flex-col items-center justify-center gap-2 shadow-sm">
          <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700" />
          <p className="font-semibold text-slate-500 dark:text-slate-400">Belum ada catatan harian tersimpan</p>
          <span className="text-xs text-slate-400">Tekan tombol di atas untuk merekam evaluasi harian.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notes.map(note => (
            <div
              key={note.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4 shadow-sm"
            >
              {/* Note Header */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(note.date)}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${getCategoryStyles(note.category)}`}>
                    {note.category}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                  title="Hapus Catatan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Note Content */}
              <div className="flex flex-col gap-1.5">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{note.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-medium">
                  {note.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Tulis Jurnal Catatan Harian
              </h3>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Kategori</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as any)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Judul Ringkasan</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Contoh: Selisih Kas Kecil, Arahan Supervisor"
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Isi Catatan</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  placeholder="Tuliskan detail temuan atau catatan Anda di sini..."
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
