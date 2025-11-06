import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { BookOpen, ShoppingCart, LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, token } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const totalItems = getTotalItems();

  const isActive = (path: string) => location.pathname === path;

  if (!token) return null;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card shadow-elegant">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/books" className="flex items-center gap-2 transition-smooth hover:opacity-80">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">IT Literature Shop</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/books">
            <Button
              variant={isActive('/books') ? 'default' : 'ghost'}
              className="transition-smooth"
            >
              Books
            </Button>
          </Link>

          <Link to="/transactions">
            <Button
              variant={isActive('/transactions') ? 'default' : 'ghost'}
              className="transition-smooth"
            >
              Transactions
            </Button>
          </Link>

          <Link to="/cart" className="relative">
            <Button
              variant={isActive('/cart') ? 'default' : 'ghost'}
              className="transition-smooth"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{user?.email}</span>
          </div>

          <Button
            onClick={logout}
            variant="outline"
            className="transition-smooth hover:border-destructive hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
