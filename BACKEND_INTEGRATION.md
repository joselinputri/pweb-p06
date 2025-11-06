# Integrasi Backend dengan Frontend

## 📦 File Backend Anda

Saya melihat Anda sudah memiliki backend di file `pemweb-3-final-master_2.zip`. Berikut langkah-langkah untuk mengintegrasikannya dengan frontend ini:

---

## 🔧 Langkah Integrasi

### 1. Extract & Setup Backend

```bash
# Extract file zip backend
unzip pemweb-3-final-master_2.zip

# Masuk ke folder backend
cd pemweb-3-final-master

# Install dependencies
npm install

# Setup database (.env)
cp .env.example .env
# Edit .env dengan konfigurasi database Anda
```

### 2. Jalankan Backend

```bash
# Development mode
npm run dev

# Atau production
npm start
```

Backend biasanya berjalan di `http://localhost:3000`

### 3. Setup Frontend

Di folder frontend (project ini):

```bash
# Buat file .env
echo "VITE_API_URL=http://localhost:3000" > .env

# Install & jalankan
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:8080`

---

## 🔍 Checklist Backend Requirements

Pastikan backend Anda memiliki:

### ✅ CORS Configuration

Backend harus mengizinkan request dari frontend. Tambahkan di backend:

```javascript
// app.js atau server.js
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'], // Tambahkan URL frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### ✅ JWT Authentication

Pastikan backend:
- Generate JWT token saat login/register
- Verify token di protected routes
- Token format: `Bearer {token}`

### ✅ Response Format

Semua API response harus consistent:

```javascript
// Success
{
  data: {...},        // atau array untuk list
  pagination: {...}   // untuk paginated endpoints
}

// Error
{
  message: "Error message",
  status: 400
}
```

### ✅ Pagination Format

Untuk endpoint dengan pagination:

```javascript
{
  data: [...],
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10
  }
}
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Failed to fetch"

**Penyebab**: CORS tidak aktif atau backend tidak running

**Solusi**:
```bash
# Di backend, install cors
npm install cors

# Tambahkan di app.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
```

### Issue 2: "Authorization header missing"

**Penyebab**: Token tidak terkirim atau format salah

**Solusi di Backend**:
```javascript
// middleware/auth.js
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

### Issue 3: "Network request failed"

**Penyebab**: Backend URL salah di `.env`

**Solusi**:
```bash
# Cek backend URL
curl http://localhost:3000/books

# Jika tidak bisa akses, coba:
# 1. Restart backend
# 2. Cek port di backend
# 3. Update VITE_API_URL di frontend .env
```

---

## 🧪 Testing Integration

### 1. Test Authentication

```bash
# Test register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Should return: { "token": "...", "user": {...} }
```

### 2. Test Protected Routes

```bash
# Get books (dengan token)
curl http://localhost:3000/books \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return list of books
```

### 3. Test from Browser

1. Buka frontend: `http://localhost:8080`
2. Register account baru
3. Login
4. Coba browse books
5. Add to cart & checkout
6. Check transactions

---

## 📊 Database Schema Expected

Frontend mengharapkan database dengan struktur berikut:

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Genres Table
```sql
CREATE TABLE genres (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
);
```

### Books Table
```sql
CREATE TABLE books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  writer VARCHAR(100) NOT NULL,
  publisher VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  genre_id INT NOT NULL,
  isbn VARCHAR(20),
  description TEXT,
  publication_year INT,
  condition ENUM('new', 'used'),
  book_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (genre_id) REFERENCES genres(id)
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  amount INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Transaction Items Table
```sql
CREATE TABLE transaction_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  transaction_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);
```

---

## 🎯 Quick Start

Jika backend Anda sudah sesuai dengan requirement di atas:

```bash
# Terminal 1 - Backend
cd backend-folder
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend-folder
npm install
npm run dev

# Buka browser: http://localhost:8080
```

Selesai! 🎉

---

## 📞 Support

Jika masih ada masalah:
1. Cek console browser (F12)
2. Cek network tab untuk API response
3. Cek backend logs
4. Pastikan semua environment variables sudah benar

Happy coding! 🚀
