import { useParams, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star, Send, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { flavorsApi, reviewsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FlavorDetail = ({ addToCart }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [flavor, setFlavor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({ comment: '', rating: 5, guestName: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flavorRes = await flavorsApi.getBySlug(id);
        setFlavor(flavorRes.flavor);
        const reviewRes = await reviewsApi.getForFlavor(flavorRes.flavor._id);
        setReviews(reviewRes.reviews);
      } catch (err) {
        toast.error('Flavor not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (newReview.comment.trim().length < 5) errs.comment = 'Comment must be at least 5 characters';
    if (!user && !newReview.guestName.trim()) errs.guestName = 'Name is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setReviewLoading(true);
    try {
      const res = await reviewsApi.submit(flavor._id, {
        rating: newReview.rating,
        comment: newReview.comment,
        guestName: newReview.guestName || undefined,
      });
      setReviews([res.review, ...reviews]);
      setNewReview({ comment: '', rating: 5, guestName: '' });
      toast.success('Review submitted! 🌟');
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return (
    <div className="pt-32 flex justify-center items-center min-h-screen">
      <Loader2 className="animate-spin text-pink-500" size={48} />
    </div>
  );

  if (!flavor) return <div className="pt-32 text-center text-iceDark text-2xl">Flavor not found!</div>;

  const displayName = (rev) => rev.user?.name || rev.guestName || 'Guest';

  return (
    <div className="pt-24 min-h-screen bg-white transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/flavors" className="flex items-center gap-2 text-icePrimary mb-8 hover:underline font-semibold">
          <ArrowLeft size={20} /> Back to Flavors
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02 }}
            className="rounded-3xl shadow-xl w-full h-96 overflow-hidden border border-pink-50">
            <img src={flavor.image} alt={flavor.name} className="w-full h-full object-cover" />
          </Motion.div>

          <Motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="text-sm font-bold text-icePrimary bg-pink-100 px-4 py-1 rounded-full">{flavor.category}</span>
            <h1 className="text-5xl font-extrabold text-iceDark mt-4 tracking-tight">{flavor.name}</h1>
            <p className="text-gray-700 mt-6 text-lg leading-relaxed">{flavor.description}</p>

            {flavor.ingredients?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-500 mb-2">Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {flavor.ingredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-medium">{ing}</span>
                  ))}
                </div>
              </div>
            )}

            {flavor.averageRating > 0 && (
              <div className="flex items-center gap-2 mt-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(flavor.averageRating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{flavor.averageRating} ({flavor.reviewCount} reviews)</span>
              </div>
            )}

            <div className="flex items-center gap-6 mt-10">
              <span className="text-4xl font-bold text-iceDark">${flavor.price?.toFixed(2)}</span>
              <Motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => addToCart({ ...flavor, price: `$${flavor.price?.toFixed(2)}` })}
                className="flex items-center gap-2 px-8 py-4 bg-icePrimary text-white rounded-full font-bold text-lg shadow-lg hover:bg-pink-500 transition-all">
                <ShoppingCart size={20} /> Add to Cart
              </Motion.button>
            </div>
          </Motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 border-t border-gray-100 pt-10">
          <h3 className="text-3xl font-extrabold text-iceDark mb-8 tracking-tight">Customer Reviews</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {reviews.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Star size={32} className="mx-auto mb-2 opacity-30" />
                  <p>No reviews yet. Be the first!</p>
                </div>
              ) : (
                reviews.map((rev, i) => (
                  <div key={i} className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-iceDark">{displayName(rev)}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(rev.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{rev.comment}</p>
                    <p className="text-gray-400 text-xs mt-2">{new Date(rev.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h4 className="font-bold text-xl text-iceDark mb-4">Add a Review</h4>
              {!user && (
                <div className="mb-4">
                  <input type="text" placeholder="Your name *" value={newReview.guestName}
                    onChange={e => setNewReview({...newReview, guestName: e.target.value})}
                    className={`w-full p-3 rounded-xl border text-sm ${errors.guestName ? 'border-red-400' : 'border-gray-200'} focus:ring-2 focus:ring-icePrimary outline-none`} />
                  {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
                </div>
              )}
              <div className="flex gap-2 mb-4">
                {[1,2,3,4,5].map(star => (
                  <button type="button" key={star} onClick={() => setNewReview({...newReview, rating: star})}>
                    <Star size={24} className={star <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
              <textarea rows="3" value={newReview.comment}
                onChange={e => { setNewReview({...newReview, comment: e.target.value}); setErrors({...errors, comment: ''}); }}
                className={`w-full p-4 rounded-xl border text-sm ${errors.comment ? 'border-red-400' : 'border-gray-200'} focus:ring-2 focus:ring-icePrimary focus:border-icePrimary outline-none transition`}
                placeholder="What did you think? (min 5 characters)" />
              {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment}</p>}
              <Motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} type="submit" disabled={reviewLoading}
                className="mt-4 px-6 py-3 bg-iceDark text-white rounded-xl font-bold hover:bg-gray-900 transition flex items-center gap-2 disabled:opacity-60">
                {reviewLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
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
