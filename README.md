# Aplikasi Pengingat Tugas

Aplikasi Pengingat Tugas adalah aplikasi web sederhana (single-file) untuk membuat, menjadwalkan, dan mengelola tugas dengan pengingat notifikasi dan alarm. Aplikasi ini dibuat untuk berjalan sepenuhnya di browser (client-side) dan menggunakan Service Worker untuk menampilkan notifikasi.

## Fitur utama

- Menambah, mengedit, dan menghapus tugas
- Mengatur tanggal dan waktu pengerjaan (due date)
- Notifikasi browser melalui Service Worker (jika diizinkan)
- Alarm suara berulang sampai dihentikan
- Tampilan daftar, kalender, dan grafik (chart)
- Ekspor data (Teks .txt atau PDF .pdf) dengan format tanggal yang ramah pembaca (Bahasa Indonesia)
- Penyimpanan data di `localStorage`

## Segera hadir

- Versi Android sedang dalam pengembangan dan akan segera dirilis. Nantikan pembaruan jika Anda ingin menjalankan aplikasi ini sebagai aplikasi Android (PWA/packaged app).

## Struktur proyek

- `index.html` — file utama aplikasi (HTML, CSS, JS digabung)
- `index.html.bak` — salinan backup (terjemahan / eksperimen)
- `sw.js` — service worker untuk notifikasi
- `manifest.json` — manifest PWA
- `sound/` — folder berisi file suara alarm

## Prasyarat

- Aplikasi ini murni berbasis HTML, CSS, dan JavaScript (client-side). Tidak perlu Python untuk menjalankan aplikasi; Python hanya dicontohkan sebagai cara cepat menjalankan server lokal.
- Browser modern (Chrome, Edge, Firefox) dengan dukungan Service Worker dan Notifications API.
- Untuk pengujian lokal, jalankan melalui server HTTP. Disarankan menggunakan Live Server (VS Code) atau Live Preview / Live Server extension agar Service Worker dan fitur PWA bekerja dengan baik; file:// tidak selalu mendukung Service Worker.

## Menjalankan (cara cepat)

Cara termudah: jalankan web server dari direktori proyek. Rekomendasi:

- Menggunakan Live Server (VS Code) atau Live Preview extension — klik kanan pada `index.html` -> "Open with Live Server".
- Atau jalankan server sederhana jika Anda menyukai baris perintah.

Contoh (PowerShell) — Node.js http-server (jika terpasang):

```powershell
# instal http-server sekali (jika belum terpasang)
npm install -g http-server
# jalankan server pada port 8000
http-server -p 8000
# lalu buka http://localhost:8000 di browser
```

Contoh cepat dengan Python (opsional):

```powershell
# buka PowerShell pada folder proyek
python -m http.server 8000
# lalu buka http://localhost:8000 di browser
```

Catatan: Live Server / Live Preview lebih nyaman karena otomatis me-refresh dan bekerja baik dengan Service Worker saat dikonfigurasi untuk `localhost`.

## Menggunakan aplikasi

1. Buka halaman `index.html` melalui server (mis. http://localhost:8000).
2. Tambah tugas memakai tombol + di kanan bawah.
3. Set tanggal/waktu pengerjaan (due date). Jika waktu tugas telah tiba dan notifikasi diizinkan, aplikasi akan menampilkan notifikasi dan memulai alarm.
4. Saat notifikasi muncul, Anda bisa menunda (snooze), menandai selesai, atau menghentikan alarm.
5. Buka Pengaturan untuk memilih suara alarm, volume, dan tampilan (chart/calendar).

## Ekspor data

- Tombol ekspor membuka dialog (SweetAlert2) yang meminta Anda memilih format:
  - Teks (.txt) — file teks yang mudah dibaca dengan tanggal yang sudah diformat ke Bahasa Indonesia.
  - PDF (.pdf) — dibuat menggunakan jsPDF (jika library tersedia); bila tidak tersedia, akan fallback ke .txt.

Catatan: tanggal dalam hasil ekspor telah diformat menggunakan helper `formatDate()` sehingga contoh ISO seperti `2025-11-18T15:32:00.000Z` ditampilkan sebagai tanggal/waktu lokal yang mudah dibaca.

## Backup dan terjemahan

- Ada file `index.html.bak` yang berisi versi dengan beberapa identifier/label yang diterjemahkan ke Bahasa Indonesia. Jika Anda ingin menjadikan versi itu sebagai file aktif, Anda harus menyalin/menimpa `index.html` dengan `index.html.bak` dan memastikan konsistensi antara ID/selector dan `sw.js` (service worker) jika ada referensi yang bergantung pada nama tertentu.

## Service Worker & Notifikasi

- `sw.js` mengelola penayangan notifikasi dan aksi ketika pengguna berinteraksi dengan notifikasi.
- Pastikan Anda mengakses aplikasi via `https://` atau lewat `http://localhost` selama pengembangan agar Service Worker dapat didaftarkan.

## Troubleshooting umum

- Alarm tidak berbunyi:

  - Pastikan file suara ada di folder `sound/` dan nama yang dipilih sesuai.
  - Periksa pengaturan volume di modal Pengaturan.
  - Beberapa browser mengharuskan interaksi pengguna (click) sebelum suara dapat diputar. Jalankan tes suara dari UI (Test Suara) terlebih dahulu.

- Notifikasi tidak muncul:

  - Pastikan browser meminta izin notifikasi dan Anda memilih "Allow"/"Izinkan".
  - Jika menggunakan file://, Service Worker tidak akan didaftarkan — gunakan server lokal.

- PDF tidak terbuat / error:
  - jsPDF dimuat dari CDN; jika CDN diblokir atau offline, exporter akan fallback ke file .txt.

## Pengembangan & kontribusi

- Proyek ini sederhana dan berbasis file; untuk kontribusi:
  1. Fork atau salin repositori ke folder kerja Anda.
  2. Buka `index.html`, lakukan perubahan, dan tes di browser melalui server lokal.
  3. Jika Anda mengubah ID/kelas atau payload notifikasi, pastikan `sw.js` masih sinkron dengan perubahan tersebut.

## Lisensi

- Anda dapat menambahkan lisensi sesuai kebutuhan. Saat ini file lisensi belum disertakan.

## Kontak / Catatan terakhir

- File backup `index.html.bak` dibuat untuk mempermudah rollback jika terjemahan atau perubahan menyebabkan masalah.
- Jika Anda ingin saya menambahkan petunjuk lebih rinci (mis. cara build menjadi PWA, detail struktur data `localStorage`, atau menambah skrip pengujian), beri tahu saya dan saya akan tambahkan.
