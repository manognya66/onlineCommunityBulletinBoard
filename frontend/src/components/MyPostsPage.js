import React, { useEffect, useState } from 'react';
import { useEventContext } from './EventContext'; // Import the context
import axios from 'axios'; // Import axios for HTTP requests
import './MyPostsPage.css';
import { useNavigate } from 'react-router-dom';
import DynamicButton from './DynamicButton';

const MyPostsPage = () => {
  const { events, setEvents } = useEventContext(); // Access shared events context
  const authToken = localStorage.getItem('authToken'); // Get the authentication token
  const userId = localStorage.getItem('userId'); // Get the userId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if userId and authToken are present
    if (!userId || !authToken) {
      setError('User is not authenticated.');
      setLoading(false);
      return;
    }

    // Fetch events posted by the user
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`, // Send auth token in request headers
            'Content-Type': 'application/json', // Send JSON data
          },
        });

        console.log('Fetched Events:', response.data);
        setEvents(response.data); // Set the events directly (since the API returns the array directly)
      } catch (err) {
        console.error(err);
        setError('Error fetching events.'); // Set the error message
      } finally {
        setLoading(false); // Stop loading once the request is done
      }
    };

    fetchEvents();
  }, [userId, authToken, setEvents]); // Added dependencies to refetch if userId or authToken changes

  const safeEvents = events || []; // Ensure events is always an array

  if (loading) {
    return <div className="my-posts-page"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="my-posts-page"><p>{error}</p></div>;
  }

  return (
    <div className="my-posts-page">
      {safeEvents.length === 0 ? (
        <div className="create-event">
          <p>No events posted yet.</p>
          <DynamicButton onClick={() => navigate('/post-event')} label="Create Event" />
        </div>
      ) : (
        <ul>
          {safeEvents.map((event) => (
            <div className="event" key={event._id}>
              <li>
                {event.image && <img src={event.image} alt="Event Poster" loading="lazy" />}
                <h2>Title: {event.title}</h2>
                <p>Club: {event.clubName}</p>
                <p>
                  Event Dates: {event.eventStartDate ? new Date(event.eventStartDate).toLocaleDateString() : 'N/A'} -{' '}
                  {event.eventEndDate ? new Date(event.eventEndDate).toLocaleDateString() : 'N/A'}
                </p>
                <p>
                  Registration Dates: {event.regStartDate ? new Date(event.regStartDate).toLocaleDateString() : 'N/A'} -{' '}
                  {event.regEndDate ? new Date(event.regEndDate).toLocaleDateString() : 'N/A'}
                </p>
                <p>Location: {event.location}</p>
                <p>Description: {event.description}</p>
                <p>
                  Registration Link:{' '}
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                    {event.registrationLink}
                  </a>
                </p>
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPostsPage;
