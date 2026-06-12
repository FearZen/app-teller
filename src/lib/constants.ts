import { TransactionCode, KbArticle, ChecklistItem } from '@/types';

export const DEFAULT_TRANSACTIONS: TransactionCode[] = [
  {
    code: "1101",
    name: "Setor Tunai Giro",
    category: "Giro",
    documents: ["Slip Setoran Giro", "Cek/Bilyet Giro jika kliring"],
    notes: ["Cek validasi tanda tangan penarik", "Giro bernilai besar wajib konfirmasi"],
    isFavorite: false
  },
  {
    code: "1103",
    name: "Kliring",
    category: "Operasional",
    documents: ["Warkat Kliring (Cek/BG)", "Slip Setoran Kliring"],
    warning: "Jangan distempel. Jangan dicoret. Jangan ditulis apapun di bagian depan warkat.",
    notes: ["Pastikan stempel kliring terpasang di belakang warkat", "Periksa wilayah kliring warkat"],
    isFavorite: false
  },
  {
    code: "1209",
    name: "Debit Giro Kredit GL",
    category: "Giro",
    documents: ["Slip Jurnal", "Cek/Bilyet Giro", "Memo Otorisasi"],
    notes: ["Transaksi antar divisi internal", "Pastikan pos GL sesuai petunjuk akuntansi"],
    isFavorite: false
  },
  {
    code: "1314",
    name: "Pindah Buku Giro ke Tabungan",
    category: "Tabungan",
    documents: ["Bilyet Giro", "Slip Transfer/Setoran Tabungan"],
    notes: ["Verifikasi saldo giro mencukupi", "Tanda tangan bilyet wajib diverifikasi"],
    isFavorite: false
  },
  {
    code: "1320",
    name: "Penarikan Tunai Giro",
    category: "Giro",
    documents: ["Cek Fisik", "KTP Penarik"],
    notes: ["Verifikasi tanda tangan di belakang cek", "Konfirmasi penarikan nominal besar ke pemilik rekening"],
    isFavorite: false
  },
  {
    code: "2101",
    name: "Setor Tunai Pakai Buku",
    category: "Tabungan",
    documents: ["Slip Setoran", "Buku Tabungan"],
    notes: ["Cetak transaksi di printer passbook", "Verifikasi kecocokan nomor rekening"],
    isFavorite: true
  },
  {
    code: "2111",
    name: "Setor Tunai Tanpa Buku",
    category: "Tabungan",
    documents: ["Slip Setoran", "KTP Penyetor"],
    notes: ["Pastikan nama di sistem cocok dengan slip", "Tulis nomor HP aktif"],
    isFavorite: false
  },
  {
    code: "2301",
    name: "Tarik Tunai Pakai Buku",
    category: "Tabungan",
    documents: ["Slip Penarikan", "Buku Tabungan", "KTP Pemilik"],
    notes: ["Wajib verifikasi tanda tangan sistem", "Nominal > 50 juta perlu supervisor"],
    isFavorite: true
  },
  {
    code: "2302",
    name: "Tarik Tunai Tanpa Buku",
    category: "Tabungan",
    documents: ["Slip Penarikan Tanpa Buku", "KTP Asli Pemilik", "Kartu ATM"],
    notes: ["Verifikasi PIN di PIN pad", "Lakukan verifikasi sidik jari jika diperlukan"],
    isFavorite: false
  },
  {
    code: "2304",
    name: "Transfer Debet",
    category: "Tabungan",
    documents: ["Slip Transfer", "Buku Tabungan", "KTP Pengirim"],
    notes: ["Cek status saldo sebelum transaksi", "Verifikasi rekening tujuan"],
    isFavorite: false
  },
  {
    code: "2305",
    name: "Pindah Buku",
    category: "Tabungan",
    documents: ["Slip Transfer", "KTP Pengirim", "Kartu ATM"],
    notes: ["Verifikasi tanda tangan & kartu ATM", "Gunakan otentikasi PIN"],
    isFavorite: false
  },
  {
    code: "2422",
    name: "Cetak Buku",
    category: "Tabungan",
    documents: ["Buku Tabungan"],
    notes: ["Pencetakan baris transaksi tertunda", "Pastikan pita printer tajam agar terbaca"],
    isFavorite: false
  },
  {
    code: "4051",
    name: "Angsuran Payment Tunai",
    category: "Kredit",
    documents: ["Slip Setoran Angsuran", "Kartu Kredit/Nomor Kontrak"],
    notes: ["Pastikan nominal sesuai tagihan bulanan", "Cek denda jika ada keterlambatan"],
    isFavorite: false
  },
  {
    code: "4056",
    name: "Angsuran Payment Tabungan (Potdal)",
    category: "Kredit",
    documents: ["Buku Tabungan", "KTP", "Kartu Debet"],
    warning: "Tidak menerima uang tunai.",
    notes: ["Gunakan sistem autodebet", "Masukkan nomor kontrak kredit dengan teliti"],
    isFavorite: true
  },
  {
    code: "4204",
    name: "Pelunasan Kredit",
    category: "Kredit",
    documents: ["Slip Pelunasan", "Memo Otorisasi Sisa Pokok + Bunga"],
    notes: ["Hitung pinalti pelunasan dipercepat bila ada", "Cek status agunan"],
    isFavorite: false
  },
  {
    code: "6145",
    name: "Penarikan Dormant",
    category: "Operasional",
    documents: ["Buku Tabungan", "KTP Asli Pemilik", "Form Pengaktifan Rekening"],
    notes: ["Wajib otorisasi Supervisor untuk buka blokir dormant", "Nasabah wajib hadir fisik"],
    isFavorite: false
  },
  {
    code: "7010",
    name: "VA Debet",
    category: "Sistem",
    documents: ["Buku Tabungan", "KTP", "Nomor Virtual Account"],
    notes: ["Verifikasi saldo cukup", "Pastikan tanda tangan cocok"],
    isFavorite: false
  },
  {
    code: "7014",
    name: "VA Tunai",
    category: "Sistem",
    documents: ["Slip Pembayaran VA", "Nomor Virtual Account"],
    notes: ["Konfirmasi nama institusi dan pelanggan sebelum eksekusi", "Berikan struk pembayaran sebagai bukti sah"],
    isFavorite: false
  },
  {
    code: "7016",
    name: "Pembayaran Dari Giro",
    category: "Giro",
    documents: ["Cek/Bilyet Giro", "KTP Pembawa Cek"],
    notes: ["Periksa tanggal efektif & tanggal kadaluarsa", "Verifikasi saldo penarik cukup"],
    isFavorite: false
  },
  {
    code: "7017",
    name: "Pembayaran Debet Dengan Buku",
    category: "Tabungan",
    documents: ["Buku Tabungan", "Slip Debet Pembayaran", "KTP"],
    notes: ["Pencetakan buku wajib dilakukan", "Periksa validitas data merchant/penerima"],
    isFavorite: false
  },
  {
    code: "7967",
    name: "E-Money",
    category: "Sistem",
    documents: ["Kartu E-Money", "Nominal Top-Up"],
    notes: ["Pastikan reader berfungsi dengan baik", "Update saldo kartu di terminal setelah sukses"],
    isFavorite: false
  },
  {
    code: "0917",
    name: "Alokasi Naik Turun Kas",
    category: "Operasional",
    documents: ["Slip Alokasi Kas", "Otorisasi BOS"],
    warning: "Digunakan saat alokasi naik turun kas.",
    notes: ["Gunakan saat kas laci teller diserahkan ke BOS atau sebaliknya", "Wajib verifikasi otorisasi pejabat bank"],
    isFavorite: true
  },
  {
    code: "0930",
    name: "Many To Many",
    category: "Operasional",
    documents: ["Slip Jurnal Many To Many", "Form Otorisasi Cabang"],
    notes: ["Digunakan untuk transaksi split payment / multi rekening", "Wajib klop total debet dan total kredit"],
    isFavorite: false
  },
  {
    code: "0001",
    name: "Setor Tunai ke GL",
    category: "Operasional",
    documents: ["Slip Jurnal Setoran GL", "Bukti Penyetoran Fisik"],
    notes: ["Digunakan untuk penyesuaian selisih kas / kas masuk GL"],
    isFavorite: false
  },
  {
    code: "0002",
    name: "Tarik Tunai dari GL",
    category: "Operasional",
    documents: ["Slip Jurnal Penarikan GL", "Memo Persetujuan Cabang"],
    notes: ["Untuk operasional kas internal", "Otorisasi supervisor mutlak diperlukan"],
    isFavorite: false
  },
  {
    code: "9211",
    name: "Pembayaran Multi Supervisor",
    category: "Operasional",
    documents: ["Form Otorisasi Multi-Supervisor", "Dokumen Transaksi Pendukung"],
    notes: ["Wajib ditandatangani minimal 2 Pejabat Pemutus", "Nominal transaksi biasanya di atas batas limit normal"],
    isFavorite: false
  },
  {
    code: "16100",
    name: "Tabungan",
    category: "Produk",
    documents: ["Buku Tabungan", "KTP Pemilik"],
    notes: ["Jenis produk tabungan reguler"],
    isFavorite: false
  },
  {
    code: "16101",
    name: "Tabungan Pinjaman",
    category: "Produk",
    documents: ["Buku Tabungan Khusus Pinjaman", "Memo Kredit"],
    notes: ["Digunakan untuk menampung pencairan kredit"],
    isFavorite: false
  },
  {
    code: "16102",
    name: "Deposito",
    category: "Produk",
    documents: ["Bilyet Deposito", "KTP Deposan"],
    notes: ["Verifikasi jangka waktu dan suku bunga"],
    isFavorite: false
  },
  {
    code: "4502",
    name: "Jual Bank",
    category: "Operasional",
    documents: ["Slip Jual/Beli Valas", "Identitas Diri (Paspor untuk WNA)", "Fisik Uang Asing"],
    notes: ["Verifikasi keaslian mata uang asing dengan money detector", "Gunakan kurs terbaru hari ini"],
    isFavorite: false
  }
];

export const DEFAULT_KB: KbArticle[] = [
  { id: "1", title: "RTGS (Real Time Gross Settlement)", content: "Layanan transfer dana elektronik antar-bank dalam mata uang Rupiah yang penyelesaiannya dilakukan seketika (real-time) per transaksi. Berlaku khusus untuk nominal di atas Rp100.000.000 (Seratus Juta Rupiah). Wajib menyertakan KTP pengirim dan melampirkan 2 buah Materai pada formulir transfer.", category: "Transfer", tags: ["RTGS", "Transfer", "Materai", "Limit"] },
  { id: "2", title: "SKN / LLG (Sistem Kliring Nasional)", content: "Mekanisme transfer dana elektronik antar-bank di mana hasil transaksi tidak langsung diterima (settlement terjadwal beberapa kali sehari). Biasanya digunakan untuk transfer dengan nominal di bawah Rp100.000.000. Proses transfer membutuhkan waktu beberapa jam hingga 1 hari kerja.", category: "Transfer", tags: ["SKN", "Kliring", "LLG", "Limit"] },
  { id: "3", title: "Kliring Warkat", content: "Proses pertukaran warkat debet (Cek, Bilyet Giro) antar bank untuk menyelesaikan utang piutang transaksi nasabah. Pastikan warkat bank lain JANGAN DITULIS APAPUN, JANGAN DICORET, DAN JANGAN DISTEMPEL di bagian depan. Pastikan stempel kliring diletakkan di lembar belakang atau slip setoran khusus.", category: "Operasional", tags: ["Kliring", "Warkat", "Cek", "Bilyet Giro"] },
  { id: "4", title: "Giro", content: "Simpanan yang penarikannya dapat dilakukan setiap saat dengan menggunakan cek, bilyet giro, atau sarana perintah pembayaran lainnya. Giro ditujukan untuk nasabah badan usaha atau perorangan dengan mobilitas transaksi tinggi. Saldo giro dicatat dalam Rekening Koran.", category: "Produk", tags: ["Giro", "Cek", "Bilyet Giro", "Rekening Koran"] },
  { id: "5", title: "Deposito", content: "Simpanan berjangka yang penarikannya hanya dapat dilakukan pada waktu tertentu berdasarkan perjanjian (misal 1, 3, 6, atau 12 bulan). Pencairan sebelum jatuh tempo dapat dikenakan penalty. Pemilik deposito dibuktikan dengan sertifikat kepemilikan berupa Bilyet Deposito.", category: "Produk", tags: ["Deposito", "Bilyet", "Jatuh Tempo"] },
  { id: "6", title: "Potdal (Potong Saldo / Autodebet)", content: "Proses pendebetan saldo rekening tabungan nasabah secara otomatis untuk pembayaran kewajiban, seperti angsuran kredit bulanan. Menggunakan kode transaksi 4056. Penting: Transaksi ini TIDAK MENERIMA UANG TUNAI karena langsung memotong saldo tabungan nasabah.", category: "Kredit", tags: ["Potdal", "Angsuran", "Kredit", "Autodebet"] },
  { id: "7", title: "NBDS & OBDS", content: "NBDS (New Branch Delivery System) adalah aplikasi web & tablet yang digunakan untuk transaksi teller harian (setoran, penarikan, pemindahbukuan). OBDS (Online Branch Delivery System) adalah sistem core-banking versi AS400/terminal lama yang masih digunakan untuk modul kredit tertentu (seperti entry angsuran Potdal Mikro) dan input pembulatan kas 0917. Kredensial OBDS Anda -> User: 1619806, Password: 11111111.", category: "Sistem", tags: ["NBDS", "OBDS", "AS400", "Sistem"] },
  { id: "8", title: "Alokasi Kas (Naik/Turun Kas)", content: "Alokasi naik kas adalah penyerahan kelebihan kas fisik teller ke kas besar (BOS) karena laci melebihi limit. Alokasi turun kas adalah penambahan kas fisik teller dari kas besar untuk memenuhi kebutuhan transaksi nasabah. Menggunakan kode transaksi 0917. Wajib diverifikasi dan diotorisasi oleh BOS.", category: "Operasional", tags: ["Alokasi Kas", "Naik Kas", "Turun Kas", "BOS", "0917"] },
  { id: "9", title: "Prosedur & Syarat Pembukaan Kartu Kredit Mandiri", content: "Persyaratan umum pengajuan Kartu Kredit Bank Mandiri:\n1. Usia: Pemegang kartu utama minimal 21 tahun atau telah menikah, pemegang kartu tambahan minimal 17 tahun.\n2. Dokumen Identitas:\n   - WNI: KTP asli & fotokopi.\n   - WNA: Paspor asli & fotokopi, KITAS/KITAP aktif.\n3. Bukti Pendapatan (Income):\n   - Karyawan: Slip gaji 3 bulan terakhir/Surat Keterangan Penghasilan (SKP), SPT Pajak.\n   - Profesional/Wiraswasta: Rekening koran 3 bulan terakhir, fotokopi Surat Izin Praktek/SIUP.\n4. NPWP: Wajib melampirkan NPWP asli & fotokopi untuk pengajuan limit tertentu.\n5. Formulir Pengajuan: Mengisi formulir aplikasi pengajuan kartu kredit Mandiri dengan lengkap dan tanda tangan basah.", category: "Kredit", tags: ["Kartu Kredit", "Mandiri", "Pengajuan", "Kredit", "Persyaratan"] },
  { id: "10", title: "Jenis & Kategori Produk Kartu Kredit Bank Mandiri", content: "Lini produk Kartu Kredit utama Bank Mandiri:\n1. Mandiri Signature / Precious: Ditujukan untuk nasabah segmen travel & shopping dengan benefit Point double (Fiestapoin).\n2. Mandiri Skyz Card: Khusus traveler dengan penawaran asuransi perjalanan komprehensif, nilai tukar kurs valas kompetitif, dan miles.\n3. Mandiri Shopee Card: Kolaborasi co-branding untuk nasabah milenial dengan cashback belanja e-commerce Shopee.\n4. Mandiri Fengshui Card / Platinum: Kartu kredit reguler untuk kebutuhan transaksi harian domestik dan internasional.\n5. Mandiri Corporate Card: Ditujukan untuk mempermudah operasional dan pengeluaran perjalanan bisnis karyawan korporasi.", category: "Kredit", tags: ["Kartu Kredit", "Produk", "Mandiri", "Signature", "Skyz"] },
  { id: "11", title: "Lini Produk Tabungan Bank Mandiri (SOP Teller)", content: "Produk tabungan Mandiri yang sering ditransaksikan oleh Teller:\n1. Mandiri Tabungan Rupiah: Rekening tabungan utama untuk transaksi sehari-hari, menggunakan kartu Mandiri Debit (ATM) GPN/Visa.\n2. Mandiri Tabungan Now: Rekening tabungan digital yang dibuka via Livin' by Mandiri tanpa harus ke cabang, setoran awal minimal Rp50.000.\n3. Mandiri Tabungan Rencana (MTR): Tabungan berjangka dengan sistem autodebet bulanan untuk pencapaian target keuangan nasabah, jangka waktu 1 s.d 20 tahun.\n4. Mandiri Tabungan Bisnis: Rekening khusus pelaku usaha/bisnis dengan limit transaksi harian yang lebih besar dan informasi mutasi lengkap.\n5. Mandiri Tabungan Valas: Rekening tabungan dalam mata uang asing (USD, SGD, EUR, AUD, dll.) untuk nasabah retail.", category: "Produk", tags: ["Tabungan", "Mandiri", "Produk", "Valas", "Tabungan Now"] },
  { id: "12", title: "Livin' by Mandiri & Kopra by Mandiri (Layanan Digital)", content: "Layanan digital banking resmi Bank Mandiri:\n1. Livin' by Mandiri (Logo Kuning): Aplikasi mobile banking untuk nasabah perorangan. Fitur utama meliputi transfer instan (BI-Fast), pembayaran QRIS, top-up e-wallet, pembukaan rekening tabungan/deposito online, hingga pengajuan pinjaman digital secara digital.\n2. Kopra by Mandiri: Core platform wholesale digital untuk nasabah bisnis/korporasi. Mengintegrasikan layanan Cash Management, Trade Finance, Custody, dan Supply Chain Management secara terpadu.", category: "Sistem", tags: ["Livin", "Kopra", "Digital Banking", "Mandiri", "Aplikasi"] },
  { id: "13", title: "Mandiri KPR (Kredit Pemilikan Rumah)", content: "Fasilitas kredit untuk pembelian rumah tinggal, ruko, atau rukan baik baru maupun bekas, serta pembiayaan renovasi.\nFitur utama:\n- KPR Multiguna: Kredit konsumtif dengan jaminan sertifikat properti.\n- KPR Take Over: Pemindahan kredit sejenis dari bank lain ke Bank Mandiri.\n- Tenor: Jangka waktu pinjaman hingga 20 tahun.\nPersyaratan: KTP (nasabah & pasangan), KK, NPWP, Slip Gaji/SKP, Rekening Koran 3 bulan terakhir, dan dokumen agunan (SHM/SHGB, IMB, PBB).", category: "Kredit", tags: ["KPR", "Kredit", "Mandiri", "Rumah", "Agunan"] },
  { id: "14", title: "Mandiri KKB (Kredit Kendaraan Bermotor)", content: "Fasilitas pembiayaan kendaraan bermotor baru atau bekas (roda dua & roda empat).\nMitra Penyalur resmi: Dikelola oleh MUF (Mandiri Utama Finance) atau MTF (Mandiri Tunas Finance).\nPersyaratan umum:\n- Usia minimal 21 tahun & maksimal 55 tahun saat kredit lunas.\n- KTP, KK, NPWP.\n- Slip gaji & rekening koran 3 bulan terakhir.", category: "Kredit", tags: ["KKB", "Kredit", "Mandiri", "Mobil", "Motor"] },
  { id: "15", title: "Mandiri KSM (Kredit Serbaguna Mandiri)", content: "Kredit Tanpa Agunan (KTA) untuk pegawai aktif berpenghasilan tetap yang sistem payroll-nya dikelola Bank Mandiri.\nKegunaan: Pembiayaan konsumtif seperti pendidikan, renovasi, pernikahan, liburan.\nLimit & Tenor: Plafon pinjaman s.d Rp1 Miliar dengan tenor hingga 15 tahun.\nSyarat: SK Pengangkatan Pegawai, Slip Gaji, KTP, dan NPWP.", category: "Kredit", tags: ["KSM", "KTA", "Pinjaman", "Mandiri", "Tanpa Agunan"] },
  { id: "16", title: "Mandiri Deposito (Rupiah & Valas)", content: "Simpanan berjangka dengan bunga kompetitif yang dicairkan saat jatuh tempo.\nFitur utama:\n- Tenor: 1, 3, 6, 12, atau 24 bulan.\n- Automatic Roll Over (ARO): Perpanjangan deposito otomatis (pokok saja atau pokok + bunga).\n- Valuta Asing: Penempatan valas dalam USD, SGD, EUR, AUD, GBP, JPY, dll.\n- Livin' Deposito: Pembukaan instan via Livin' by Mandiri dengan minimum penempatan Rp1.000.000.", category: "Produk", tags: ["Deposito", "ARO", "Investasi", "Mandiri", "Valas"] },
  { id: "17", title: "Mandiri Agen (Layanan Keuangan Laku Pandai)", content: "Program kemitraan perorangan atau badan usaha dengan Bank Mandiri untuk melayani aktivitas perbankan terbatas kepada masyarakat.\nLayanan Mandiri Agen:\n- Pembukaan rekening tabungan Simak/SiMakmur.\n- Setoran tunai dan penarikan tunai laci.\n- Pembayaran tagihan rutin (Listrik, BPJS, PDAM) & pembelian pulsa.\n- Layanan transfer dana antar-bank.", category: "Operasional", tags: ["Mandiri Agen", "Laku Pandai", "Keagenan", "Transaksi", "Lokal"] }
];

export const DEFAULT_OPENING_CHECKLIST: ChecklistItem[] = [
  { id: "o1", title: "Nyalakan PC", checked: false, note: "Gunakan UPS jika tegangan listrik kurang stabil." },
  { id: "o2", title: "Nyalakan Printer Besar", checked: false, note: "Cek kesiapan kertas." },
  { id: "o3", title: "Nyalakan Printer Kecil", checked: false, note: "Cek ribbon/pita pencetak." },
  { id: "o4", title: "Nyalakan Mesin Hitung Uang Kecil", checked: false, note: "Bersihkan sensor debu jika ada error." },
  { id: "o5", title: "Nyalakan Mesin Hitung Uang Gepokan", checked: false, note: "Pastikan wadah siap menampung uang." },
  { id: "o6", title: "Koneksi SNAP Printer (BMB16100)", checked: false, note: "BMB16100 adalah SNAP untuk printer. Pastikan token terpasang." },
  { id: "o7", title: "Login Report Viewer", checked: false, note: "Gunakan kredensial yang valid." },
  { id: "o8", title: "Cetak TL Hari Kemarin", checked: false, note: "Pengingat: Font 8, Landscape, Kertas Scaffold." },
  { id: "o9", title: "Satukan dengan laporan kemarin", checked: false, note: "Gunakan klip besar." },
  { id: "o10", title: "Tulis Alokasi Kas", checked: false, note: "Sesuai dengan sisa saldo fisik kemarin." },
  { id: "o11", title: "Buat Slip Alokasi Kas Besar", checked: false, note: "Diverifikasi oleh BOS/Supervisor." },
  { id: "o12", title: "Buat Slip Alokasi Kas Kecil", checked: false, note: "Pecahan Rp100 s.d Rp10.000." },
  { id: "o13", title: "Login Website NBDS", checked: false, note: "Buka tab browser Chrome baru." },
  { id: "o14", title: "Login Tablet NBDS", checked: false, note: "Pastikan baterai tablet > 50%." },
  { id: "o15", title: "Pastikan BOS sudah mencetak Buku Besar & Stock Report", checked: false, note: "Hubungi Supervisor/BOS." },
  { id: "o16", title: "Teller siap melayani nasabah", checked: false, note: "Ubah status ke Operasional." }
];

export const DEFAULT_CLOSING_CHECKLIST: ChecklistItem[] = [
  { id: "c1", title: "Klop Kas (Rekonsiliasi Kas Sistem vs Fisik)", checked: false, note: "Masukkan nominal kas sistem dan kas fisik untuk verifikasi kesesuaian laci.", type: "custom-reconciliation" },
  { id: "c3", title: "Input Potdal Mikro ke OBDS (User: 1619806)", checked: false, warning: "Slip masuk tabungan wajib melalui NBDS. OBDS hanya untuk Potdal Kredit atau Angsuran.", note: "Kredensial OBDS -> User: 1619806, Pass: 11111111", type: "custom-potdal-obds" },
  { id: "c4", title: "Naik Kas Besar ke BOS melalui NBDS", checked: false, note: "Gunakan pecahan 100k, 50k, 20k, 10k, 5k.", type: "custom-naik-kas" },
  { id: "c5", title: "Alokasi Kas Kecil", checked: false, note: "Gunakan pecahan Rp100." },
  { id: "c6", title: "Input Pembulatan di OBDS (User: 1619806)", checked: false, note: "Gunakan Kode 0917. Kredensial OBDS -> User: 1619806, Pass: 11111111", type: "custom-pembulatan-obds" },
  { id: "c7", title: "Cetak Laporan Gabungan Total Inquiry Teller", checked: false },
  { id: "c8", title: "Cetak Laporan Transaksi Sukses", checked: false },
  { id: "c9", title: "Cetak Laporan Transaksi Gagal", checked: false },
  { id: "c10", title: "Cetak Laporan Transaksi Tertunda", checked: false },
  { id: "c11", title: "Cetak Laporan Transaksi Dikoreksi", checked: false },
  { id: "c12", title: "Cetak Laporan Penyesuaian AS400", checked: false },
  { id: "c13", title: "Cetak Laporan Antar Cabang Gagal", checked: false },
  { id: "c14", title: "Cetak Laporan Diverifikasi Supervisor", checked: false },
  { id: "c15", title: "Cetak Laporan Transaksi Tanpa Buku", checked: false },
  { id: "c16", title: "Download Laporan NBDS", checked: false },
  { id: "c17", title: "Print Laporan NBDS jika ada transaksi", checked: false },
  { id: "c18", title: "Buat Stock Report Excel", checked: false },
  { id: "c19", title: "Siapkan Stock Report Besok", checked: false },
  { id: "c20", title: "Minta BOS Cetak Buku Besar", checked: false },
  { id: "c21", title: "Minta BOS Cetak Stock Report", checked: false },
  { id: "c22", title: "Minta BOS Cetak Laporan 0917", checked: false },
  { id: "c23", title: "Staple Slip Alokasi dengan Laporan 0917", checked: false },
  { id: "c24", title: "Minta BOS Cetak Checklist", checked: false },
  { id: "c25", title: "Selesaikan hari kerja", checked: false, note: "Ubah status ke Hari Selesai." }
];

export const DEFAULT_REMINDERS = [
  { id: "r1", title: "Buku Besar sudah dicetak BOS", checked: false },
  { id: "r2", title: "Stock Report sudah dicetak BOS", checked: false },
  { id: "r3", title: "TL Kemarin sudah dicetak", checked: false },
  { id: "r4", title: "Login NBDS", checked: false },
  { id: "r5", title: "Login Tablet NBDS", checked: false },
  { id: "r6", title: "Alokasi Kas sudah dibuat", checked: false }
];
