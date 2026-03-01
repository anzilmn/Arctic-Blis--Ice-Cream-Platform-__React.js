import { useParams, Link } from 'react-router-dom';
import { flavors } from '../data/flavors';
import { motion as Motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

// ✅ Added addToCart prop here
const FlavorDetail = ({ addToCart }) => {
  const { id } = useParams();
  const flavor = flavors.find(f => f.id === id);
  
  const [reviews, setReviews] = useState([
    { name: "Rahul", rating: 5, comment: "Absolutely divine! The best mango ice cream in Kochi." },
    { name: "Priya", rating: 4, comment: "So creamy, but a bit too sweet for me." }
  ]);
  const [newReview, setNewReview] = useState("");

  if (!flavor) return <div className="pt-32 text-center text-iceDark">Flavor not found!</div>;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if(!newReview) return;
    
    const reviewObj = { name: "Guest", rating: 5, comment: newReview };
    setReviews([reviewObj, ...reviews]);
    setNewReview("");
    toast.success("Review added! (Frontend only)");
  };

  return (
    <div className="pt-24 min-h-screen bg-white transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/flavors" className="flex items-center gap-2 text-icePrimary mb-8 hover:underline font-semibold">
          <ArrowLeft size={20} /> Back to Flavors
        </Link>

        {/* --- Product Info --- */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* ✅ Premium shadow and hover animation */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl shadow-xl w-full h-96 overflow-hidden border border-pink-50"
          >
            <img 
              src={flavor.image} 
              alt={flavor.name}
              className="w-full h-full object-cover"
            />
          </Motion.div>
          
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm font-bold text-icePrimary bg-pink-100 px-4 py-1 rounded-full">
              {flavor.category}
            </span>
            <h1 className="text-5xl font-extrabold text-iceDark mt-4 tracking-tight">{flavor.name}</h1>
            <p className="text-gray-700 mt-6 text-lg leading-relaxed">{flavor.description}</p>
            
            <div className="flex items-center gap-6 mt-10">
              <span className="text-4xl font-bold text-iceDark">{flavor.price}</span>
              
              {/* ✅ ADDED: onClick handler for Add to Cart */}
              <Motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(flavor)} // ✅ Added click handler
                className="flex items-center gap-2 px-8 py-4 bg-icePrimary text-white rounded-full font-bold text-lg shadow-lg hover:bg-pink-500 transition-all"
              >
                <ShoppingCart size={20} /> Add to Cart
              </Motion.button>
            </div>
          </Motion.div>
        </div>

        {/* --- Reviews Section --- */}
        <div className="mt-20 border-t border-gray-100 pt-10">
          <h3 className="text-3xl font-extrabold text-iceDark mb-8 tracking-tight">Customer Reviews</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {reviews.map((rev, i) => (
                <div key={i} className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-iceDark">{rev.name}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h4 className="font-bold text-xl text-iceDark mb-4">Add a Review</h4>
              <textarea 
                rows="3"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-icePrimary focus:border-icePrimary outline-none transition"
                placeholder="What did you think?"
              />
              {/* ✅ Button styling */}
              <Motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="mt-4 px-6 py-3 bg-iceDark text-white rounded-xl font-bold hover:bg-gray-900 transition"
              >
                Submit Review
              </Motion.button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FlavorDetail;