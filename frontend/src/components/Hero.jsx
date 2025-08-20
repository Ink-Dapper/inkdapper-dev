import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import { Link } from "react-router-dom";

const Hero = () => {
    const [currentColor, setCurrentColor] = useState("teal");

    // Color mapping for different T-shirt colors with actual CSS values
    const colorMap = {
        black: {
            primary: "linear-gradient(to right, #1f2937, #374151, #4b5563)",
            secondary: "linear-gradient(to right, #4b5563, #6b7280, #9ca3af)",
            accent: "#9ca3af",
            bg: "linear-gradient(to right, #f9fafb, #f3f4f6)"
        },
        white: {
            primary: "linear-gradient(to right, #4b5563, #6b7280, #9ca3af)",
            secondary: "linear-gradient(to right, #6b7280, #9ca3af, #d1d5db)",
            accent: "#9ca3af",
            bg: "linear-gradient(to right, #f9fafb, #dbeafe)"
        },
        red: {
            primary: "linear-gradient(to right, #dc2626, #ef4444, #ec4899)",
            secondary: "linear-gradient(to right, #ef4444, #ec4899, #f43f5e)",
            accent: "#f87171",
            bg: "linear-gradient(to right, #fef2f2, #fdf2f8)"
        },
        green: {
            primary: "linear-gradient(to right, #16a34a, #10b981, #14b8a6)",
            secondary: "linear-gradient(to right, #22c55e, #10b981, #14b8a6)",
            accent: "#4ade80",
            bg: "linear-gradient(to right, #f0fdf4, #ecfdf5)"
        },
        blue: {
            primary: "linear-gradient(to right, #2563eb, #6366f1, #8b5cf6)",
            secondary: "linear-gradient(to right, #3b82f6, #6366f1, #8b5cf6)",
            accent: "#60a5fa",
            bg: "linear-gradient(to right, #eff6ff, #eef2ff)"
        },
        "navy-blue": {
            primary: "linear-gradient(to right, #1e40af, #4338ca, #7c3aed)",
            secondary: "linear-gradient(to right, #2563eb, #4338ca, #7c3aed)",
            accent: "#3b82f6",
            bg: "linear-gradient(to right, #eff6ff, #eef2ff)"
        },
        brown: {
            primary: "linear-gradient(to right, #b45309, #ea580c, #dc2626)",
            secondary: "linear-gradient(to right, #d97706, #f97316, #ef4444)",
            accent: "#f59e0b",
            bg: "linear-gradient(to right, #fffbeb, #fff7ed)"
        },
        coffee: {
            primary: "linear-gradient(to right, #92400e, #c2410c, #b91c1c)",
            secondary: "linear-gradient(to right, #b45309, #ea580c, #dc2626)",
            accent: "#d97706",
            bg: "linear-gradient(to right, #fffbeb, #fff7ed)"
        },
        beige: {
            primary: "linear-gradient(to right, #d97706, #eab308, #f97316)",
            secondary: "linear-gradient(to right, #f59e0b, #facc15, #fb923c)",
            accent: "#fbbf24",
            bg: "linear-gradient(to right, #fffbeb, #fefce8)"
        },
        lavender: {
            primary: "linear-gradient(to right, #8b5cf6, #7c3aed, #6366f1)",
            secondary: "linear-gradient(to right, #a855f7, #8b5cf6, #6366f1)",
            accent: "#a78bfa",
            bg: "linear-gradient(to right, #faf5ff, #f5f3ff)"
        },
        redwood: {
            primary: "linear-gradient(to right, #b91c1c, #e11d48, #ec4899)",
            secondary: "linear-gradient(to right, #dc2626, #f43f5e, #ec4899)",
            accent: "#f87171",
            bg: "linear-gradient(to right, #fef2f2, #fdf2f8)"
        },
        teal: {
            primary: "linear-gradient(to right, #0d9488, #10b981, #06b6d4)",
            secondary: "linear-gradient(to right, #14b8a6, #10b981, #06b6d4)",
            accent: "#2dd4bf",
            bg: "linear-gradient(to right, #ecfdf5, #ecfeff)"
        }
    };

    const colors = colorMap[currentColor] || colorMap.teal;

    const handleColorChange = (color) => {
        setCurrentColor(color);
    };

    // Force re-render when color changes
    useEffect(() => {
        // This ensures the color change is applied immediately
        const element = document.querySelector('.hero-title');
        if (element) {
            element.style.background = colors.secondary;
            element.style.webkitBackgroundClip = 'text';
            element.style.webkitTextFillColor = 'transparent';
            element.style.backgroundClip = 'text';
        }
    }, [currentColor, colors.secondary]);

    // Get text color based on background color for better contrast
    const getTextColor = (colorName) => {
        const darkColors = ['black', 'navy-blue', 'brown', 'coffee'];
        return darkColors.includes(colorName) ? '#ffffff' : '#1f2937';
    };

    return (
        <div className="relative flex flex-col-reverse md:flex-row items-center justify-between bg-gradient-to-r from-orange-100 via-white to-orange-50 rounded-xl shadow-lg overflow-hidden p-6 md:p-12 mb-8">
            {/* Hero left side */}
            <div className="w-full md:w-1/2 flex flex-col items-start justify-center gap-2 md:gap-6 z-10">
                <span
                    className="inline-block text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg mb-0 mt-8 md:mt-1 md:mb-2 animate-pulse transform hover:scale-105 transition-all duration-300"
                    style={{ background: colors.primary }}
                >
                    🌟 NEW ARRIVAL 🌟
                </span>
                <h1
                    className="hero-title prata-regular text-3xl md:text-6xl font-extrabold leading-tight animate-gradient-x drop-shadow-lg"
                    style={{
                        color: getTextColor(currentColor),
                        textShadow: `2px 2px 4px rgba(0,0,0,0.3)`,
                        transition: 'color 0.5s ease-in-out'
                    }}
                >
                    Discover the Latest Trends
                </h1>
                <p
                    className="text-base md:text-xl font-medium max-w-md mb-4 p-4 rounded-lg shadow-sm"
                    style={{
                        background: colors.bg,
                        borderLeft: `4px solid ${colors.accent}`,
                        color: 'black',
                        transition: 'color 0.5s ease-in-out'
                    }}
                >
                    ✨ Elevate your style with our exclusive collection of premium T-shirts. Shop the freshest designs, crafted for comfort and impact.
                </p>
                <Link to="/collection" className="inline-block">
                    <button
                        className="px-8 py-3 text-white text-lg font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none animate-pulse"
                        style={{
                            background: colors.primary,
                            '--tw-ring-color': colors.accent
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = colors.secondary;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = colors.primary;
                        }}
                    >
                        🛒 Shop Now
                    </button>
                </Link>
            </div>
            {/* Hero right side */}
            <div className="w-full md:w-1/2 flex items-center justify-center relative z-0">
                <div className="relative w-full max-w-2xl md:max-w-3xl drop-shadow-2xl md:animate-float">
                    <Slider onColorChange={handleColorChange} />
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
