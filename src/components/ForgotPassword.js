import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './ForgotPassword.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import CustomModal from './CustomModal';
import DynamicButton from './DynamicButton';

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputVerificationCode, setInputVerificationCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showModal]);

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a Gmail address')
      .required('Email is required'),
    captcha: Yup.string()
      .required('Verification code is required')
      .matches(/^[A-Za-z0-9]{6}$/, 'Captcha must be 6 characters'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(10, 'Password must be at most 10 characters')
      .matches(/^[A-Za-z0-9]+$/, 'Password must be alphanumeric')
      .required('New Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      captcha: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Password reset successful:', values);
      formik.resetForm();
      setShowModal(true); 
    },
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleClose = () =>{
    setShowModal(false);
  };

   // Request to backend to generate and send verification code
   const sendVerificationCode = async (email) => {
    try {
      const response = await fetch('/api/generate-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log('Verification code sent to email');
      } else {
        console.error('Failed to send verification code');
      }
    } catch (error) {
      console.error('Error while sending verification code:', error);
    }
  };

   // Handle verification code input
   const handleVerifyCode = async () => {
    try {
      const response = await fetch('/api/verify-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputVerificationCode }),
      });

      const data = await response.json();

      if (data.success) {
        setIsCodeVerified(true);
        formik.setFieldError('captcha', ''); // Clear error
      } else {
        formik.setFieldError('captcha', 'Incorrect verification code');
      }
    } catch (error) {
      console.error('Error while verifying the code:', error);
    }
  };

  return (
    <div className="ForgotPasswordPage">
      <h1>Forgot Password</h1>
      <form className="ForgotPassword" onSubmit={formik.handleSubmit}>
        <div className="email">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="inputField"
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email && <p className="error">{formik.errors.email}</p>}
          <DynamicButton
            label='Verify Email'
            onClick={() => {
              if (!formik.values.email) {
                formik.setFieldError('email', 'Please enter your email before verification');
              } else {
                sendVerificationCode(formik.values.email);
              }
            }}
            disabled={!formik.values.email}
          />
        </div>

         {/* Verification Code Input */}
         {formik.values.email && (
          <div className="verification-code">
            <input
              type="text"
              placeholder="Enter Verification Code"
              value={inputVerificationCode}
              onChange={(e) => setInputVerificationCode(e.target.value)}
              maxLength={6}
            />
            <DynamicButton
              label='Verify Code'
              onClick={handleVerifyCode}
              disabled={inputVerificationCode.length !== 6}
            />
            {formik.touched.captcha && formik.errors.captcha && <p className="error">{formik.errors.captcha}</p>}
          </div>
        )}
        
        {isCodeVerified && (
          <div className="password">
            <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="New Password"
                  {...formik.getFieldProps('newPassword')}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="eye-icon"
                  onClick={togglePasswordVisibility}
                />
            </div>
            {formik.touched.newPassword && formik.errors.newPassword && <p className="error">{formik.errors.newPassword}</p>}
              <div className="password-field">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  {...formik.getFieldProps('confirmPassword')}
                />
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  className="eye-icon"
                  onClick={toggleConfirmPasswordVisibility}
                />
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="error">{formik.errors.confirmPassword}</p>}

              <DynamicButton label='Change Password'
                disabled={
                  !formik.values.newPassword ||
                  !formik.values.confirmPassword ||
                  formik.values.newPassword !== formik.values.confirmPassword
                }
              />
          </div>
        )}
      </form>
      <div className="back-to-login">
        <Link to="/login" className="link">Back to Login</Link>
      </div>

      {showModal &&
        ReactDOM.createPortal(
          <CustomModal showModal={showModal} onClose={handleClose} message="Password Changed Successfully." />,
          document.getElementById('changepasswordmodal')
        )}
    </div>
  );
};

export default ForgotPassword;
