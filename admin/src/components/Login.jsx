import React, { useState } from 'react'
import axiosInstance from '../utils/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = ({ setToken }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

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
                navigate('/')
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
        <div
            className="min-h-screen flex items-center justify-center w-full relative overflow-hidden"
            style={{ background: '#0a0a0b' }}
        >
            {/* ── Ambient glow blobs ── */}
            <div
                className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.13) 0%, transparent 70%)', filter: 'blur(40px)' }}
            />
            <div
                className="absolute bottom-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)', filter: 'blur(40px)' }}
            />

            {/* ── Ragged top edge strip ── */}
            <div
                className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6), rgba(245,158,11,0.4), rgba(249,115,22,0.6), transparent)' }}
            />

            {/* ── Grid noise texture overlay ── */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 40px),
                        repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 40px)`
                }}
            />

            {/* ── Card ── */}
            <div
                className="relative z-10 w-full max-w-md mx-4 rounded-2xl px-8 py-9"
                style={{
                    background: 'linear-gradient(160deg, #111113 0%, #0d0d0e 60%, #0a0a0b 100%)',
                    border: '1px solid rgba(249,115,22,0.25)',
                    boxShadow: '0 0 0 1px rgba(249,115,22,0.06) inset, 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(249,115,22,0.07)',
                }}
            >
                {/* Inner top shimmer line */}
                <div
                    className="absolute top-0 left-8 right-8 h-px rounded-full pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)' }}
                />

                {/* ── Header ── */}
                <div className="text-center mb-9">
                    <div className="flex justify-center mb-5">
                        <div
                            className="p-3 rounded-xl"
                            style={{
                                background: 'rgba(249,115,22,0.08)',
                                border: '1px solid rgba(249,115,22,0.2)',
                                boxShadow: '0 0 24px rgba(249,115,22,0.1)',
                            }}
                        >
                            <img
                                src="/ink_dapper_logo_white.svg"
                                alt="Ink Dapper Logo"
                                className="h-10 w-auto"
                                style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(10deg)' }}
                            />
                        </div>
                    </div>

                    <h1
                        className="text-2xl font-extrabold uppercase tracking-widest mb-1"
                        style={{ color: '#f5f5f0', letterSpacing: '0.18em' }}
                    >
                        Admin Panel
                    </h1>

                    {/* Divider with diamond */}
                    <div className="flex items-center justify-center gap-2 mt-2 mb-1">
                        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.4))' }} />
                        <div
                            className="w-1.5 h-1.5 rotate-45"
                            style={{ background: '#f97316' }}
                        />
                        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.4), transparent)' }} />
                    </div>

                    <p className="text-xs uppercase tracking-[0.15em] mt-2" style={{ color: 'rgba(253,186,116,0.6)' }}>
                        Secure Access
                    </p>
                </div>

                {/* ── Form ── */}
                <form onSubmit={onSubmitHandler} className="space-y-5">

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label
                            className="text-[11px] font-bold uppercase tracking-[0.14em] block"
                            style={{ color: 'rgba(253,186,116,0.75)' }}
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200 text-sm"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(249,115,22,0.2)',
                                    color: '#f5f5f0',
                                    caretColor: '#f97316',
                                }}
                                onFocus={e => {
                                    e.target.style.border = '1px solid rgba(249,115,22,0.6)'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.08), 0 0 16px rgba(249,115,22,0.08)'
                                }}
                                onBlur={e => {
                                    e.target.style.border = '1px solid rgba(249,115,22,0.2)'
                                    e.target.style.boxShadow = 'none'
                                }}
                                type="email"
                                name="email"
                                placeholder="admin@inkdapper.com"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label
                            className="text-[11px] font-bold uppercase tracking-[0.14em] block"
                            style={{ color: 'rgba(253,186,116,0.75)' }}
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200 text-sm"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(249,115,22,0.2)',
                                    color: '#f5f5f0',
                                    caretColor: '#f97316',
                                }}
                                onFocus={e => {
                                    e.target.style.border = '1px solid rgba(249,115,22,0.6)'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.08), 0 0 16px rgba(249,115,22,0.08)'
                                }}
                                onBlur={e => {
                                    e.target.style.border = '1px solid rgba(249,115,22,0.2)'
                                    e.target.style.boxShadow = 'none'
                                }}
                                type="password"
                                name="password"
                                placeholder="••••••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-lg font-bold uppercase tracking-widest text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        style={{
                            background: isLoading
                                ? 'rgba(249,115,22,0.5)'
                                : 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
                            color: '#0a0a0b',
                            boxShadow: isLoading ? 'none' : '0 4px 24px rgba(249,115,22,0.35), 0 0 0 1px rgba(249,115,22,0.2)',
                            letterSpacing: '0.14em',
                        }}
                        onMouseEnter={e => {
                            if (!isLoading) {
                                e.target.style.boxShadow = '0 6px 32px rgba(249,115,22,0.5), 0 0 0 1px rgba(249,115,22,0.3)'
                                e.target.style.transform = 'translateY(-1px)'
                            }
                        }}
                        onMouseLeave={e => {
                            e.target.style.boxShadow = '0 4px 24px rgba(249,115,22,0.35), 0 0 0 1px rgba(249,115,22,0.2)'
                            e.target.style.transform = 'translateY(0)'
                        }}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div
                                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                                    style={{ borderColor: 'rgba(10,10,11,0.4)', borderTopColor: 'transparent' }}
                                />
                                Authenticating...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* ── Footer ── */}
                <div className="mt-8 pt-5 text-center" style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(249,115,22,0.5)' }} />
                        <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'rgba(253,186,116,0.35)' }}>
                            Ink Dapper © 2026
                        </p>
                        <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(249,115,22,0.5)' }} />
                    </div>
                </div>

                {/* Inner bottom shimmer line */}
                <div
                    className="absolute bottom-0 left-8 right-8 h-px rounded-full pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.2), transparent)' }}
                />
            </div>
        </div>
    )
}

export default Login
