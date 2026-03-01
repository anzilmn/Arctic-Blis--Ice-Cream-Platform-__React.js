import { motion as Motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-black transition-colors duration-500">
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left Side Content */}
        <Motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-1/2 text-center md:text-left"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-icePrimary dark:text-pink-300 text-sm font-semibold mb-4">
            Handcrafted in Kochi 🥥
          </span>
          <h1 className="text-6xl md:text-8xl font-extrabold text-iceDark dark:text-white leading-[0.95] tracking-tighter">
            Scoop the <br />
            {/* ✨ Premium Gradient Text */}
            <span className="bg-gradient-to-r from-icePrimary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Happiness
            </span>
          </h1>
          <p className="mt-8 text-xl text-gray-700 dark:text-gray-300 max-w-lg mx-auto md:mx-0">
            Experience the creamiest, dreamiest ice cream on earth, made with premium ingredients and a whole lot of love.
          </p>
          
          <Motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(255, 105, 180, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="mt-10 px-10 py-5 bg-icePrimary text-white rounded-full font-bold text-lg shadow-xl hover:bg-pink-600 transition-colors"
          >
            Order Your Scoop
          </Motion.button>
        </Motion.div>

        {/* Right Side Image */}
        <Motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="md:w-1/2 mt-16 md:mt-0 relative flex justify-center"
        >
          {/* ✨ Glowing Background Blur */}
          <div className="absolute inset-0 bg-gradient-to-r from-icePrimary/20 to-blue-400/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          
          {/* ✨ Glassmorphism Wrapper */}
          <div className="relative z-10 p-3 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20">
            <img 
              src="https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&q=80&w=600" 
              alt="Premium Ice Cream" 
              className="rounded-2xl w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105"
            />
          </div>
        </Motion.div>
      </section>
    </div>
  );
};
export default Home;