import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useCanteen, FoodItem } from '../../context/CanteenContext';
import { Store, Plus, Edit, Trash2, TrendingUp, Package, Clock, CheckCircle, ImagePlus, X, ChefHat, PlayCircle } from 'lucide-react';

export const CanteenManagerDashboard = () => {
  const { menu, orders, addFoodItem, updateFoodItem, deleteFoodItem, updateOrderStatus } = useCanteen();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'kitchen' | 'requests'>('orders');
  const [requests, setRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  
  // Form state for adding/editing food
  const [isEditing, setIsEditing] = useState(false);
  const [currentFood, setCurrentFood] = useState<Partial<FoodItem>>({
    name: '', price: 0, image: '', category: 'Lunch', available: true
  });

  const totalSales = orders.filter(o => o.status === 'Completed').reduce((sum, order) => sum + order.total, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
  const activeKitchenOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing');

  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      setRequestsError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/complaints/assigned`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load requests');
      }

      const data = await response.json();
      setRequests(data.complaints || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load requests';
      setRequestsError(message);
    } finally {
      setRequestsLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: 'pending' | 'in_progress' | 'resolved') => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to update status');
      }

      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      alert(message);
    }
  };

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [activeTab]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setCurrentFood({ ...currentFood, image: imageUrl });
    }
  };

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFood.image) {
      alert('Please upload an image for the food item.');
      return;
    }
    if (currentFood.id) {
      updateFoodItem(currentFood.id, currentFood);
    } else {
      addFoodItem(currentFood as Omit<FoodItem, 'id'>);
    }
    setIsEditing(false);
    setCurrentFood({ name: '', price: 0, image: '', category: 'Lunch', available: true });
  };

  const editFood = (item: FoodItem) => {
    setCurrentFood(item);
    setIsEditing(true);
    setActiveTab('menu');
  };

  return (
    <DashboardLayout allowedRole="Canteen">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="p-3 bg-orange-50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-xl">
          <Store className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Canteen Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage menu items, monitor orders, and handle kitchen preparation.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">Rs. {totalSales.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Orders</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingOrdersCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Menu Items</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{menu.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'orders' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setActiveTab('kitchen')}
          className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'kitchen' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Kitchen View
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'menu' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Menu Management
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'requests' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Service Requests
        </button>
      </div>

      {/* Kitchen View Tab */}
      {activeTab === 'kitchen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">New Orders (Pending)</h3>
              <span className="ml-auto bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 py-0.5 px-2.5 rounded-full text-xs font-bold">
                {activeKitchenOrders.filter(o => o.status === 'Pending').length}
              </span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[600px]">
              {activeKitchenOrders.filter(o => o.status === 'Pending').map(order => (
                <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">{order.id}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(order.date).toLocaleTimeString()}</p>
                    </div>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <PlayCircle className="h-4 w-4" /> Start Preparing
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 w-6 h-6 flex items-center justify-center rounded text-xs">
                          {item.quantity}
                        </span>
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {activeKitchenOrders.filter(o => o.status === 'Pending').length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No pending orders.
                </div>
              )}
            </div>
          </div>

          {/* Preparing Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Currently Preparing</h3>
              <span className="ml-auto bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 py-0.5 px-2.5 rounded-full text-xs font-bold">
                {activeKitchenOrders.filter(o => o.status === 'Preparing').length}
              </span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[600px]">
              {activeKitchenOrders.filter(o => o.status === 'Preparing').map(order => (
                <div key={order.id} className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">{order.id}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(order.date).toLocaleTimeString()}</p>
                    </div>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Ready')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" /> Mark as Ready
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 w-6 h-6 flex items-center justify-center rounded text-xs border border-gray-200 dark:border-gray-700">
                          {item.quantity}
                        </span>
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {activeKitchenOrders.filter(o => o.status === 'Preparing').length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No orders currently being prepared.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Order ID</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Student</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Items</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Total</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{order.studentName}</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="p-4 font-semibold text-indigo-600 dark:text-indigo-400">Rs. {order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'Ready' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                        order.status === 'Preparing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-1.5"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Canteen Service Requests</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Requests routed by Warden or Marshal.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Title</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Description</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Submitted By</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {requestsLoading ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-gray-400">
                      Loading requests...
                    </td>
                  </tr>
                ) : requestsError ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-red-600 dark:text-red-400">
                      {requestsError}
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-gray-400">
                      No assigned requests.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{request.title}</td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{request.description}</td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                        {request.submittedByRole || request.submittedByName || 'Warden'}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                        {request.status === 'resolved' ? 'Resolved' : request.status === 'in_progress' ? 'In Progress' : 'Pending'}
                      </td>
                      <td className="p-4">
                        <select
                          value={request.status}
                          onChange={(e) => updateRequestStatus(request._id, e.target.value as any)}
                          className="text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">Current Menu</h3>
                <button 
                  onClick={() => {
                    setCurrentFood({ name: '', price: 0, image: '', category: 'Lunch', available: true });
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-2 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-medium transition-colors dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                >
                  <Plus className="h-4 w-4" /> Add Item
                </button>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {menu.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.category} • Rs. {item.price.toFixed(2)}</p>
                        <span className={`text-xs font-medium ${item.available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {item.available ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editFood(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteFoodItem(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {isEditing && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-fit sticky top-24">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {currentFood.id ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <form onSubmit={handleSaveFood} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input type="text" required value={currentFood.name} onChange={e => setCurrentFood({...currentFood, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (Rs.)</label>
                  <input type="number" required min="0" value={currentFood.price} onChange={e => setCurrentFood({...currentFood, price: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select value={currentFood.category} onChange={e => setCurrentFood({...currentFood, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Food Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative">
                    <div className="space-y-1 text-center">
                      {currentFood.image ? (
                        <div className="relative">
                          <img src={currentFood.image} alt="Preview" className="mx-auto h-32 object-cover rounded-lg" />
                          <button 
                            type="button"
                            onClick={() => setCurrentFood({...currentFood, image: ''})}
                            className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-1 hover:bg-red-200 dark:hover:bg-red-800/50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <ImagePlus className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="available" checked={currentFood.available} onChange={e => setCurrentFood({...currentFood, available: e.target.checked})} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor="available" className="text-sm font-medium text-gray-700 dark:text-gray-300">Available in Menu</label>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save Item</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};
