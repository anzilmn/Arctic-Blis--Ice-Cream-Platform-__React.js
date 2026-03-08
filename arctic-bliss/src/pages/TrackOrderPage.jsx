import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Package, Clock, CheckCircle, ArrowLeft, Search, Loader2, XCircle } from 'lucide-react';
import { ordersApi } from '../services/api';

const TrackOrderPage = () => {
  const { orderId: paramOrderId } = useParams();
  const [orderId, setOrderId] = useState(paramOrderId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stages = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];

  const fetchOrder = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await ordersApi.track(id.trim().toUpperCase());
      setOrder(res.order);
    } catch (err) {
      setError('Order not found. Please check your Order ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramOrderId) fetchOrder(paramOrderId);
  }, [paramOrderId]);

  const getProgress = (status) => {
    const map = { Placed: 12, Preparing: 37, 'Out for Delivery': 70, Delivered: 100, Cancelled: 100 };
    return map[status] || 0;
  };

  const StepIcon = ({ stage, currentStatus }) => {
    const isActive = stages.indexOf(stage) <= stages.indexOf(currentStatus);
    const icons = { Placed: Package, Preparing: Clock, 'Out for Delivery': MapPin, Delivered: CheckCircle };
    const Icon = icons[stage];
    return <Icon className={`w-6 h-6 ${isActive ? 'text-pink-600' : 'text-gray-300'}`} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-6 font-medium">
          <ArrowLeft size={16} />Back to Orders
        </Link>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Track Your Order</h2>
          <div className="flex gap-3">
            <input type="text" placeholder="Enter Order ID (e.g. ORD-1001)" value={orderId}
              onChange={e => setOrderId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchOrder(orderId)}
              className="flex-1 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent outline-none" />
            <button onClick={() => fetchOrder(orderId)} disabled={loading}
              className="px-6 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-icePrimary transition-colors flex items-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              Track
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-3 flex items-center gap-1"><XCircle size={14} />{error}</p>}
        </div>

        {order && (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter">
                Tracking <span className="text-pink-600">#{order.orderId}</span>
              </h1>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                order.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                'bg-blue-100 text-blue-800 border-blue-200'
              }`}>
                {order.status}
              </span>
            </div>

            {order.status === 'Cancelled' ? (
              <div className="text-center py-10 bg-red-50 rounded-2xl">
                <XCircle className="mx-auto text-red-400 mb-3" size={48} />
                <p className="text-red-600 font-semibold text-lg">This order has been cancelled</p>
              </div>
            ) : (
              <div className="relative pt-10 pb-5">
                <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100">
                  <div style={{ width: `${getProgress(order.status)}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-pink-500 to-blue-500 transition-all duration-1000" />
                </div>
                <div className="flex justify-between mt-[-32px]">
                  {stages.map(stage => (
                    <div key={stage} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                        stages.indexOf(stage) <= stages.indexOf(order.status) ?
                        'bg-pink-100 border-white ring-2 ring-pink-500' : 'bg-white border-white ring-2 ring-gray-200'
                      }`}>
                        <StepIcon stage={stage} currentStatus={order.status} />
                      </div>
                      <span className={`text-xs mt-2 font-semibold ${stages.indexOf(stage) <= stages.indexOf(order.status) ? 'text-gray-900' : 'text-gray-400'}`}>
                        {stage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 bg-gray-50 p-6 rounded-2xl grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-bold text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Arrival</p>
                <p className="font-bold text-gray-900">{order.status === 'Delivered' ? 'Delivered!' : order.estimatedDelivery || '30-40 Minutes'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold text-pink-600 text-xl">${order.total?.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Items Ordered</p>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-900">{item.flavorName} ×{item.quantity}</span>
                    <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Link to="/contact" className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
