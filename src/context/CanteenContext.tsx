import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Order {
  id: string;
  studentName: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'Cash' | 'Online';
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed';
  date: string;
}

interface CanteenContextType {
  menu: FoodItem[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (studentName: string, paymentMethod: 'Cash' | 'Online') => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, item: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
}

const CanteenContext = createContext<CanteenContextType | undefined>(undefined);

export const CanteenProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<FoodItem[]>([
    { id: '1', name: 'Chicken Rice & Curry', price: 250, image: 'https://picsum.photos/seed/rice/400/300', category: 'Lunch', available: true },
    { id: '2', name: 'Vegetable Kottu', price: 300, image: 'https://picsum.photos/seed/kottu/400/300', category: 'Dinner', available: true },
    { id: '3', name: 'Fish Bun', price: 80, image: 'https://picsum.photos/seed/bun/400/300', category: 'Snacks', available: true },
    { id: '4', name: 'Iced Coffee', price: 150, image: 'https://picsum.photos/seed/coffee/400/300', category: 'Beverages', available: true },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      studentName: 'Kamal Perera',
      items: [{ ...menu[0], quantity: 1 }],
      total: 250,
      paymentMethod: 'Cash',
      status: 'Pending',
      date: new Date().toISOString()
    }
  ]);

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (studentName: string, paymentMethod: 'Cash' | 'Online') => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      studentName,
      items: [...cart],
      total,
      paymentMethod,
      status: 'Pending',
      date: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const addFoodItem = (item: Omit<FoodItem, 'id'>) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setMenu(prev => [...prev, newItem]);
  };

  const updateFoodItem = (id: string, item: Partial<FoodItem>) => {
    setMenu(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
  };

  const deleteFoodItem = (id: string) => {
    setMenu(prev => prev.filter(i => i.id !== id));
  };

  return (
    <CanteenContext.Provider value={{
      menu, cart, orders,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      placeOrder, updateOrderStatus,
      addFoodItem, updateFoodItem, deleteFoodItem
    }}>
      {children}
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (context === undefined) {
    throw new Error('useCanteen must be used within a CanteenProvider');
  }
  return context;
};
