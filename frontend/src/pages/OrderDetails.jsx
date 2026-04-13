import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from '../utils/axios';
import { storageUrl } from '../utils/storageUrl';

const InfoCard = ({ icon, label, accentColor = '#f97316', children }) => (
  <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.12)' }}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${accentColor}, #f59e0b)`, boxShadow: `0 0 14px ${accentColor}40` }}>
        {icon}
      </div>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em', fontSize: '1.05rem', color: '#f1f5f9' }}>
        {label}
      </span>
    </div>
    <div className="text-slate-400 text-sm leading-relaxed space-y-1">
      {children}
    </div>
  </div>
)

const StatBadge = ({ label, value, sub, accent = false }) => (
  <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${accent ? 'rgba(249,115,22,0.3)' : 'rgba(249,115,22,0.1)'}` }}>
    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
    <p className={`text-base font-bold ${accent ? 'text-orange-400' : 'text-slate-200'}`}>{value}</p>
    {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
  </div>
)

const OrderDetails = () => {
  const { productId } = useParams();
  const { token, currency, delivery_fee } = useContext(ShopContext)
  const [productData, setProductData] = useState(null);
  const [isReturnExpired, setIsReturnExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetailsAndProducts = async () => {
    try {
      setLoading(true);
      if (!token) { setLoading(false); return; }
      const response = await axios.post('/order/user-details', {}, { headers: { token } });
      if (response.data.success) {
        const order = response.data.orders.find(o => o._id === productId);
        if (order) {
          setProductData(order);
          if (new Date() > new Date(order.returnDate)) setIsReturnExpired(true);
        } else {
          setProductData(null);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrderDetailsAndProducts(); }, [token, productId]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return { color: '#34d399', border: 'rgba(52,211,153,0.3)', bg: 'rgba(52,211,153,0.08)', dot: '#34d399' };
      case 'Shipped': return { color: '#60a5fa', border: 'rgba(96,165,250,0.3)', bg: 'rgba(96,165,250,0.08)', dot: '#60a5fa' };
      case 'Processing': return { color: '#fb923c', border: 'rgba(251,146,60,0.3)', bg: 'rgba(251,146,60,0.08)', dot: '#fb923c' };
      case 'Cancelled': return { color: '#f87171', border: 'rgba(248,113,113,0.3)', bg: 'rgba(248,113,113,0.08)', dot: '#f87171' };
      default: return { color: '#94a3b8', border: 'rgba(148,163,184,0.3)', bg: 'rgba(148,163,184,0.08)', dot: '#94a3b8' };
    }
  };

  return (
    <div className="ragged-section min-h-screen" style={{ background: '#0d0d0e' }}>
      <div className="ragged-noise" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6))' }} />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400">Ink Dapper</span>
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.6), transparent)' }} />
          </div>
          <h1 className="ragged-title" style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)' }}>
            Order Details
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <svg className="w-10 h-10 animate-spin text-orange-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-slate-500 text-base">Loading order details...</p>
          </div>
        )}

        {/* Not Found */}
        {!loading && !productData && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-200 text-xl font-semibold mb-2">Order not found</p>
            <p className="text-slate-500 text-sm mb-8">This order may have been removed or the link is invalid.</p>
            <Link to="/orders"
              className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0d0d0e' }}>
              View All Orders
            </Link>
          </div>
        )}

        {/* Order Content */}
        {!loading && productData && (() => {
          const order = productData;
          const statusStyle = getStatusStyle(order.status);
          return (
            <div className="space-y-5">

              {/* Timeline Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBadge
                  label="Order Date"
                  value={new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                />
                {order.status === 'Delivered' ? (
                  <StatBadge
                    label="Delivered On"
                    value={new Date(order.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    accent
                  />
                ) : (
                  <StatBadge
                    label="Expected By"
                    value={order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                  />
                )}
                {order.returnOrderStatus === 'Order Returned' && (
                  <StatBadge
                    label="Return Date"
                    value={new Date(order.returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  />
                )}
                {order.deliveryDate && (
                  <StatBadge
                    label="Return Window"
                    value={isReturnExpired ? 'Expired' : 'Active'}
                    sub={isReturnExpired ? 'Cannot return' : 'Return eligible'}
                    accent={!isReturnExpired}
                  />
                )}
                <div className="text-center p-4 rounded-xl col-span-1"
                  style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}` }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Status</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: statusStyle.dot }} />
                    <span className="text-sm font-bold" style={{ color: statusStyle.color }}>{order.status}</span>
                  </div>
                </div>
              </div>

              {/* Main Card: Image + Info */}
              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(249,115,22,0.12)' }}>
                <div className="grid grid-cols-1 lg:grid-cols-5">

                  {/* Product Image */}
                  <div className="lg:col-span-2 relative group">
                    <img
                      className="w-full h-72 lg:h-full object-cover"
                      src={storageUrl(order.items?.[0]?.isCustom
                        ? (Array.isArray(order.items[0].reviewImageCustom) ? order.items[0].reviewImageCustom[0] : order.items[0].reviewImageCustom)
                        : order.items?.[0]?.image?.[0])}
                      alt={order.items?.[0]?.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0d0d0e]" />
                    {/* Order ID badge on image */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm"
                        style={{ background: 'rgba(13,13,14,0.75)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c' }}>
                        #{order._id?.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-3 p-6 lg:p-8 space-y-5">

                    {/* Product name */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">Product</p>
                      <h2 className="text-slate-200 font-semibold text-lg leading-snug">{order.items?.[0]?.name}</h2>
                      {order.items?.[0]?.size && (
                        <span className="inline-block mt-2 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          Size: {order.items[0].size}
                        </span>
                      )}
                    </div>

                    {/* Shipping Address */}
                    <InfoCard
                      label="Shipping Address"
                      accentColor="#f97316"
                      icon={<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    >
                      <p className="text-slate-300 font-medium">{order.address?.firstName} {order.address?.lastName}</p>
                      <p>{order.address?.street}</p>
                      <p>{order.address?.city} — {order.address?.zipcode}</p>
                      <p>{order.address?.state}, {order.address?.country}</p>
                      <p className="text-orange-400 font-medium mt-1">📞 {order.address?.phone}</p>
                    </InfoCard>

                    {/* Payment */}
                    <InfoCard
                      label="Payment Method"
                      accentColor="#f59e0b"
                      icon={<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                    >
                      <p className="text-slate-300 font-semibold">{order.paymentMethod}</p>
                    </InfoCard>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.12)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', boxShadow: '0 0 14px rgba(249,115,22,0.35)' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em', fontSize: '1.1rem', color: '#f1f5f9' }}>
                    Order Summary
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Quantity', value: `${order.items?.[0]?.quantity ?? '—'} item(s)` },
                    { label: 'Items Subtotal', value: `${currency} ${order.items?.[0]?.price ?? '—'}` },
                    { label: 'Shipping', value: `${currency} ${typeof delivery_fee === 'number' ? `${delivery_fee}.00` : delivery_fee}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="text-slate-500 text-sm">{label}</span>
                      <span className="text-slate-300 font-semibold text-sm">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-slate-300 font-bold">Grand Total</span>
                    <span className="text-orange-400 font-bold text-xl">{currency} {order.amount}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                <Link to="/orders"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  All Orders
                </Link>

                <Link to={`/product/${order.items?.[0]?.slug}`}>
                  <button
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0d0d0e', boxShadow: '0 0 20px rgba(249,115,22,0.35)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Buy It Again
                  </button>
                </Link>
              </div>

            </div>
          );
        })()}

      </div>
    </div>
  )
}

export default OrderDetails
