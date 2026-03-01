import React, { useState } from 'react';
import { Users, IceCream, DollarSign, LayoutDashboard, PlusCircle, Trash2, Mail } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const AdminDashboard = () => {
    // ✅ MOCK STATE DATA
    const [activeView, setActiveView] = useState('Dashboard');
    const [flavors, setFlavors] = useState([
        { id: 1, name: 'Chocolate Lava', price: 5.99 },
        { id: 2, name: 'Mango Magic', price: 4.99 },
        { id: 3, name: 'Pistachio Dream', price: 6.50 },
    ]);
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]);
    const [newFlavor, setNewFlavor] = useState({ name: '', price: '' });

    // ✅ Add Flavor Handler
    const handleAddFlavor = (e) => {
        e.preventDefault();
        setFlavors([...flavors, { ...newFlavor, id: Date.now(), price: parseFloat(newFlavor.price) }]);
        setNewFlavor({ name: '', price: '' });
        setActiveView('Manage Flavors');
    };

    // ✅ Delete User Handler (Fixes unused setUsers error)
    const handleDeleteUser = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    const stats = [
        { name: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Ice Cream Flavors', value: flavors.length, icon: IceCream, color: 'text-pink-600', bg: 'bg-pink-100' },
        { name: 'Total Income', value: '$12,450', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    ];

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Manage Flavors', icon: IceCream },
        { name: 'Add Flavor', icon: PlusCircle },
        { name: 'Users', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex pt-20">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col gap-8">
                <h2 className="text-2xl font-black text-gray-950 tracking-tighter">Admin Panel</h2>
                <nav className="space-y-4">
                    {menuItems.map(item => (
                        <button 
                            key={item.name} 
                            onClick={() => setActiveView(item.name)}
                            className={`flex w-full items-center gap-3 font-medium transition-colors ${activeView === item.name ? 'text-pink-600' : 'text-gray-600 hover:text-pink-600'}`}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10">
                <h1 className="text-4xl font-extrabold text-gray-950 tracking-tighter mb-10">{activeView}</h1>
                
                {activeView === 'Dashboard' && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {stats.map(stat => (
                                <div key={stat.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.name}</p>
                                        <p className="text-3xl font-extrabold text-gray-950">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Summary Table */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold mb-6">Recent Flavors</h3>
                            <div className="space-y-2">
                                {flavors.slice(-3).map(flavor => (
                                    <div key={flavor.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <span className="font-semibold">{flavor.name}</span>
                                        <span className="font-bold text-pink-600">${flavor.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeView === 'Manage Flavors' && (
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="space-y-4">
                            {flavors.map(flavor => (
                                <div key={flavor.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <span className="font-semibold block">{flavor.name}</span>
                                        <span className="text-sm text-gray-500">${flavor.price.toFixed(2)}</span>
                                    </div>
                                    <button className="text-sm px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeView === 'Add Flavor' && (
                    <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm max-w-lg">
                        <form onSubmit={handleAddFlavor} className="space-y-5">
                            <input type="text" placeholder="Flavor Name" value={newFlavor.name} onChange={e => setNewFlavor({...newFlavor, name: e.target.value})} required className="w-full p-4 rounded-xl border border-gray-200" />
                            <input type="number" step="0.01" placeholder="Price" value={newFlavor.price} onChange={e => setNewFlavor({...newFlavor, price: e.target.value})} required className="w-full p-4 rounded-xl border border-gray-200" />
                            <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-pink-600 transition-colors">Add to Menu</button>
                        </form>
                    </div>
                )}

                {activeView === 'Users' && (
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="space-y-4">
                            {users.map(user => (
                                <div key={user.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                    <div className='flex items-center gap-3'>
                                        <div className='p-3 bg-blue-100 text-blue-600 rounded-full'>
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <span className="font-semibold block">{user.name}</span>
                                            <span className="text-sm text-gray-500 flex items-center gap-1"><Mail size={14}/>{user.email}</span>
                                        </div>
                                    </div>
                                    {/* ✅ Added Delete User Button */}
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-sm px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
