'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, Settings, Info, Save, X } from 'lucide-react';
import { TransactionCode } from '@/types';

interface AdminPanelProps {
  transactions: TransactionCode[];
  addOrUpdateTx: (tx: TransactionCode) => void;
  deleteTx: (code: string) => void;
}

export default function AdminPanel({
  transactions,
  addOrUpdateTx,
  deleteTx
}: AdminPanelProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // Form Fields
  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Tabungan');
  const [editDocs, setEditDocs] = useState('');
  const [editWarning, setEditWarning] = useState('');
  const [editNotes, setEditNotes] = useState('');
  
  const [isEditMode, setIsEditMode] = useState(false);

  const categories = ['Tabungan', 'Giro', 'Kredit', 'Sistem', 'Operasional', 'Produk'];

  const openAdd = () => {
    setEditCode('');
    setEditName('');
    setEditCategory('Tabungan');
    setEditDocs('');
    setEditWarning('');
    setEditNotes('');
    setIsEditMode(false);
    setIsEditorOpen(true);
  };

  const openEdit = (tx: TransactionCode) => {
    setEditCode(tx.code);
    setEditName(tx.name);
    setEditCategory(tx.category);
    setEditDocs(tx.documents.join(', '));
    setEditWarning(tx.warning || '');
    setEditNotes(tx.notes.join('\n'));
    setIsEditMode(true);
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    if (!editCode.trim() || !editName.trim()) {
      alert('Kode dan Nama Transaksi wajib diisi!');
      return;
    }

    const documents = editDocs
      .split(',')
      .map(d => d.trim())
      .filter(d => d.length > 0);

    const notes = editNotes
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    const tx: TransactionCode = {
      code: editCode.trim(),
      name: editName.trim(),
      category: editCategory,
      documents,
      warning: editWarning.trim() || undefined,
      notes,
      isFavorite: false
    };

    addOrUpdateTx(tx);
    setIsEditorOpen(false);
  };

  const handleDelete = (code: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kode transaksi "${code} - ${name}"?`)) {
      deleteTx(code);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Warning admin notification banner */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-4.5 rounded-2xl text-amber-700 dark:text-amber-500 text-xs flex gap-3 font-medium">
        <Shield className="h-5 w-5 flex-shrink-0" />
        <div>
          <strong className="font-bold">ADMIN PANEL SECURE ACCESS:</strong>
          <p className="mt-1 opacity-90">
            Halaman ini khusus digunakan oleh Supervisor atau Pejabat Operasional untuk menyesuaikan kode transaksi dan SOP lokal.
          </p>
        </div>
      </div>

      {/* Header bar and action triggers */}
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Manajemen Kode Transaksi</h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Tambah Kode Transaksi</span>
        </button>
      </div>

      {/* Grid listing all transaction codes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/20 text-slate-400 border-b border-slate-200 dark:border-slate-800/60 uppercase text-[10px] tracking-wider font-extrabold">
                <th className="p-4">Kode</th>
                <th className="p-4">Nama Transaksi</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Dokumen</th>
                <th className="p-4">Warning</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {transactions.map(tx => (
                <tr key={tx.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                  <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{tx.code}</td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{tx.name}</td>
                  <td className="p-4">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      {tx.category}
                    </span>
                  </td>
                  <td className="p-4 max-w-xs truncate text-slate-400" title={tx.documents.join(', ')}>
                    {tx.documents.join(', ')}
                  </td>
                  <td className="p-4">
                    {tx.warning ? (
                      <span className="text-rose-500 font-semibold truncate max-w-xs block" title={tx.warning}>
                        ⚠ {tx.warning}
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEdit(tx)}
                        className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.code, tx.name)}
                        className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {isEditMode ? 'Edit Kode Transaksi' : 'Tambah Kode Transaksi'}
              </h3>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Kode Transaksi</label>
                  <input
                    type="text"
                    value={editCode}
                    disabled={isEditMode}
                    onChange={(e) => setEditCode(e.target.value)}
                    placeholder="Contoh: 4056"
                    className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono font-bold text-xs rounded-lg outline-none disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Kategori</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Nama Transaksi</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Contoh: Setoran Tunai ke Giro"
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Dokumen yang Diperlukan (pisahkan koma)</label>
                <input
                  type="text"
                  value={editDocs}
                  onChange={(e) => setEditDocs(e.target.value)}
                  placeholder="Buku Tabungan, Kartu ATM, KTP"
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Warning Alert (Opsional)</label>
                <input
                  type="text"
                  value={editWarning}
                  onChange={(e) => setEditWarning(e.target.value)}
                  placeholder="Contoh: Tidak menerima uang tunai"
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Prosedur / Langkah Catatan (Satu baris per langkah)</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                  placeholder="Cetak buku di printer passbook&#10;Verifikasi otorisasi supervisor"
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
                  Simpan Transaksi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
