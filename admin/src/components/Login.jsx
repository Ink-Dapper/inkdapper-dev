import React, { useState } from 'react'
import axiosInstance from '../utils/axios'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            setIsLoading(true)

            console.log('Attempting admin login with:', { email, password });
            console.log('Base URL:', axiosInstance.defaults.baseURL);
            console.log('Full URL will be:', `${axiosInstance.defaults.baseURL}/user/admin`);

            const response = await axiosInstance.post('/user/admin', { email, password })
            if (response.data.success) {
                setToken(response.data.token)
                toast.success('Login successful!')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log('Admin login error:', error)
            console.log('Error config:', error.config)
            console.log('Error response:', error.response)
            toast.error(error.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'>
            {/* Background decorative elements */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-orange-200/20 to-red-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-0 w-48 h-48 bg-gradient-to-r from-red-200/15 to-pink-200/15 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>

            <div className='bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl px-8 py-8 max-w-md w-full mx-4 border border-white/20 relative z-10'>
                {/* Logo and Header */}
                <div className='text-center mb-8'>
                    <div className='flex justify-center mb-4'>
                        <img
                            src="/ink_dapper_logo_white.svg"
                            alt="Ink Dapper Logo"
                            className='h-12 w-auto filter brightness-0'
                        />
                    </div>
                    <h1 className='text-3xl font-bold text-slate-800 mb-2'>Admin Panel</h1>
                    <p className='text-slate-600 text-sm'>Sign in to manage your store</p>
                </div>

                {/* Login Form */}
                <form onSubmit={onSubmitHandler} className='space-y-6'>
                    <div className='space-y-2'>
                        <label className='text-sm font-semibold text-slate-700 block'>
                            Email Address
                        </label>
                        <div className='relative'>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className='w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm'
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='text-sm font-semibold text-slate-700 block'>
                            Password
                        </label>
                        <div className='relative'>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className='w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm'
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className='w-full py-3 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
                    >
                        {isLoading ? (
                            <div className='flex items-center justify-center'>
                                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className='mt-8 text-center'>
                    <p className='text-xs text-slate-500'>
                        Secure access to your admin dashboard
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login