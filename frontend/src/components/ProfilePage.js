import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import './ProfilePage.css';
import DynamicButton from './DynamicButton';

const Profile = ({ userEmail }) => {
  const [profileData, setProfileData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    collegeName: '',
    collegeRegistrationId: '',
    clubName: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
        if (!authToken) {
          alert('Please log in to access your profile');
          return;
        }

        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Attach token in the Authorization header
          },
        });

        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        alert('Failed to fetch profile data. Please check your authentication.');
      }
    };
    fetchProfile();
  }, []);

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    collegeName: Yup.string().required('College name is required'),
    collegeRegistrationId: Yup.string().required('College registration ID is required'),
    clubName: Yup.string().required('Club name is required'),
  });

  const formik = useFormik({
    initialValues: {
      phoneNumber: profileData.phoneNumber || '',
      collegeName: profileData.collegeName || '',
      collegeRegistrationId: profileData.collegeRegistrationId || '',
      clubName: profileData.clubName || '',
    },
    enableReinitialize: true, // Allow form values to reset when profileData changes
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
        if (!token) {
          alert('Please log in to update your profile');
          return;
        }

        const updatedProfile = {
          phoneNumber: values.phoneNumber,
          collegeName: values.collegeName,
          collegeRegistrationId: values.collegeRegistrationId,
          clubName: values.clubName,
        };

        // Send updated profile to the backend
        await axios.put('/api/profile', updatedProfile, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });
        setProfileData((prevData) => ({
          ...prevData, // Retain existing profile data
          ...updatedProfile, // Update the changed fields
        })); // Update the profile data, including email and full name
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please check your authentication.');
      }
    },
  });

  const isFormValid =
    formik.values.phoneNumber &&
    formik.values.collegeName &&
    formik.values.collegeRegistrationId &&
    formik.values.clubName;

  return (
    <div className="profile-container">
      <form onSubmit={formik.handleSubmit} className="profile-form">
        {/* Display Email */}
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <p id="email" className="static-email">
            {profileData.email} {/* Display email fetched from backend */}
          </p>
        </div>

        {/* Display Name */}
        <div className="form-control">
          <label htmlFor="name">Full Name</label>
          <p id="name" className="static-name">
            {profileData.fullName} {/* Display name fetched from backend */}
          </p>
        </div>

        <div className="form-control">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Enter your phone number"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <p className="error">{formik.errors.phoneNumber}</p>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="collegeName">College Name</label>
          <input
            type="text"
            id="collegeName"
            name="collegeName"
            placeholder="Enter your college name"
            value={formik.values.collegeName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.collegeName && formik.errors.collegeName && (
            <p className="error">{formik.errors.collegeName}</p>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="collegeRegistrationId">College Registration ID</label>
          <input
            type="text"
            id="collegeRegistrationId"
            name="collegeRegistrationId"
            placeholder="Enter your college registration ID"
            value={formik.values.collegeRegistrationId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.collegeRegistrationId &&
            formik.errors.collegeRegistrationId && (
              <p className="error">{formik.errors.collegeRegistrationId}</p>
            )}
        </div>

        <div className="form-control">
          <label htmlFor="clubName">Club Name</label>
          <input
            type="text"
            id="clubName"
            name="clubName"
            placeholder="Enter your club name"
            value={formik.values.clubName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.clubName && formik.errors.clubName && (
            <p className="error">{formik.errors.clubName}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="button">
          <DynamicButton
            label="Update Profile"
            type="submit"
            disabled={!isFormValid || !formik.isValid}
          />
        </div>
      </form>
    </div>
  );
};

export default Profile;
