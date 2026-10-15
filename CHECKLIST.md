# Checklist sebelum digunakan siswa

## Sudah diuji pada pengerjaan source

- [x] Build Vite produksi.
- [x] Dua belas tes backend dengan layanan Google tiruan, seluruhnya lulus.
- [x] Pengisian identitas dan tujuh status melalui browser.
- [x] Pesan belum terhubung; tidak ada sukses palsu tanpa backend.
- [x] Pemeriksaan header spreadsheet asli, perbaikan parsing rumus, pembacaan ulang nilai rekap tanpa error.
- [x] Zona waktu spreadsheet WITA.

## Wajib diuji setelah deployment Google dan GitHub

- [ ] Jalankan setup; cocokkan semua header, kolom Y/Z, serta folder privat.
- [ ] Daftarkan roster asli hanya di DATA_SISWA, cek tidak ada kelas/absen ganda.
- [ ] Konfigurasi OAuth origin, Script Properties, dan variables Pages.
- [ ] Kirim jurnal menggunakan identitas uji yang secara khusus diizinkan pengelola. Cocokkan nilai di Sheet dan timestamp WITA.
- [ ] Kirim ulang dari tab yang sama: hanya satu baris jurnal, satu dokumentasi aktif; foto lama di Trash.
- [ ] Coba dari sesi lain: pembaruan ditolak, tidak ada endpoint membaca jurnal publik.
- [ ] Pilih Sudah olahraga/makan tanpa foto: ditolak; Belum tidak meminta foto; ibadah tanpa foto diterima.
- [ ] File palsu ber-MIME gambar atau >5 MB ditolak server.
- [ ] Simulasikan koneksi lambat/gagal, retry, klik ganda, dan pengisian serentak dari beberapa perangkat.
- [ ] Akun non-guru, token kedaluwarsa, dan token aplikasi lain ditolak untuk semua operasi admin termasuk foto.
- [ ] Akun guru di allowlist dapat memuat dashboard, detail, foto, rekap, dan daftar belum mengisi.
- [ ] Bandingkan rekap satu hari dan periode dengan hitungan manual roster. Sudah + Belum + tanpa jurnal = kesempatan pengisian untuk setiap kebiasaan.
- [ ] Pastikan semua 12 kelas muncul pada rekap sekolah; filter kelas dan periode bekerja.
- [ ] Cabut izin dokumentasi, perbarui jurnal: foto tidak masuk kandidat laporan.
- [ ] Preview dan cetak A4: kop, tabel, grafik, foto, tanggal, tanda tangan terbaca dan tidak terpotong. Uji laporan kosong serta periode padat.
- [ ] CSV terbuka dengan benar di Excel; nama berkarakter Indonesia tetap terbaca; formula teks tidak dieksekusi.
- [ ] Uji layar 360/390/768/1280 px, zoom 200%, keyboard, fokus, pembaca layar, dan reduced motion.
- [ ] Uji pergantian tanggal WITA saat browser masih terbuka: server menolak tanggal lama dan memberi instruksi muat ulang.
- [ ] Pastikan repository dan bundle tidak memuat daftar siswa asli, token, kredensial, maupun foto.
- [ ] Tinjau izin Sheet/folder, kuota, kebijakan retensi foto, serta mekanisme koreksi identitas oleh guru.

Jangan menandai checklist produksi sebagai lulus hanya berdasarkan tes lokal.
