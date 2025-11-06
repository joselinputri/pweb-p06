import { Link } from 'react-router-dom';
import { Book } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { BookOpen, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (book.stock > 0) {
      addToCart(book, 1);
      toast.success(`${book.title} added to cart`);
    }
  };

  return (
    <Link to={`/books/${book.id}`}>
      <Card className="group h-full cursor-pointer overflow-hidden transition-smooth hover:shadow-lg hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden bg-gradient-card">
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-20 w-20 text-muted-foreground/30" />
          </div>
          {book.condition && (
            <Badge className="absolute right-2 top-2" variant={book.condition === 'new' ? 'default' : 'secondary'}>
              {book.condition}
            </Badge>
          )}
        </div>

        <CardHeader>
          <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{book.writer}</p>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              Rp {book.price.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Stock:</span>
            <span className={book.stock > 0 ? 'text-accent font-medium' : 'text-destructive'}>
              {book.stock > 0 ? `${book.stock} available` : 'Out of stock'}
            </span>
          </div>
          {book.genre && (
            <Badge variant="outline" className="mt-2">
              {book.genre.name}
            </Badge>
          )}
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            className="w-full transition-smooth"
            variant="default"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
