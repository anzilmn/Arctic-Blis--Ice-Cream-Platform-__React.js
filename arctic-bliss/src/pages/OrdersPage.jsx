import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, MapPin, Loader2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StatusBadge = ({ status }) => {
  const styles = {
    Placed: 'bg-gray-100 text-gray-800 border-gray-200',
    Preparing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Delivered: 'bg-green-100 text-green-800 border-green-200',
    'Out for Delivery': 'bg-blue-100 text-blue-800 border-blue-200',
    Cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  const icons = {
    Placed: <Package size={14} />,
    Preparing: <Clock size={14} />,
    Delivered: <CheckCircle size={14} />,
    'Out for Delivery': <MapPin size={14} />,
    Cancelled: <Package size={14} />,
  };
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.Placed}`}>
      {icons[status] || icons.Placed}{status}
    </span>
  );
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    ordersApi.getMine()
      .then(res => setOrders(res.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-6 flex items-center justify-center">
      <div className="text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Please sign in</h3>
        <p className="text-gray-500 mb-6">Sign in to view your order history</p>
        <Link to="/login" className="bg-icePrimary text-white px-6 py-3 rounded-xl font-semibold">Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl"><Package size={32} /></div>
          <h1 className="text-4xl font-extrabold text-gray-950 tracking-tighter">Order <span className="text-pink-600">History</span></h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-pink-400" size={48} /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't made your first scoop yet!</p>
            <Link to="/flavors" className="bg-icePrimary text-white px-6 py-3 rounded-xl font-semibold">Explore Flavors</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-lg font-bold text-gray-950">{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Placed On</p>
                    <p className="text-sm font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Items</p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                      {order.items.map((item, i) => <li key={i}>{item.flavorName} (x{item.quantity})</li>)}
                    </ul>
                  </div>
                  <div className="flex flex-col md:items-end justify-between gap-4">
                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-2xl font-black text-gray-950">${order.total?.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{order.paymentMethod?.toUpperCase()} · {order.paymentStatus}</p>
                    </div>
                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                      <Link to={`/track/${order.orderId}`}
                        className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-icePrimary transition-colors">
                        <MapPin size={16} />Track Order
                      </Link>
                    )}
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

export default OrdersPage;
