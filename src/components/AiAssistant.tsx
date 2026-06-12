'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Brain, Bot, User } from 'lucide-react';
import { TransactionCode, KbArticle } from '@/types';

interface Message {
  text: string;
  isUser: boolean;
  time: string;
}

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: TransactionCode[];
  kbArticles: KbArticle[];
}

export default function AiAssistant({
  isOpen,
  onClose,
  transactions,
  kbArticles
}: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "Halo! Saya Teller AI Assistant. Tanyakan apapun seputar prosedur transaksi, warkat cek, transfer, atau kode harian.\n\nContoh pertanyaan:\n• *'Nasabah bayar angsuran pakai tabungan'*\n• *'Nasabah tarik menggunakan cek mandiri'*\n• *'Batas limit transfer RTGS'*",
          isUser: false,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { text, isUser: true, time }]);
    setInput('');

    // Simulate AI loading/thinking
    setTimeout(() => {
      const responseText = processQuery(text);
      setMessages(prev => [...prev, { text: responseText, isUser: false, time }]);
    }, 600);
  };

  const processQuery = (query: string): string => {
    const q = query.toLowerCase();

    // 1. Angsuran via Tabungan (Potdal)
    if ((q.includes('angsuran') || q.includes('bayar')) && q.includes('tabungan')) {
      return `🤖 **Hasil Analisis AI:**
Kategori: **Angsuran (Potdal)**
Kode Transaksi: **4056**
Nama Transaksi: **Angsuran Payment dari Tabungan**

**Dokumen yang Diperlukan:**
• Buku Tabungan
• Identitas Diri (KTP)

⚠️ **WARNING:**
Tidak menerima uang tunai! Transaksi harus didebet langsung dari rekening tabungan.`;
    }

    // 2. Cek Mandiri
    if (q.includes('tarik') && q.includes('cek') && (q.includes('mandiri') || q.includes('sendiri'))) {
      return `🤖 **Hasil Analisis AI:**
Kategori: **Cek Mandiri (Penarikan)**

**Dokumen Checklist Verifikasi:**
• Fotokopi KTP Penarik
• Verifikasi Tanda Tangan (Sistem)
• Stempel SV (Supervisor)
• Paraf Pejabat/Teller
• Stempel Lunas`;
    }

    // 3. Cek Bank Lain
    if (q.includes('cek') && (q.includes('bank lain') || q.includes('kliring') || q.includes('luar'))) {
      return `🤖 **Hasil Analisis AI:**
Kategori: **Cek / Bilyet Giro Bank Lain (Kliring)**

🚨 **WARNING BESAR:**
• **JANGAN DISTEMPEL** di bagian depan warkat!
• **JANGAN DICORET**!
• **JANGAN DITULIS APAPUN**!

**Checklist:**
• Verifikasi Keaslian Fisik Warkat
• Verifikasi Nominal & Tanggal Efektif`;
    }

    // 4. RTGS
    if (q.includes('rtgs') || (q.includes('transfer') && q.includes('100'))) {
      return `🤖 **Hasil Analisis AI:**
Kategori: **RTGS (Real Time Gross Settlement)**
Ketentuan: **Transfer di atas Rp100 Juta**

**Dokumen yang Diperlukan:**
• KTP Pengirim (Asli & Fotokopi)
• Materai 2 Buah (ditempel pada formulir transfer)
• Buku Tabungan / Kartu ATM (bila debet)`;
    }

    // 5. SKN
    if (q.includes('skn') || q.includes('kliring llg')) {
      return `🤖 **Hasil Analisis AI:**
Kategori: **SKN (Sistem Kliring Nasional) / LLG**
Ketentuan: **Transfer di bawah Rp100 Juta**
Durasi: Jam kerja terjadwal (beberapa jam / keesokan hari)`;
    }

    // 6. Kartu Kredit Mandiri pengajuan
    if (q.includes('kartu kredit') && (q.includes('buka') || q.includes('syarat') || q.includes('daftar') || q.includes('aju') || q.includes('butuh'))) {
      return `🤖 **Syarat Pengajuan Kartu Kredit Bank Mandiri:**
1. **Usia:** Utama min. 21 tahun / Tambahan min. 17 tahun.
2. **Dokumen Identitas:**
   - **WNI:** KTP Asli & fotokopi.
   - **WNA:** Paspor & KITAS/KITAP aktif.
3. **Bukti Pendapatan (Income):**
   - **Karyawan:** Slip Gaji / Surat Keterangan Penghasilan (SKP) terbaru.
   - **Profesional / Wiraswasta:** Rekening Koran 3 bulan terakhir & SIUP/Izin Praktek.
4. **NPWP:** Wajib melampirkan NPWP asli/fotokopi.
5. **Aplikasi:** Mengisi & menandatangani formulir aplikasi pengajuan.`;
    }

    // 7. Produk Bank Mandiri umum
    if (q.includes('produk') && q.includes('mandiri')) {
      return `🤖 **Produk Utama Bank Mandiri (Layanan Cabang):**
1. **Tabungan:** Tabungan Rupiah (Utama), Tabungan Now (Digital), Tabungan Bisnis (Usaha), Tabungan Rencana (MTR), Tabungan Valas.
2. **Kartu Kredit:** Mandiri Signature (Travel), Precious, Skyz Card (Traveler), Shopee Card (Co-branding), Platinum.
3. **Kredit & Pinjaman:** KPR (Kredit Rumah), KKB (Kendaraan Bermotor), KSM (Kredit Serbaguna Tanpa Agunan).
4. **Simpanan Berjangka:** Deposito Rupiah & Valas.
5. **Layanan Digital:** Livin' by Mandiri (Ritel), Kopra by Mandiri (Wholesale/Bisnis).
6. **Lainnya:** Mandiri Agen (Laku Pandai).`;
    }

    // 8. KPR Mandiri
    if (q.includes('kpr') && q.includes('mandiri')) {
      return `🤖 **Mandiri KPR (Kredit Pemilikan Rumah):**
Pembiayaan untuk pembelian rumah tinggal, ruko, apartemen, atau renovasi.
- **Tenor:** Jangka waktu s.d 20 tahun.
- **Persyaratan:** KTP, KK, NPWP, Slip Gaji/SKP, Rekening Koran 3 bulan, dan dokumen agunan (SHM/SHGB, IMB, PBB).`;
    }

    // 9. KSM Mandiri
    if (q.includes('ksm') && q.includes('mandiri')) {
      return `🤖 **Mandiri KSM (Kredit Serbaguna Mandiri):**
Fasilitas Kredit Tanpa Agunan (KTA) khusus untuk pegawai payroll Mandiri.
- **Plafon:** S.d Rp1 Miliar.
- **Tenor:** Jangka waktu s.d 15 tahun.
- **Persyaratan:** KTP, NPWP, SK Pengangkatan Pegawai, dan Slip Gaji terbaru.`;
    }

    // Check transactions list
    const matchedTxs = transactions.filter(t => t.code.includes(q) || t.name.toLowerCase().includes(q));
    const matchedKbs = kbArticles.filter(kb => kb.title.toLowerCase().includes(q) || kb.content.toLowerCase().includes(q));

    if (matchedTxs.length > 0 || matchedKbs.length > 0) {
      let text = "🤖 **Berikut data SOP internal yang relevan:**\n\n";

      if (matchedTxs.length > 0) {
        text += "**Kode Transaksi:**\n";
        matchedTxs.forEach(t => {
          text += `• **${t.code}** - ${t.name}\n  📄 *Dokumen:* ${t.documents.join(', ')}\n`;
          if (t.warning) text += `  ⚠️ *Warning: ${t.warning}*\n`;
        });
        text += "\n";
      }

      if (matchedKbs.length > 0) {
        text += "**Knowledge Base:**\n";
        matchedKbs.forEach(kb => {
          text += `• **${kb.title}**\n  ${kb.content.substring(0, 160)}...\n`;
        });
      }

      return text;
    }

    return `🤖 Maaf, saya tidak menemukan kecocokan spesifik untuk "${query}". Coba cari kata kunci lain seperti "angsuran", "cek mandiri", "giro", atau "RTGS".`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-250">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800/60 flex items-center gap-3">
        <div className="p-2 bg-blue-600 text-white rounded-full">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex-grow">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Teller AI Assistant</h4>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wide block">Asisten Pintar Offline</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-grow p-5 overflow-y-auto bg-slate-50 dark:bg-slate-950/20 flex flex-col gap-3.5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 max-w-[85%] ${msg.isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
          >
            <div className={`p-1.5 rounded-full shrink-0 ${msg.isUser ? 'bg-slate-200 text-slate-700' : 'bg-blue-600 text-white'}`}>
              {msg.isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>
            
            <div className="flex flex-col gap-1">
              <div 
                className={`p-3 text-xs leading-relaxed rounded-2xl whitespace-pre-line border font-medium ${
                  msg.isUser 
                    ? 'bg-blue-600 border-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className={`text-[9px] text-slate-400 font-bold self-end ${msg.isUser ? 'pr-1' : 'pl-1'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/60 flex gap-2 bg-white dark:bg-slate-900">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Tanyakan prosedur, dokumen, atau kode..."
          className="flex-grow px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-slate-950 dark:text-slate-100 font-semibold text-xs rounded-full outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
        />
        <button
          onClick={handleSend}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm cursor-pointer transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
