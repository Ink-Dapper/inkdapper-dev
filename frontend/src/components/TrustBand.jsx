import React from 'react'

const items = [
    {
        icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
        ),
        label: 'Free Shipping',
        sub: 'On orders above ₹999',
    },
    {
        icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        ),
        label: '7-Day Returns',
        sub: 'Hassle-free exchange',
    },
    {
        icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        ),
        label: '4.9 / 5 Rating',
        sub: 'From 2,000+ reviews',
    },
    {
        icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        label: 'Secure Payments',
        sub: 'Razorpay & COD',
    },
    {
        icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        label: 'Premium Quality',
        sub: '100% cotton fabric',
    },
]

const TrustBand = () => {
    return (
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white py-3 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-5 md:gap-0 md:justify-between overflow-x-auto scrollbar-none pb-0.5 md:pb-0">
                    {items.map((item, i) => (
                        <React.Fragment key={i}>
                            <div className="flex items-center gap-2 flex-shrink-0 py-0.5">
                                <span className="opacity-90 w-4 h-4 sm:w-5 sm:h-5">{item.icon}</span>
                                <div className="leading-tight">
                                    <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wide whitespace-nowrap">{item.label}</div>
                                    <div className="text-[10px] sm:text-xs opacity-80 whitespace-nowrap hidden sm:block">{item.sub}</div>
                                </div>
                            </div>
                            {i < items.length - 1 && (
                                <div className="hidden md:block w-px h-7 bg-white/30 flex-shrink-0" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TrustBand
