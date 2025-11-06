export interface User {
  id: number;
  email: string;
  username?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface Book {
  id: number;
  title: string;
  writer: string;
  publisher?: string;
  price: number;
  stock: number;
  genre_id: number;
  genre?: Genre;
  isbn?: string;
  description?: string;
  publication_year?: number;
  condition?: 'new' | 'used';
  book_image?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  total_price: number;
  created_at: string;
  items?: TransactionItem[];
}

export interface TransactionItem {
  id: number;
  transaction_id: number;
  book_id: number;
  quantity: number;
  price: number;
  book?: Book;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CartItem {
  book: Book;
  quantity: number;
}
