# PRD KitoApps

## Property Intelligence, Listing & Valuation System

**Versi:** 1.0
**Platform awal:** Glide + Google Sheets
**Primary Color:** `#EACA40`
**Warna pendukung:** Hitam `#000000`, Putih `#FFFFFF`

---

# 1. Product Overview

**KitoApps** adalah aplikasi untuk mengelola seluruh siklus data dan aktivitas properti, mulai dari:

**Database Properti → Listing → Leads → Survey → Offer → Transaksi**

serta menyediakan:

**Valuasi Properti → Kalkulasi Transaksi → Laporan Valuasi**

KitoApps bukan hanya database, tetapi merupakan sistem terintegrasi untuk **property data management, listing management, lead management, transaction calculation, dan property valuation**.

---

# 2. Tujuan Produk

KitoApps bertujuan untuk:

1. Membuat satu database properti yang terstruktur.
2. Memisahkan data **Property** dan **Listing**.
3. Mendukung Regular Listing dan Exclusive Listing.
4. Mengelola leads, survey, dan offer.
5. Mengelola proses transaksi.
6. Menyediakan kalkulator valuasi berbasis comparable.
7. Mengurangi subjektivitas dalam penilaian properti.
8. Menggunakan faktor koreksi yang dapat dikonfigurasi.
9. Menyimpan seluruh riwayat valuasi.
10. Menghasilkan laporan valuasi.
11. Memungkinkan Admin mengubah parameter sistem tanpa mengubah struktur aplikasi.

---

# 3. Struktur Menu Utama

## HOME / DASHBOARD

Ringkasan seluruh aktivitas.

## DATABASE PROPERTI

* Input Property
* Cari Data Property

## LISTING

* Regular Listing
* Exclusive Listing
* Manage Listing
* Manage Leads
* Manage Survey
* Manage Offer
* Laporan Leads

## VALUASI

* Kalkulator Valuasi Properti
* Kalkulasi Transaksi
* Laporan Valuasi

## PENGATURAN

* Parameter Faktor Koreksi
* Parameter Bangunan
* Parameter Mitigasi
* Parameter Utilitas
* Parameter Zona Kawasan
* Parameter Zona Perkembangan
* Parameter Transaksi
* Master Data
* User & Role
* Riwayat Perubahan Parameter

---

# 4. Arsitektur Workflow

## Property Management

```text
DATABASE PROPERTI
       │
       ├── INPUT PROPERTY
       │
       └── CARI DATA PROPERTY
```

## Listing Management

```text
PROPERTY
   ↓
LISTING
   ├── REGULAR
   └── EXCLUSIVE
          ↓
        LEADS
          ↓
        SURVEY
          ↓
        OFFER
          ↓
       TRANSAKSI
```

## Valuation

```text
PROPERTY / LISTING
       ↓
KALKULATOR VALUASI
       ↓
SMART COMPARABLE
       ↓
MATCH SCORE
       ↓
FAKTOR KOREKSI
       ↓
NILAI TANAH
       +
NILAI BANGUNAN
       ↓
INDIKASI NILAI PASAR
       ↓
KALKULASI TRANSAKSI
       ↓
LAPORAN VALUASI
```

---

# 5. Modul Home / Dashboard

Dashboard menampilkan KPI:

* Total Property
* Total Listing
* Regular Listing
* Exclusive Listing
* Active Listing
* Total Leads
* Survey Terjadwal
* Survey Selesai
* Offer Aktif
* Transaksi
* Total Valuasi

## Quick Action

* Input Property
* Input Listing
* Tambah Lead
* Jadwalkan Survey
* Buat Offer
* Kalkulator Valuasi
* Kalkulasi Transaksi

## Recent Activity

Menampilkan aktivitas terbaru:

* Property baru
* Listing baru
* Lead baru
* Survey
* Offer
* Transaksi
* Valuasi

---

# 6. Modul Database Properti

Database Properti adalah **Master Property Database**.

Satu property mempunyai satu:

**Property_ID**

Property_ID dibuat otomatis oleh sistem.

## Data Property

### Identitas

* Property_ID
* Tanggal Input
* Tahun
* Status
* Sumber
* URL Sumber

### Lokasi

* Alamat
* Kecamatan
* Kelurahan
* Google Maps

### Karakteristik

* Jenis Properti
* Tingkat Bangunan
* Kondisi Properti
* Akses Jalan
* Posisi Objek
* Legalitas

### Ukuran

* Luas Tanah
* Luas Bangunan

### Harga

* Harga Jual
* Harga/m²
* NJOP

### Data Lokasi

* Skor Kelurahan
* Skor Mitigasi
* Skor Utilitas
* Zona Kawasan
* Zona Perkembangan

### Dokumentasi

* Foto
* Catatan

---

# 7. Input Property

Input Property digunakan untuk memasukkan property baru.

Flow:

```text
INPUT PROPERTY
      ↓
VALIDASI DATA
      ↓
GENERATE PROPERTY_ID
      ↓
DATABASE PROPERTI
```

Jika property sudah ada, sistem harus mencegah pembuatan duplicate property yang tidak diperlukan.

---

# 8. Cari Data Property

Fitur pencarian harus mendukung:

* Keyword
* Kecamatan
* Kelurahan
* Jenis Properti
* Tingkat Bangunan
* Kondisi
* Akses
* Posisi
* Legalitas
* LT Minimum
* LT Maksimum
* LB Minimum
* LB Maksimum
* Harga Minimum
* Harga Maksimum
* Zona Kawasan
* Zona Perkembangan

Hasil pencarian menampilkan:

* Property ID
* Alamat
* Kecamatan
* Kelurahan
* Jenis
* LT
* LB
* Harga
* Status
* Skor Kelurahan

---

# 9. Modul Listing

Listing harus terhubung dengan Property melalui:

**Property_ID**

Data property tidak perlu dimasukkan ulang ketika membuat listing.

## Jenis Listing

### Regular Listing

Listing biasa.

### Exclusive Listing

Listing eksklusif.

Keduanya otomatis masuk ke:

**Database Listing**

dan tetap terhubung dengan:

**Database Properti**

---

# 10. Database Listing

Field utama:

* Listing_ID
* Property_ID
* Jenis Listing
* Tanggal Input
* Tanggal Update
* Status Listing
* Sumber Listing
* URL
* Harga Listing
* Pemilik
* Kontak Pemilik
* PIC
* Tanggal Mulai
* Tanggal Berakhir
* Fee/Komisi
* Catatan

## Status Listing

* Draft
* Aktif
* Negotiation
* Offer
* Sold
* Withdrawn
* Expired

---

# 11. Manage Leads

Leads merupakan calon buyer/prospect yang berhubungan dengan listing.

Database Lead:

* Lead_ID
* Listing_ID
* Property_ID
* Nama
* Nomor Kontak
* Sumber Lead
* PIC
* Tanggal Masuk
* Kebutuhan
* Budget
* Status
* Catatan

## Status Lead

* New
* Contacted
* Qualified
* Survey
* Offer
* Negotiation
* Won
* Lost
* Follow Up

---

# 12. Manage Survey

Survey harus terhubung dengan Property, Listing, dan Lead.

Database Survey:

* Survey_ID
* Property_ID
* Listing_ID
* Lead_ID
* Tanggal
* Jam
* PIC
* Status
* Hasil Survey
* Catatan
* Foto
* Lokasi

## Status Survey

* Scheduled
* Confirmed
* Completed
* Rescheduled
* Cancelled
* No Show

## Flow

```text
LEAD
 ↓
JADWALKAN SURVEY
 ↓
SURVEY
 ↓
HASIL SURVEY
 ↓
FOLLOW UP
 ↓
OFFER
```

---

# 13. Manage Offer

Offer terhubung dengan:

* Property
* Listing
* Lead
* Survey

Database Offer:

* Offer_ID
* Property_ID
* Listing_ID
* Lead_ID
* Tanggal Offer
* Harga Listing
* Harga Offer
* Buyer
* Metode Pembayaran
* DP
* Tenor
* Status
* Catatan
* PIC

## Status Offer

* Draft
* Submitted
* Negotiation
* Accepted
* Rejected
* Expired
* Cancelled

Jika Offer Accepted, data dapat diteruskan ke **Kalkulasi Transaksi**.

---

# 14. Laporan Leads

Laporan Leads menampilkan performa funnel:

```text
TOTAL LEADS
     ↓
CONTACTED
     ↓
QUALIFIED
     ↓
SURVEY
     ↓
OFFER
     ↓
NEGOTIATION
     ↓
WON
```

KPI:

* Total Leads
* Leads Aktif
* Leads Qualified
* Survey
* Offer
* Won
* Lost
* Conversion Rate
* Listing dengan lead terbanyak
* PIC performance

---

# 15. Modul Valuasi

Modul Valuasi mempunyai tiga bagian:

### 1. Kalkulator Valuasi Properti

### 2. Kalkulasi Transaksi

### 3. Laporan Valuasi

---

# 16. Kalkulator Valuasi Properti

## Input Objek

* Jenis Properti
* Tingkat Bangunan
* Kondisi Bangunan
* Alamat
* Kecamatan
* Kelurahan
* Posisi Objek
* Luas Tanah
* Luas Bangunan
* Standar Biaya Bangunan/m²
* Akses Jalan
* Legalitas
* NJOP
* Tahun
* Skor Mitigasi
* Skor Utilitas
* Zona Kawasan
* Zona Perkembangan
* Skor Kelurahan

---

# 17. Smart Comparable

Sistem mencari pembanding dari Database Properti.

Jumlah pembanding yang dapat diminta:

**1–10 pembanding.**

User dapat menentukan:

* Jumlah pembanding
* LT Minimum
* LT Maksimum

Sistem tidak boleh membuat data pembanding fiktif.

Jika user meminta 10 tetapi hanya terdapat 6 pembanding valid, sistem menggunakan 6 pembanding.

---

# 18. Match Score

Match Score digunakan untuk menentukan tingkat kemiripan pembanding terhadap objek.

Skala:

**0–100**

Faktor yang digunakan antara lain:

* Kelurahan
* Kecamatan
* Jenis Properti
* Tingkat Bangunan
* Kondisi
* Luas
* Karakteristik lokasi

Match Score digunakan untuk **ranking pembanding**, bukan sebagai Faktor Koreksi.

---

# 19. Faktor Koreksi

KitoApps menggunakan **10 kelompok faktor koreksi** yang telah ditetapkan dalam rancangan valuasi:

1. **Waktu**
2. **Status**
3. **Akses**
4. **Posisi**
5. **Legalitas**
6. **Selisih Luas**
7. **Skor Mitigasi**
8. **Skor Utilitas**
9. **Zona Kawasan**
10. **Zona Perkembangan**

Faktor-faktor tersebut diterapkan kepada pembanding setelah pembanding terpilih.

### Catatan penting

PRD tidak mengarang ulang besaran angka faktor yang pernah ditetapkan sebelumnya.

**Besaran faktor koreksi harus disimpan sebagai Parameter Pengaturan KitoApps**, sehingga nilai yang sudah ditetapkan dapat dimasukkan ke tabel parameter dan dapat diubah oleh Admin.

---

# 20. Parameter Faktor Koreksi

Struktur parameter:

| Faktor    | Parameter      | Nilai | Aktif |
| --------- | -------------- | ----: | ----- |
| Akses     | Jalan Utama    |     — | Ya    |
| Akses     | Jalan Sekunder |     — | Ya    |
| Akses     | Jalan Gang     |     — | Ya    |
| Akses     | Tanpa Akses    |     — | Ya    |
| Posisi    | Tengah         |     — | Ya    |
| Posisi    | Hook           |     — | Ya    |
| Legalitas | SHM            |     — | Ya    |
| Legalitas | HGB            |     — | Ya    |
| Legalitas | AJB/PPJB       |     — | Ya    |
| Legalitas | Girik/Letter C |     — | Ya    |
| ...       | ...            |   ... | ...   |

Nilai `—` di atas merupakan **placeholder**, bukan nilai faktor baru.

Nilai resmi menggunakan parameter yang telah ditetapkan untuk sistem valuasi KitoApps.

---

# 21. Selisih Luas

Sistem menghitung perbedaan luas antara:

**Objek Valuasi**

dan

**Pembanding**

Kemudian menerapkan parameter koreksi Selisih Luas.

---

# 22. Skor Mitigasi

Skala:

**0–100**

Semakin tinggi skor berarti semakin baik/aman.

Komponen yang telah digunakan:

* Banjir
* Tsunami
* Banjir Bandang
* Longsor

Hasil skor kemudian diterjemahkan menjadi faktor koreksi sesuai Parameter Pengaturan.

---

# 23. Skor Utilitas

Skala:

**0–100**

Parameter mencakup kualitas utilitas/infrastruktur seperti:

* Listrik
* Air
* Telekomunikasi/Internet
* Drainase
* Sanitasi
* Infrastruktur pendukung

Hasil skor kemudian diterjemahkan menjadi faktor koreksi.

---

# 24. Zona Kawasan

Kategori:

* Komersial Utama
* Dekat Pusat Keramaian
* Komersial Sekunder
* Permukiman Standar
* Industri/Pinggiran

Besaran faktor masing-masing kategori disimpan di Pengaturan.

---

# 25. Zona Perkembangan

Kategori:

* Puncak
* Berkembang Pesat
* Berkembang
* Netral
* Tertinggal

Besaran faktor masing-masing kategori disimpan di Pengaturan.

---

# 26. Harga Terkoreksi

Setiap pembanding menghasilkan:

**Harga Asli → Faktor Koreksi → Harga Terkoreksi**

Hanya pembanding yang memiliki data valid yang boleh digunakan dalam perhitungan akhir.

Jika terdapat 6 pembanding valid dari 10 slot, rata-rata harus dibagi **6**, bukan 10.

Sistem harus mencegah:

* `#DIV/0!`
* `NA`
* pembagian dengan jumlah slot kosong
* hasil valuasi palsu

---

# 27. Nilai Tanah

Konsep perhitungan:

**Rata-rata Harga Terkoreksi/m² × Luas Tanah Objek**

---

# 28. Nilai Bangunan

Konsep perhitungan:

**Luas Bangunan × Standar Biaya Bangunan/m²**

Parameter biaya bangunan disimpan di:

**Pengaturan → Parameter Bangunan**

Kategori dapat mencakup:

* Jenis Properti
* Tingkat Bangunan
* Kondisi

Kondisi yang digunakan:

* Standar
* Mewah
* Perlu Renovasi
* Ruko Tua/Renovasi Berat

---

# 29. Indikasi Nilai Pasar

Output utama:

**Indikasi Nilai Pasar = Nilai Tanah + Nilai Bangunan**

Hasil ditampilkan secara prominent.

---

# 30. Harga Listing dan Harga Likuidasi

KitoApps menyediakan rekomendasi berdasarkan parameter yang telah ditetapkan.

Parameter persentase harus disimpan di:

**Pengaturan → Parameter Valuasi**

sehingga dapat diubah Admin tanpa mengubah logic aplikasi.

---

# 31. Kalkulasi Transaksi

Kalkulasi Transaksi berbeda dengan Kalkulator Valuasi.

### Kalkulator Valuasi

Menjawab:

> Berapa indikasi nilai properti?

### Kalkulasi Transaksi

Menjawab:

> Berapa hasil finansial jika transaksi dilakukan pada harga tertentu?

Data dapat mencakup:

* Harga Listing
* Harga Offer
* Harga Deal
* DP
* Sisa pembayaran
* Metode pembayaran
* Fee
* Komisi
* Biaya transaksi
* Biaya lain
* Net Transaction
* Margin

---

# 32. Laporan Valuasi

Laporan menampilkan:

1. Identitas objek
2. Data objek
3. Metodologi
4. Data pembanding
5. Match Score
6. Faktor Koreksi
7. Harga Terkoreksi
8. Nilai Tanah
9. Nilai Bangunan
10. Indikasi Nilai Pasar
11. Harga Listing
12. Harga Likuidasi
13. Catatan
14. Tanggal valuasi
15. Valuation ID

Output akhir:

**Laporan Valuasi / PDF**

---

# 33. Database Valuasi

Setiap valuasi mendapatkan:

**Valuation_ID**

Contoh:

`VAL-0001`

Database menyimpan:

* Valuation_ID
* Property_ID
* Tanggal
* User
* Jumlah Pembanding
* LT Min
* LT Max
* Nilai Tanah
* Nilai Bangunan
* Indikasi Nilai Pasar
* Harga Listing
* Harga Likuidasi
* Status
* Catatan

---

# 34. Database Valuasi Pembanding

Gunakan struktur relasional.

Satu valuasi dapat mempunyai maksimal 10 pembanding.

```text
VALUASI
   │
   ├── Pembanding 1
   ├── Pembanding 2
   ├── Pembanding 3
   ├── ...
   └── Pembanding 10
```

Database:

**Valuasi_Pembanding**

Field:

* Valuation_Comparable_ID
* Valuation_ID
* Property_ID
* Urutan
* Match Score
* Harga Asli
* Selisih Luas
* Faktor Koreksi
* Harga Terkoreksi
* Status Valid/Invalid

---

# 35. Modul Pengaturan

Pengaturan adalah **control center KitoApps**.

## A. Parameter Faktor Koreksi

Mengubah besaran:

* Waktu
* Status
* Akses
* Posisi
* Legalitas
* Selisih Luas
* Mitigasi
* Utilitas
* Zona Kawasan
* Zona Perkembangan

## B. Parameter Bangunan

Mengubah:

* Jenis
* Tingkat
* Kondisi
* Biaya/m²

## C. Parameter Mitigasi

Mengatur hubungan:

**Skor 0–100 → Faktor Koreksi**

## D. Parameter Utilitas

Mengatur hubungan:

**Skor 0–100 → Faktor Koreksi**

## E. Parameter Zona

Mengatur nilai Zona Kawasan dan Zona Perkembangan.

## F. Parameter Transaksi

Mengatur parameter:

* Fee
* Komisi
* Biaya
* Persentase lainnya

## G. Master Data

Mengelola:

* Kecamatan
* Kelurahan
* Jenis Properti
* Tingkat Bangunan
* Kondisi
* Akses
* Posisi
* Legalitas
* Status Listing
* Status Lead
* Status Survey
* Status Offer

---

# 36. Riwayat Parameter

Setiap perubahan parameter harus dapat dicatat.

Contoh:

```text
Parameter:
Akses — Jalan Gang

Nilai Lama:
X

Nilai Baru:
Y

Diubah Oleh:
Admin

Tanggal:
DD/MM/YYYY
```

Tujuannya untuk menjaga **audit trail** dan konsistensi hasil valuasi.

---

# 37. Role & Permission

## Admin

Akses penuh:

* Semua database
* Semua transaksi
* Valuasi
* Pengaturan
* Parameter
* User

## Staff

Akses operasional:

* Database Properti
* Listing
* Leads
* Survey
* Offer
* Valuasi sesuai permission

Staff tidak dapat mengubah parameter sistem kecuali diberikan hak oleh Admin.

---

# 38. Struktur Database Utama

```text
MASTER
│
├── Jenis Properti
├── Tingkat Bangunan
├── Kondisi
├── Akses
├── Posisi
├── Legalitas
├── Kecamatan
├── Kelurahan
├── Status Listing
├── Status Lead
├── Status Survey
└── Status Offer


DATABASE_PROPERTI
│
└── Property


DATABASE_LISTING
│
└── Listing


DATABASE_LEADS
│
└── Lead


DATABASE_SURVEY
│
└── Survey


DATABASE_OFFER
│
└── Offer


DATABASE_TRANSAKSI
│
└── Transaction


DATABASE_VALUASI
│
└── Valuation


DATABASE_VALUASI_PEMBANDING
│
└── Comparable


PARAMETER_KOREKSI
PARAMETER_BANGUNAN
PARAMETER_TRANSAKSI
PARAMETER_ZONA
PARAMETER_MITIGASI
PARAMETER_UTILITAS


LAPORAN_VALUASI
```

---

# 39. Relationship Database

Relasi utama:

```text
PROPERTY
   │
   ├──────< LISTING
   │             │
   │             ├──────< LEAD
   │             │          │
   │             │          ├──────< SURVEY
   │             │          │
   │             │          └──────< OFFER
   │             │
   │             └──────< TRANSACTION
   │
   └──────< VALUATION
                  │
                  └──────< VALUATION_COMPARABLE
                                  │
                                  └──────> PROPERTY
```

---

# 40. Prinsip Data Utama

### Property_ID

Identitas objek properti.

### Listing_ID

Identitas aktivitas pemasaran property.

### Lead_ID

Identitas calon buyer/prospect.

### Survey_ID

Identitas aktivitas survey.

### Offer_ID

Identitas penawaran.

### Transaction_ID

Identitas transaksi.

### Valuation_ID

Identitas proses valuasi.

Setiap ID harus unik dan dibuat otomatis.

---

# 41. UI/UX

Identitas visual KitoApps:

### Primary Color

`#EACA40`

### Secondary

`#000000`

### Background

`#FFFFFF`

### Tombol utama

**Background:** `#EACA40`
**Text:** `#000000`

Desain:

* Premium
* Clean
* Minimalis
* Profesional
* Modern
* Property/Financial
* Tidak terlalu ilustratif
* Fokus pada data dan action

---

# 42. Prinsip UX

User harus dapat mencapai fungsi utama dengan sesedikit mungkin langkah.

Contoh:

### Input Property

```text
Input Property
↓
Save
↓
Property Detail
```

### Membuat Listing

```text
Property Detail
↓
Create Listing
↓
Regular / Exclusive
↓
Save
```

### Membuat Offer

```text
Listing
↓
Lead
↓
Create Offer
↓
Negotiation
↓
Accepted
```

### Valuasi

```text
Property
↓
Valuasi
↓
Pilih Pembanding
↓
Koreksi
↓
Hasil
```

---

# 43. Business Rules

1. Property tidak boleh memiliki Property_ID duplikat.
2. Listing harus memiliki Property_ID.
3. Lead harus terhubung dengan Listing/Property.
4. Survey harus terhubung dengan Lead/Listing/Property.
5. Offer harus terhubung dengan Lead dan Listing.
6. Transaksi harus berasal dari proses Offer/Listing yang valid.
7. Valuasi harus memiliki Property_ID.
8. Jumlah pembanding maksimal 10.
9. Pembanding kosong tidak ikut perhitungan.
10. Rata-rata hanya membagi jumlah pembanding valid.
11. Sistem tidak boleh menghasilkan pembagian nol.
12. Parameter valuasi tidak ditanam permanen di UI.
13. Parameter dapat diubah melalui Pengaturan.
14. Perubahan parameter harus dapat dicatat.
15. Hanya role yang berwenang yang dapat mengubah parameter.

---

# 44. MVP

Tahap pertama yang harus dibangun:

### Phase 1

**Database Properti**

* Input Property
* Cari Data Property
* Detail Property

### Phase 2

**Listing**

* Regular
* Exclusive
* Manage Listing

### Phase 3

**Lead Management**

* Leads
* Survey
* Offer
* Laporan Leads

### Phase 4

**Valuasi**

* Kalkulator Valuasi
* Smart Comparable
* Maksimal 10 Pembanding
* Match Score
* Faktor Koreksi
* Nilai Tanah
* Nilai Bangunan

### Phase 5

**Transaction & Reporting**

* Kalkulasi Transaksi
* Laporan Valuasi
* PDF

### Phase 6

**Pengaturan**

* Faktor Koreksi
* Bangunan
* Zona
* Mitigasi
* Utilitas
* Transaksi
* Master Data
* Audit Parameter

---

# 45. Product Success Criteria

KitoApps dinyatakan memenuhi kebutuhan apabila user dapat melakukan satu workflow lengkap:

```text
INPUT PROPERTY
      ↓
PROPERTY DATABASE
      ↓
CREATE LISTING
      ↓
REGULAR / EXCLUSIVE
      ↓
LEAD
      ↓
SURVEY
      ↓
OFFER
      ↓
TRANSACTION
```

dan secara paralel:

```text
PROPERTY / LISTING
       ↓
VALUATION
       ↓
SMART COMPARABLE
       ↓
MAX 10 COMPARABLE
       ↓
CORRECTION FACTORS
       ↓
LAND VALUE
       +
BUILDING VALUE
       ↓
MARKET VALUE
       ↓
TRANSACTION CALCULATION
       ↓
VALUATION REPORT
```

Sementara Admin dapat mengontrol seluruh parameter melalui:

```text
PENGATURAN
     ↓
PARAMETER
     ↓
VALUATION ENGINE
```

---

# 46. Prinsip Akhir KitoApps

KitoApps harus dibangun dengan pemisahan yang jelas:

**PROPERTY** = objek properti

**LISTING** = aktivitas pemasaran

**LEAD** = calon buyer/prospect

**SURVEY** = aktivitas kunjungan

**OFFER** = penawaran

**TRANSACTION** = transaksi

**VALUATION** = proses estimasi nilai

**COMPARABLE** = data pembanding

**PARAMETER** = aturan yang mengendalikan sistem

Dengan arsitektur ini, KitoApps dapat berkembang dari aplikasi sederhana berbasis Glide menjadi sistem property intelligence yang lebih besar tanpa harus mengubah fondasi database.
