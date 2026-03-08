import React, { useState, useEffect } from 'react';
import { Users, IceCream, DollarSign, LayoutDashboard, PlusCircle, Trash2, Mail, Package, AlertCircle, Star, MessageSquare, Loader2, CheckCircle, Clock, X, RefreshCw, TrendingUp } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { adminApi, flavorsApi, ordersApi, reviewsApi, complaintsApi, contactApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('Dashboard');
  const [loading, setLoading] = useState(false);

  // Data states
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newFlavor, setNewFlavor] = useState({ name: '', category: 'Chocolate', price: '', image: '', description: '', ingredients: '' });

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/login'); return; }
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getStats();
      setStats(res.stats);
      setRecentOrders(res.recentOrders || []);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadView = async (view) => {
    setActiveView(view);
    setLoading(true);
    try {
      if (view === 'Dashboard') await loadDashboard();
      else if (view === 'Users') { const r = await adminApi.getUsers(); setUsers(r.users); }
      else if (view === 'Manage Flavors') { const r = await flavorsApi.getAll(); setFlavors(r.flavors); }
      else if (view === 'Orders') { const r = await ordersApi.getAll(); setOrders(r.orders); }
      else if (view === 'Reviews') { const r = await reviewsApi.getAll(); setReviews(r.reviews); }
      else if (view === 'Complaints') { const r = await complaintsApi.getAll(); setComplaints(r.complaints); }
      else if (view === 'Messages') { const r = await contactApi.getAll(); setMessages(r.messages); }
    } catch (err) {
      toast.error(`Failed to load ${view}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFlavor = async (e) => {
    e.preventDefault();
    try {
      const data = { ...newFlavor, price: parseFloat(newFlavor.price), ingredients: newFlavor.ingredients.split(',').map(s => s.trim()) };
      await flavorsApi.create(data);
      toast.success('Flavor added!');
      setNewFlavor({ name: '', category: 'Chocolate', price: '', image: '', description: '', ingredients: '' });
      loadView('Manage Flavors');
    } catch (err) { toast.error(err.message); }
  };

  const handleDeleteFlavor = async (id) => {
    if (!confirm('Deactivate this flavor?')) return;
    try { await flavorsApi.delete(id); setFlavors(flavors.filter(f => f._id !== id)); toast.success('Flavor deactivated'); }
    catch (err) { toast.error(err.message); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await adminApi.deleteUser(id); setUsers(users.filter(u => u._id !== id)); toast.success('User deleted'); }
    catch (err) { toast.error(err.message); }
  };

  const handleToggleUser = async (id) => {
    try { const r = await adminApi.toggleUser(id); setUsers(users.map(u => u._id === id ? r.user : u)); toast.success(r.message); }
    catch (err) { toast.error(err.message); }
  };

  const handleOrderStatus = async (id, status) => {
    try { const r = await ordersApi.updateStatus(id, status); setOrders(orders.map(o => o._id === id ? r.order : o)); toast.success('Order updated'); }
    catch (err) { toast.error(err.message); }
  };

  const handleDeleteReview = async (id) => {
    try { await reviewsApi.delete(id); setReviews(reviews.filter(r => r._id !== id)); toast.success('Review deleted'); }
    catch (err) { toast.error(err.message); }
  };

  const handleComplaintUpdate = async (id, data) => {
    try { const r = await complaintsApi.update(id, data); setComplaints(complaints.map(c => c._id === id ? r.complaint : c)); toast.success('Complaint updated'); }
    catch (err) { toast.error(err.message); }
  };

  const handleMarkRead = async (id) => {
    try { await contactApi.markRead(id); setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m)); }
    catch (err) { toast.error(err.message); }
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Orders', icon: Package },
    { name: 'Manage Flavors', icon: IceCream },
    { name: 'Add Flavor', icon: PlusCircle },
    { name: 'Users', icon: Users },
    { name: 'Reviews', icon: Star },
    { name: 'Complaints', icon: AlertCircle },
    { name: 'Messages', icon: MessageSquare },
  ];

  const statusColors = { Placed: 'bg-gray-100 text-gray-700', Preparing: 'bg-yellow-100 text-yellow-700', 'Out for Delivery': 'bg-blue-100 text-blue-700', Delivered: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700' };

  return (
    <div className="min-h-screen bg-gray-50 flex pt-20">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col gap-6 flex-shrink-0">
        <h2 className="text-2xl font-black text-gray-950 tracking-tighter">Admin Panel</h2>
        <nav className="space-y-2">
          {menuItems.map(item => (
            <button key={item.name} onClick={() => loadView(item.name)}
              className={`flex w-full items-center gap-3 font-medium transition-colors px-3 py-2.5 rounded-xl ${activeView === item.name ? 'text-pink-600 bg-pink-50' : 'text-gray-600 hover:text-pink-600 hover:bg-gray-50'}`}>
              <item.icon size={18} />{item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-950 tracking-tighter">{activeView}</h1>
          <button onClick={() => loadView(activeView)} className="text-gray-400 hover:text-pink-600 transition-colors">
            <RefreshCw size={20} />
          </button>
        </div>

        {loading && <div className="flex justify-center py-20"><Loader2 className="animate-spin text-pink-400" size={48} /></div>}

        {!loading && activeView === 'Dashboard' && stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              {[
                { name: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
                { name: 'Flavors', value: stats.totalFlavors, icon: IceCream, color: 'text-pink-600', bg: 'bg-pink-100' },
                { name: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
                { name: 'Revenue', value: `$${stats.totalRevenue?.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
                { name: 'Open Complaints', value: stats.pendingComplaints, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
                { name: 'Unread Messages', value: stats.unreadMessages, icon: MessageSquare, color: 'text-cyan-600', bg: 'bg-cyan-100' },
              ].map(stat => (
                <Motion.div key={stat.name} whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div>
                  <div><p className="text-sm text-gray-500">{stat.name}</p><p className="text-3xl font-extrabold text-gray-950">{stat.value}</p></div>
                </Motion.div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-pink-500" /> Recent Orders</h3>
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div>
                      <span className="font-semibold text-gray-900">{order.orderId}</span>
                      <span className="text-gray-500 text-sm ml-2">· {order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>{order.status}</span>
                      <span className="font-bold text-pink-600">${order.total?.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!loading && activeView === 'Orders' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="p-5 bg-gray-50 rounded-2xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-bold text-gray-900">{order.orderId}</span>
                      <p className="text-sm text-gray-500">{order.customerName} · {order.customerEmail}</p>
                    </div>
                    <span className="font-bold text-pink-600 text-lg">${order.total?.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <select value={order.status} onChange={e => handleOrderStatus(order._id, e.target.value)}
                      className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-pink-300 outline-none">
                      {['Placed','Preparing','Out for Delivery','Delivered','Cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <span className="text-xs text-gray-400">{order.items?.length} items · {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-center text-gray-400 py-8">No orders yet</p>}
            </div>
          </div>
        )}

        {!loading && activeView === 'Manage Flavors' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="space-y-3">
              {flavors.map(flavor => (
                <div key={flavor._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={flavor.image} alt={flavor.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <span className="font-semibold block">{flavor.name}</span>
                      <span className="text-sm text-gray-500">{flavor.category} · ${flavor.price?.toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteFlavor(flavor._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && activeView === 'Add Flavor' && (
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm max-w-lg">
            <form onSubmit={handleAddFlavor} className="space-y-4">
              {[
                { name: 'name', placeholder: 'Flavor Name *', type: 'text' },
                { name: 'price', placeholder: 'Price (e.g. 4.99) *', type: 'number' },
                { name: 'image', placeholder: 'Image URL *', type: 'text' },
                { name: 'description', placeholder: 'Description *', type: 'text' },
                { name: 'ingredients', placeholder: 'Ingredients (comma-separated)', type: 'text' },
              ].map(f => (
                <input key={f.name} type={f.type} placeholder={f.placeholder} value={newFlavor[f.name]}
                  onChange={e => setNewFlavor({ ...newFlavor, [f.name]: e.target.value })}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 outline-none" />
              ))}
              <select value={newFlavor.category} onChange={e => setNewFlavor({ ...newFlavor, category: e.target.value })}
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 outline-none">
                {['Chocolate','Fruit','Special'].map(c => <option key={c}>{c}</option>)}
              </select>
              <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-pink-600 transition-colors">Add to Menu</button>
            </form>
          </div>
        )}

        {!loading && activeView === 'Users' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="space-y-3">
              {users.map(u => (
                <div key={u._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={18} /></div>
                    <div>
                      <span className="font-semibold block">{u.name}</span>
                      <span className="text-sm text-gray-500 flex items-center gap-1"><Mail size={12} />{u.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-400">🏆 {u.loyaltyPoints} pts</span>
                    <button onClick={() => handleToggleUser(u._id)} className="text-xs px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-medium">
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDeleteUser(u._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {users.length === 0 && <p className="text-center text-gray-400 py-8">No users yet</p>}
            </div>
          </div>
        )}

        {!loading && activeView === 'Reviews' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev._id} className="flex justify-between items-start p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{rev.user?.name || rev.guestName || 'Guest'}</span>
                      <span className="text-yellow-400">{'★'.repeat(rev.rating)}</span>
                      <span className="text-xs text-gray-400">on {rev.flavor?.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{rev.comment}</p>
                  </div>
                  <button onClick={() => handleDeleteReview(rev._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {reviews.length === 0 && <p className="text-center text-gray-400 py-8">No reviews yet</p>}
            </div>
          </div>
        )}

        {!loading && activeView === 'Complaints' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="space-y-4">
              {complaints.map(c => (
                <div key={c._id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-gray-900">{c.subject}</span>
                      <p className="text-sm text-gray-500">{c.customerName} · {c.customerEmail}</p>
                      {c.orderId && <p className="text-xs text-gray-400">Order: {c.orderId}</p>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${c.priority === 'high' ? 'bg-red-100 text-red-700' : c.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                      {c.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{c.description}</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <select value={c.status} onChange={e => handleComplaintUpdate(c._id, { status: e.target.value })}
                      className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-pink-300 outline-none">
                      {['open','in_review','resolved','closed'].map(s => <option key={s}>{s}</option>)}
                    </select>
                    {c.adminResponse && <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Responded</span>}
                  </div>
                </div>
              ))}
              {complaints.length === 0 && <p className="text-center text-gray-400 py-8">No complaints yet 🎉</p>}
            </div>
          </div>
        )}

        {!loading && activeView === 'Messages' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg._id} className={`p-5 rounded-2xl border ${msg.isRead ? 'bg-gray-50 border-gray-100' : 'bg-blue-50 border-blue-100'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="font-semibold text-gray-900">{msg.name}</span>
                      <span className="text-gray-500 text-sm ml-2">· {msg.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!msg.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                      <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                  {!msg.isRead && (
                    <button onClick={() => handleMarkRead(msg._id)}
                      className="mt-2 text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium flex items-center gap-1">
                      <CheckCircle size={12} /> Mark as Read
                    </button>
                  )}
                </div>
              ))}
              {messages.length === 0 && <p className="text-center text-gray-400 py-8">No messages yet</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
