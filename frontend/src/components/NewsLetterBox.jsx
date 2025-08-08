import React, { useContext, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const NewsLetterBox = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { backendUrl } = useContext(ShopContext);

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const sendOtp = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await axios.post(backendUrl + '/api/newsletter/send-otp', { email });
            if (response.data.success) {
                setIsOtpSent(true);
                setSuccess('OTP sent to your email!');
                toast.success('OTP sent to your email!');
            } else {
                setError('Failed to send OTP. Please try again.');
                toast.error('Failed to send OTP. Please try again.');
            }
        } catch (err) {
            console.error('OTP send error:', err);
            setError('Failed to send OTP. Please try again.');
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await axios.post(backendUrl + '/api/newsletter/verify-otp', { email, otp });
            if (response.data.success) {
                setSuccess('Email verified successfully!');
                toast.success('Email verified successfully!');
                await sendSubscriptionEmail();
                setOtp('');
            } else {
                setError('Invalid OTP. Please try again.');
                toast.error('Invalid OTP. Please try again.');
            }
        } catch (err) {
            console.error('OTP verification error:', err);
            setError('Failed to verify OTP. Please try again.');
            toast.error('Failed to verify OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const sendSubscriptionEmail = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/newsletter/subscribe', {
                email,
                adminEmail: 'admin@inkdapper.in',
                sendAutoReply: true,
            });
            if (response.data.success) {
                setSuccess('Subscription successful! Check your email for confirmation.');
                toast.success('Subscription successful! Check your email for confirmation.');
                setEmail('');
                setIsOtpSent(false);
            } else {
                setError('Failed to subscribe. Please try again.');
                toast.error('Failed to subscribe. Please try again.');
            }
        } catch (err) {
            console.error('Subscription error:', err);
            setError('Failed to notify admin. Please try again.');
            toast.error('Failed to notify admin. Please try again.');
        }
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (isValidEmail(email)) {
            sendOtp();
        } else {
            setError('Please enter a valid email address.');
            toast.error('Please enter a valid email address.');
        }
    };

    return (
        <div className="relative overflow-hidden py-16 px-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Floating decorative elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-200 rounded-full opacity-20 blur-3xl animate-float animation-delay-2000"></div>

            <div className="relative max-w-4xl mx-auto text-center">
                {/* Main heading with theme colors */}
                <div className="mb-8">
                    <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg mb-4 animate-bounce">
                        EXCLUSIVE OFFER
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x">
                        Stay in the Loop
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto rounded-full shadow-lg"></div>
                </div>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join the <span className="text-orange-600 font-semibold">Ink Dapper</span> community and unlock exclusive deals,
                    style updates, and <span className="text-orange-500 font-bold text-xl">20% off</span> your first order!
                </p>

                {/* Newsletter form container */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-orange-200/50 shadow-2xl hover:shadow-orange-200/20 transition-all duration-500">
                    {!isOtpSent ? (
                        <form onSubmit={onSubmitHandler} className="space-y-6">
                            <div className="flex flex-col lg:flex-row gap-4 w-full">
                                <div className="flex-1 relative">
                                    <input
                                        type="email"
                                        id="newsletter-email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        className="w-full px-6 py-4 bg-white/90 border border-orange-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 shadow-sm"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="lg:w-auto w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Subscribe
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col lg:flex-row gap-4 w-full">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        id="newsletter-otp"
                                        name="otp"
                                        placeholder="Enter 6-digit OTP"
                                        className="w-full px-6 py-4 bg-white/90 border border-orange-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 text-center text-lg tracking-widest shadow-sm"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <button
                                    onClick={verifyOtp}
                                    disabled={isLoading}
                                    className="lg:w-auto w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Verify
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-sm text-slate-600">
                                We've sent a verification code to <span className="text-orange-600 font-medium">{email}</span>
                            </p>
                        </div>
                    )}

                    {/* Status messages */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {success}
                        </div>
                    )}
                </div>

                {/* Trust indicators */}
                <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-slate-600 text-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        No spam, ever
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Secure & private
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Instant updates
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsLetterBox;