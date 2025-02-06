import React from 'react';
import './HomePage.css';
import TrendingEvents from './TrendingEvents';
import Clubs from './Clubs';

const HomePage = () => {
  return (
    <div>
      <main>
        <section className="trending-events">
          <h2>Trending Events</h2>
          <TrendingEvents />
        </section>
        <section className="clubs">
          <h2>Clubs</h2>
          <Clubs />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
