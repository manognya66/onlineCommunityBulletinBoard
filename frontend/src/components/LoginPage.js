import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './LoginPage.css';
import DynamicButton from './DynamicButton';
import SignUpPage from './SignUpPage';
import ForgotPassword from './ForgotPassword';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; // Import axios

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    if (authToken) {
      navigate('/home'); // Redirect to home if the user is already logged in
    }
  }, [authToken, navigate]);

  const validationSchema = Yup.object({
    Email: Yup.string()
      .email('Invalid email format')
      .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a Gmail account')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(10, 'Password must be at most 10 characters')
      .matches(/^[A-Za-z0-9]{8,10}$/, 'Password can only contain alphanumeric characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      Email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/login',
          {
            email: values.Email,
            password: values.password,
          }
        );

        const data = response.data;

        if (data.message === 'Login successful' && data.token) {
          // Check if the token is already stored to prevent logging it multiple times
          const existingToken = localStorage.getItem('authToken');
          if (existingToken !== data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('user', JSON.stringify(data));
            setAuthToken(data.token);  // Update state to prevent re-renders
            console.log('Token saved:', data.token);  // Log token once
          }

          toast.success('Login successful! Redirecting to home page', {
            autoClose: 900,
            style: { color: '#000', fontFamily: 'Open Sans, sans-serif' },
          });

          login();
          setTimeout(() => {
            navigate('/home');
          }, 1000);
        } else {
          toast.error('Invalid email or password', {
            autoClose: 900,
            style: { color: '#000', fontFamily: 'Open Sans, sans-serif' },
          });
        }
      } catch (error) {
        toast.error('An error occurred during login', {
          autoClose: 900,
          style: { color: '#000', fontFamily: 'Open Sans, sans-serif' },
        });
        console.error('Login error:', error.response?.data || error.message);
      }
    },
  });

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      formik.setFieldValue('password', value);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="LoginPage">
      <h1>Login</h1>
      <form className="Login" onSubmit={formik.handleSubmit}>
        <div>
          <input
            type="text"
            name="Email"
            placeholder="Email"
            value={formik.values.Email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.Email && formik.errors.Email && (
            <div className="error">{formik.errors.Email}</div>
          )}
        </div>
        <div>
          <div className="password-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={handlePasswordChange}
              onBlur={formik.handleBlur}
            />
            <span
              className="show-password"
              onClick={togglePasswordVisibility}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </span>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
        </div>

        <DynamicButton label="Login" disabled={!(formik.isValid && formik.dirty)} onClick={formik.handleSubmit} />
      </form>

      <div className="links">
        <Link to="/signup" element = {<SignUpPage/>} className="link">Sign Up</Link>
        <span> | </span>
        <Link to="/forgot-password" element = {<ForgotPassword/>} className="link">Forgot Password?</Link>
      </div>
    </div>
  );
};

export default LoginPage;

