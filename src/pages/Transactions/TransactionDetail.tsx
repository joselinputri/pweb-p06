import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Transaction } from '@/types';
import { Navbar } from '@/components/Navbar';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<Transaction>(`/transactions/${id}`, true);
      setTransaction(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transaction details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <LoadingState message="Loading transaction details..." />
        </main>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <ErrorState message={error || 'Transaction not found'} onRetry={fetchTransaction} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/transactions')}
          className="mb-6 transition-smooth"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Transactions
        </Button>

        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl">Transaction #{transaction.id}</CardTitle>
                <p className="mt-2 text-muted-foreground">
                  {format(new Date(transaction.created_at), 'EEEE, dd MMMM yyyy • HH:mm')}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 rounded-lg bg-muted p-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{transaction.amount} books</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold text-primary">
                  Rp {transaction.total_price.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold">Items Purchased</h3>
              <div className="space-y-3">
                {transaction.items?.map((item) => (
                  <Card key={item.id} className="border-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{item.book?.title || 'Unknown Book'}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.book?.writer || 'Unknown Writer'}
                          </p>
                          <p className="mt-1 text-sm">
                            Qty: <span className="font-medium">{item.quantity}</span> × Rp{' '}
                            {item.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Subtotal</p>
                          <p className="text-lg font-bold">
                            Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t pt-6">
              <Button onClick={() => navigate('/books')}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TransactionDetail;
