import { IceCream, Instagram, Twitter, Facebook, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // ✅ Updated classes for light-only theme
    <footer className="bg-white border-t border-pink-100 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Section */}
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 text-3xl font-extrabold text-icePrimary tracking-tighter">
            <IceCream size={36} />
            <span>Arctic Bliss</span>
          </Link>
          <p className="text-gray-600 mt-4 max-w-sm">
            Crafting artisan moments of happiness in Kochi. Premium ingredients, unforgettable flavors.
          </p>
          <div className="flex items-center gap-2 mt-6 text-gray-500">
              <MapPin size={18} className="text-icePrimary" />
              <span>Panampilly Nagar, Kochi</span>
          </div>
        </div>

        {/* Links Section */}
        <div>
          <h5 className="font-bold text-lg text-iceDark mb-5 tracking-tight">Navigate</h5>
          <div className="flex flex-col gap-3 text-gray-600">
            <Link to="/" className="hover:text-icePrimary transition-colors">Home</Link>
            <Link to="/flavors" className="hover:text-icePrimary transition-colors">Our Flavors</Link>
            <Link to="/contact" className="hover:text-icePrimary transition-colors">Contact Us</Link>
          </div>
        </div>

        {/* Social Section */}
        <div>
          <h5 className="font-bold text-lg text-iceDark mb-5 tracking-tight">Connect</h5>
          <div className="flex gap-4 text-gray-400">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-pink-50 rounded-full hover:bg-icePrimary hover:text-white transition-all transform hover:-translate-y-1">
                    <Icon size={20} />
                </a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="text-center p-8 border-t border-pink-100 bg-pink-50/50 transition-colors">
        <p className="text-gray-600 text-sm">
            &copy; 2026 Arctic Bliss. All rights reserved. 
            <span className="hidden md:inline"> Designed with 💖 for sweet teeth.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;