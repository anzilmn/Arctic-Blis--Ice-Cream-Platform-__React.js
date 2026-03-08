import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Send, Loader2, MessageSquare } from 'lucide-react';
import { contactApi } from '../services/api';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) errs.email = 'Valid email required';
    if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
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
      await contactApi.send(form);
      setSent(true);
      toast.success("Message sent! We'll get back to you soon. 🍦");
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const inputClass = (field) =>
    `w-full px-5 py-4 rounded-2xl border bg-white text-gray-900 focus:ring-2 focus:ring-icePrimary outline-none transition ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`;

  return (
    <div className="pt-32 pb-20 bg-gradient-to-b from-white to-pink-50 transition-colors min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-colors border border-gray-100">
          
          <div className="md:w-1/3 bg-icePrimary p-12 text-white">
            <h2 className="text-4xl font-extrabold mb-8 leading-tight">Get in Touch</h2>
            <p className="text-pink-100 mb-12">Have questions about our flavors or catering? We'd love to hear from you!</p>
            <div className="space-y-8">
              <div className="flex items-center gap-4 group"><MapPin className="text-pink-200 group-hover:scale-110 transition-transform" /><p className="font-medium">Marine Drive, Kochi, Kerala</p></div>
              <div className="flex items-center gap-4 group"><Phone className="text-pink-200 group-hover:scale-110 transition-transform" /><p className="font-medium">+91 98765 43210</p></div>
              <div className="flex items-center gap-4 group"><Mail className="text-pink-200 group-hover:scale-110 transition-transform" /><p className="font-medium">hello@arcticbliss.com</p></div>
            </div>
            <div className="mt-24 pt-10 border-t border-white/20">
              <div className="flex gap-6 items-center">
                <p className="font-semibold text-lg italic">Follow Us</p>
                <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"><Instagram className="cursor-pointer" /></a>
              </div>
            </div>
          </div>

          <div className="md:w-2/3 p-12 bg-white">
            <h3 className="text-3xl font-bold text-iceDark mb-8">Send us a message</h3>
            {sent ? (
              <Motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-pink-50 rounded-3xl border-2 border-dashed border-pink-200">
                <MessageSquare className="mx-auto text-pink-500 mb-4" size={48} />
                <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                <p className="text-gray-600 mt-2">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}
                  className="mt-6 px-6 py-2 bg-icePrimary text-white rounded-full font-semibold text-sm hover:bg-pink-500 transition">
                  Send Another
                </button>
              </Motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass('name')} placeholder="John Doe" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass('email')} placeholder="john@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea rows="5" name="message" value={form.message} onChange={handleChange} className={inputClass('message')} placeholder="Tell us about your favorite flavor!"></textarea>
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                <Motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                  className="w-full py-4 bg-iceDark text-white font-bold rounded-2xl shadow-lg hover:bg-black transition text-lg flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  {loading ? 'Sending...' : 'Send Message 🍦'}
                </Motion.button>
              </form>
            )}
          </div>
        </Motion.div>
      </div>
    </div>
  );
};

export default Contact;
