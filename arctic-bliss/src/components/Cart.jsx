import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = ({ isOpen, onClose, items, onRemove, clearCart }) => {
  // Calculate total
  const total = items.reduce((acc, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  // ✅ Function to handle checkout and clear cart
  const handleCheckout = () => {
    onClose(); // Close the cart
    clearCart(); // ✅ Call the function to empty the cart
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Cart Drawer */}
          <Motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col border-l border-pink-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-3xl font-extrabold flex items-center gap-3 text-iceDark tracking-tight">
                <ShoppingBag className="text-icePrimary" size={28} /> Your Tub
              </h2>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-pink-50 rounded-full transition-colors"
              >
                <X size={24} className="text-iceDark" />
              </button>
            </div>

            {/* Items Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="text-center mt-20 text-gray-500 flex flex-col items-center">
                  <div className="bg-pink-50 p-8 rounded-full mb-6">
                      <p className="text-6xl">🍦</p>
                  </div>
                  <h3 className="text-2xl font-bold text-iceDark">Your cart is empty</h3>
                  <p className="mt-2 text-gray-600">Looks like you haven't added any delicious scoops yet.</p>
                  <button onClick={onClose} className="mt-8 px-6 py-2 bg-icePrimary text-white rounded-full font-semibold hover:bg-pink-400 transition">
                      Explore Flavors
                  </button>
                </div>
              ) : (
                items.map((item, index) => (
                  <Motion.div 
                    layout 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex items-center gap-4 bg-pink-50/70 p-4 rounded-3xl border border-pink-100 hover:border-pink-200 transition-all duration-300"
                  >
                    <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-iceDark leading-snug">{item.name}</h4>
                      <p className="text-icePrimary font-bold text-xl mt-1">{item.price}</p>
                    </div>
                    <button 
                      onClick={() => onRemove(index)} 
                      className="text-red-400 hover:text-red-600 p-3 bg-white rounded-full shadow-sm"
                    >
                      <Trash2 size={20} />
                    </button>
                  </Motion.div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-white">
                <div className="flex justify-between mb-6 text-xl font-bold text-iceDark">
                  <span>Subtotal</span>
                  <span className="text-2xl">${total.toFixed(2)}</span>
                </div>
                <Link 
                  to="/checkout" 
                  onClick={handleCheckout} 
                  className="group flex items-center justify-center gap-3 w-full py-4 bg-icePrimary text-white font-bold text-lg rounded-2xl shadow-lg hover:bg-pink-500 transition-all transform hover:-translate-y-1 hover:shadow-pink-500/30"
                >
                  Checkout Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;