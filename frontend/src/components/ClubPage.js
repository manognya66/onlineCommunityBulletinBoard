import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEventContext } from './EventContext';
import axios from 'axios';
import eclub from '../assets/eclub.png';
import gitamsports from '../assets/gitamsports.jpg';
import gitam from '../assets/gitam.png';
import gusac from '../assets/gusac.jpg';
import nss from '../assets/nss.png';
import studentlife from '../assets/studentlife.png';
import './ClubPage.css';

const clubs = [
  { id: 'eclub', name: 'E-Club', image: eclub, description: 'The E-CLUB at GITAM is a dynamic platform for aspiring entrepreneurs to hone their business acumen and turn their innovative ideas into reality. The club organizes workshops, pitch competitions, mentorship programs, and networking events, connecting students with industry leaders and investors. It encourages entrepreneurial thinking, leadership, and creativity, fostering the next generation of successful business leaders.' },
  { id: 'gitam-sports', name: 'Gitam Sports', image: gitamsports, description: 'Gitam Sports promotes physical fitness, team spirit, and a healthy competitive spirit among students. With state-of-the-art facilities for various indoor and outdoor games, the sports club provides opportunities for students to excel in athletics, football, basketball, cricket, and more. Regular tournaments, fitness sessions, and coaching ensure that students not only stay physically active but also develop a well-rounded personality.' },
  { id: 'gitam', name: 'Gitam', image: gitam, description: 'GITAM Club represents the overall community at GITAM University.' },
  { id: 'gusac', name: 'Gusac', image: gusac, description: 'GUSAC is the official student innovation club of GITAM University, fostering creativity and promoting interdisciplinary learning. It serves as a platform for students to work on real-world projects, explore emerging technologies, and participate in national and international competitions. With a focus on research, innovation, and teamwork, GUSAC encourages students to develop critical thinking and problem-solving skills, making it the hub for tech enthusiasts and innovators.' },
  { id: 'nss', name: 'NSS', image: nss, description: 'The NSS unit at GITAM is dedicated to community service and social welfare. It provides students with opportunities to contribute to societal development through activities such as blood donation camps, environmental campaigns, rural development programs, and disaster relief initiatives. NSS instills a sense of responsibility, teamwork, and empathy in students, empowering them to be active participants in nation-building.' },
  { id: 'student-life', name: 'Student Life', image: studentlife, description: "STUDENT LIFE at GITAM is vibrant and enriching, offering a perfect blend of academics, extracurricular activities, and cultural experiences. From engaging in clubs and organizations to participating in festivals, workshops, and community outreach programs, students have a plethora of opportunities to grow holistically. GITAM's campus provides a supportive environment where students can pursue their passions, build lifelong friendships, and create cherished memories." },
];

const ClubPage = () => {
  const { id } = useParams();
  const { events, setEvents } = useEventContext();
  const club = clubs.find((club) => club.id === id);
  const authToken = localStorage.getItem('authToken'); // Get the authentication token
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authToken) {
      setError('User is not authenticated.');
      setLoading(false);
      return;
    }

    // Fetch events posted by the user
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/events/${club.name}`, {
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
  }, [club, authToken, setEvents]);

  if (loading) {
    return (
      <div className="club-page">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="club-page">
        <p>{error}</p>
      </div>
    );
  }

  const safeEvents = events || []; // Ensure events is always an array

  return (
    <div className="club-page">
      <div className="club-content">
        <img src={club.image} alt={club.name} className="club-image" />
        <div className="club-info">
          <h1>{club.name}</h1>
          <p>{club.description}</p>
        </div>
      </div>
      <div className="events">
        <h2>Posted Events</h2>
        {safeEvents.length === 0 ? (
          <p>No events have been posted for this club yet.</p> // Display message when no events are available
        ) : (
          <ul>
            {safeEvents.map((event) => (
              <div className="event" key={event.clubName}>
                <li>
                  {event.image && <img src={event.image} alt="Event Poster" loading="lazy" />}
                  <h3>Title: {event.title}</h3>
                  <p>Club: {event.clubName}</p>
                  <p>
                    Event Dates:{' '}
                    {event.eventStartDate ? new Date(event.eventStartDate).toLocaleDateString() : 'N/A'} -{' '}
                    {event.eventEndDate ? new Date(event.eventEndDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <p>
                    Registration Dates:{' '}
                    {event.regStartDate ? new Date(event.regStartDate).toLocaleDateString() : 'N/A'} -{' '}
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
    </div>
  );
};

export default ClubPage;

