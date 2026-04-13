import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
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
  const { user } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const toFrontendStatus = (status: string): Order['status'] => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const toBackendStatus = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'pending';
      case 'Preparing':
        return 'preparing';
      case 'Ready':
        return 'ready';
      case 'Completed':
        return 'completed';
      case 'Cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const mapOrder = (order: any): Order => {
    const items = (order.items || []).map((entry: any) => {
      const item = entry.item || {};
      return {
        id: item._id || entry.item,
        name: item.name || 'Item',
        price: item.price || 0,
        image: item.image || 'https://picsum.photos/seed/food/400/300',
        category: item.category || 'General',
        available: item.available ?? true,
        quantity: entry.quantity || 1,
      } as CartItem;
    });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      id: order._id,
      studentName: order.user?.name || 'Student',
      items,
      total,
      paymentMethod: 'Cash',
      status: toFrontendStatus(order.status),
      date: order.createdAt,
    };
  };

  const fetchMenu = async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${apiBaseUrl}/api/canteen/items`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const mapped = (data.items || []).map((item: any) => ({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image || 'https://picsum.photos/seed/food/400/300',
      category: item.category || 'General',
      available: item.available ?? true,
    }));
    setMenu(mapped);
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setOrders([]);
      return;
    }

    const mineResponse = await fetch(`${apiBaseUrl}/api/canteen/orders/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (mineResponse.ok) {
      const data = await mineResponse.json();
      setOrders((data.orders || []).map(mapOrder));
      return;
    }

    const allResponse = await fetch(`${apiBaseUrl}/api/canteen/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!allResponse.ok) {
      return;
    }

    const data = await allResponse.json();
    setOrders((data.orders || []).map(mapOrder));
  };

  useEffect(() => {
    fetchMenu();
    fetchOrders();
  }, [user]);

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
    const submit = async () => {
      if (cart.length === 0) return;
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${apiBaseUrl}/api/canteen/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({ item: item.id, quantity: item.quantity })),
        }),
      });

      if (!response.ok) {
        return;
      }

      clearCart();
      fetchOrders();
    };

    submit();
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    const submit = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${apiBaseUrl}/api/canteen/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: toBackendStatus(status) }),
      });

      if (!response.ok) {
        return;
      }

      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    };

    submit();
  };

  const addFoodItem = (item: Omit<FoodItem, 'id'>) => {
    const submit = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${apiBaseUrl}/api/canteen/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        return;
      }

      fetchMenu();
    };

    submit();
  };

  const updateFoodItem = (id: string, item: Partial<FoodItem>) => {
    const submit = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${apiBaseUrl}/api/canteen/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        return;
      }

      fetchMenu();
    };

    submit();
  };

  const deleteFoodItem = (id: string) => {
    const submit = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${apiBaseUrl}/api/canteen/items/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      fetchMenu();
    };

    submit();
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
