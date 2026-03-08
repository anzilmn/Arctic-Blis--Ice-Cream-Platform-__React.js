import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { CreditCard, MapPin, Package, CheckCircle, Smartphone, Banknote, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Checkout = ({ cartItems = [], clearCart }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    street: '', city: '', state: '', pincode: '',
    cardNumber: '', cardExpiry: '', cardCvv: '',
    upiId: '',
  });

  const items = cartItems.length > 0 ? cartItems : [
    { name: "Chocolate Lava", price: "$4.50", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=100" },
  ];

  const subtotal = items.reduce((acc, item) => {
    const price = parseFloat(item.price?.toString().replace('$', '') || 0);
    return acc + (isNaN(price) ? 0 : price);
  }, 0);
  const deliveryFee = subtotal >= 20 ? 0 : 2.99;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = 'Name is required';
    if (!form.customerEmail.match(/^\S+@\S+\.\S+$/)) errs.customerEmail = 'Valid email required';
    if (!form.street.trim()) errs.street = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.pincode.trim()) errs.pincode = 'Pincode is required';
    if (paymentMethod === 'card') {
      if (!form.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) errs.cardNumber = 'Enter valid 16-digit card number';
      if (!form.cardExpiry.match(/^\d{2}\/\d{2}$/)) errs.cardExpiry = 'Format: MM/YY';
      if (!form.cardCvv.match(/^\d{3,4}$/)) errs.cardCvv = 'Enter valid CVV';
    }
    if (paymentMethod === 'upi') {
      if (!form.upiId.includes('@')) errs.upiId = 'Enter valid UPI ID (e.g. name@bank)';
    }
    return errs;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        flavorName: item.name,
        flavorImage: item.image,
        price: parseFloat(item.price?.toString().replace('$', '') || 0),
        quantity: item.quantity || 1,
      }));

      const res = await ordersApi.place({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        items: orderItems,
        shippingAddress: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
        paymentMethod,
        subtotal,
        total,
      });

      setPlacedOrder(res.order);
      setIsSubmitted(true);
      if (clearCart) clearCart();
      toast.success('Order placed successfully! 🍦');
      setTimeout(() => navigate(`/track/${res.order.orderId}`), 3000);
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: Smartphone },
    { id: 'cod', name: 'Cash on Delivery', icon: Banknote },
  ];

  const inputClass = (field) =>
    `w-full p-4 rounded-xl border transition focus:outline-none ${
      errors[field] ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-pink-300'
    }`;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gray-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-950 mb-10 text-center md:text-left">Checkout</h1>
        <div className="grid md:grid-cols-3 gap-10">
          <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <AnimatePresence>
              {isSubmitted ? (
                <Motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-pink-50 rounded-3xl border-2 border-dashed border-pink-200">
                  <CheckCircle className="mx-auto text-pink-500" size={64} />
                  <h2 className="text-3xl font-bold text-gray-950 mt-6">Order Placed! 🎉</h2>
                  <p className="text-gray-600 mt-2">Order ID: <span className="font-bold text-pink-600">{placedOrder?.orderId}</span></p>
                  <p className="text-gray-500 mt-2">Redirecting to tracking page...</p>
                </Motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-950 mb-6 flex items-center gap-3"><MapPin className="text-pink-500" /> Shipping Details</h2>
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input name="customerName" type="text" placeholder="Full Name *" value={form.customerName} onChange={handleChange} className={inputClass('customerName')} />
                        {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                      </div>
                      <div>
                        <input name="customerEmail" type="email" placeholder="Email *" value={form.customerEmail} onChange={handleChange} className={inputClass('customerEmail')} />
                        {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>}
                      </div>
                    </div>
                    <input name="customerPhone" type="tel" placeholder="Phone (optional)" value={form.customerPhone} onChange={handleChange} className={inputClass('customerPhone')} />
                    <div>
                      <input name="street" type="text" placeholder="Street Address *" value={form.street} onChange={handleChange} className={inputClass('street')} />
                      {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <input name="city" type="text" placeholder="City *" value={form.city} onChange={handleChange} className={inputClass('city')} />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <input name="state" type="text" placeholder="State" value={form.state} onChange={handleChange} className={inputClass('state')} />
                      </div>
                      <div>
                        <input name="pincode" type="text" placeholder="Pincode *" value={form.pincode} onChange={handleChange} className={inputClass('pincode')} />
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-950 mt-10 mb-6 flex items-center gap-3"><CreditCard className="text-pink-500" /> Payment Method</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {paymentMethods.map(method => (
                        <button key={method.id} type="button" onClick={() => setPaymentMethod(method.id)}
                          className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${paymentMethod === method.id ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:border-gray-200'}`}>
                          <method.icon className={paymentMethod === method.id ? 'text-pink-500' : 'text-gray-500'} size={28} />
                          <span className={`text-sm font-semibold ${paymentMethod === method.id ? 'text-gray-950' : 'text-gray-600'}`}>{method.name}</span>
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {paymentMethod === 'card' && (
                        <Motion.div key="card" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-4">
                          <div>
                            <input name="cardNumber" type="text" placeholder="Card Number (16 digits)" value={form.cardNumber} onChange={handleChange} className={inputClass('cardNumber')} maxLength={19} />
                            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <input name="cardExpiry" type="text" placeholder="MM/YY" value={form.cardExpiry} onChange={handleChange} className={inputClass('cardExpiry')} maxLength={5} />
                              {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
                            </div>
                            <div>
                              <input name="cardCvv" type="text" placeholder="CVV" value={form.cardCvv} onChange={handleChange} className={inputClass('cardCvv')} maxLength={4} />
                              {errors.cardCvv && <p className="text-red-500 text-xs mt-1">{errors.cardCvv}</p>}
                            </div>
                          </div>
                        </Motion.div>
                      )}
                      {paymentMethod === 'upi' && (
                        <Motion.div key="upi" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                          <input name="upiId" type="text" placeholder="username@bank" value={form.upiId} onChange={handleChange} className={inputClass('upiId')} />
                          {errors.upiId && <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>}
                        </Motion.div>
                      )}
                      {paymentMethod === 'cod' && (
                        <Motion.div key="cod" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='bg-gray-50 p-4 rounded-xl border text-center text-gray-700'>
                          Pay with cash when your delicious treats arrive! 🚚
                        </Motion.div>
                      )}
                    </AnimatePresence>

                    <Motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                      className="w-full mt-6 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-md hover:bg-gray-700 transition-all disabled:opacity-60">
                      {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
                    </Motion.button>
                  </form>
                </>
              )}
            </AnimatePresence>
          </Motion.div>

          <Motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-28">
            <h2 className="text-2xl font-bold text-gray-950 mb-6 flex items-center gap-3"><Package className="text-pink-500" /> Summary</h2>
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-gray-600 mb-4">
                <div className='flex items-center gap-3'>
                  <img src={item.image} alt={item.name} className='w-12 h-12 rounded-lg object-cover' />
                  <span className="font-medium text-gray-950">{item.name}</span>
                </div>
                <span className="font-bold text-gray-950">{item.price}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-950 pt-2 border-t">
                <span>Total</span><span className='text-pink-600'>${total.toFixed(2)}</span>
              </div>
            </div>
            {subtotal < 20 && (
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <AlertCircle size={12} /> Add ${(20 - subtotal).toFixed(2)} more for free delivery
              </p>
            )}
          </Motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
