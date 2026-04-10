import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { useAuth } from '../../context/AuthContext';
import { Clock, CheckCircle, ChefHat, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CanteenOrder = () => {
  const { orders } = useCanteen();
  const { user } = useAuth();

  // Filter orders for the current user (if logged in)
  const myOrders = user ? orders.filter(o => o.studentName === user.name) : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Preparing': return <ChefHat className="h-5 w-5 text-blue-500" />;
      case 'Ready': return <Package className="h-5 w-5 text-orange-500" />;
      case 'Completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Preparing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Ready': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/canteen-menu" className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track the status of your canteen orders.</p>
          </div>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't placed any orders from the canteen.</p>
            <Link to="/canteen-menu" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                    <p className="font-bold text-gray-900 dark:text-white">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">Rs. {order.total.toFixed(2)}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full flex items-center gap-2 font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Order Items</h4>
                  <ul className="space-y-3">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {item.quantity}x
                          </span>
                          <span className="text-gray-800 dark:text-gray-200">{item.name}</span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
