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

  const InputField = useCallback(({ icon: Icon, type = "text", placeholder, value, onChange, required = true, className = "", id, name }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-700 shadow-sm"
      />
    </div>
  ), []);

  const PasswordField = useCallback(({ placeholder, value, onChange, required = true, className = "", id, name }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
      </div>
      <input
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-700 shadow-sm"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-500 transition-colors duration-200"
      >
        {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
      </button>
    </div>
  ), [showPassword]);

  const Button = useCallback(({ children, type = "submit", onClick, disabled = false, className = "" }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
    >
      {disabled ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  ), []);

  return (
    <div className="h-full md:min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-orange-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full opacity-30 animate-float"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        {currentState !== 'Login' && (
          <button
            onClick={() => setCurrentState('Login')}
            className="mb-6 flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back to Login
          </button>
        )}

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">
              {currentState}
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto"></div>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Sign Up Form */}
            {currentState === 'Sign Up' && (
              <div className="space-y-4">
                <InputField
                  icon={FaUser}
                  id="signup-name"
                  name="name"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <InputField
                  icon={FaEnvelope}
                  type="email"
                  id="signup-email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                  icon={FaPhone}
                  id="signup-phone"
                  name="phone"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <PasswordField
                  id="signup-password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={onPasswordChange}
                />

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Password Strength:</span>
                      <span className={`font-medium ${passwordStrength === 'Strong' ? 'text-green-600' :
                        passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {passwordStrength}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength === 'Strong' ? 'bg-green-500 w-full' :
                          passwordStrength === 'Medium' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'
                          }`}
                      ></div>
                    </div>
                  </div>
                )}

                {passwordError && (
                  <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    {passwordError}
                  </p>
                )}

                <Button disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Create Account'}
                </Button>
              </div>
            )}

            {/* Login Form */}
            {currentState === 'Login' && (
              <div className="space-y-4">
                <InputField
                  icon={FaEnvelope}
                  id="login-email"
                  name="emailOrPhone"
                  placeholder="Email or Phone"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
                <PasswordField
                  id="login-password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </div>
            )}

            {/* Verify Email Form */}
            {currentState === 'Verify Email' && (
              <div className="space-y-4">
                <InputField
                  icon={FaEnvelope}
                  id="verification-token"
                  name="verificationToken"
                  placeholder="Verification Token"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                />
                <p className="text-gray-600 text-sm bg-orange-50 p-3 rounded-lg border border-orange-200">
                  Check your email for the verification token.
                </p>

                <Button disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </Button>
              </div>
            )}

            {/* Forgot Password Form */}
            {currentState === 'Forgot Password' && (
              <div className="space-y-4">
                <InputField
                  icon={FaEnvelope}
                  type="email"
                  id="reset-email"
                  name="resetEmail"
                  placeholder="Enter your registered email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />

                <Button disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Code'}
                </Button>
              </div>
            )}

            {/* Reset Password Form */}
            {currentState === 'Reset Password' && (
              <div className="space-y-4">
                <InputField
                  icon={FaEnvelope}
                  id="reset-code"
                  name="resetCode"
                  placeholder="Enter the reset code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                />
                <PasswordField
                  id="new-password"
                  name="newPassword"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <PasswordField
                  id="confirm-password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button disabled={isLoading}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </div>
            )}

            {/* Navigation Links */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <button
                  type="button"
                  onClick={() => setCurrentState('Forgot Password')}
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-200 text-sm"
                >
                  Forgot your password?
                </button>
                {currentState === 'Login' ? (
                  <button
                    type="button"
                    onClick={() => setCurrentState('Sign Up')}
                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 text-sm"
                  >
                    Create account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentState('Login')}
                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 text-sm"
                  >
                    Login Here
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;