import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Flavors from './pages/Flavors';
import Contact from './pages/Contact';
import Cart from './components/Cart';
import FlavorDetail from './pages/FlavorDetail';
import Checkout from './pages/Checkout';
import OrdersPage from './pages/OrdersPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintsPage from './pages/ComplaintsPage';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.findIndex(i => i._id === product._id || i.id === product.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], quantity: (updated[existing].quantity || 1) + 1 };
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to your scoop! 🍦`, {
      duration: 3000, position: 'bottom-center',
      style: { borderRadius: '15px', background: '#4A4A4A', color: '#fff', fontFamily: 'Poppins, sans-serif' },
    });
  };

  const removeFromCart = (index) => {
    const itemToRemove = cartItems[index];
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
    toast.error(`${itemToRemove.name} removed.`, { icon: '🗑️', position: 'bottom-center', style: { borderRadius: '15px', fontFamily: 'Poppins, sans-serif' } });
  };

  const clearCart = () => setCartItems([]);

  return (
    <Router>
      <Toaster />
      <Navbar cartCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onRemove={removeFromCart} clearCart={clearCart} />
      <div className="min-h-screen pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flavors" element={<Flavors addToCart={addToCart} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/flavor/:id" element={<FlavorDetail addToCart={addToCart} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} clearCart={clearCart} />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/track/:orderId" element={<TrackOrderPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/login" element={<AuthPage type="login" />} />
          <Route path="/signup" element={<AuthPage type="signup" />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
