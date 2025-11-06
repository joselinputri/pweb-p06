import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import BooksList from "./pages/Books/BooksList";
import BookDetail from "./pages/Books/BookDetail";
import AddBook from "./pages/Books/AddBook";
import Cart from "./pages/Cart";
import TransactionsList from "./pages/Transactions/TransactionsList";
import TransactionDetail from "./pages/Transactions/TransactionDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              
              <Route path="/books" element={<ProtectedRoute><BooksList /></ProtectedRoute>} />
              <Route path="/books/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
              <Route path="/books/add" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
              
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              
              <Route path="/transactions" element={<ProtectedRoute><TransactionsList /></ProtectedRoute>} />
              <Route path="/transactions/:id" element={<ProtectedRoute><TransactionDetail /></ProtectedRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
