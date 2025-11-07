// src/pages/Books/BookDetail.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Pastikan Link ada
import { api } from "@/lib/api";
import { Book } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { Navbar } from "@/components/Navbar";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Trash2, Edit } from "lucide-react"; // Ikon baru
import { toast } from "sonner";
// Impor "Lego" Pop-up Konfirmasi Hapus
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // State untuk loading hapus
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const fetchBook = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<Book>(`/books/${id}`, true);
      setBook(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch book details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (book && book.stock > 0) {
      // Set kuantitas agar tidak melebihi stok
      const qtyToAdd = Math.min(quantity, book.stock);
      addToCart(book, qtyToAdd);
      toast.success(`${qtyToAdd} x ${book.title} added to cart`);
      setQuantity(1); // Reset quantity setelah add
    }
  };

  // --- FUNGSI HAPUS (BARU) ---
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/books/${id}`, true);
      toast.success("Book deleted successfully!");
      navigate("/books"); // Lempar kembali ke etalase
    } catch (err: any) {
      toast.error(err.message || "Failed to delete book");
    } finally {
      setIsDeleting(false);
    }
  };
  // ------------------------------

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <LoadingState message="Loading book details..." />
        </main>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <ErrorState message={error || "Book not found"} onRetry={fetchBook} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/books")}
          className="mb-6 transition-smooth"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Books
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="overflow-hidden shadow-elegant">
              <div className="aspect-[3/4] bg-gradient-card p-8">
                <div className="flex h-full items-center justify-center text-muted-foreground/30">
                  {/* (Placeholder gambar buku, biarkan saja) */}
                  <svg
                    className="h-32 w-32"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-start justify-between">
                  <h1 className="text-4xl font-bold text-foreground">
                    {book.title}
                  </h1>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {book.condition && (
                      <Badge
                        variant={
                          book.condition === "new" ? "default" : "secondary"
                        }
                      >
                        {book.condition}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xl text-muted-foreground">{book.writer}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  Rp {book.price.toLocaleString("id-ID")}
                </span>
              </div>

              <Card className="shadow-elegant">
                <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Publisher</p>
                    <p className="font-medium">{book.publisher || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <p
                      className={`font-medium ${
                        book.stock > 0 ? "text-accent" : "text-destructive"
                      }`}
                    >
                      {book.stock > 0
                        ? `${book.stock} available`
                        : "Out of stock"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Genre</p>
                    <p className="font-medium">{book.genre?.name || "N/A"}</p>
                  </div>
                  {book.publication_year && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Publication Year
                      </p>
                      <p className="font-medium">{book.publication_year}</p>
                    </div>
                  )}
                  {book.isbn && (
                    <div className="sm:col-span-2">
                      <p className="text-sm text-muted-foreground">ISBN</p>
                      <p className="font-medium">{book.isbn}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {book.description && (
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h2 className="mb-2 text-lg font-semibold">Description</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {book.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* --- BAGIAN TOMBOL MANAJEMEN BUKU (BARU) --- */}
              <Card className="shadow-elegant">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row">
                  <Link to={`/books/edit/${book.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Edit className="mr-2 h-4 w-4" /> Edit Book
                    </Button>
                  </Link>

                  {/* "Lego" Pop-up Hapus ditaruh di sini */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Book
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the book "{book.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Yes, delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
              {/* --------------------------------------- */}

              {/* --- BAGIAN ADD TO CART (DARI KODEMU) --- */}
              <Card className="shadow-elegant">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium">
                        Quantity
                      </label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={book.stock === 0}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setQuantity(Math.min(book.stock, quantity + 1))
                          }
                          disabled={book.stock === 0 || quantity >= book.stock}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Button
                        onClick={handleAddToCart}
                        disabled={book.stock === 0}
                        className="w-full"
                        size="lg"
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                  {quantity > book.stock && book.stock > 0 && (
                    <p className="mt-2 text-sm text-destructive">
                      Only {book.stock} available.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetail;
