import React from "react";
import Slider from "./Slider";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="relative flex flex-col-reverse md:flex-row items-center justify-between bg-gradient-to-r from-orange-100 via-white to-orange-50 rounded-xl shadow-lg overflow-hidden p-6 md:p-12 mb-8">
            {/* Hero left side */}
            <div className="w-full md:w-1/2 flex flex-col items-start justify-center gap-2 md:gap-6 z-10">
                <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow mb-0 mt-8 md:mt-1 md:mb-2 animate-bounce">NEW ARRIVAL</span>
                <h1 className="prata-regular text-3xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x">
                    Discover the Latest Trends
                </h1>
                <p className="text-base md:text-xl text-gray-700 font-medium max-w-md mb-4">
                    Elevate your style with our exclusive collection of premium T-shirts. Shop the freshest designs, crafted for comfort and impact.
                </p>
                <Link to="/collection" className="inline-block">
                    <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-200">
                        Shop Now
                    </button>
                </Link>
            </div>
            {/* Hero right side */}
            <div className="w-full md:w-1/2 flex items-center justify-center relative z-0">
                <div className="relative w-full max-w-2xl md:max-w-3xl drop-shadow-2xl md:animate-float">
                    <Slider />
                    {/* Decorative shape */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-100 rounded-full opacity-60 blur-2xl z-[-1]" />
                </div>
            </div>
            {/* Optional: Decorative background shapes */}
            <div className="absolute left-0 top-0 w-40 h-40 bg-orange-200 rounded-full opacity-30 blur-2xl z-0" />
            <div className="absolute right-0 bottom-0 w-56 h-56 bg-yellow-100 rounded-full opacity-20 blur-2xl z-0" />
        </div>
    );
};

export default Hero;
// Add the following to your global CSS (e.g., index.css) for animation:
// .animate-gradient-x {
//   background-size: 200% 200%;
//   animation: gradient-x 3s ease-in-out infinite;
// }
// @keyframes gradient-x {
//   0%, 100% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
// }
// .animate-float {
//   animation: float 3s ease-in-out infinite;
// }
// @keyframes float {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-12px); }
// }
