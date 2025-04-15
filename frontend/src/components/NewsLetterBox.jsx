import React, { useContext, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const NewsLetterBox = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { backendUrl } = useContext(ShopContext);

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const sendOtp = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/newsletter/send-otp', { email });
            if (response.data.success) {
                setIsOtpSent(true);
                setSuccess('OTP sent to your email!');
                setError('');
            }
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        }
    };

    const verifyOtp = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/newsletter/verify-otp', { email, otp });
            if (response.data.success) {
                setSuccess('Email verified successfully!');
                setError('');
                sendSubscriptionEmail(); // Send subscription email to admin
            } else {
                setError('Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError('Failed to verify OTP. Please try again.');
        }
    };

    const sendSubscriptionEmail = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/newsletter/subscribe', {
                email,
                adminEmail: 'admin@inkdapper.in',
            });
            if (response.data.success) {
                setSuccess('Subscription successful! Admin notified.');
            } else {
                setError('Failed to subscribe. Please try again.');
            }
        } catch (err) {
            setError('Failed to notify admin. Please try again.');
        }
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (isValidEmail(email)) {
            sendOtp();
        } else {
            setError('Please enter a valid email address.');
        }
    };

    return (
        <div className='text-center'>
            <p className='text-xl md:text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
            <p className='text-gray-400 text-xs md:text-base mt-3'>
                Join the Ink Dapper community and unlock exclusive deals, style updates, and 20% off your first order!
            </p>
            {!isOtpSent ? (
                <form onSubmit={onSubmitHandler} className='flex items-center w-full sm:w-1/2 gap-3 mx-auto border my-6 pl-3'>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full sm:flex-1 outline-none"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="bg-black text-white text-xs px-10 py-2">SEND OTP</button>
                </form>
            ) : (
                <div className='flex items-center w-full sm:w-1/2 gap-3 mx-auto border my-6 pl-3'>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="w-full sm:flex-1 outline-none"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={verifyOtp} className="bg-black text-white text-xs px-10 py-4">VERIFY OTP</button>
                </div>
            )}
            {error && <p className='text-red-500'>{error}</p>}
            {success && <p className='text-green-500'>{success}</p>}
        </div>
    );
};

export default NewsLetterBox;