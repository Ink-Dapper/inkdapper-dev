import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Separate state for email
  const [phone, setPhone] = useState(''); // Separate state for phone number
  const [emailOrPhone, setEmailOrPhone] = useState(''); // State for email or phone
  const [verificationToken, setVerificationToken] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading

  const [resetEmail, setResetEmail] = useState(''); // State for reset email
  const [resetCode, setResetCode] = useState(''); // State for reset code
  const [newPassword, setNewPassword] = useState(''); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password

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
    setIsLoading(true); // Set loading to true
    if (currentState === 'Sign Up' && !validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
      setIsLoading(false); // Set loading to false
      return;
    }
    setPasswordError('');
    try {
      if (currentState === 'Sign Up') {
        // Check if the phone number is already registered
        const phoneCheckResponse = await axios.post(backendUrl + '/api/user/check-phone', { phone });
        if (!phoneCheckResponse.data.success) {
          toast.error('Phone number is already registered. Please use another.');
          setIsLoading(false); // Set loading to false
          return;
        }

        const response = await axios.post(backendUrl + '/api/email/send-verification-email', { email });
        if (response.data.success) {
          toast.success(response.data.message);
          setCurrentState('Verify Email');
          localStorage.setItem('signupPassword', password); // Save password to local storage
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Verify Email') {
        const response = await axios.post(backendUrl + '/api/email/verify-email', { token: verificationToken, email });
        if (response.data.success) {
          const registerResponse = await axios.post(backendUrl + '/api/user/register', { name, email, password, phone }); // Include phone in registration
          if (registerResponse.data.success) {
            setToken(registerResponse.data.token);
            localStorage.setItem('token', registerResponse.data.token);
            navigate('/');
          } else {
            toast.error(registerResponse.data.message);
          }
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Forgot Password') {
        const response = await axios.post(backendUrl + '/api/user/send-reset-code', { email: resetEmail });
        if (response.data.success) {
          toast.success(response.data.message);
          setCurrentState('Reset Password');
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Reset Password') {
        if (newPassword !== confirmPassword) {
          toast.error('Passwords do not match.');
          setIsLoading(false); // Set loading to false
          return;
        }
        const response = await axios.post(backendUrl + '/api/user/reset-password', { email: resetEmail, code: resetCode, newPassword });
        if (response.data.success) {
          toast.success(response.data.message);
          setCurrentState('Login');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const loginData = { emailOrPhone, password }; // Use emailOrPhone for login
        const response = await axios.post(backendUrl + '/api/user/login', loginData); // Include emailOrPhone in login
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div className=''>
      <h1 className="sr-only">Login / Sign Up</h1>
      <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mt-10'>
          <p className='prata-regular text-3xl'>{currentState}</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        {currentState === 'Sign Up' && (
          <>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              id="signup-name"
              name="name"
              className='w-full px-3 py-2 border border-gray-800'
              placeholder='Name'
              required
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              id="signup-email"
              name="email"
              className='w-full px-3 py-2 border border-gray-800'
              placeholder='Email'
              required
            />
            <input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              type="text"
              id="signup-phone"
              name="phone"
              className='w-full px-3 py-2 border border-gray-800'
              placeholder='Phone'
              required
            />
            <div className='relative w-full'>
              <input
                onChange={onPasswordChange}
                value={password}
                type={showPassword ? 'text' : 'password'}
                id="signup-password"
                name="password"
                className='w-full px-3 py-2 border border-gray-800'
                placeholder='Password'
                required
              />
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'>
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='focus:outline-none'>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className='w-full mt-2'>
              <div className='h-2 bg-gray-300 rounded'>
                <div
                  className={`h-full rounded ${passwordStrength === 'Strong' ? 'bg-green-500' : passwordStrength === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: passwordStrength === 'Strong' ? '100%' : passwordStrength === 'Medium' ? '66%' : '33%' }}
                ></div>
              </div>
              <p className={`text-sm mt-1 ${passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                {passwordStrength} Password
              </p>
            </div>
            {passwordError && <p className='text-red-500 text-sm'>{passwordError}</p>}
            <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4' disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Verification Email'}
            </button>
          </>
        )}
        {currentState === 'Login' && (
          <>
            <input
              onChange={(e) => setEmailOrPhone(e.target.value)}
              value={emailOrPhone}
              type="text"
              id="login-email-phone"
              name="emailOrPhone"
              className='w-full px-3 py-2 border border-gray-800'
              placeholder='Email or Phone'
              required
            />
            <div className='relative w-full'>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                name="password"
                className='w-full px-3 py-2 border border-gray-800'
                placeholder='Password'
                required
              />
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'>
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='focus:outline-none'>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </>
        )}
        {currentState === 'Verify Email' && (
          <>
            <input
              onChange={(e) => setVerificationToken(e.target.value)}
              value={verificationToken}
              type="text"
              id="verification-token"
              name="verificationToken"
              className='w-full px-3 py-2 border border-gray-800'
              placeholder='Verification Token'
              required
            />
            {currentState === 'Verify Email' && <p className='text-gray-500 text-xs mt-[-10px] md:mt-[-5px] flex justify-start w-full'>Check your email for the verification token.</p>}
          </>
        )}
        {currentState === 'Forgot Password' && (
          <>
            <input
              onChange={(e) => setResetEmail(e.target.value)}
              value={resetEmail}
              type="email"
              id="reset-email"
              name="resetEmail"
              className='w-full px-3 py-2 border border-gray-800'
              placeholder='Enter your registered email'
              required
            />
            <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4' disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </>
        )}
        {currentState === 'Reset Password' && (
          <>
            <input
              onChange={(e) => setResetCode(e.target.value)}
              value={resetCode}
              type="text"
              id="reset-code"
              name="resetCode"
              className='w-full px-3 py-2 border border-gray-800'
              placeholder='Enter the reset code'
              required
            />
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              type={showPassword ? 'text' : 'password'}
              id="new-password"
              name="newPassword"
              className='w-full px-3 py-2 border border-gray-800'
              placeholder='New Password'
              required
            />
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type={showPassword ? 'text' : 'password'}
              id="confirm-password"
              name="confirmPassword"
              className='w-full px-3 py-2 border border-gray-800'
              placeholder='Confirm New Password'
              required
            />
            <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4' disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}
        <div className='w-full md:flex justify-between text-sm mt-[-8px]'>
          <p className='cursor-pointer underline pb-1' onClick={() => setCurrentState('Forgot Password')}>Forgot your password?</p>
          {currentState === 'Login' ? (
            <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-orange-600'>Create account</p>
          ) : (
            <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-orange-600'>Login Here</p>
          )}
        </div>
        {currentState !== 'Sign Up' && currentState !== 'Forgot Password' && currentState !== 'Reset Password' && (
          <button className='bg-black text-white font-light px-8 py-2 mt-4' disabled={isLoading}>
            {isLoading ? 'Loading...' : currentState === 'Login' ? 'Sign In' : currentState === 'Verify Email' ? 'Verify Email' : ''}
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;