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
// ✅ Import Admin Dashboard
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    
    // 🔥 The Premium Toast Notification
    toast.success(`${product.name} added to your scoop! 🍦`, {
      duration: 3000,
      position: 'bottom-center',
      style: {
        borderRadius: '15px',
        background: '#4A4A4A',
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
      },
    });
  };

  const removeFromCart = (index) => {
    const itemToRemove = cartItems[index];
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);

    // Alert when something is removed
    toast.error(`${itemToRemove.name} removed.`, {
      icon: '🗑️',
      position: 'bottom-center',
      style: {
        borderRadius: '15px',
        fontFamily: 'Poppins, sans-serif',
      },
    });
  };

  // ✅ Added function to empty the cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      {/* Container for popups */}
      <Toaster /> 
      
      <Navbar cartCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
      
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemove={removeFromCart}
        clearCart={clearCart} // ✅ Passed clearCart to Cart component
      />

      {/* Main Content Area */}
      {/* ✅ Added top padding to prevent content from going under the fixed navbar */}
      <div className="min-h-screen pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flavors" element={<Flavors addToCart={addToCart} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/flavor/:id" element={<FlavorDetail addToCart={addToCart} />} /> 
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/track/:orderId" element={<TrackOrderPage />} />
          
          <Route path="/login" element={<AuthPage type="login" />} />
          <Route path="/signup" element={<AuthPage type="signup" />} />
          
          {/* ✅ Registered Admin Route */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>

      <Footer /> 
    </Router>
  );
}

export default App;
