import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DynamicButton from './DynamicButton'; // Custom dynamic button
import axios from 'axios'; // Axios for HTTP requests
import './EventPostPage.css';
import CustomModal from './CustomModal';
import { useEventContext } from './EventContext';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';

const clubs = [
  { id: 'eclub', name: 'E-Club' },
  { id: 'gitam-sports', name: 'Gitam Sports' },
  { id: 'gitam', name: 'Gitam' },
  { id: 'gusac', name: 'Gusac'},
  { id: 'nss', name: 'NSS' },
  { id: 'student-life', name: 'Student Life'},
];


const EventPostPage = () => {
  const { events, setEvents } = useEventContext();
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: '',
      clubName: '',
      eventStartDate: '',
      eventEndDate: '',
      location: '',
      image: '',
      registrationLink: '',
      regStartDate: '',
      regEndDate: '',
      description: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Event title is required'),
      clubName: Yup.string().required('Club name is required'),
      eventStartDate: Yup.date().required('Event start date is required'),
      eventEndDate: Yup.date()
        .required('Event end date is required')
        .min(Yup.ref('eventStartDate'), 'End date must be after the start date'),
      location: Yup.string().required('Event location is required'),
      registrationLink: Yup.string().url('Invalid URL format'),
      regStartDate: Yup.date().required('Registration start date is required'),
      regEndDate: Yup.date()
        .required('Registration end date is required')
        .min(Yup.ref('regStartDate'), 'End date must be after the start date'),
      description: Yup.string().required('Event description is required'),
    }),
    onSubmit: async (values) => {
      try {
        if (!authToken) {
          console.error('No token found in localStorage');
          alert('Please log in again.');
          return;
        }
        const requestBody = { 
          title: values.title,
          clubName: values.clubName,
          eventStartDate: values.eventStartDate,
          eventEndDate: values.eventEndDate,
          location: values.location,
          image: values.image,
          registrationLink:  values.registrationLink,
          regStartDate: values.regStartDate,
          regEndDate: values.regEndDate,
          description: values.description, 
          userId,
        };
        console.log("requestBody: ",requestBody);
        const response = await axios.post('http://localhost:5000/api/events', requestBody, {
          headers: {
            'Authorization': `Bearer ${authToken}`, // Ensure the token is correctly placed here
            'Content-Type': 'application/json',
          },
        });
        if (response.data.message === 'Event created successfully') {
          setEvents((prevEvents) => [...prevEvents, {...values, userId}]);
          formik.resetForm();
          setPreviewImage(null);
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error posting event:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          alert('Authentication failed. Please log in again.');
          localStorage.removeItem('authToken');
          navigate('/login'); 
        }
        setShowModal(false);
      }
    },
  });

  const handleUploadImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const targetWidth = 1728;
        const targetHeight = 2592;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const resizedImageURL = canvas.toDataURL();
        setPreviewImage(resizedImageURL);
        formik.setFieldValue('image', resizedImageURL);
        console.log('Image uploaded successfully!');
      };
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    formik.setFieldValue('image', '');
    console.log('Image removed successfully!'); 
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="event-post-page">
      <section className="event-form">
        <form onSubmit={formik.handleSubmit}>
          {/* Event Title */}
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter event title"
            />
            {formik.errors.title && formik.touched.title && <p className="error">{formik.errors.title}</p>}
          </div>

          {/* Club Name */}
          <div className="form-group">
            <label htmlFor="clubName">Club Name</label>
            <select
              id="clubName"
              name="clubName"
              value={formik.values.clubName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="styled-dropdown">
              <option value="" label="Select a club" />
              {clubs.map((club) => (
                <option key={club.id} value={club.name} label={club.name} />
              ))}
            </select>
            {formik.errors.clubName && formik.touched.clubName && <p className="error">{formik.errors.clubName}</p>}
          </div>

          {/* Event Start and End Dates */}
          <div className="form-group-event">
            <div>
              <label htmlFor="eventStartDate">Event Start Date</label>
              <input
                type="date"
                id="eventStartDate"
                name="eventStartDate"
                value={formik.values.eventStartDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.eventStartDate && formik.touched.eventStartDate && <p className="error">{formik.errors.eventStartDate}</p>}
            </div>
            <div>
              <label htmlFor="eventEndDate">Event End Date</label>
              <input
                type="date"
                id="eventEndDate"
                name="eventEndDate"
                value={formik.values.eventEndDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.eventEndDate && formik.touched.eventEndDate && <p className="error">{formik.errors.eventEndDate}</p>}
            </div>
          </div>

          {/* Registration Start and End Dates */}
          <div className="form-group-registration">
            <div>
              <label htmlFor="regStartDate">Registration Start Date</label>
              <input
                type="date"
                id="regStartDate"
                name="regStartDate"
                value={formik.values.regStartDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.regStartDate && formik.touched.regStartDate && <p className="error">{formik.errors.regStartDate}</p>}
            </div>
            <div>
              <label htmlFor="regEndDate">Registration End Date</label>
              <input
                type="date"
                id="regEndDate"
                name="regEndDate"
                value={formik.values.regEndDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.regEndDate && formik.touched.regEndDate && <p className="error">{formik.errors.regEndDate}</p>}
            </div>
          </div>

          {/* Event Location and Description */}
          <div className="form-group">
            <label htmlFor="location">Event Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Event location"
            />
            {formik.errors.location && formik.touched.location && <p className="error">{formik.errors.location}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="description">Event Description</label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Event details"
            />
            {formik.errors.description && formik.touched.description && <p className="error">{formik.errors.description}</p>}
          </div>

          {/* Event Poster */}
          <div className="form-group">
            <label htmlFor="image">Event Poster</label>
            <div className="poster-button">
              <DynamicButton
                label="Upload Poster" type="button"
                onClick={(e) => {
                  e.preventDefault(); 
                  document.getElementById('imageInput').click();  
                }}
                style={{ height: '30px', width: '150px', fontSize: '14px' }}
              />
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleUploadImage(e.target.files[0])}
              />
              <DynamicButton
                label="Remove Poster" type
                disabled={!previewImage}
                onClick={handleRemoveImage}
                style={{ height: '30px', width: '150px', fontSize: '14px' }}
              />
            </div>
            {previewImage && <div className="image-preview"><img src={previewImage} alt="Event Poster" /></div>}
          </div>

          {/* Registration Link */}
          <div className="form-group">
            <label htmlFor="registrationLink">Registration Link</label>
            <input
              type="url"
              id="registrationLink"
              name="registrationLink"
              value={formik.values.registrationLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Registration link"
            />
            {formik.errors.registrationLink && formik.touched.registrationLink && <p className="error">{formik.errors.registrationLink}</p>}
          </div>

          {/* Submit Button */}
          <div className="submit-button">
            <DynamicButton label="Post Event" type="submit"/>
          </div>
        </form>
      </section>

      {/* Success Message */}
      {showModal && ReactDOM.createPortal(
        <CustomModal
          message="Event posted successfully!"
          showModal={showModal}
          onClose={handleClose}
        />, 
        document.getElementById('posteventsuccess')
      )}
    </div>
  );
};

export default EventPostPage;
