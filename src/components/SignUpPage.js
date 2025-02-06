import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './SignUpPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import DynamicButton from './DynamicButton';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required'),
      email: Yup.string()
        .email('Invalid email format')
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a Gmail address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(10, 'Password must be at most 10 characters')
        .matches(/^[A-Za-z0-9]{8,10}$/, 'Password must be alphanumeric')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
        .matches(/^[A-Za-z0-9]{8,10}$/, 'Password must be alphanumeric'),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:5000/api/auth/signup', values);
        toast.success('Registration successful! Navigate to Login Page.', { autoClose: 900 });
        setTimeout(() => navigate('/login'), 1000);
      } catch (error) {
        toast.error('Registration failed. Try again.', { autoClose: 900 });
      }
    },
  });

  return (
    <div className="SignUpPage">
      <h1>Sign Up</h1>
      <form className="SignUp" onSubmit={formik.handleSubmit}>
        <input type="text" placeholder="Full Name" {...formik.getFieldProps('fullName')} />
        {formik.touched.fullName && formik.errors.fullName && <div className="error">{formik.errors.fullName}</div>}

        <input type="text" placeholder="Email" {...formik.getFieldProps('email')} />
        {formik.touched.email && formik.errors.email && <div className="error">{formik.errors.email}</div>}

        <div className="password">
          <div className="password-field">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" {...formik.getFieldProps('password')} />
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="eye-icon" onClick={() => setShowPassword((prev) => !prev)} />
          </div>
          {formik.touched.password && formik.errors.password && <div className="error">{formik.errors.password}</div>}

          <div className="password-field">
            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" {...formik.getFieldProps('confirmPassword')} />
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="eye-icon" onClick={() => setShowConfirmPassword((prev) => !prev)} />
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && <div className="error">{formik.errors.confirmPassword}</div>}
        </div>

        <DynamicButton label="Sign up" disabled={formik.isSubmitting || !formik.isValid} onClick={formik.handleSubmit} />
      </form>

      <div className="login-link">
        <span>Already have an account? <Link to="/login">Login</Link></span>
      </div>
    </div>
  );
};

export default SignUpPage;
