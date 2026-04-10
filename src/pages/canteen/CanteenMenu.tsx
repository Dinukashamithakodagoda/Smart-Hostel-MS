import React, { useState } from 'react';
import { useCanteen, FoodItem } from '../../context/CanteenContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Plus, Minus, CreditCard, Banknote, Coffee, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CanteenMenu = () => {
  const { menu, cart, addToCart, removeFromCart, updateCartQuantity, placeOrder } = useCanteen();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online'>('Cash');

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (user && cart.length > 0) {
      placeOrder(user.name, paymentMethod);
      setIsCartOpen(false);
      navigate('/canteen-order');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Coffee className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              Canteen Menu
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Order your favorite meals from the hostel canteen.</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menu.filter(item => item.available).map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                  <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-1 rounded-md font-medium">
                    {item.category}
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-4">Rs. {item.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex justify-center items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" /> Your Cart
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <ArrowLeft className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium">Rs. {item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                            <Minus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                          </button>
                          <span className="font-medium text-gray-900 dark:text-white w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                            <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">Rs. {cartTotal.toFixed(2)}</span>
                </div>

                <div className="mb-6">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Method</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('Cash')}
                      className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                        paymentMethod === 'Cash' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' 
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      <Banknote className="h-5 w-5" /> Cash
                    </button>
                    <button
                      onClick={() => setPaymentMethod('Online')}
                      className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                        paymentMethod === 'Online' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' 
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      <CreditCard className="h-5 w-5" /> Online
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
