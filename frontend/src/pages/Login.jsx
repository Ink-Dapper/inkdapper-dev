import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaEnvelope, FaPhone, FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const getPasswordStrength = (password) => {
    if (password.length < 8) return 'Weak';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) return 'Strong';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password)) return 'Medium';
    return 'Weak';
  };

  const onPasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(getPasswordStrength(newPassword));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (currentState === 'Sign Up' && !validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
      setIsLoading(false);
      return;
    }
    setPasswordError('');
    try {
      if (currentState === 'Sign Up') {
        const phoneCheckResponse = await axios.post('/user/check-phone', { phone });
        if (!phoneCheckResponse.data.success) {
          toast.error('Phone number is already registered. Please use another.');
          setIsLoading(false);
          return;
        }

        const response = await axios.post('/email/send-verification-email', { email });
        if (response.data.success) {
          toast.success(response.data.message);
          setCurrentState('Verify Email');
          localStorage.setItem('signupPassword', password);
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Verify Email') {
        const response = await axios.post('/email/verify-email', { token: verificationToken, email });
        if (response.data.success) {
          const registerResponse = await axios.post('/user/register', { name, email, password, phone });
          if (registerResponse.data.success) {
            setToken(registerResponse.data.token);
            localStorage.setItem('token', registerResponse.data.token);

            // Store user information in localStorage
            localStorage.setItem('user_name', name);
            localStorage.setItem('user_email', email);
            if (phone) {
              localStorage.setItem('user_phone', phone);
            }

            navigate('/');
          } else {
            toast.error(registerResponse.data.message);
          }
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Forgot Password') {
        const response = await axios.post('/user/send-reset-code', { email: resetEmail });
        if (response.data.success) {
          toast.success(response.data.message);
          setCurrentState('Reset Password');
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Reset Password') {
        if (newPassword !== confirmPassword) {
          toast.error('Passwords do not match.');
          setIsLoading(false);
          return;
        }
        const response = await axios.post('/user/reset-password', { email: resetEmail, code: resetCode, newPassword });
        if (response.data.success) {
          toast.success(response.data.message);
          setCurrentState('Login');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const loginData = { emailOrPhone, password };
        const response = await axios.post('/user/login', loginData);

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);

          // Store user information if available in response
          if (response.data.user) {
            localStorage.setItem('user_name', response.data.user.name);
            localStorage.setItem('user_email', response.data.user.email);
            if (response.data.user.phone) {
              localStorage.setItem('user_phone', response.data.user.phone);
            }
          }

          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  const InputField = useCallback(({ icon: Icon, type = "text", placeholder, value, onChange, required = true, className = "" }) => (
    <div className={`relative group ${className}`}>
      <div
        className="relative w-full transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(148,163,184,0.18)',
          clipPath: 'polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px)',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(251,146,60,0.6)'; e.currentTarget.style.background = 'rgba(249,115,22,0.06)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.18)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <Icon className="h-4 w-4 text-slate-600 group-focus-within:text-orange-400 transition-colors duration-200" />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
<<<<<<< HEAD
          className="w-full pl-11 pr-4 py-3.5 text-sm font-medium text-slate-700 placeholder-slate-600 outline-none bg-transparent"
=======
          className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-sm font-medium text-slate-700 placeholder-slate-600 outline-none bg-transparent"
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
        />
      </div>
    </div>
  ), []);

  const PasswordField = useCallback(({ placeholder, value, onChange, required = true, className = "" }) => (
    <div className={`relative group ${className}`}>
      <div
        className="relative w-full transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(148,163,184,0.18)',
          clipPath: 'polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px)',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(251,146,60,0.6)'; e.currentTarget.style.background = 'rgba(249,115,22,0.06)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.18)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <FaLock className="h-4 w-4 text-slate-600 group-focus-within:text-orange-400 transition-colors duration-200" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
<<<<<<< HEAD
          className="w-full pl-11 pr-12 py-3.5 text-sm font-medium text-slate-700 placeholder-slate-600 outline-none bg-transparent"
=======
          className="w-full pl-11 pr-12 py-3 sm:py-3.5 text-sm font-medium text-slate-700 placeholder-slate-600 outline-none bg-transparent"
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-orange-400 transition-colors duration-200 z-10"
        >
          {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  ), [showPassword]);

  const Button = useCallback(({ children, type = "submit", onClick, disabled = false, className = "" }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
<<<<<<< HEAD
      className={`w-full py-4 px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${className}`}
=======
      className={`w-full py-3.5 sm:py-4 px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${className}`}
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
      style={{
        background: 'linear-gradient(135deg, rgba(251,146,60,0.95), rgba(245,158,11,0.88))',
        clipPath: 'polygon(10px 0%,100% 0%,100% calc(100% - 10px),calc(100% - 10px) 100%,0% 100%,0% 10px)',
        boxShadow: '0 8px 24px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
    >
      {disabled ? (
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
          {children}
        </div>
      ) : children}
    </button>
  ), []);

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#08090a' }}>
=======
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center px-4 py-8 sm:py-4 relative overflow-x-hidden overflow-y-auto" style={{ background: '#08090a' }}>
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a

      {/* Diagonal stripe texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.008) 0px, rgba(255,255,255,0.008) 1px, transparent 1px, transparent 30px)',
          backgroundSize: '45px 45px'
        }}
      />
      {/* Orange radial glow — top */}
<<<<<<< HEAD
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(249,115,22,0.11) 0%, transparent 70%)' }}
      />
      {/* Orange radial glow — bottom right */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[280px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom right, rgba(249,115,22,0.07) 0%, transparent 70%)' }}
      />
      {/* Corner bracket marks */}
      <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-orange-500/30 pointer-events-none" />
      <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-orange-500/30 pointer-events-none" />
      <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-orange-500/30 pointer-events-none" />
      <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-orange-500/30 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
=======
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[280px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(249,115,22,0.11) 0%, transparent 70%)' }}
      />
      {/* Orange radial glow — bottom right */}
      <div className="absolute bottom-0 right-0 w-[min(400px,100vw)] h-[280px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom right, rgba(249,115,22,0.07) 0%, transparent 70%)' }}
      />
      {/* Corner bracket marks — hidden on very small screens */}
      <div className="hidden xs:block absolute top-5 left-5 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-orange-500/30 pointer-events-none" />
      <div className="hidden xs:block absolute top-5 right-5 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-orange-500/30 pointer-events-none" />
      <div className="hidden xs:block absolute bottom-5 left-5 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-orange-500/30 pointer-events-none" />
      <div className="hidden xs:block absolute bottom-5 right-5 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-orange-500/30 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 my-auto">
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
        {/* Back Button */}
        {currentState !== 'Login' && (
          <button
            onClick={() => setCurrentState('Login')}
            className="mb-5 flex items-center gap-2 text-slate-500 hover:text-orange-400 transition-colors duration-200 text-[11px] font-black uppercase tracking-[0.15em]"
          >
            <span className="w-6 h-6 flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(148,163,184,0.2)',
                clipPath: 'polygon(4px 0%,100% 0%,100% calc(100% - 4px),calc(100% - 4px) 100%,0% 100%,0% 4px)'
              }}
            >
              <FaArrowLeft className="h-3 w-3" />
            </span>
            Back to Login
          </button>
        )}

        {/* Main Card */}
        <div className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0f1012 0%, #141518 100%)',
            border: '1px solid rgba(251,146,60,0.28)',
            clipPath: 'polygon(16px 0%,100% 0%,100% calc(100% - 16px),calc(100% - 16px) 100%,0% 100%,0% 16px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(251,146,60,0.06)'
          }}
        >
          {/* Top orange glow bar */}
          <div className="h-[3px] w-full"
            style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(251,146,60,0.9) 30%, rgba(245,158,11,1) 50%, rgba(251,146,60,0.9) 70%, transparent 95%)' }}
          />
          {/* Left accent bar */}
          <div className="absolute left-0 top-[3px] bottom-0 w-[3px] pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(251,146,60,0.8), rgba(245,158,11,0.3), transparent)' }}
          />
          {/* Inner diagonal texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
            style={{
              backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 24px)',
              backgroundSize: '36px 36px'
            }}
          />

<<<<<<< HEAD
          <div className="relative px-7 pt-7 pb-7">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
=======
          <div className="relative px-4 sm:px-7 pt-5 sm:pt-7 pb-5 sm:pb-7">
            {/* Header */}
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0"
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
                  style={{
                    background: 'linear-gradient(135deg, rgba(251,146,60,0.95), rgba(245,158,11,0.88))',
                    clipPath: 'polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px)',
                    boxShadow: '0 6px 16px rgba(249,115,22,0.4)'
                  }}
                >
                  <FaLock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500 leading-none">Ink Dapper</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 leading-none mt-0.5">Secure Access</p>
                </div>
              </div>
<<<<<<< HEAD
              <h1 className="text-2xl font-black uppercase tracking-[0.08em] text-slate-100">{currentState}</h1>
=======
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-[0.06em] sm:tracking-[0.08em] text-slate-100">{currentState}</h1>
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
              <div className="mt-2 flex items-center gap-2">
                <div className="h-[2px] w-10" style={{ background: 'linear-gradient(90deg, rgba(251,146,60,0.9), rgba(245,158,11,0.6))' }} />
                <div className="h-px flex-1 bg-slate-800" />
              </div>
            </div>

<<<<<<< HEAD
            <form onSubmit={onSubmitHandler} className="space-y-5">
=======
            <form onSubmit={onSubmitHandler} className="space-y-4 sm:space-y-5">
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
              {/* Sign Up */}
              {currentState === 'Sign Up' && (
                <div className="space-y-3">
                  <InputField icon={FaUser} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <InputField icon={FaEnvelope} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <InputField icon={FaPhone} placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <PasswordField placeholder="Password" value={password} onChange={onPasswordChange} />
                  {password && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">Strength</span>
                        <span className={`text-[10px] font-black uppercase tracking-[0.12em] ${passwordStrength === 'Strong' ? 'text-green-400' : passwordStrength === 'Medium' ? 'text-amber-400' : 'text-red-400'}`}>
                          {passwordStrength}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="h-1 flex-1 transition-all duration-300"
                            style={{
                              background: (passwordStrength === 'Strong') || (passwordStrength === 'Medium' && i < 2) || (passwordStrength === 'Weak' && i === 0)
                                ? (i === 0 ? 'rgba(239,68,68,0.85)' : i === 1 ? 'rgba(245,158,11,0.85)' : 'rgba(34,197,94,0.85)')
                                : 'rgba(255,255,255,0.06)'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {passwordError && (
                    <p className="text-red-400 text-xs font-medium px-3 py-2.5"
                      style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)' }}>
                      {passwordError}
                    </p>
                  )}
                  <Button disabled={isLoading}>{isLoading ? 'Sending...' : 'Create Account'}</Button>
                </div>
              )}

              {/* Login */}
              {currentState === 'Login' && (
                <div className="space-y-3">
                  <InputField icon={FaEnvelope} placeholder="Email or Phone" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} />
                  <PasswordField placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <Button disabled={isLoading}>{isLoading ? 'Signing In...' : 'Sign In'}</Button>
                </div>
              )}

              {/* Verify Email */}
              {currentState === 'Verify Email' && (
                <div className="space-y-3">
                  <InputField icon={FaEnvelope} placeholder="Verification Token" value={verificationToken} onChange={(e) => setVerificationToken(e.target.value)} />
                  <p className="text-slate-700 text-xs font-medium px-3 py-2.5"
                    style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(251,146,60,0.2)', clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)' }}>
                    Check your email for the verification token.
                  </p>
                  <Button disabled={isLoading}>{isLoading ? 'Verifying...' : 'Verify Email'}</Button>
                </div>
              )}

              {/* Forgot Password */}
              {currentState === 'Forgot Password' && (
                <div className="space-y-3">
                  <InputField icon={FaEnvelope} type="email" placeholder="Enter your registered email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                  <Button disabled={isLoading}>{isLoading ? 'Sending...' : 'Send Reset Code'}</Button>
                </div>
              )}

              {/* Reset Password */}
              {currentState === 'Reset Password' && (
                <div className="space-y-3">
                  <InputField icon={FaEnvelope} placeholder="Enter the reset code" value={resetCode} onChange={(e) => setResetCode(e.target.value)} />
                  <PasswordField placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <PasswordField placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <Button disabled={isLoading}>{isLoading ? 'Resetting...' : 'Reset Password'}</Button>
                </div>
              )}

              {/* Navigation Links */}
<<<<<<< HEAD
              <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-2"
=======
              <div className="pt-3 sm:pt-4 flex flex-row justify-between items-center gap-2 flex-wrap"
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
                style={{ borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                <button
                  type="button"
                  onClick={() => setCurrentState('Forgot Password')}
                  className="text-slate-600 hover:text-orange-400 transition-colors duration-200 text-[11px] font-black uppercase tracking-[0.12em]"
                >
                  Forgot password?
                </button>
                {currentState === 'Login' ? (
                  <button type="button" onClick={() => setCurrentState('Sign Up')}
                    className="text-orange-500 hover:text-orange-400 font-black transition-colors duration-200 text-[11px] uppercase tracking-[0.12em] flex items-center gap-1.5">
                    <span className="text-orange-600">→</span> Create account
                  </button>
                ) : (
                  <button type="button" onClick={() => setCurrentState('Login')}
                    className="text-orange-500 hover:text-orange-400 font-black transition-colors duration-200 text-[11px] uppercase tracking-[0.12em] flex items-center gap-1.5">
                    <span className="text-orange-600">→</span> Login Here
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
<<<<<<< HEAD
        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.25))' }} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">Premium T-Shirt Brand</span>
=======
        <div className="mt-4 sm:mt-5 flex items-center gap-2 sm:gap-3">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.25))' }} />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-700 whitespace-nowrap">Premium T-Shirt Brand</span>
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
          <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(251,146,60,0.25))' }} />
        </div>
      </div>
    </div>
  );
};

export default Login;