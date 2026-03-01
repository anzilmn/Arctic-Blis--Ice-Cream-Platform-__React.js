import React, { useState } from 'react';
import { Package, Clock, CheckCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock Data - Added icon mapping for status
const initialOrders = [
  {
    id: 'ORD-1001',
    date: 'Feb 28, 2026',
    items: ['Chocolate Lava (x2)', 'Mango Magic (x1)'],
    total: 13.00,
    status: 'Preparing',
  },
  {
    id: 'ORD-0999',
    date: 'Feb 27, 2026',
    items: ['Pistachio Dream (x1)'],
    total: 5.00,
    status: 'Delivered',
  },
];

// Helper to style status badges
const StatusBadge = ({ status }) => {
  const styles = {
    Preparing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Delivered: 'bg-green-100 text-green-800 border-green-200',
    'Out for Delivery': 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const icons = {
    Preparing: <Clock size={16} />,
    Delivered: <CheckCircle size={16} />,
    'Out for Delivery': <MapPin size={16} />,
  };

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

const OrdersPage = () => {
  const [orders] = useState(initialOrders);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
            <Package size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-950 tracking-tighter">
            Order <span className="text-pink-600">History</span>
          </h1>
        </div>
        
        {/* Orders Grid */}
        <div className="space-y-6">
          {orders.map(order => (
            <div 
              key={order.id} 
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-lg font-bold text-gray-950">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Placed On</p>
                  <p className="text-sm font-medium text-gray-800">{order.date}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Items</p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    {order.items.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </div>
                
                <div className="flex flex-col md:items-end justify-between gap-4">
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-black text-gray-950">${order.total.toFixed(2)}</p>
                  </div>
                  
                  {order.status !== 'Delivered' && (
                    <Link 
                      to={`/track/${order.id}`} 
                      className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-icePrimary transition-colors"
                    >
                      <MapPin size={16} />
                      Track Order
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State / Back to Shop */}
        {orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't made your first scoop yet!</p>
            <Link to="/flavors" className="bg-icePrimary text-white px-6 py-3 rounded-xl font-semibold">
              Explore Flavors
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;