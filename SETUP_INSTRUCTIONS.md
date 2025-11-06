# IT Literature Shop - Frontend Setup Instructions

## 📚 Praktikum Modul 4 - Pemrograman Web 2025

Frontend untuk IT Literature Shop - Online Book Catalog menggunakan React.js + TypeScript.

---

## ✅ Fitur yang Sudah Diimplementasi

### 1. **Autentikasi**
- ✅ Halaman Login & Register
- ✅ JWT Token disimpan di localStorage
- ✅ Tombol Logout di navbar
- ✅ Auto redirect setelah login
- ✅ Email user ditampilkan di navbar

### 2. **Manajemen Buku**
- ✅ List buku dengan search, filter by condition, sort, pagination
- ✅ Detail buku (dynamic route `/books/:id`)
- ✅ Tambah buku dengan form validation
- ✅ Genre dropdown dari API `/genres`

### 3. **Transaksi**
- ✅ Cart system untuk checkout >1 item
- ✅ List transaksi dengan search & sort
- ✅ Detail transaksi (dynamic route `/transactions/:id`)

### 4. **UX/UI**
- ✅ Loading state, error state, empty state
- ✅ Form validation (client-side)
- ✅ Responsive design (mobile & desktop)
- ✅ Beautiful design dengan warm terracotta theme
- ✅ Protected routes dengan auto redirect

---

## 🚀 Cara Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di root folder:

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan dengan backend URL Anda:

```
VITE_API_URL=http://localhost:3000
```

**PENTING**: Ganti `http://localhost:3000` dengan URL backend Anda jika berbeda!

### 3. Jalankan Development Server

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:8080`

---

## 🔌 Integrasi dengan Backend

### Expected API Endpoints

Frontend ini mengharapkan backend memiliki endpoint berikut:

#### Authentication
- `POST /auth/login` - Login user
  - Body: `{ email, password }`
  - Response: `{ token, user? }`

- `POST /auth/register` - Register user
  - Body: `{ email, password, username? }`
  - Response: `{ token, user? }`

#### Books
- `GET /books` - Get books list (with pagination, search, filter, sort)
  - Query params: `search`, `condition`, `sortBy`, `page`, `limit`
  - Response: `{ data: Book[], pagination: {...} }`

- `GET /books/:id` - Get book detail
  - Response: `Book`

- `POST /books` - Create new book (requires auth)
  - Body: Book data
  - Headers: `Authorization: Bearer {token}`

#### Genres
- `GET /genres` - Get all genres (requires auth)
  - Headers: `Authorization: Bearer {token}`
  - Response: `Genre[]`

#### Transactions
- `GET /transactions` - Get user's transactions (with pagination, search, sort)
  - Query params: `id`, `sortBy`, `page`, `limit`
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ data: Transaction[], pagination: {...} }`

- `GET /transactions/:id` - Get transaction detail
  - Headers: `Authorization: Bearer {token}`
  - Response: `Transaction`

- `POST /transactions` - Create new transaction (requires auth)
  - Body: `{ items: [{ book_id, quantity, price }] }`
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ id: number }`

### CORS Configuration

Pastikan backend Anda sudah mengaktifkan CORS! Tambahkan di backend:

```javascript
// Jika menggunakan Express.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8080', // URL frontend
  credentials: true
}));
```

---

## 🛠️ Troubleshooting

### Problem: "Failed to fetch" / "Network Error"

**Solusi:**
1. Pastikan backend sudah berjalan
2. Cek VITE_API_URL di `.env` sudah benar
3. Pastikan CORS sudah diaktifkan di backend
4. Cek console browser untuk error detail

### Problem: "Unauthorized" / "401 Error"

**Solusi:**
1. Cek token tersimpan di localStorage browser (F12 → Application → Local Storage)
2. Pastikan backend menerima header `Authorization: Bearer {token}`
3. Token mungkin expired, coba login ulang

### Problem: Halaman blank / loading forever

**Solusi:**
1. Cek console browser untuk error (F12)
2. Pastikan semua API endpoints return data dengan format yang benar
3. Cek network tab untuk melihat API response

---

## 📁 Struktur Project

```
src/
├── components/          # Reusable components
│   ├── ui/             # shadcn UI components
│   ├── BookCard.tsx    # Book card component
│   ├── Navbar.tsx      # Navigation bar
│   ├── LoadingState.tsx
│   ├── ErrorState.tsx
│   ├── EmptyState.tsx
│   └── ProtectedRoute.tsx
│
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── CartContext.tsx # Shopping cart state
│
├── lib/                # Utilities
│   ├── api.ts          # API client
│   └── utils.ts        # Helper functions
│
├── pages/              # Page components
│   ├── Auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── Books/
│   │   ├── BooksList.tsx
│   │   ├── BookDetail.tsx
│   │   └── AddBook.tsx
│   ├── Transactions/
│   │   ├── TransactionsList.tsx
│   │   └── TransactionDetail.tsx
│   ├── Cart.tsx
│   └── Index.tsx
│
├── types/              # TypeScript types
│   └── index.ts
│
├── App.tsx             # Main app component
├── index.css           # Global styles & design system
└── main.tsx            # Entry point
```

---

## 🎨 Design System

Project ini menggunakan design system yang konsisten:

**Colors:**
- Primary: Warm terracotta/burgundy (#C75B39)
- Secondary: Cream/beige
- Accent: Deep teal (#2B7A78)

**Components:**
- Semua menggunakan shadcn UI components
- Custom variants untuk consistency
- Responsive design dengan Tailwind CSS

---

## 📝 Notes

- JWT token disimpan di localStorage
- Protected routes akan auto redirect ke `/auth/login` jika belum login
- Setelah login sukses, user di-redirect ke `/books`
- Form validation menggunakan Zod
- API client sudah handle error dengan baik

---

## 👥 Demo

Untuk demo, pastikan:
1. Backend sudah running
2. Database sudah seeded dengan data
3. Bisa explain setiap bagian yang dikerjakan
4. Test semua fitur (login, register, CRUD books, transactions)

Good luck! 🎉
