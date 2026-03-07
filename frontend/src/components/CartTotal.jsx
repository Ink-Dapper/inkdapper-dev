import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartTotal = ({ creditPtsVisible, setCreditPtsVisible }) => {
    const {
        currency,
        delivery_fee,
        getCartAmount,
        creditPoints,
        appliedCoupon,
        couponDiscount,
        hasMultipleProducts,
        getMultiProductDiscount,
        getShippingCharges,
        getShippingMessage
    } = useContext(ShopContext)

    return (
        <div className='w-full relative'>

            {/* Credit Points Toggle */}
            {location.pathname === '/place-order' && (
                <div className='mb-4'>
                    <div
                        onClick={() => setCreditPtsVisible(!creditPtsVisible && creditPoints)}
                        className='relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg'
                        style={creditPtsVisible
                            ? {
                                background: 'linear-gradient(135deg, rgba(239,68,68,0.24), rgba(220,38,38,0.18))',
                                border: '1px solid rgba(248,113,113,0.75)',
                                color: '#fee2e2',
                                boxShadow: '0 0 0 1px rgba(248,113,113,0.2) inset, 0 8px 20px rgba(239,68,68,0.28), 0 0 28px rgba(248,113,113,0.35)'
                            }
                            : {
                                background: 'linear-gradient(135deg, rgba(34,197,94,0.14), rgba(16,185,129,0.1))',
                                border: '1px solid rgba(74,222,128,0.45)',
                                color: '#bbf7d0',
                                boxShadow: '0 0 0 1px rgba(74,222,128,0.1) inset, 0 0 16px rgba(74,222,128,0.18)'
                            }
                        }
                    >
                        <span
                            className='absolute -top-8 -left-10 w-28 h-28 rounded-full blur-2xl animate-pulse pointer-events-none'
                            style={{ background: creditPtsVisible ? 'rgba(252,165,165,0.3)' : 'rgba(134,239,172,0.2)' }}
                        />
                        <svg className='relative z-10 w-4 h-4 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                        </svg>
                        <span className='relative z-10 text-sm font-semibold tracking-wide text-inherit'>
                            {creditPtsVisible ? 'Remove Credit Points' : 'Use Credit Points'}
                        </span>
                    </div>
                </div>
            )}

            {/* Order Details */}
            <div className='space-y-1.5'>
                {/* Subtotal */}
                <div className='flex items-center justify-between px-3 py-2.5 rounded-xl'
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className='text-green-400 text-sm'>Subtotal</span>
                    <span className='text-slate-300 text-sm font-semibold'>{currency} {getCartAmount()}.00</span>
                </div>

                {/* Shipping Fee */}
                <div className='flex items-center justify-between px-3 py-2.5 rounded-xl'
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className='text-green-400 text-sm'>Shipping Fee</span>
                    <span className='text-slate-300 text-sm font-semibold'>{currency} {getShippingCharges()}.00</span>
                </div>

                {/* Shipping Message */}
                <div className='px-3 py-2.5 rounded-xl flex items-center gap-2'
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                    <svg className='w-3.5 h-3.5 text-blue-400 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <span className='text-blue-400 text-xs'>{getShippingMessage()}</span>
                </div>

                {/* Multi-Product Discount */}
                {hasMultipleProducts() && (
                    <div className='flex items-center justify-between px-3 py-2.5 rounded-xl'
                        style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                        <span className='text-green-400 text-sm'>Multi-Product Discount (7%)</span>
                        <span className='text-green-400 text-sm font-semibold'>-{currency} {getMultiProductDiscount()}.00</span>
                    </div>
                )}

                {/* Coupon Discount */}
                {appliedCoupon && (
                    <div className='flex items-center justify-between px-3 py-2.5 rounded-xl'
                        style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}>
                        <span className='text-orange-400 text-sm'>Coupon ({appliedCoupon.code})</span>
                        <span className='text-orange-400 text-sm font-semibold'>-{currency} {couponDiscount}.00</span>
                    </div>
                )}

                {/* Credit Points */}
                {location.pathname === '/place-order' && (
                    <div className='flex items-center justify-between px-3 py-2.5 rounded-xl'
                        style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                        <span className='text-green-400 text-sm'>Credit Points</span>
                        <span className='text-green-400 text-sm font-semibold'>-{currency} {creditPtsVisible ? creditPoints : 0}.00</span>
                    </div>
                )}

                {/* Divider */}
                <div className='h-px my-1' style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.2), transparent)' }} />

                {/* Total */}
                <div className='flex items-center justify-between px-4 py-3 rounded-xl'
                    style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)' }}>
                    <span className='text-sm font-bold uppercase tracking-[0.1em]' style={{ color: '#f1f5f9' }}>Total</span>
                    <span className='text-lg font-bold text-orange-400'>
                        {currency} {getCartAmount() === 0 ? 0 : getCartAmount() + getShippingCharges() - (creditPtsVisible ? creditPoints : 0) - couponDiscount - getMultiProductDiscount()}.00
                    </span>
                </div>
            </div>

            {/* Savings Info */}
            {(creditPtsVisible && creditPoints > 0) || (appliedCoupon && couponDiscount > 0) || (hasMultipleProducts() && getMultiProductDiscount() > 0) ? (
                <div className='mt-2 px-3 py-2.5 rounded-xl flex items-center gap-2'
                    style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                    <svg className='w-3.5 h-3.5 text-green-400 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                    </svg>
                    <span className='text-xs text-green-400 font-medium'>
                        You&apos;re saving {currency} {(creditPtsVisible ? creditPoints : 0) + couponDiscount + getMultiProductDiscount()}.00 total!
                    </span>
                </div>
            ) : null}
        </div>
    )
}

export default CartTotal
