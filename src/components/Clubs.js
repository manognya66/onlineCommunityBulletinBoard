import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import eclub from '../assets/eclub.png';
import gitamsports from '../assets/gitamsports.jpg';
import gitam from '../assets/gitam.png';
import gusac from '../assets/gusac.jpg';
import nss from '../assets/nss.png';
import studentlife from '../assets/studentlife.png';
import CustomModal from './CustomModal';
import './Clubs.css';

const clubs = [
  { id: 'eclub', name: 'E-Club', image: eclub },
  { id: 'gitam-sports', name: 'Gitam Sports', image: gitamsports },
  { id: 'gitam', name: 'Gitam', image: gitam },
  { id: 'gusac', name: 'Gusac', image: gusac },
  { id: 'nss', name: 'NSS', image: nss },
  { id: 'student-life', name: 'Student Life', image: studentlife },
];

const ImageGallery = () => {
  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const navigate = useNavigate();

  const handleNavigate = (clubId) => {
    if (isLoggedIn) {
      navigate(`/clubs/${clubId}`);
    } else {
      setShowModal(true); // Show modal if not logged in
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="image-gallery">
      {clubs.map((club) => (
        <div key={club.id} className="image-container">
          {/* Replace Link with a click handler */}
          <div onClick={() => handleNavigate(club.id)} style={{ cursor: 'pointer' }}>
            <img src={club.image} alt={club.name} className="gallery-image" />
            <h2>{club.name}</h2>
          </div>
        </div>
      ))}

      {/* Custom Modal */}
      <CustomModal
        showModal={showModal}
        onClose={closeModal}
        message="Login or Signin to access the Page."
      />
    </div>
  );
};

export default ImageGallery;
