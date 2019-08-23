import React, { useState } from "react";
import TimeList from "../components/TimeList";
import Map from "../components/Map";
import "../styles/global.css";

const Home = () => {
  const [timezonesToShow, setTimezonesToShow] = useState([])
  return (
    <div>
      <TimeList timezones={timezonesToShow}/>
      <Map onTimeZoneClick={setTimezonesToShow}/>
    </div>
  )
}

export default Home