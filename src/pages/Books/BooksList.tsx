import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Book, Genre, PaginatedResponse } from '@/types';
import { BookCard } from '@/components/BookCard';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';

const BooksList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('title');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (condition !== 'all') params.append('condition', condition);
      params.append('sortBy', sortBy);
      params.append('page', page.toString());
      params.append('limit', '12');

      const response = await api.get<PaginatedResponse<Book>>(
        `/books?${params.toString()}`,
        true
      );

      setBooks(response.data);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch books');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await api.get<Genre[]>('/genres', true);
      setGenres(response);
    } catch (err) {
      console.error('Failed to fetch genres');
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [search, condition, sortBy, page]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Book Catalog</h1>
            <p className="mt-2 text-muted-foreground">Browse our collection of IT literature</p>
          </div>

          <Link to="/books/add">
            <Button className="transition-smooth">
              <Plus className="mr-2 h-5 w-5" />
              Add New Book
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>

          <Select value={condition} onValueChange={(value) => { setCondition(value); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="title_desc">Title (Z-A)</SelectItem>
              <SelectItem value="publication_year">Publication Year</SelectItem>
              <SelectItem value="price">Price (Low to High)</SelectItem>
              <SelectItem value="price_desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {isLoading && <LoadingState message="Loading books..." />}
        
        {error && <ErrorState message={error} onRetry={fetchBooks} />}
        
        {!isLoading && !error && books.length === 0 && (
          <EmptyState 
            message="No books found" 
            description="Try adjusting your filters or add a new book"
          />
        )}

        {!isLoading && !error && books.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default BooksList;
