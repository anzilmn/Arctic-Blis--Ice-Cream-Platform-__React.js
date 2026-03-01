import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { CreditCard, MapPin, Package, CheckCircle, Smartphone, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  // ✅ State to manage selected payment method
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Hardcoded cart items for the demo checkout page
  const cartItems = [
    { name: "Chocolate Lava", price: "$4.50", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=100" },
  ];
  const total = 4.50;

  const handlePlaceOrder = (e) => {
    e.preventDefault(); // Prevent page reload
    setIsSubmitted(true); // Show success message

    // Redirect to home after 3 seconds
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  // ✅ Payment Methods Data
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: Smartphone },
    { id: 'cod', name: 'Cash on Delivery', icon: Banknote },
  ];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gray-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-950 mb-10 text-center md:text-left">Checkout</h1>
        
        <div className="grid md:grid-cols-3 gap-10">
          {/* Form Side - Animated */}
          <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            {/* ✅ Success Message Area */}
            <AnimatePresence>
              {isSubmitted ? (
                <Motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-pink-50 rounded-3xl border-2 border-dashed border-pink-200"
                >
                  <CheckCircle className="mx-auto text-pink-500" size={64} />
                  <h2 className="text-3xl font-bold text-gray-950 mt-6">Order Placed!</h2>
                  <p className="text-gray-600 mt-2">Thank you for your purchase. Redirecting you to home...</p>
                </Motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-950 mb-6 flex items-center gap-3">
                    <MapPin className="text-pink-500" /> Shipping Details
                  </h2>
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <input type="text" placeholder="Full Name" required className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent transition" />
                    <input type="text" placeholder="Address" required className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent transition" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="City" required className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent transition" />
                      <input type="text" placeholder="Postal Code" required className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent transition" />
                    </div>
                    
                    {/* ✅ Payment Method Selection */}
                    <h2 className="text-2xl font-bold text-gray-950 mt-10 mb-6 flex items-center gap-3">
                      <CreditCard className="text-pink-500" /> Payment Method
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {paymentMethods.map(method => (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() => setPaymentMethod(method.id)}
                                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                                    paymentMethod === method.id 
                                    ? 'border-pink-500 bg-pink-50' 
                                    : 'border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                <method.icon className={paymentMethod === method.id ? 'text-pink-500' : 'text-gray-500'} size={28} />
                                <span className={`text-sm font-semibold ${paymentMethod === method.id ? 'text-gray-950' : 'text-gray-600'}`}>
                                    {method.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* ✅ Dynamic Payment Fields */}
                    <AnimatePresence mode="wait">
                        {paymentMethod === 'card' && (
                            <Motion.div key="card" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-4">
                                <input type="text" placeholder="Card Number" required className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent transition" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="MM/YY" required className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent transition" />
                                    <input type="text" placeholder="CVV" required className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent transition" />
                                </div>
                            </Motion.div>
                        )}
                        {paymentMethod === 'upi' && (
                            <Motion.div key="upi" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                                <input type="text" placeholder="username@bank" required className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent transition" />
                            </Motion.div>
                        )}
                        {paymentMethod === 'cod' && (
                            <Motion.div key="cod" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='bg-gray-50 p-4 rounded-xl border text-center text-gray-700'>
                                Pay with cash when your delicious treats arrive!
                            </Motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* ✅ Animated Premium Button */}
                    <Motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full mt-6 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-md hover:bg-gray-700 transition-all"
                    >
                      Place Order - ${total.toFixed(2)}
                    </Motion.button>
                  </form>
                </>
              )}
            </AnimatePresence>
          </Motion.div>

          {/* Summary Side - Animated */}
          <Motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-28"
          >
            <h2 className="text-2xl font-bold text-gray-950 mb-6 flex items-center gap-3">
              <Package className="text-pink-500" /> Summary
            </h2>
            {cartItems.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-gray-600 mb-4">
                <div className='flex items-center gap-3'>
                    <img src={item.image} alt={item.name} className='w-12 h-12 rounded-lg object-cover'/>
                    <span className="font-medium text-gray-950">{item.name}</span>
                </div>
                <span className="font-bold text-gray-950">{item.price}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between text-xl font-bold text-gray-950">
              <span>Total</span>
              <span className='text-pink-600'>${total.toFixed(2)}</span>
            </div>
          </Motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;