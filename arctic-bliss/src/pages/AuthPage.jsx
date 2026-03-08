import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Mail, Lock, User, IceCream, Phone, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthPage = ({ type }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = type === 'login';

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!isLogin && form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) errs.email = 'Enter a valid email';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!isLogin && form.phone && !form.phone.match(/^[0-9]{10}$/)) errs.phone = 'Phone must be 10 digits';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await login(form.email, form.password);
      } else {
        user = await register(form.name, form.email, form.password, form.phone);
      }

      toast.success(`Welcome${user.name ? ', ' + user.name : ''}! 🍦`);
      if (user.isAdmin) navigate('/admin');
      else navigate('/');
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full p-4 pl-12 rounded-xl border transition ${
      errors[field] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-pink-400'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-6">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-3xl bg-pink-100 text-pink-600">
            <IceCream size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-950 text-center tracking-tighter mb-2">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {isLogin ? 'Sign in to access your dashboard.' : 'Join us for sweet rewards! 🍦'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className={inputClass('name')} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
            </div>
          )}
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} className={inputClass('email')} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={form.password} onChange={handleChange} className={`${inputClass('password')} pr-12`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>
          {!isLogin && (
            <div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="tel" name="phone" placeholder="Phone (10 digits, optional)" value={form.phone} onChange={handleChange} className={inputClass('phone')} />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
            </div>
          )}
          <Motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-pink-600 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Motion.button>
        </form>
        <p className="text-center text-gray-600 mt-6 text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <a href={isLogin ? '/signup' : '/login'} className="text-pink-600 font-semibold hover:underline">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </a>
        </p>
      </Motion.div>
    </div>
  );
};

export default AuthPage;
