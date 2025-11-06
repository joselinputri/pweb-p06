import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Transaction, PaginatedResponse } from '@/types';
import { Navbar } from '@/components/Navbar';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye } from 'lucide-react';
import { format } from 'date-fns';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchId, setSearchId] = useState('');
  const [sortBy, setSortBy] = useState<string>('id_desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchId) params.append('id', searchId);
      params.append('sortBy', sortBy);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await api.get<PaginatedResponse<Transaction>>(
        `/transactions?${params.toString()}`,
        true
      );

      setTransactions(response.data);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [searchId, sortBy, page]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Transaction History</h1>
          <p className="mt-2 text-muted-foreground">View your purchase history</p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by transaction ID..."
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id_desc">ID (Newest First)</SelectItem>
              <SelectItem value="id">ID (Oldest First)</SelectItem>
              <SelectItem value="amount_desc">Amount (High to Low)</SelectItem>
              <SelectItem value="amount">Amount (Low to High)</SelectItem>
              <SelectItem value="price_desc">Price (High to Low)</SelectItem>
              <SelectItem value="price">Price (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {isLoading && <LoadingState message="Loading transactions..." />}

        {error && <ErrorState message={error} onRetry={fetchTransactions} />}

        {!isLoading && !error && transactions.length === 0 && (
          <EmptyState
            message="No transactions found"
            description="You haven't made any purchases yet"
          />
        )}

        {!isLoading && !error && transactions.length > 0 && (
          <>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="shadow-elegant transition-smooth hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Transaction ID</p>
                            <p className="text-xl font-bold text-foreground">#{transaction.id}</p>
                          </div>

                          <div className="h-12 w-px bg-border" />

                          <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-medium">
                              {format(new Date(transaction.created_at), 'dd MMM yyyy, HH:mm')}
                            </p>
                          </div>

                          <div className="h-12 w-px bg-border" />

                          <div>
                            <p className="text-sm text-muted-foreground">Items</p>
                            <p className="font-medium">{transaction.amount} books</p>
                          </div>

                          <div className="h-12 w-px bg-border" />

                          <div>
                            <p className="text-sm text-muted-foreground">Total Price</p>
                            <p className="text-xl font-bold text-primary">
                              Rp {transaction.total_price.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link to={`/transactions/${transaction.id}`}>
                        <Button variant="outline" className="transition-smooth">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
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

export default TransactionsList;
