import React, { createContext, useContext, useState } from 'react';
import { CartItem, Book } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book, quantity: number) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (book: Book, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.book.id === book.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, book.stock) }
            : item
        );
      }
      
      return [...prevCart, { book, quantity: Math.min(quantity, book.stock) }];
    });
  };

  const removeFromCart = (bookId: number) => {
    setCart(prevCart => prevCart.filter(item => item.book.id !== bookId));
  };

  const updateQuantity = (bookId: number, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.book.id === bookId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.book.stock)) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.book.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
