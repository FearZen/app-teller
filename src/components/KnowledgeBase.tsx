'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Tag, BookOpen, X } from 'lucide-react';
import { KbArticle } from '@/types';

interface KnowledgeBaseProps {
  articles: KbArticle[];
  addOrUpdateArticle: (article: KbArticle) => void;
  deleteArticle: (id: string) => void;
}

export default function KnowledgeBase({
  articles,
  addOrUpdateArticle,
  deleteArticle
}: KnowledgeBaseProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Editor fields
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('Operasional');
  const [editTags, setEditTags] = useState('');

  const categories = [
    'Semua', 'NBDS', 'OBDS', 'Potdal', 'Giro', 'Deposito', 'RTGS', 'SKN', 'Kliring', 'Alokasi Kas', 'Cek', 'Slip'
  ];

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter(art => {
      const matchesCategory = selectedCategory === 'Semua' || 
                              art.category.toLowerCase() === selectedCategory.toLowerCase() ||
                              art.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
                              
      const matchesQuery = q === '' ||
                           art.title.toLowerCase().includes(q) ||
                           art.content.toLowerCase().includes(q) ||
                           art.tags.some(tag => tag.toLowerCase().includes(q));
                           
      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory, articles]);

  const openAdd = () => {
    setEditId(null);
    setEditTitle('');
    setEditContent('');
    setEditCategory('NBDS');
    setEditTags('');
    setIsEditorOpen(true);
  };

  const openEdit = (art: KbArticle) => {
    setEditId(art.id);
    setEditTitle(art.title);
    setEditContent(art.content);
    setEditCategory(art.category);
    setEditTags(art.tags.join(', '));
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Judul dan Konten wajib diisi!');
      return;
    }

    const tags = editTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const article: KbArticle = {
      id: editId || String(Date.now()),
      title: editTitle.trim(),
      content: editContent.trim(),
      category: editCategory,
      tags
    };

    addOrUpdateArticle(article);
    setIsEditorOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      deleteArticle(id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Search and Add buttons */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex items-center w-full md:max-w-sm">
          <Search className="absolute left-4 text-slate-400 h-4.5 w-4.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari SOP / istilah perbankan..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium text-xs outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Tambah Artikel SOP</span>
        </button>
      </div>

      {/* Category Selection Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid List */}
      {filteredArticles.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-slate-400 flex flex-col items-center justify-center gap-2 shadow-sm">
          <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-700" />
          <p className="font-semibold text-slate-500 dark:text-slate-400">Tidak ada artikel SOP found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map(art => (
            <div
              key={art.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-snug">{art.title}</h4>
                  <span className="text-[9px] font-extrabold tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-500/10 uppercase shrink-0">
                    {art.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line font-medium">
                  {art.content}
                </p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800/40">
                {/* Tags row */}
                <div className="flex gap-1.5 flex-wrap">
                  {art.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-slate-400">
                      <Tag className="h-2.5 w-2.5" />
                      {t}
                    </span>
                  ))}
                </div>

                {/* Edit & delete buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(art)}
                    className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg cursor-pointer transition-colors"
                    title="Edit Artikel"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(art.id, art.title)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                    title="Hapus Artikel"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal Popup */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {editId ? 'Edit Artikel SOP' : 'Tambah Artikel SOP'}
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
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Judul / Istilah</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Contoh: RTGS, Kliring, PLN"
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Deskripsi &amp; Ketentuan SOP</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  placeholder="Tuliskan prosedur pengerjaan..."
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Kategori</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none"
                  >
                    {categories.slice(1).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tags (pisahkan koma)</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="RTGS, Limit, Biaya"
                    className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg outline-none"
                  />
                </div>
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
                  Simpan SOP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
