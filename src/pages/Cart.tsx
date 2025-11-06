import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      setIsCheckingOut(true);

      const items = cart.map((item) => ({
        book_id: item.book.id,
        quantity: item.quantity,
        price: item.book.price,
      }));

      const response = await api.post<{ id: number }>(
        '/transactions',
        { items },
        true
      );

      toast.success('Transaction completed successfully!');
      clearCart();
      navigate(`/transactions/${response.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Checkout failed');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <EmptyState
            message="Your cart is empty"
            description="Add some books to your cart to continue shopping"
          />
          <div className="mt-6 flex justify-center">
            <Button onClick={() => navigate('/books')}>
              Browse Books
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-foreground">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <Card key={item.book.id} className="shadow-elegant">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="flex h-24 w-20 items-center justify-center rounded-lg bg-gradient-card">
                      <svg className="h-10 w-10 text-muted-foreground/30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                      </svg>
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{item.book.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.book.writer}</p>
                        <p className="mt-2 text-lg font-bold text-primary">
                          Rp {item.book.price.toLocaleString('id-ID')}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            removeFromCart(item.book.id);
                            toast.info('Item removed from cart');
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Subtotal</p>
                      <p className="text-xl font-bold text-foreground">
                        Rp {(item.book.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-elegant">
              <CardContent className="p-6">
                <h2 className="mb-4 text-2xl font-bold">Order Summary</h2>

                <div className="space-y-3 border-b pb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items ({cart.length})</span>
                    <span className="font-medium">
                      {cart.reduce((total, item) => total + item.quantity, 0)} books
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="mt-6 w-full"
                  size="lg"
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </Button>

                <Button
                  onClick={() => navigate('/books')}
                  variant="outline"
                  className="mt-3 w-full"
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
