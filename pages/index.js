import React, { useState } from "react";
import TimeList from "../components/TimeList";
import Map from "../components/Map";
import "../styles/global.css";
import Title from "../components/Title";  

const Home = () => {
  const [timezonesToShow, setTimezonesToShow] = useState([])
  return (
    <div>
      <Title />
      <TimeList timezones={timezonesToShow}/>
      <div className="map-container">
        <Map onTimeZoneClick={setTimezonesToShow}/>
      </div>
    </div>
  )
}

export default Home