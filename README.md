# Sikumpul — SD Negeri 3 Kesiman

Versi operasional untuk kegiatan Jumat, 16 Oktober 2026: orang tua mengisi Jurnal 7 KAIH bertahap; guru memantau lewat Google Sheets. Login/dashboard guru di website dihapus dari alur operasional. Laporan tabel/PDF disusun kemudian dari data Sheet sesuai kebutuhan sekolah.

Website: https://appssdnegerikesiman.github.io/sikumpul/

## Cara orang tua mengisi

1. Buka tugas Jurnal 7 KAIH, pilih kelas dan absen, ketik nama lengkap anak saat pengisian pertama.
2. Pilih Sudah atau Belum pada kebiasaan yang ingin dicatat; isi keterangan dan foto bila diminta.
3. Tekan **Simpan kebiasaan ini**. Tunggu konfirmasi berhasil dari server. Tidak perlu mengisi semua kebiasaan sekaligus.
4. Lanjutkan kartu lain sepanjang hari. Setelah menutup halaman, gunakan HP/browser yang sama, pilih kelas dan absen, lalu **Buka jurnal tersimpan**.
5. Belum diisi berbeda dari Belum dilakukan. Tidur Cepat dicatat berdasarkan malam sebelumnya.

Foto olahraga dan makan sehat wajib saat Sudah; ibadah opsional. JPG/PNG/WebP maksimal 5 MB per foto. Foto lama yang sudah tersimpan tidak perlu diunggah ulang saat mengisi kartu lain.

## Privasi dan melanjutkan jurnal

Database utama tetap Google Sheets dan Drive. Browser hanya menyimpan **kunci acak perangkat** di localStorage, tanpa isi jurnal/foto/nama sebagai database lokal. Kunci sessionStorage versi lama dimigrasikan ketika perangkat yang sama digunakan.

Membuka jurnal tersimpan memerlukan kunci acak yang cocok; kelas dan absen saja tidak memberikan akses baca. Jangan membersihkan data situs, memakai mode incognito, atau berganti browser selama pengisian. Jika kunci hilang, guru menangani koreksi lewat Sheet; tidak tersedia reset publik berdasarkan absen.

Nama/kelas/absen bukan autentikasi kuat. Orang yang mengetahui identitas masih dapat mencoba pengisian pertama pada slot kosong. Jangan membagikan kunci perangkat atau akses editor Sheet/Drive kepada pihak yang tidak berwenang.

## Guru lewat Google Sheets

Spreadsheet yang digunakan tetap ID `1W5xBJOEPjWcSG1CM9BuGCdRxAaHd0DeRaeXcnEadyqk`.

- **DATA_SISWA**: 12 kelas I A–VI B, masing-masing absen 1–38, total 456 slot. Nama kosong berstatus Belum Terdaftar; setelah pengiriman pertama nama tercatat dan status menjadi Aktif. Slot kosong tidak dihitung sebagai siswa aktif. Koreksi ejaan nama dilakukan guru di sini.
- **JURNAL_HARIAN**: satu baris per tanggal/kelas/absen. Setiap penyimpanan menggabungkan kartu yang dikirim dengan isian sebelumnya. Kolom status jurnal menampilkan `Bertahap (n/7)` atau `Lengkap`. Sel kebiasaan kosong berarti belum diisi, bukan Belum.
- **DOKUMENTASI**: ID foto pada F:H; kolom K:M berisi tautan Lihat Foto. File tetap privat, tautan hanya dapat dibuka akun Google yang memiliki izin Drive.
- **REKAP_KELAS / REKAP_SEKOLAH**: ringkasan sesuai tanggal acuan REKAP_SEKOLAH B2. Sudah Mengisi berarti sudah memiliki setidaknya satu isian; lihat kolom W jurnal untuk kelengkapan tujuh kebiasaan. Jumlah Sudah tetap berdasarkan jawaban aktual.
- **PENGATURAN**: identitas sekolah dan informasi program.

Nama/file siswa tidak disalin ke repositori. Data dummy hanya di tests/fixtures. Rekap memakai roster aktif saat ini, bukan histori perubahan status siswa. Karena pendaftaran dilakukan saat pengisian pertama, daftar ini belum mencakup siswa nyata yang sama sekali belum pernah mendaftar; guru dapat melengkapi roster resmi bila ingin angka partisipasi terhadap seluruh siswa nyata.

## Backend Apps Script

Kode: `apps-script/Code.gs`, manifest: `apps-script/appsscript.json`.

Jalankan setup satu kali sebagai pemilik untuk memeriksa header asli, menyiapkan hash pada Y:Z JURNAL_HARIAN, mengatur WITA, dan membuat folder Drive privat. Jangan menghapus tab/data yang sudah ada. Deployment berjalan sebagai pemilik dengan akses Anyone; hanya aksi publik terbatas yang dapat digunakan siswa. Operasi admin lama tetap ditolak tanpa otorisasi backend, dan tidak digunakan pada versi operasional ini.

Aksi publik POST JSON melalui Content-Type text/plain:
- publicSettings: identitas sekolah, tanggal WITA.
- submitJournal / updateJournal: array tujuh jawaban; status kosong berarti kartu itu tidak diubah. Minimal satu status terisi. Foto baru hanya untuk kartu yang diubah. Server memvalidasi roster, kunci perangkat, status, dan file.
- resumeJournal: tanggal/kelas/absen + editKey acak; hanya mengembalikan jurnal pemilik kunci. Tidak mengembalikan ID Drive atau foto orang lain.

LockService mencegah konflik. Kiriman ulang memperbarui baris yang sama; unggahan gagal dibersihkan/dirollback bila status commit diketahui. Perubahan berbeda tidak lagi dibatasi 20 detik agar kartu dapat disimpan satu per satu. Periksa kuota Apps Script/Drive dan anjurkan foto seperlunya. Tidak ada penghapusan riwayat otomatis.

Setelah mengubah kode: **Kelola deployment → Edit → Versi baru → Terapkan**, pertahankan deployment dan URL yang sama. Script Property PHOTO_FOLDER_ID tetap dipertahankan. Tidak diperlukan OAuth Client ID untuk alur siswa ini.

## Frontend dan GitHub Pages

React + Vite + Tailwind, Lucide. Struktur frontend/, apps-script/, tests/.

```sh
cd frontend
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

Node 22+, pnpm 11.25.0. Konfigurasi publik VITE_API_URL tersedia lewat GitHub Actions repository variable; .env.local digunakan untuk lokal dan diabaikan Git. Jangan memasukkan kredensial/token/data siswa ke source. Pages memakai workflow .github/workflows/pages.yml dan base relatif.

## Pengujian

```sh
node --test tests/backend.test.cjs
```

19 tes memakai layanan Google tiruan: validasi, upsert, enrollment, rollback, privasi, resume dengan kunci, penyimpanan bertahap, pelestarian foto, dan pembedaan status kosong. Verifikasi browser dan layanan produksi tetap diperlukan. Jangan mengirim data dummy ke Sheet sekolah tanpa izin pengelola.
