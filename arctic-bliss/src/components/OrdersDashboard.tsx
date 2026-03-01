import React, { useState, useEffect } from 'react';

// 1. Define Types for TypeScript
type OrderStatus = 'Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered';

interface OrderItem {
  flavorId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
}

// 2. Mock Data for demonstration
const mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    date: '2026-02-28 14:30',
    items: [
      { flavorId: 'chocolate-lava', name: 'Chocolate Lava', quantity: 2, price: 4.50 },
      { flavorId: 'mango-magic', name: 'Mango Magic', quantity: 1, price: 4.00 },
    ],
    total: 13.00,
    status: 'Preparing',
  },
  {
    id: 'ORD-0999',
    date: '2026-02-27 18:15',
    items: [
      { flavorId: 'pistachio-dream', name: 'Pistachio Dream', quantity: 1, price: 5.00 },
    ],
    total: 5.00,
    status: 'Delivered',
  },
];

const OrderDashboard: React.FC = () => {
  // 3. State Management
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(mockOrders[0]);

  // 4. Simulate Order Progress Tracking
  useEffect(() => {
    if (!trackingOrder || trackingOrder.status === 'Delivered') return;

    const timer = setTimeout(() => {
      const nextStatusMap: Record<OrderStatus, OrderStatus> = {
        'Placed': 'Preparing',
        'Preparing': 'Out for Delivery',
        'Out for Delivery': 'Delivered',
        'Delivered': 'Delivered',
      };

      setTrackingOrder((prev) => {
        if (!prev) return null;
        const newStatus = nextStatusMap[prev.status];
        return { ...prev, status: newStatus };
      });
      
      // Also update the order in the main list
      setOrders(prevOrders => 
        prevOrders.map(o => o.id === trackingOrder.id ? {...o, status: nextStatusMap[o.status]} : o)
      );

    }, 5000); // Advances every 5 seconds

    return () => clearTimeout(timer);
  }, [trackingOrder]);

  // Helper to get progress percentage
  const getProgress = (status: OrderStatus): number => {
    const map = { 'Placed': 25, 'Preparing': 50, 'Out for Delivery': 75, 'Delivered': 100 };
    return map[status];
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>My Orders</h1>
      
      {/* SECTION 1: Tracking Screen */}
      {trackingOrder && (
        <div style={{ border: '2px solid #333', padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
          <h2>Tracking Order: {trackingOrder.id}</h2>
          <p>Status: <strong>{trackingOrder.status}</strong></p>
          
          {/* Progress Bar */}
          <div style={{ width: '100%', backgroundColor: '#ddd', borderRadius: '4px', margin: '10px 0' }}>
            <div style={{
              width: `${getProgress(trackingOrder.status)}%`,
              backgroundColor: '#4CAF50',
              height: '20px',
              borderRadius: '4px',
              transition: 'width 0.5s ease-in-out'
            }} />
          </div>
          <p style={{fontSize: '0.9rem', color: '#666'}}>Order updates automatically every 5 seconds...</p>
        </div>
      )}

      {/* SECTION 2: List View */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        {orders.map(order => (
          <div key={order.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Order ID: {order.id}</strong>
              <span>{order.date}</span>
            </div>
            <p>Status: {order.status}</p>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {order.items.map(item => (
                <li key={item.flavorId}>{item.name} x {item.quantity}</li>
              ))}
            </ul>
            <p style={{ fontWeight: 'bold' }}>Total: ${order.total.toFixed(2)}</p>
            
            {order.status !== 'Delivered' && (
              <button 
                onClick={() => setTrackingOrder(order)}
                style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Track Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDashboard;