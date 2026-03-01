import { motion as Motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

const Contact = () => {
  return (
    // Updated background for a subtle gradient effect (Light Mode Only)
    <div className="pt-32 pb-20 bg-gradient-to-b from-white to-pink-50 transition-colors min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Entrance Animation for the card */}
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          // Updated background to white (Light Mode Only)
          className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-colors border border-gray-100"
        >
          
          {/* Info Side - Left panel remains colored for branding */}
          <div className="md:w-1/3 bg-icePrimary p-12 text-white">
            <h2 className="text-4xl font-extrabold mb-8 leading-tight">Get in Touch</h2>
            <p className="text-pink-100 mb-12">Have questions about our flavors or catering? We'd love to hear from you!</p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-4 group">
                <MapPin className="text-pink-200 group-hover:scale-110 transition-transform" />
                <p className="font-medium">Marine Drive, Kochi, Kerala</p>
              </div>
              <div className="flex items-center gap-4 group">
                <Phone className="text-pink-200 group-hover:scale-110 transition-transform" />
                <p className="font-medium">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-4 group">
                <Mail className="text-pink-200 group-hover:scale-110 transition-transform" />
                <p className="font-medium">hello@arcticbliss.com</p>
              </div>
            </div>
            
            <div className="mt-24 pt-10 border-t border-white/20">
              <div className="flex gap-6 items-center">
                <p className="font-semibold text-lg italic">Follow Us</p>
                <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                  <Instagram className="cursor-pointer" />
                </a>
              </div>
            </div>
          </div>

          {/* Form Side - Enhanced UI */}
          <div className="md:w-2/3 p-12 bg-white">
            <h3 className="text-3xl font-bold text-iceDark mb-8">Send us a message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                  <input type="text" className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-icePrimary outline-none transition" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-icePrimary outline-none transition" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea rows="5" className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-icePrimary outline-none transition" placeholder="Tell us about your favorite flavor!"></textarea>
              </div>
              
              {/* Premium Button */}
              <Motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-iceDark text-white font-bold rounded-2xl shadow-lg hover:bg-black transition text-lg"
              >
                Send Message 🍦
              </Motion.button>
            </form>
          </div>
          
        </Motion.div>
      </div>
    </div>
  );
};

export default Contact;