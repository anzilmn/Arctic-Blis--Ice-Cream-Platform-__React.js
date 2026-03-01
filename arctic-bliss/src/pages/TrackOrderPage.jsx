import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Package, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

const TrackOrderPage = () => {
  // ✅ Get the order ID from the URL (e.g., /track/ORD-1001)
  const { orderId } = useParams();
  
  // Simulation: Define stages
  const stages = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
  
  // Set initial state based on param or default
  const [order, setOrder] = useState({
    id: orderId || 'ORD-UNKNOWN',
    status: 'Placed',
  });

  // Simulate progress
  useEffect(() => {
    if (order.status === 'Delivered') return;

    const timer = setTimeout(() => {
      const currentIndex = stages.indexOf(order.status);
      
      if (currentIndex < stages.length - 1) {
        setOrder(prev => ({ ...prev, status: stages[currentIndex + 1] }));
      }
    }, 4000); // Advances status every 4 seconds

    return () => clearTimeout(timer);
  }, [order.status]);

  const getProgress = () => {
    const map = { 'Placed': 25, 'Preparing': 50, 'Out for Delivery': 75, 'Delivered': 100 };
    return map[order.status] || 0;
  };

  // Icon mapping for steps
  const StepIcon = ({ stage, currentStatus }) => {
    const isActive = stages.indexOf(stage) <= stages.indexOf(currentStatus);
    const colorClass = isActive ? 'text-pink-600' : 'text-gray-300';
    
    const icons = {
      Placed: Package,
      Preparing: Clock,
      'Out for Delivery': MapPin,
      Delivered: CheckCircle,
    };
    const Icon = icons[stage];
    
    return <Icon className={`w-8 h-8 ${colorClass}`} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link to="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-6 font-medium">
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        {/* Tracking Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter">
              Tracking <span className="text-pink-600">#{order.id}</span>
            </h1>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
              order.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-blue-100 text-blue-800 border-blue-200'
            }`}>
              {order.status}
            </span>
          </div>

          {/* Visual Progress Bar */}
          <div className="relative pt-10 pb-5">
            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100">
              <div
                style={{ width: `${getProgress()}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-pink-500 to-blue-500 transition-all duration-500"
              />
            </div>
            
            {/* Steps Nodes */}
            <div className="flex justify-between mt-[-32px]">
              {stages.map(stage => (
                <div key={stage} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                    stages.indexOf(stage) <= stages.indexOf(order.status) 
                      ? 'bg-pink-100 border-white ring-2 ring-pink-500' 
                      : 'bg-white border-white ring-2 ring-gray-200'
                  }`}>
                    <StepIcon stage={stage} currentStatus={order.status} />
                  </div>
                  <span className={`text-xs mt-2 font-semibold ${
                    stages.indexOf(stage) <= stages.indexOf(order.status) ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-gray-50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">Estimated Arrival</p>
              <p className="text-xl font-bold text-gray-950">
                {order.status === 'Delivered' ? 'Delivered!' : '30-40 Minutes'}
              </p>
            </div>
            <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;