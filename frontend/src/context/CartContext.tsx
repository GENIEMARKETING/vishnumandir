'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Represents a single item in the cart.
 */
export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  quantity: number;
  price: number;
  thumbnail?: string | null;
  handle: string;
}

/**
 * Cart context state.
 */
export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
  cartId?: string;
}

/**
 * Cart context interface.
 */
interface CartContextType {
  state: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  setCartId: (id: string) => void;
}

/**
 * Create the cart context.
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Calculate totals from items.
 */
const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax (adjust as needed)
  const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
  const total = subtotal + tax + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, tax, shipping, total, itemCount };
};

/**
 * Cart Provider component.
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CartState>({
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
  });

  const [isHydrated, setIsHydrated] = useState(false);

  /**
   * Load cart from localStorage on mount.
   */
  useEffect(() => {
    const savedCart = localStorage.getItem('vishnu_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        const totals = calculateTotals(parsed.items || []);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate after mount to avoid SSR/client mismatch
        setState({
          items: parsed.items || [],
          ...totals,
          cartId: parsed.cartId,
        });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  /**
   * Save cart to localStorage whenever it changes.
   */
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        'vishnu_cart',
        JSON.stringify({
          items: state.items,
          cartId: state.cartId,
        })
      );
    }
  }, [state.items, state.cartId, isHydrated]);

  /**
   * Add item to cart or increase quantity if it already exists.
   */
  const addToCart = (newItem: CartItem) => {
    setState((prevState) => {
      const existingItemIndex = prevState.items.findIndex(
        (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
      );

      let updatedItems: CartItem[];

      if (existingItemIndex > -1) {
        // Item exists, increase quantity
        updatedItems = prevState.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // New item, add to cart
        updatedItems = [...prevState.items, newItem];
      }

      const totals = calculateTotals(updatedItems);
      return {
        ...prevState,
        items: updatedItems,
        ...totals,
      };
    });
  };

  /**
   * Remove item from cart.
   */
  const removeFromCart = (productId: string, variantId: string) => {
    setState((prevState) => {
      const updatedItems = prevState.items.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      );

      const totals = calculateTotals(updatedItems);
      return {
        ...prevState,
        items: updatedItems,
        ...totals,
      };
    });
  };

  /**
   * Update quantity of an item.
   */
  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setState((prevState) => {
      const updatedItems = prevState.items.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      );

      const totals = calculateTotals(updatedItems);
      return {
        ...prevState,
        items: updatedItems,
        ...totals,
      };
    });
  };

  /**
   * Clear the entire cart.
   */
  const clearCart = () => {
    setState({
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      itemCount: 0,
    });
  };

  /**
   * Set the Medusa cart ID.
   */
  const setCartId = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      cartId: id,
    }));
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setCartId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook to use the cart context.
 * @throws {Error} If used outside of CartProvider
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
