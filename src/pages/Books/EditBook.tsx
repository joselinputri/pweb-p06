// src/pages/Books/EditBook.tsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Book, Genre } from "@/types";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { LoadingState } from "@/components/LoadingState"; // Impor LoadingState

// Skema Zod-nya SAMA PERSIS dengan AddBook
const bookSchema = z.object({
  title: z.string().trim().nonempty({ message: "Title is required" }).max(200),
  writer: z
    .string()
    .trim()
    .nonempty({ message: "Writer is required" })
    .max(100),
  publisher: z.string().trim().max(100).optional(),
  price: z.number().positive({ message: "Price must be positive" }),
  stock: z
    .number()
    .int()
    .nonnegative({ message: "Stock must be non-negative" }),
  genre_id: z.number().positive({ message: "Genre is required" }),
  isbn: z.string().trim().max(20).optional(),
  description: z.string().trim().max(1000).optional(),
  publication_year: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear() + 1)
    .optional(),
  condition: z.enum(["new", "used"]).optional(),
});

const EditBook = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Tangkap ID dari URL
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // State u/ loading data buku
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State form-nya SAMA PERSIS dengan AddBook
  const [formData, setFormData] = useState({
    title: "",
    writer: "",
    publisher: "",
    price: "",
    stock: "",
    genre_id: "",
    isbn: "",
    description: "",
    publication_year: "",
    condition: "" as "new" | "used" | "",
  });

  // Ambil data buku yang mau diedit
  useEffect(() => {
    const fetchBookToEdit = async () => {
      if (!id) return;
      setIsFetching(true);
      try {
        const bookData = await api.get<Book>(`/books/${id}`, true);
        // Isi form-nya pakai data yang sudah ada
        setFormData({
          title: bookData.title,
          writer: bookData.writer,
          publisher: bookData.publisher || "",
          price: bookData.price.toString(),
          stock: bookData.stock.toString(),
          genre_id: bookData.genre_id.toString(),
          isbn: bookData.isbn || "",
          description: bookData.description || "",
          publication_year: bookData.publication_year?.toString() || "",
          condition: bookData.condition || "",
        });
      } catch (err) {
        toast.error("Failed to fetch book data");
        navigate("/books");
      } finally {
        setIsFetching(false);
      }
    };

    fetchBookToEdit();
  }, [id, navigate]);

  // useEffect untuk fetchGenres SAMA PERSIS dengan AddBook
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get<Genre[]>("/genres", true);
        setGenres(response);
      } catch (err) {
        toast.error("Failed to fetch genres");
      }
    };
    fetchGenres();
  }, []);

  // handleSubmit BEDA: pakai .put (update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validasi datanya SAMA PERSIS dengan AddBook
      const dataToValidate = {
        title: formData.title,
        writer: formData.writer,
        publisher: formData.publisher || undefined,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        genre_id: parseInt(formData.genre_id),
        isbn: formData.isbn || undefined,
        description: formData.description || undefined,
        publication_year: formData.publication_year
          ? parseInt(formData.publication_year)
          : undefined,
        condition: formData.condition || undefined,
      };

      const validatedData = bookSchema.parse(dataToValidate);

      setIsLoading(true);
      // GANTI DARI .post MENJADI .put DAN PAKAI ID
      await api.put(`/books/${id}`, validatedData, true);
      toast.success("Book updated successfully!");
      navigate(`/books/${id}`); // Balik ke halaman detail
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(error.message || "Failed to update book");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi handleChange SAMA PERSIS dengan AddBook
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Kalau data bukunya masih diambil, tampilkan loading
  if (isFetching) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto max-w-3xl px-4 py-8">
          <LoadingState message="Loading book data..." />
        </main>
      </div>
    );
  }

  // Tampilan JSX-nya SAMA PERSIS dengan AddBook,
  // CUMA GANTI JUDUL DAN TEKS TOMBOL
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto max-w-3xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/books/${id}`)} // Balik ke detail
          className="mb-6 transition-smooth"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Book Detail
        </Button>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl">Edit Book</CardTitle>{" "}
            {/* GANTI JUDUL */}
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* SEMUA INPUT FORM SAMA PERSIS DENGAN ADD BOOK */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="writer">Writer *</Label>
                  <Input
                    id="writer"
                    value={formData.writer}
                    onChange={(e) => handleChange("writer", e.target.value)}
                    className={errors.writer ? "border-destructive" : ""}
                  />
                  {errors.writer && (
                    <p className="text-sm text-destructive">{errors.writer}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) => handleChange("publisher", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre_id">Genre *</Label>
                  <Select
                    value={formData.genre_id}
                    onValueChange={(value) => handleChange("genre_id", value)}
                  >
                    <SelectTrigger
                      className={errors.genre_id ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.id.toString()}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.genre_id && (
                    <p className="text-sm text-destructive">
                      {errors.genre_id}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (Rp) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                    className={errors.stock ? "border-destructive" : ""}
                  />
                  {errors.stock && (
                    <p className="text-sm text-destructive">{errors.stock}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => handleChange("isbn", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publication_year">Publication Year</Label>
                  <Input
                    id="publication_year"
                    type="number"
                    min="1000"
                    max={new Date().getFullYear() + 1}
                    value={formData.publication_year}
                    onChange={(e) =>
                      handleChange("publication_year", e.target.value)
                    }
                    className={
                      errors.publication_year ? "border-destructive" : ""
                    }
                  />
                  {errors.publication_year && (
                    <p className="text-sm text-destructive">
                      {errors.publication_year}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleChange("condition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/books/${id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}{" "}
                  {/* GANTI TEKS TOMBOL */}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default EditBook;
