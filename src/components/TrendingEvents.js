import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  EffectCoverflow,
  A11y,
  Keyboard, 
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "./TrendingEvents.css";

import ArtExhibition from "../assets/ArtExhibition.jpg";
import CharityRun from "../assets/CharityRun.jpeg";
import FoodFest from "../assets/FoodFest.jpeg";
import MusicFest from "../assets/MusicFest.jpeg";
import TechMeetUp from "../assets/TechMeetUp.jpg";

const events = [
  { id: "1", name: "Art Exhibition", img: ArtExhibition, date: "01-01-2025" },
  { id: "2", name: "Music Fest", img: MusicFest, date: "05-01-2025" },
  { id: "3", name: "Food Fest", img: FoodFest, date: "10-01-2025" },
  { id: "4", name: "Tech Meet Up", img: TechMeetUp, date: "15-01-2025" },
  { id: "5", name: "Charity Run", img: CharityRun, date: "20-01-2025" },
];

function TrendingEvents() {
  return (
    <div className="TrendingEvents">
      <Swiper
        modules={[Autoplay, Navigation, EffectCoverflow, A11y, Keyboard]} 
        autoplay={{ delay: 2000 }}
        navigation
        loop={true}
        effect="coverflow"
        coverflowEffect={{
          rotate: 30, 
          stretch: -80, 
          depth: 100, 
          modifier: 0, 
          slideShadows: true, 
        }}
        centeredSlides={true} 
        slidesPerView={1.85} 
        keyboard={{ enabled: true }}
        className="mySwiper"
      >
        {events.map((event) => (
          <SwiperSlide key={event.id}>
            <div className="events">
              <img src={event.img} alt={event.name} />
              <div className="event-info">
                <h2>{event.name}</h2>
                <p>{event.date}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default TrendingEvents;
