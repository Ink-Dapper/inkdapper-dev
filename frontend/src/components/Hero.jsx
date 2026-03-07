import React, { useState } from "react";
import Slider from "./Slider";
import { Link } from "react-router-dom";

const Hero = () => {
    const [currentColor, setCurrentColor] = useState("teal");
    const [hasError, setHasError] = useState(false);

    const colorMap = {
        black:      { primary: "linear-gradient(to right, #1f2937, #374151, #4b5563)", secondary: "linear-gradient(to right, #4b5563, #6b7280, #9ca3af)" },
        white:      { primary: "linear-gradient(to right, #4b5563, #6b7280, #9ca3af)", secondary: "linear-gradient(to right, #6b7280, #9ca3af, #d1d5db)" },
        red:        { primary: "linear-gradient(to right, #dc2626, #ef4444, #ec4899)", secondary: "linear-gradient(to right, #ef4444, #ec4899, #f43f5e)" },
        green:      { primary: "linear-gradient(to right, #16a34a, #10b981, #14b8a6)", secondary: "linear-gradient(to right, #22c55e, #10b981, #14b8a6)" },
        blue:       { primary: "linear-gradient(to right, #2563eb, #6366f1, #8b5cf6)", secondary: "linear-gradient(to right, #3b82f6, #6366f1, #8b5cf6)" },
        "navy-blue":{ primary: "linear-gradient(to right, #1e40af, #4338ca, #7c3aed)", secondary: "linear-gradient(to right, #2563eb, #4338ca, #7c3aed)" },
        brown:      { primary: "linear-gradient(to right, #b45309, #ea580c, #dc2626)", secondary: "linear-gradient(to right, #d97706, #f97316, #ef4444)" },
        coffee:     { primary: "linear-gradient(to right, #92400e, #c2410c, #b91c1c)", secondary: "linear-gradient(to right, #b45309, #ea580c, #dc2626)" },
        beige:      { primary: "linear-gradient(to right, #d97706, #eab308, #f97316)", secondary: "linear-gradient(to right, #f59e0b, #facc15, #fb923c)" },
        lavender:   { primary: "linear-gradient(to right, #8b5cf6, #7c3aed, #6366f1)", secondary: "linear-gradient(to right, #a855f7, #8b5cf6, #6366f1)" },
        redwood:    { primary: "linear-gradient(to right, #b91c1c, #e11d48, #ec4899)", secondary: "linear-gradient(to right, #dc2626, #f43f5e, #ec4899)" },
        teal:       { primary: "linear-gradient(to right, #0d9488, #10b981, #06b6d4)", secondary: "linear-gradient(to right, #14b8a6, #10b981, #06b6d4)" },
    };

    const colors = colorMap[currentColor] || colorMap.teal;

    const handleColorChange = (color) => {
        try { setCurrentColor(color); }
        catch (err) { console.warn('Error changing color:', err); setHasError(true); }
    };

    if (hasError) {
        return (
            <section className="relative ragged-section flex items-center py-14 px-4">
                <div className="ragged-noise" />
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
                    <h1 className="ragged-title text-6xl">Ink Dapper</h1>
                    <p className="ragged-subtitle">Redefine Your Street Style</p>
                    <Link to="/collection" className="ragged-solid-btn inline-flex w-fit px-8 py-3 font-semibold">Shop Now</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="relative overflow-hidden ragged-section flex items-center min-h-[88vh] md:min-h-[92vh]">

            {/* ── Film-grain noise ── */}
            <div className="ragged-noise" />

            {/* ── Diagonal scratch marks ── */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(118deg, rgba(255,255,255,0.9) 0px, rgba(255,255,255,0.9) 1px, transparent 1px, transparent 80px)',
                }}
            />

            {/* ── Color-reactive glow orb behind slider ── */}
            <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[65vw] h-[65vw] max-w-[860px] max-h-[860px] rounded-full blur-[130px] opacity-18 pointer-events-none transition-all duration-700"
                style={{ background: colors.primary }}
            />
            {/* Secondary glow — bottom left */}
            <div className="absolute -bottom-40 -left-40 w-[45vw] h-[45vw] max-w-[580px] max-h-[580px] bg-orange-500/12 rounded-full blur-3xl pointer-events-none" />

            {/* ── Jagged top accent line ── */}
            <div className="ragged-divider" />

            {/* ── Large watermark text ── */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 whitespace-nowrap"
                style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(80px, 18vw, 260px)',
                    letterSpacing: '0.06em',
                    color: 'transparent',
                    WebkitTextStroke: '1px rgba(249,115,22,0.06)',
                    opacity: 1,
                    transform: 'translate(-50%, -50%) rotate(-8deg)',
                }}
            >
                INK DAPPER
            </div>

            {/* ── Vertical left accent bar ── */}
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-transparent via-orange-500/60 to-transparent pointer-events-none" />
            {/* Tick marks on the bar */}
            {[15, 30, 50, 70, 85].map((pct) => (
                <div
                    key={pct}
                    className="hidden lg:block absolute left-1.5 w-3 h-px bg-orange-400/40 pointer-events-none"
                    style={{ top: `${pct}%` }}
                />
            ))}

            <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 md:py-16 lg:py-18">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-10">

                    {/* ═══════════════════════════════════════════════
                        SLIDER — bigger, order-1 on mobile, order-2 on md
                    ═══════════════════════════════════════════════ */}
                    <div className="w-full md:w-[55%] lg:w-[58%] md:order-2 flex items-center justify-center">
                        <div className="relative w-full pb-3 md:pb-5 md:animate-float">

                            {/* Color glow halo */}
                            <div
                                className="absolute inset-4 bottom-10 rounded-3xl blur-2xl opacity-45 -z-30 transition-all duration-700"
                                style={{ background: colors.primary }}
                            />

                            {/* Rugged corner accent — top-right */}
                            <div className="absolute -top-2 -right-2 w-14 h-14 pointer-events-none z-20"
                                style={{
                                    background: 'linear-gradient(225deg, rgba(249,115,22,0.55) 0%, transparent 55%)',
                                    borderRadius: '0 16px 0 0',
                                }}
                            />
                            {/* Rugged corner accent — bottom-left */}
                            <div className="absolute -bottom-1 -left-2 w-12 h-12 pointer-events-none z-20"
                                style={{
                                    background: 'linear-gradient(45deg, rgba(245,158,11,0.4) 0%, transparent 55%)',
                                    borderRadius: '0 0 0 16px',
                                }}
                            />

                            <Slider onColorChange={handleColorChange} />
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        TEXT CONTENT — order-2 on mobile, order-1 on md
                    ═══════════════════════════════════════════════ */}
                    <div className="w-full md:w-[45%] lg:w-[42%] md:order-1 flex flex-col gap-4 md:gap-5">

                        {/* Badge + rating row */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="ragged-pill text-[11px] font-bold uppercase tracking-widest px-3 py-1.5">
                                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                                New Arrival
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-white/12 px-2.5 py-1 rounded-full text-xs">
                                <span className="text-yellow-400 leading-none">★★★★★</span>
                                <span className="font-bold text-white text-xs">4.9</span>
                                <span className="text-slate-500 text-[11px] hidden sm:inline">(2,000+ reviews)</span>
                            </span>
                        </div>

                        {/* Giant rugged headline */}
                        <div>
                            <h1
                                className="ragged-title leading-[0.88] tracking-tight"
                                style={{ fontSize: 'clamp(3.2rem, 7vw, 6.5rem)' }}
                            >
                                Discover
                                <br />
                                <span
                                    className="bg-clip-text text-transparent"
                                    style={{ backgroundImage: colors.secondary, transition: 'background-image 0.5s ease' }}
                                >
                                    Latest
                                </span>
                                <br />
                                Trends
                            </h1>

                            {/* Underline scratch accent */}
                            <div className="flex items-center gap-2 mt-3">
                                <div className="h-0.5 w-10 bg-orange-500 rounded-full" />
                                <div className="h-px w-4 bg-orange-400/40 rounded-full" />
                                <div className="h-px w-2 bg-orange-400/20 rounded-full" />
                            </div>

                            <p className="mt-3 text-sm md:text-[15px] ragged-subtitle leading-relaxed max-w-xs">
                                Premium T-shirts crafted for comfort and designed for impact. Drop-worthy fits, delivered fast.
                            </p>
                        </div>

                        {/* CTA buttons */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <Link to="/collection">
                                <button className="ragged-solid-btn inline-flex items-center gap-2 px-7 py-3.5 text-white text-sm font-extrabold tracking-wide uppercase transition-all duration-300 hover:scale-105">
                                    Shop Now
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </Link>
                            <Link
                                to="/collection"
                                className="ragged-outline-btn inline-flex items-center gap-1.5 font-semibold text-sm px-5 py-3.5 uppercase tracking-wide transition-all duration-200"
                            >
                                Explore
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-5 sm:gap-7 pt-1">
                            {[
                                { value: '10K+', label: 'Customers' },
                                { value: '50+',  label: 'Designs'   },
                                { value: '4.9★', label: 'Rating'    },
                            ].map((stat, i) => (
                                <React.Fragment key={stat.label}>
                                    <div className="text-center">
                                        <div
                                            className="font-extrabold text-white leading-none"
                                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '0.03em' }}
                                        >
                                            {stat.value}
                                        </div>
                                        <div className="text-[9px] sm:text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                    {i < 2 && <div className="w-px h-9 bg-slate-700/80 rounded-full" />}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Trust chips */}
                        <div className="hidden sm:flex flex-wrap gap-2 pt-1">
                            {['Free Shipping', '7-Day Returns', 'Premium Cotton', 'COD Available'].map((label) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-1.5 bg-white/4 border border-white/10 px-3 py-1 rounded-full text-[11px] font-medium text-slate-400"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                    {label}
                                </span>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Bottom torn edge ── */}
            <div
                className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none"
                style={{
                    background: 'linear-gradient(90deg, rgba(249,115,22,0.28), rgba(245,158,11,0.2), rgba(249,115,22,0.28))',
                    clipPath: 'polygon(0 52%, 3% 38%, 7% 55%, 12% 37%, 17% 54%, 22% 38%, 28% 56%, 34% 39%, 40% 55%, 46% 37%, 52% 55%, 58% 38%, 64% 54%, 70% 36%, 76% 55%, 82% 37%, 88% 54%, 93% 39%, 97% 55%, 100% 40%, 100% 100%, 0 100%)',
                }}
            />
        </section>
    );
};

export default Hero;
