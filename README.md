# Deskripsi Umum Proyek
Shoe Laundry Ale adalah REST API berbasis Node.js dan Express.js yang digunakan untuk mengelola data layanan cuci sepatu. Sistem ini menyimpan data pelanggan dan status pengerjaan di Supabase (PostgreSQL cloud), serta menyediakan endpoint CRUD agar data dapat dikelola melalui aplikasi web, mobile, atau Postman.
API ini juga siap deploy ke Vercel menggunakan arsitektur serverless, sehingga dapat diakses publik secara online.

# Tujuan dan Fitur Utama
## Tujuan

1. Mempermudah pencatatan dan pemantauan status pengerjaan cuci sepatu secara digital.

2. Menyediakan API ringan, aman, dan mudah diintegrasikan ke sistem front-end (web atau mobile).

3. Menjadi dasar bagi pengembangan sistem laundry sepatu berbasis online.

## Fitur Utama

| **Tujuan**                                                                | **Fitur Utama**                                           |
| ------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1. Menyediakan layanan CRUD sederhana untuk pengelolaan data cuci sepatu. | CRUD lengkap (`POST`, `GET`, `PUT`, `PATCH`, `DELETE`)    |
| 2. Menyediakan filter status pengerjaan sepatu.                           | Filter `status` (`Masuk`, `Proses`, `Selesai`, `Diambil`) |
| 3. Memudahkan integrasi API ke aplikasi web/mobile.                       | Struktur data rapi dan JSON-based                         |
| 4. Dapat dijalankan lokal atau di-deploy ke Vercel.                       | Arsitektur serverless siap produksi                       |


# Struktur Data
| Kolom         | Tipe Data              | Deskripsi                                                   |
| ------------- | ---------------------- | ----------------------------------------------------------- |
| id            | `uuid` (Primary Key)   | ID unik untuk setiap item                                   |
| customer_name | `text`                 | Nama pelanggan                                              |
| brand         | `text`                 | Merek sepatu                                                |
| color         | `text`                 | Warna sepatu                                                |
| service_type  | `text`                 | Jenis layanan (mis. Deep Clean, Repaint)                    |
| price         | `integer`              | Harga layanan                                               |
| received_at   | `timestamptz`          | Tanggal penerimaan                                          |
| due_at        | `timestamptz`          | Estimasi selesai                                            |
| notes         | `text`                 | Catatan tambahan                                            |
| status        | `enum(laundry_status)` | Status pengerjaan (`Masuk`, `Proses`, `Selesai`, `Diambil`) |
| created_at    | `timestamptz`          | Tanggal data dibuat                                         |

# Contoh Request dan Response
| **Endpoint**            | **Metode** | **Deskripsi**                         |
| ----------------------- | ---------- | ------------------------------------- |
| `/items`                | **GET**    | Menampilkan semua data cucian         |
| `/items?status=Selesai` | **GET**    | Menampilkan data dengan filter status |
| `/items`                | **POST**   | Menambahkan data baru                 |
| `/items/:id`            | **PATCH**  | Mengubah sebagian data (mis. status)  |
| `/items/:id`            | **DELETE** | Menghapus data berdasarkan ID         |

## GET /Items

```json
{
    "count": 3,
    "data": [
        {
            "id": "18334a67-9e2b-4445-87d7-253b9b18d85c",
            "customer_name": "Ale",
            "brand": "Nike",
            "color": "White",
            "service_type": "Deep Clean",
            "price": 35000,
            "received_at": "2025-10-23T08:46:06.346536+00:00",
            "due_at": "2025-10-26T08:46:06.346536+00:00",
            "notes": "Noda tanah di sisi kanan",
            "status": "Masuk",
            "created_at": "2025-10-23T08:46:06.346536+00:00"
        },
        {
            "id": "b1215b99-524b-4026-a6bc-f9fd360ccd1e",
            "customer_name": "Rusdi",
            "brand": "Vans",
            "color": "Black",
            "service_type": "Repaint",
            "price": 65000,
            "received_at": "2025-10-23T08:46:06.346536+00:00",
            "due_at": "2025-10-28T08:46:06.346536+00:00",
            "notes": "Repaint hitam doff",
            "status": "Proses",
            "created_at": "2025-10-23T08:46:06.346536+00:00"
        },
        {
            "id": "b53f42c0-99ba-48cc-b7a5-909528c068d3",
            "customer_name": "Mas Gatot",
            "brand": "Adidas",
            "color": "Blue",
            "service_type": "Fast Clean",
            "price": 20000,
            "received_at": "2025-10-23T08:46:06.346536+00:00",
            "due_at": "2025-10-24T08:46:06.346536+00:00",
            "notes": "Hanya upper",
            "status": "Selesai",
            "created_at": "2025-10-23T08:46:06.346536+00:00"
        }
    ]
```
## GET /items?status=Selesai
```json
{
    "count": 1,
    "data": [
        {
            "id": "b53f42c0-99ba-48cc-b7a5-909528c068d3",
            "customer_name": "Mas Gatot",
            "brand": "Adidas",
            "color": "Blue",
            "service_type": "Fast Clean",
            "price": 20000,
            "received_at": "2025-10-23T08:46:06.346536+00:00",
            "due_at": "2025-10-24T08:46:06.346536+00:00",
            "notes": "Hanya upper",
            "status": "Selesai",
            "created_at": "2025-10-23T08:46:06.346536+00:00"
        }
    ]
}
```

## POST /items

**Body**
```json
{
  "customer_name": "Citra",
  "brand": "Adidas",
  "color": "White",
  "service_type": "Fast Clean",
  "price": 25000,
  "due_at": "2025-10-30T17:00:00.000Z",
  "notes": "Bagian sol agak kotor",
  "status": "Masuk"
}
```
**Response**
```json
{
    "id": "dd2868f8-df4c-4a7c-9449-e7295fd64502",
    "customer_name": "Citra",
    "brand": "Adidas",
    "color": "White",
    "service_type": "Fast Clean",
    "price": 25000,
    "received_at": "2025-10-23T09:56:14.584+00:00",
    "due_at": "2025-10-30T17:00:00+00:00",
    "notes": "Bagian sol agak kotor",
    "status": "Masuk",
    "created_at": "2025-10-23T09:56:16.843143+00:00"
}
```

## PATCH /items/id

**Body**
```json
{ "status": "Selesai" }
```
**Response**
```json
{
    "id": "b1215b99-524b-4026-a6bc-f9fd360ccd1e",
    "customer_name": "Rusdi",
    "brand": "Vans",
    "color": "Black",
    "service_type": "Repaint",
    "price": 65000,
    "received_at": "2025-10-23T08:46:06.346536+00:00",
    "due_at": "2025-10-28T08:46:06.346536+00:00",
    "notes": "Repaint hitam doff",
    "status": "Selesai",
    "created_at": "2025-10-23T08:46:06.346536+00:00"
}
```
## DELETE /items/id
**Response**
```
```

## Langkah Instalasi dan Cara Menjalankan API
**Clone Repository**
git clone https://github.com/<username>/shoe-laundry-ale.git
cd shoe-laundry-ale
**Instal Dependensi**
```
npm install
```
**Buat File .env**
Salin isi dari .env.example lalu isi dengan kredensial Supabase:
```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
PORT=3000
```
##Jalankan API secara lokal
```
npm run dev
```
API akan aktif di:
localhost:3000

##Uji di Postman
```
GET http://localhost:3000/items
POST http://localhost:3000/items/id
DELETE http://localhost:3000/items/id
PATCH http://localhost:3000/items/id
```
