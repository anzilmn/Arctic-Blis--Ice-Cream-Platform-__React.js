import React from 'react';
import { ShoppingCart, IceCream, Menu, Package, MapPin, UserCircle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';

const Navbar = ({ cartCount, onCartClick }) => {
  const navigate = useNavigate();
  // ✅ Check if user is logged in from localStorage
  const user = localStorage.getItem('user');
  
  // ✅ Logout Functionality
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload(); // Refresh to update navbar state
  };

  // ✅ Helper to get display name
  const getDisplayName = () => {
    if (!user) return 'Sign In';
    const userData = JSON.parse(user);
    // Prefer name, fallback to email prefix
    return userData.name || userData.email.split('@')[0];
  };

  return (
    <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-xl border-b border-pink-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-900">
          <Motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="flex items-center justify-center p-2 rounded-2xl bg-pink-50 text-icePrimary"
          >
            <IceCream size={28} strokeWidth={2.5} />
          </Motion.div>
          <span className="bg-gradient-to-r from-icePrimary via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Arctic Bliss
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 font-bold text-gray-800">
          {[
            { name: 'Home', path: '/' },
            { name: 'Flavors', path: '/flavors' },
            { name: 'Orders', path: '/orders', icon: Package },
            { name: 'Track', path: '/track', icon: MapPin },
          ].map(item => (
            <Link 
              key={item.name}
              to={item.path}
              className="hover:text-icePrimary transition-colors relative group py-2 flex items-center gap-2"
            >
              {item.icon && <item.icon size={18} />}
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-icePrimary transition-all group-hover:w-full rounded-full"></span>
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          
          {/* ✅ Auth / User Profile Button */}
          {user ? (
            <div className="flex items-center gap-2 group">
                <div className='flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 p-2 px-4 rounded-full'>
                    <UserCircle size={20} />
                    {/* ✅ "Hy username" */}
                    Hy {getDisplayName()}
                </div>
                {/* Logout Icon on hover */}
                <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 p-3 px-5 bg-gray-900 text-white rounded-2xl text-sm font-semibold hover:bg-gray-700 transition-colors">
              <UserCircle size={20} />
              Sign In
            </Link>
          )}

          {/* Cart Button */}
          <button 
            onClick={onCartClick}
            className="relative p-3 bg-pink-50 hover:bg-icePrimary text-gray-800 hover:text-white transition-all duration-300 rounded-2xl group shadow-sm"
          >
            <ShoppingCart size={22} className="transition-colors" />
            
            {/* Dynamic Notification Badge */}
            {cartCount > 0 && (
              <Motion.div 
                key={cartCount} // Re-animate on change
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ duration: 0.3 }}
                className="absolute -top-1 -right-1 bg-icePrimary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
              >
                {cartCount}
              </Motion.div>
            )}
          </button>

          {/* Mobile Menu Icon */}
          <button className="md:hidden p-3 bg-pink-50 rounded-2xl text-gray-800">
            <Menu size={24} />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;