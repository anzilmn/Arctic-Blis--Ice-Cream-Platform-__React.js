import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Mail, Lock, User, IceCream } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ type }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const isLogin = type === 'login';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ✅ ADMIN SIMULATION LOGIC
    if (isLogin && email === 'admin@arcticbliss.com' && password === 'admin123') {
        localStorage.setItem('user', JSON.stringify({ 
            email, 
            name: 'Admin',
            isAdmin: true // Special flag
        }));
        navigate('/admin');
    } else {
        // Normal user login/signup
        localStorage.setItem('user', JSON.stringify({ 
            email, 
            name: isLogin ? name || email.split('@')[0] : name,
            isAdmin: false
        }));
        navigate('/');
    }
    
    window.location.reload();
  };

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
            {isLogin ? 'Sign in to access your dashboard.' : 'Join us for sweet rewards!'}
        </p>
        
        {/* Helper text for demo */}
        {isLogin && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-xs mb-4 text-center">
                Admin: admin@arcticbliss.com | admin123
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-4 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-4 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-4 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition" />
          </div>

          <Motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-pink-600 transition-colors shadow-md">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Motion.button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
          <a href={isLogin ? '/signup' : '/login'} className="text-pink-600 font-semibold hover:underline">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </a>
        </p>
      </Motion.div>
    </div>
  );
};

export default AuthPage;
