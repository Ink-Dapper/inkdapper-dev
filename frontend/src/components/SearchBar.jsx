import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {

    const { search, setSearch, showSearch, clearSearchBar, productSearch } = useContext(ShopContext)
    const location = useLocation()
    const [isFocused, setIsFocused] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        productSearch()
    }, [location])

    useEffect(() => {
        if (showSearch) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [showSearch])

    return (
        <div className={`hidden md:block transition-all duration-600 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
            {showSearch && (
                <div className='relative'>
                    <div className="max-w-4xl mx-auto px-8 py-8">
                        <div className="relative">
                            {/* Search Input Container */}
                            <div className={`relative flex items-center max-w-2xl mx-auto transition-all duration-400 shadow-xl ease-out ${isFocused
                                ? 'shadow-lg shadow-orange-100/50 scale-[1.01]'
                                : 'shadow-md shadow-slate-100/50 hover:shadow-lg hover:shadow-slate-100/60'
                                }`}>

                                {/* Glass Effect Background with Border */}
                                <div className={`absolute inset-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border-2 transition-all duration-300 ${isFocused
                                    ? 'border-orange-300 shadow-inner shadow-orange-50/50'
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}></div>

                                {/* Search Icon */}
                                <div className="absolute left-4 z-10">
                                    <div className={`p-2 rounded-lg transition-all duration-300 ${isFocused
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'bg-slate-50 text-slate-500 hover:text-orange-500'
                                        }`}>
                                        <img
                                            src={assets.search_icon}
                                            alt="search_icon"
                                            className="w-4 h-4"
                                        />
                                    </div>
                                </div>

                                {/* Input Field */}
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className={`relative z-10 w-full pl-14 pr-14 py-3.5 text-base bg-transparent border-none outline-none transition-all duration-300 placeholder:text-slate-700 font-medium text-slate-800 ${isFocused
                                        ? 'placeholder:text-orange-300'
                                        : 'placeholder:text-slate-700'
                                        }`}
                                    type="text"
                                    placeholder='Find your perfect t-shirt...'
                                />

                                {/* Clear Button */}
                                {search && (
                                    <button
                                        onClick={() => {
                                            clearSearchBar()
                                            setIsFocused(false)
                                        }}
                                        className="absolute right-4 z-10 p-1.5 rounded-lg bg-slate-50/80 hover:bg-red-50/90 transition-all duration-300 group"
                                    >
                                        <img
                                            src={assets.cross_icon}
                                            alt="clear_search"
                                            className='w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-all duration-200 group-hover:scale-110'
                                        />
                                    </button>
                                )}
                            </div>

                            {/* Search Suggestions */}
                            <div className="mt-5 text-center">
                                <div className="flex items-center justify-center gap-5 text-sm">
                                    <span className="text-slate-500 font-medium">Popular:</span>
                                    <div className="flex items-center gap-3">
                                        <button className="px-3 py-1.5 rounded-lg bg-orange-50/70 hover:bg-orange-100/90 text-orange-700 font-medium transition-all duration-300 hover:scale-105 hover:shadow-sm border border-orange-200/40">
                                            Custom Designs
                                        </button>
                                        <button className="px-3 py-1.5 rounded-lg bg-slate-50/70 hover:bg-slate-100/90 text-slate-700 font-medium transition-all duration-300 hover:scale-105 hover:shadow-sm border border-slate-200/40">
                                            Premium Collection
                                        </button>
                                        <button className="px-3 py-1.5 rounded-lg bg-blue-50/70 hover:bg-blue-100/90 text-blue-700 font-medium transition-all duration-300 hover:scale-105 hover:shadow-sm border border-blue-200/40">
                                            Limited Edition
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Subtle Decorative Elements */}
                            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 rounded-full blur-md"></div>
                            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-md"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchBar