import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartTotal = ({ creditPtsVisible, setCreditPtsVisible }) => {
    const { currency, delivery_fee, getCartAmount, creditPoints, appliedCoupon, couponDiscount, hasMultipleProducts, getMultiProductDiscount, getShippingCharges, getShippingMessage } = useContext(ShopContext)

    return (
        <div className='w-full relative'>
            {/* Header Section */}
            <div className='mb-4'>
                <div className='flex items-center gap-2 mb-1'>
                    <div className='w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                        </svg>
                    </div>
                    <h2 className='text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                        Order Summary
                    </h2>
                </div>
                <p className='text-gray-600 text-xs'>Review your order details</p>
            </div>

            {/* Credit Points Toggle */}
            {location.pathname === '/place-order' && (
                <div className='mb-3'>
                    <div
                        onClick={() => setCreditPtsVisible(!creditPtsVisible && creditPoints)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 ${creditPtsVisible
                            ? 'bg-green-100 border-2 border-green-300 text-green-700'
                            : 'bg-green-100 border-2 border-green-300 text-green-700 hover:bg-green-200'
                            }`}
                    >
                        <span className={`text-lg font-bold ${creditPtsVisible ? 'text-green-600' : 'text-green-600'}`}>₹</span>
                        <span className='text-xs font-medium'>
                            {creditPtsVisible ? 'Remove Credit Points' : 'Use Credit Points'}
                        </span>
                    </div>
                </div>
            )}

            {/* Order Details */}
            <div className='space-y-2'>
                {/* Subtotal */}
                <div className='flex items-center justify-between p-2 bg-gray-50 rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <div className='w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center'>
                            <span className="text-blue-600 font-bold text-xs">₹</span>
                        </div>
                        <span className='text-gray-700 text-sm font-medium'>Subtotal</span>
                    </div>
                    <span className='text-gray-900 text-sm font-semibold'>{currency} {getCartAmount()}.00</span>
                </div>

                {/* Shipping Fee */}
                <div className='flex items-center justify-between p-2 bg-gray-50 rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <div className='w-5 h-5 bg-green-100 rounded-full flex items-center justify-center'>
                            <span className="text-green-600 font-bold text-xs">₹</span>
                        </div>
                        <span className='text-gray-700 text-sm font-medium'>Shipping Fee</span>
                    </div>
                    <span className='text-gray-900 text-sm font-semibold'>
                        {currency} {getShippingCharges()}.00
                    </span>
                </div>

                {/* Shipping Message */}
                <div className='p-2 bg-blue-50 rounded-lg border border-blue-200'>
                    <div className='flex items-center gap-2'>
                        <div className='w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center'>
                            <span className="text-blue-600 font-bold text-xs">ℹ️</span>
                        </div>
                        <span className='text-blue-700 text-xs font-medium'>{getShippingMessage()}</span>
                    </div>
                </div>

                {/* Multi-Product Discount */}
                {hasMultipleProducts() && (
                    <div className='flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200'>
                        <div className='flex items-center gap-2'>
                            <div className='w-5 h-5 bg-green-100 rounded-full flex items-center justify-center'>
                                <span className="text-green-600 font-bold text-xs">🎉</span>
                            </div>
                            <span className='text-green-700 text-sm font-medium'>Multi-Product Discount (7%)</span>
                        </div>
                        <span className='text-green-700 text-sm font-semibold'>-{currency} {getMultiProductDiscount()}.00</span>
                    </div>
                )}

                {/* Coupon Discount */}
                {appliedCoupon && (
                    <div className='flex items-center justify-between p-2 bg-orange-50 rounded-lg border border-orange-200'>
                        <div className='flex items-center gap-2'>
                            <div className='w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center'>
                                <span className="text-orange-600 font-bold text-xs">🎫</span>
                            </div>
                            <span className='text-orange-700 text-sm font-medium'>Coupon ({appliedCoupon.code})</span>
                        </div>
                        <span className='text-orange-700 text-sm font-semibold'>-{currency} {couponDiscount}.00</span>
                    </div>
                )}

                {/* Credit Points */}
                {location.pathname === '/place-order' && (
                    <div className='flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200'>
                        <div className='flex items-center gap-2'>
                            <div className='w-5 h-5 bg-green-100 rounded-full flex items-center justify-center'>
                                <span className="text-green-600 font-bold text-xs">₹</span>
                            </div>
                            <span className='text-green-700 text-sm font-medium'>Credit Points</span>
                        </div>
                        <span className='text-green-700 text-sm font-semibold'>-{currency} {creditPtsVisible ? creditPoints : 0}.00</span>
                    </div>
                )}

                {/* Divider */}
                <div className='border-t-2 border-gray-200 my-2'></div>

                {/* Total */}
                <div className='flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-200'>
                    <div className='flex items-center gap-2'>
                        <div className='w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center'>
                            <span className="text-white font-bold text-sm">₹</span>
                        </div>
                        <span className='text-base font-bold text-gray-800'>Total Amount</span>
                    </div>
                    <span className='text-lg font-bold text-orange-600'>
                        {currency} {getCartAmount() === 0 ? 0 : getCartAmount() + getShippingCharges() - (creditPtsVisible ? creditPoints : 0) - couponDiscount - getMultiProductDiscount()}.00
                    </span>
                </div>
            </div>

            {/* Savings Info */}
            {(creditPtsVisible && creditPoints > 0) || (appliedCoupon && couponDiscount > 0) || (hasMultipleProducts() && getMultiProductDiscount() > 0) ? (
                <div className='mt-2 p-2 bg-green-50 rounded-lg border border-green-200'>
                    <div className='flex items-center gap-2'>
                        <span className="text-green-600 font-bold text-sm">💰</span>
                        <span className='text-xs text-green-700 font-medium'>
                            You're saving {currency} {(creditPtsVisible ? creditPoints : 0) + couponDiscount + getMultiProductDiscount()}.00 total!
                        </span>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default CartTotal