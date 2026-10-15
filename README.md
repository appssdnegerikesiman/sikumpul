# Jurnal 7 KAIH — SD Negeri 3 Kesiman

Aplikasi React + Vite + Tailwind, Lucide, Motion, dan Recharts; Google Apps Script sebagai API; spreadsheet sekolah sebagai database; Drive privat untuk foto. Bahasa Indonesia, waktu Asia/Makassar (WITA).

## Status pengerjaan dan batas verifikasi

- Source portal siswa, dashboard guru, API Apps Script, laporan A4, CSV, dan workflow GitHub Pages tersedia.
- Header keenam tab spreadsheet asli sudah diperiksa melalui koneksi Google Drive. Tab dan data yang ada dipertahankan. Pemisah rumus rekap diperbaiki untuk locale Indonesia, kriteria tanggal mendukung tanggal Sheet dan teks ISO, zona waktu diubah ke Asia/Makassar.
- Build produksi berhasil. Tes backend berjalan dengan layanan Google tiruan, menggunakan data fiktif di memori. Tes ini **bukan** bukti deployment Google berhasil.
- Pengiriman produksi, login Google, unggah Drive sesungguhnya, dan cetak laporan dengan data produksi harus diuji setelah deployment. Repositori tujuan: https://github.com/appssdnegerikesiman/sikumpul. URL API, OAuth Client ID, dan daftar email guru belum diberikan. Website belum dinyatakan siap digunakan siswa.

## Struktur

```text
frontend/                 React, Vite, Tailwind
  src/main.jsx            Portal siswa, dashboard, laporan
  src/api.js              Transport API, unggah, kunci sesi pembaruan
  src/style.css           Responsif dan print A4
apps-script/
  Code.gs                 API, validasi, otorisasi, statistik, setup
  appsscript.json          Manifest izin dan WITA
tests/backend.test.cjs    12 skenario otomatis, data fiktif di memori
fixtures/                 Contoh CSV fiktif, tidak dimasukkan ke Sheet asli
.github/workflows/pages.yml
CHECKLIST.md
```

## 1. Jalankan frontend lokal

Gunakan Node.js 22+ dan pnpm 11.25.0.

```sh
cd frontend
pnpm install
cp .env.example .env.local
pnpm dev
```

Pada PowerShell gunakan `Copy-Item .env.example .env.local`. Isi konfigurasi setelah memperoleh deployment API dan OAuth Client ID. Tanpa konfigurasi, portal tetap dapat ditinjau, tetapi tombol kirim memberikan pesan belum terhubung dan tidak menampilkan sukses palsu.

```dotenv
VITE_API_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
VITE_GOOGLE_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
```

Kedua nilai tersebut adalah konfigurasi publik. Jangan memasukkan client secret, password, access token, ID token, daftar siswa, atau Script Properties ke frontend/repository. Tidak ada database localStorage. sessionStorage hanya menyimpan kunci acak pengiriman per tanggal/kelas/absen, tanpa isi jurnal atau nama siswa.

## 2. Siapkan spreadsheet yang sudah ada

Gunakan **hanya** spreadsheet ID `1W5xBJOEPjWcSG1CM9BuGCdRxAaHd0DeRaeXcnEadyqk`.

Pemetaan header yang diperiksa:

| Tab | Kolom dan fungsi |
| --- | --- |
| DATA_SISWA | A ID siswa; B Nama Lengkap; C Kelas; D No. Absen; E Status Aktif |
| JURNAL_HARIAN | A ID; B Tanggal; C Waktu Kirim; D ID siswa; E Nama; F Kelas; G Absen; H:U tujuh pasangan status/keterangan; V jumlah Sudah; W status; X diperbarui |
| DOKUMENTASI | A ID jurnal; B tanggal; C ID siswa; D nama; E kelas; F ID foto olahraga; G ID foto makan; H ID foto ibadah; I izin; J catatan |
| REKAP_KELAS | A kelas; B siswa aktif; C terkumpul; D belum mengisi; E partisipasi; F:L tujuh kebiasaan |
| REKAP_SEKOLAH | A indikator; B nilai. B2 tanggal acuan rekap |
| PENGATURAN | A nama pengaturan; B nilai; C catatan yang telah tersedia |

`setup()` menambahkan header **Y Edit Key Hash** dan **Z Payload Hash** di JURNAL_HARIAN, lalu menyembunyikan kolom tersebut. Fungsi menolak jika header asli berubah atau Y/Z telah digunakan. Tidak menghapus/mengganti tab atau menimpa data yang ada. Kolom tersembunyi bukan batas keamanan; akses spreadsheet tetap harus privat.

Guru harus mendaftarkan siswa di DATA_SISWA terlebih dahulu. Satu baris unik per kelas + absen, kelas persis `I A` s.d. `VI B`, absen 1–38, status `Aktif`. Nama dicocokkan setelah normalisasi spasi dan huruf. Jangan menaruh daftar asli ke repository. Dummy CSV pada fixtures hanya untuk lingkungan uji yang disetujui, jangan impor ke database sekolah secara otomatis.

Tanggal jurnal baru disimpan sebagai teks ISO `YYYY-MM-DD`, waktu kirim/perubahan ISO UTC dengan akhiran Z. Rekap spreadsheet telah disesuaikan supaya menghitung tanggal serial Sheet lama maupun teks ISO baru. Dashboard menghitung langsung dari DATA_SISWA dan JURNAL_HARIAN; tidak bergantung pada rumus rekap. REKAP_SEKOLAH B2 tetap berupa `TODAY()`.

## 3. Buat dan deploy Google Apps Script

1. Buka spreadsheet sekolah dengan akun pengelola, pilih **Extensions → Apps Script**.
2. Salin `apps-script/Code.gs` ke editor. Tampilkan manifest pada pengaturan proyek dan salin `appsscript.json`.
3. Jalankan fungsi `setup` sebagai pemilik. Tinjau dan setujui izin spreadsheet, Drive, dan permintaan eksternal Google. Fungsi membuat folder Drive privat khusus dokumentasi apabila Script Property `PHOTO_FOLDER_ID` belum ada. Tidak membuat spreadsheet baru.
4. Buka **Project Settings → Script Properties**, isi:

| Properti | Nilai |
| --- | --- |
| PHOTO_FOLDER_ID | Diisi setup, atau ID folder privat milik sekolah |
| GOOGLE_CLIENT_ID | OAuth Web Client ID yang sama dengan frontend |
| ADMIN_EMAILS | Email Google guru diizinkan, dipisahkan koma, tanpa wildcard |

5. Pastikan folder bukan folder publik atau shared drive dengan anggota yang tidak berwenang. Jangan aktifkan “Anyone with the link”. Akun pemilik script harus tetap memiliki akses ke Sheet dan folder.
6. **Deploy → New deployment → Web app**: Execute as **Me**, akses **Anyone** untuk menerima jurnal siswa. Operasi admin tetap memerlukan ID token Google valid dan allowlist di server. Bila kebijakan Workspace melarang web app anonim, minta pengelola domain menyiapkan opsi akses yang sesuai; jangan membuka Sheet/Drive untuk mengakalinya.
7. Salin URL `/exec` ke VITE_API_URL. Setelah perubahan backend pilih **Manage deployments → Edit → New version**.

API menggunakan POST `Content-Type: text/plain;charset=utf-8` agar tidak memicu preflight JSON yang tidak didukung Apps Script. Respons JSON tetap dibaca setelah redirect ContentService. Jangan menggunakan `mode:no-cors` karena respons opaque tidak dapat mengonfirmasi simpan. Uji dari origin GitHub Pages sebenarnya; kebijakan domain dapat memengaruhi redirect/CORS.

### Aksi API

```json
{"action":"submitJournal","payload":{"kelas":"I A","absen":1,"nama":"Siswa Uji Alfa","tanggal":"YYYY-MM-DD","editKey":"64 karakter heksadesimal acak","consent":false,"answers":[{"status":"Belum","note":"","photo":null}]},"token":""}
```

Array answers wajib **tujuh** elemen. Contoh di atas hanya menunjukkan struktur satu elemen. Foto berbentuk `{mime:"image/jpeg",data:"BASE64_TANPA_PREFIX"}`. Tidak menerima URL atau path Drive dari siswa.

| Aksi | Akses | Fungsi |
| --- | --- | --- |
| publicSettings / GET | Publik | Sekolah, WITA, tanggal saja |
| submitJournal / updateJournal | Publik, validasi roster + kunci pembaruan | Simpan/perbarui jurnal beserta unggahan |
| adminSummary | ID token + email allowlist | Statistik, baris jurnal, siswa belum mengisi |
| adminClassRecap | ID token + email allowlist | Rekap dengan filter kelas |
| adminReport | ID token + email allowlist | Data laporan, kandidat foto berizin |
| adminDetail | ID token + email allowlist | Tujuh jawaban dan referensi foto |
| adminPhoto | ID token + email allowlist | Byte foto sebagai data URL, bukan URL Drive publik |

Filter admin `{from:"YYYY-MM-DD",to:"YYYY-MM-DD",kelas:""}` maksimal 31 hari. Detail memakai `{id:"ID_JURNAL"}`; foto memakai `{id:"ID_FILE"}`. Frontend mengirim ID token melalui badan POST dan menyimpannya hanya di memori. Tidak ada endpoint daftar siswa atau pembacaan jurnal publik.

## 4. Login Google guru

1. Dalam Google Cloud Console milik sekolah, konfigurasi OAuth consent screen untuk aplikasi sekolah dan buat **OAuth client ID → Web application**. Gunakan identitas organisasi yang benar.
2. Masukkan **Authorized JavaScript origins**: `https://NAMA_AKUN.github.io`, origin custom domain jika ada, dan `http://localhost:5173` / `http://127.0.0.1:5174` untuk pengujian. Origin tidak memuat path repository.
3. Jika aplikasi masih Testing, tambahkan akun guru sebagai test users. Ikuti kebijakan Google Workspace sekolah.
4. Isi Client ID publik di frontend dan Script Properties. Isi ADMIN_EMAILS di server saja.
5. Buka `/#guru`, masuk menggunakan tombol Google. Backend memverifikasi token melalui endpoint Google tokeninfo, lalu memeriksa audience, issuer, expiry, email_verified, dan email allowlist **pada setiap permintaan admin**. ID token dari aplikasi lain atau akun non-guru ditolak.

Tidak ada password admin statis. Client secret tidak diperlukan untuk alur Google Identity Services ini. Jika sesi berakhir, keluar lalu masuk lagi. Jangan menampilkan data admin melalui mode demo publik. Data dummy pengujian ada di tests, bukan dashboard produksi.

## 5. GitHub Pages

Folder `jurnal-7-kaih` dirancang sebagai **root repository tersendiri**. Salin seluruh isinya, termasuk `.github`, ke repository tujuan; file workflow tidak akan aktif bila dibiarkan bersarang pada repository induk. Repository tujuan: `appssdnegerikesiman/sikumpul`. Source proyek ditempatkan di root repository.

1. Buat/pilih repository dan unggah source proyek tanpa `.env.local`, node_modules, data siswa, atau kredensial.
2. Di Settings → Secrets and variables → Actions → **Variables**, tambahkan VITE_API_URL dan VITE_GOOGLE_CLIENT_ID.
3. Di Settings → Pages, pilih source **GitHub Actions**.
4. Push ke branch `main` atau jalankan workflow manual.
5. Workflow memasang dependency memakai lockfile, membangun frontend, lalu deploy `frontend/dist`. `base:'./'` mendukung path repository Pages. Dashboard memakai hash `#guru` sehingga tidak memerlukan fallback server routing.
6. Cocokkan origin Pages dengan konfigurasi OAuth, lalu lakukan checklist produksi.

Jika ingin mempertahankan proyek di subfolder repository lama, ubah `working-directory` workflow menjadi `jurnal-7-kaih/frontend`, path artifact menjadi `jurnal-7-kaih/frontend/dist`, lalu tempatkan workflow di `.github/workflows` pada **root repository lama**. Tinjau dampaknya pada website lama sebelum mengubah sumber Pages.

## 6. Statistik dan laporan

- Total siswa berasal dari roster aktif, bukan hitungan pengirim.
- Statistik membedakan Sudah, Belum, dan Belum ada jurnal.
- Duplikat lama tanggal/kelas/absen diringkas satu entri, sedangkan pengiriman baru menggunakan upsert dengan kunci tanggal/kelas/absen.
- Untuk satu hari, partisipasi adalah jurnal / siswa aktif. Untuk rentang beberapa hari, denominator adalah **siswa aktif × hari kalender**. Akhir pekan tetap dihitung; pilih tanggal yang sesuai kegiatan sekolah. Roster saat ini dipakai untuk seluruh rentang; perubahan status siswa historis belum dilacak.
- Modul laporan: filter periode/kelas → Tampilkan → Laporan Sekolah → lengkapi kepala sekolah, gelar/NIP/alamat jika tersedia → pilih maksimal empat foto berizin → Preview → Cetak PDF → Save as PDF, A4. Identitas tambahan diisi untuk laporan saat itu dan tidak disimpan ke source.
- Kop, tujuan, ringkasan, tabel kelas, grafik batang cetak, analisis data, foto pilihan, kesimpulan, tanggal, dan tanda tangan tersedia. Kepala sekolah default Desak Nyoman Sari, tanpa gelar atau NIP rekaan.
- CSV memakai BOM UTF-8 dan pemisah titik koma agar mudah dibuka Excel berlocale Indonesia. Sel teks berawalan formula dilindungi. CSV memuat jurnal terkumpul dan siswa tanpa jurnal sesuai filter.
- Dokumentasi tidak dimasukkan otomatis. Hanya kandidat dengan izin `Ya` yang tersedia di pemilih laporan. Semua foto tersimpan privat; dashboard mengambil byte lewat server terautentikasi.

## 7. Keandalan, privasi, dan kuota

- Nomor absen bukan password. Roster nama/kelas/absen tidak merupakan autentikasi siswa kuat; orang yang sudah mengetahui identitas dapat mencoba kiriman pertama. Pembaruan membutuhkan kunci acak sesi pemilik kiriman, sehingga siswa lain tidak dapat menimpa hanya dengan absen. Tidak ada akses baca berdasarkan absen. Untuk kebutuhan verifikasi siswa yang lebih kuat, tambahkan akun sekolah atau kode undangan privat per siswa sebelum peluncuran, sesuai kebijakan sekolah.
- Jangan menutup tab atau membersihkan sessionStorage sebelum selesai memperbarui jurnal. Kehilangan kunci tidak membuka hak reset publik; guru melakukan koreksi terverifikasi lewat Sheet. Entri lama tanpa hash juga hanya dikoreksi guru.
- Backend membatasi tipe foto, ukuran 5 MB/foto, memeriksa magic bytes, maksimal tiga slot yang dikenal, total badan sekitar 22 juta karakter. Foto tidak diminta saat Belum. Foto ibadah opsional; foto olahraga/makan wajib saat Sudah. Anjurkan foto kegiatan/benda seperlunya tanpa informasi pribadi lain.
- LockService melindungi pembaruan jurnal/dokumentasi bersamaan; lock menunggu maksimal 30 detik. Permintaan sibuk gagal dengan pesan retry. Unggahan dilakukan dalam lock agar konsisten; untuk sekolah besar jadwalkan pengisian bertahap, kompres foto, pantau durasi dan kuota.
- Foto dibuat sebelum commit jurnal. Jika penulisan gagal, dokumentasi dikembalikan dan file baru ditaruh di Trash; retry dengan payload/kunci sama tidak menggandakan jurnal. File versi lama di-Trash setelah commit. Jika status commit tidak dapat dibaca, server mengembalikan error dan mempertahankan file untuk pemeriksaan pengelola. Tidak mengklaim sukses pada status tidak pasti.
- Timeout frontend 90 detik tidak memastikan proses server dibatalkan; kirim ulang dengan identitas/sesi sama. Fingerprint payload membuat retry identik idempotent. Pembaruan berbeda dibatasi 20 detik per jurnal.
- Statistik membaca data Sheet langsung dan membatasi rentang 31 hari, tetapi biaya baca tetap meningkat seiring riwayat jurnal. Arsipkan periode lama secara privat setelah kebijakan retensi sekolah ditetapkan. Jangan menghapus otomatis. Untuk skala lebih besar, pindahkan backend ke layanan dengan transaksi dan rate limit yang sesuai.
- Jangan membagikan Sheet atau folder Drive secara publik. Batasi editor spreadsheet dan Apps Script. Jangan mencetak/log payload jurnal, token, base64, atau data siswa. Tinjau log kegagalan, Trash file yatim, kuota Apps Script/Drive, daftar guru dan retensi foto secara rutin.
- Data laporan adalah data internal sekolah. Simpan CSV/PDF di lokasi yang diizinkan, pilih foto berizin, dan ikuti kebijakan persetujuan orang tua.

## 8. Uji

```sh
node --test tests/backend.test.cjs
cd frontend
pnpm build
```

Tes mencakup normalisasi, upsert/retry, kunci pembaruan, validasi, unggahan privat, rollback, rekap roster, periode, akses admin, pemeriksaan token, dan formula injection. Lanjutkan `CHECKLIST.md` untuk pengujian layanan Google sesungguhnya, aksesibilitas, responsivitas, serta cetak A4. Jangan mengisi data dummy ke Sheet asli tanpa keputusan pengelola.
