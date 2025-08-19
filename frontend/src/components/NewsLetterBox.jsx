import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const NewsLetterBox = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
    const { backendUrl } = useContext(ShopContext);

    // Always use hardcoded backend URL to ensure it works
    const apiUrl = 'http://localhost:4000';

    // Debug: Log the backend URL being used
    console.log('🔧 NewsLetterBox Debug Info:');
    console.log('Context backendUrl:', backendUrl);
    console.log('Final apiUrl:', apiUrl);

    // Check subscription status on component mount
    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            try {
                // First check localStorage for cached subscription status
                const cachedEmail = localStorage.getItem('newsletter_subscribed_email');
                if (cachedEmail) {
                    console.log('Found cached subscription email:', cachedEmail);
                    setIsSubscribed(true);
                    setIsCheckingSubscription(false);
                    return;
                }

                // If no cached email, check if user has any email in localStorage or session
                const userEmail = localStorage.getItem('user_email') || sessionStorage.getItem('user_email');
                if (userEmail) {
                    console.log('Checking subscription status for email:', userEmail);

                    // Try to verify subscription status with backend
                    try {
                        const response = await axios.post(apiUrl + '/api/newsletter/check-subscription', { email: userEmail });
                        if (response.data.isSubscribed) {
                            setIsSubscribed(true);
                            localStorage.setItem('newsletter_subscribed_email', userEmail);
                        }
                    } catch (err) {
                        console.log('Could not verify subscription status, assuming not subscribed');
                    }
                }
            } catch (error) {
                console.error('Error checking subscription status:', error);
            } finally {
                setIsCheckingSubscription(false);
            }
        };

        checkSubscriptionStatus();
    }, [apiUrl]);

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubscription = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            toast.error('Please enter a valid email address.');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            console.log('=== NEWSLETTER SUBSCRIPTION DEBUG ===');
            console.log('Email to subscribe:', email);
            console.log('Backend URL:', apiUrl);
            console.log('Full API URL:', apiUrl + '/api/newsletter/subscribe');

            // Test backend connection first
            try {
                const testResponse = await axios.get(apiUrl + '/api/test');
                console.log('✅ Backend connection test successful:', testResponse.data);
            } catch (testError) {
                console.error('❌ Backend connection test failed:', testError.message);
                setError('Backend server is not running. Please try again later.');
                toast.error('Backend server is not running. Please try again later.');
                return;
            }

            // Now try the subscription
            const response = await axios.post(apiUrl + '/api/newsletter/subscribe', { email });
            console.log('✅ Subscription response:', response.data);

            if (response.data.success) {
                setSuccess('🎉 Subscription successful! Welcome to Ink Dapper newsletter!');
                setIsSubscribed(true);
                // Store the email in localStorage to persist subscription status
                localStorage.setItem('newsletter_subscribed_email', email);
                toast.success('🎉 Subscription successful! Welcome to Ink Dapper newsletter!');
                setEmail(''); // Reset form
            } else {
                const errorMsg = response.data.message || 'Failed to subscribe. Please try again.';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            console.error('❌ Subscription error details:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
            console.error('Error code:', err.code);

            let errorMessage = 'Failed to subscribe. Please try again.';

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
                // Check if user is already subscribed
                if (err.response.data.message === 'Email already subscribed to newsletter') {
                    setIsSubscribed(true);
                    // Store the email in localStorage to persist subscription status
                    localStorage.setItem('newsletter_subscribed_email', email);
                    setSuccess('You are already subscribed to our newsletter! 🎉');
                    toast.success('You are already subscribed to our newsletter! 🎉');
                    setEmail('');
                    return;
                }
            } else if (err.code === 'NETWORK_ERROR' || err.code === 'ERR_NETWORK') {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (err.response?.status === 404) {
                errorMessage = 'Backend service not found. Please make sure the backend server is running on port 4000.';
            } else if (err.response?.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (err.code === 'ECONNREFUSED') {
                errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while checking subscription
    if (isCheckingSubscription) {
        return (
            <div className="relative overflow-hidden py-16 px-4">
                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-orange-200/50 shadow-2xl">
                        <div className="flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-3 text-slate-600">Checking subscription status...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If user is already subscribed, show different design
    if (isSubscribed) {
        return (
            <div className="relative overflow-hidden py-16 px-4">
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                {/* Floating decorative elements */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-3xl animate-float"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-200 rounded-full opacity-20 blur-3xl animate-float animation-delay-2000"></div>

                <div className="relative max-w-4xl mx-auto text-center">
                    {/* Success heading */}
                    <div className="mb-8">
                        <span className="inline-block bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg mb-4 animate-bounce">
                            SUBSCRIBED
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent animate-gradient-x">
                            You're All Set!
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full shadow-lg"></div>
                    </div>

                    {/* Success message */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-green-200/50 shadow-2xl">
                        <div className="flex flex-col items-center space-y-6">
                            {/* Success icon */}
                            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            {/* Success text */}
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                    Already Subscribed!
                                </h3>
                                <p className="text-lg text-slate-600 mb-4">
                                    You're already part of the <span className="text-green-600 font-semibold">Ink Dapper</span> community!
                                </p>
                                <p className="text-slate-500">
                                    Keep an eye on your inbox for exclusive deals, style updates, and special offers.
                                </p>
                            </div>

                            {/* Benefits list */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700">Exclusive Deals</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700">Style Updates</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700">Special Offers</span>
                                </div>
                            </div>
                        </div>
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
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Instant updates
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                    <form onSubmit={handleSubscription} className="space-y-6">
                        {/* Email Input */}
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
                                        Subscribing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Subscribe Now
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

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