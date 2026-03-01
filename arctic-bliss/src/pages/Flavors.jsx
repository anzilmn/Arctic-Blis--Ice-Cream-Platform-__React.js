import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { flavors } from '../data/flavors';

const Flavors = ({ addToCart }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Chocolate', 'Fruit', 'Special'];

  const filteredFlavors = filter === 'All' 
    ? flavors 
    : flavors.filter(f => f.category === filter);

  return (
    // ✅ Updated Background with a very subtle gradient (Light Theme)
    <div className="pt-32 pb-20 min-h-screen bg-gradient-to-b from-white to-pink-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          {/* ✅ Premium Heading Styling (Light Theme) */}
          <h2 className="text-5xl md:text-6xl font-extrabold text-iceDark mb-4 tracking-tighter">
            Our Signature <span className="text-icePrimary">Scoops</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our handcrafted flavors, made with the finest local ingredients.
          </p>
          
          {/* ✅ Premium Filter Buttons (Light Theme) */}
          <div className="flex flex-wrap justify-center gap-3 mt-12 bg-white/50 p-2 rounded-full border border-pink-100 backdrop-blur-sm shadow-inner inline-flex">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  filter === cat 
                  ? 'bg-icePrimary text-white shadow-lg shadow-icePrimary/30' 
                  : 'text-gray-600 hover:text-icePrimary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Used Motion.div for layout animations */}
        <Motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredFlavors.map((flavor) => (
              <Motion.div // 2. Updated to Motion.div
                key={flavor.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                // ✅ Premium Card Style (Light Theme)
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-pink-100/50 hover:border-pink-200"
              >
                <Link to={`/flavor/${flavor.id}`} className="block">
                    <div className="h-72 overflow-hidden relative">
                    <img 
                        src={flavor.image} 
                        alt={flavor.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {/* ✅ Sleeker Price Badge (Light Theme) */}
                    <span className="absolute top-4 right-4 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-iceDark border border-white/20">
                        {flavor.price}
                    </span>
                    </div>
                    <div className="p-6">
                        <h3 className="text-2xl font-bold text-iceDark group-hover:text-icePrimary transition-colors tracking-tight">
                            {flavor.name}
                        </h3>
                        <p className="text-icePrimary text-sm font-medium mt-1">{flavor.category}</p>
                        <p className="text-gray-600 text-sm mt-3 line-clamp-2">{flavor.description}</p>
                    </div>
                </Link>
                <div className="px-6 pb-6 pt-2">
                    {/* ✅ Upgraded Add to Cart Button (Light Theme) */}
                    <Motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => addToCart(flavor)}
                        className="w-full py-4 bg-icePrimary text-white font-bold rounded-2xl hover:bg-icePrimary/90 transition-all duration-300 shadow-md shadow-icePrimary/20"
                    >
                        Add to Cart +
                    </Motion.button>
                </div>
              </Motion.div>
            ))}
          </AnimatePresence>
        </Motion.div>
      </div>
    </div>
  );
};

export default Flavors;