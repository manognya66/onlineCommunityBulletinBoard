import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage'; // Adjust the import path
import SignUpPage from './components/SignUpPage'; // Adjust the import path
import ForgotPassword from './components/ForgotPassword';
import EventPostPage from './components/EventPostPage';
import MyPostsPage from './components/MyPostsPage';
import ProfilePage from './components/ProfilePage';
import ClubPage from './components/ClubPage';
import ImageGallery from './components/Clubs';
import MenuAppBar from './components/Navbar';


function App() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  return (
    <div className="App">
      {!shouldHideNavbar && <MenuAppBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/post-event" element={<EventPostPage />} />
        <Route path="/clubs" element={<ImageGallery isAuthenticated={true} />} />
        <Route path="clubs/:id" element={<ClubPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/my-posts" element={<MyPostsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;

// import React from 'react';
// import './App.css';
// import EventPostPage from './components/EventPostPage';

// function App() {
//   return (
//     <div className="App">
//       <EventPostPage />
//     </div>
//   );
// }

// export default App;

// import React from 'react';
// import DynamicButton from './DynamicButton';

// const App = () => {
//     const handleClick = (label) => {
//         console.log(`${label} button clicked`);
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
//             <DynamicButton label="Login" onClick={() => handleClick('Login')} />
//             <DynamicButton label="Post Event" onClick={() => handleClick('Post Event')} />
//             <DynamicButton label="Update Profile" onClick={() => handleClick('Update Profile')} />
//             <DynamicButton label="Verify" onClick={() => handleClick('Verify')} />
//             <DynamicButton label="Upload Poster" onClick={() => handleClick('Upload Poster')} />
//             <DynamicButton label="Remove Poster" onClick={() => handleClick('Remove Poster')} />
//             <DynamicButton label="Sign In" onClick={() => handleClick('Sign In')} />
//             <DynamicButton label="Choose Picture" onClick={() => handleClick('Choose Picture')} />
//             <DynamicButton label="Change Password" onClick={() => handleClick('Change Password')} />
//             <DynamicButton label="Show Password" onClick={() => handleClick('Show Password')} />
//             <DynamicButton label="Hide Password" onClick={() => handleClick('Hide Password')} />
//         </div>
//     );
// };

// export default App;





