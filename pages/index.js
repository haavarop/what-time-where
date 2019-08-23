import React, { useState } from "react";
import TimeList from "../components/TimeList";
import Map from "../components/Map";

const Home = () => {
  const [timezonesToShow, setTimezonesToShow] = useState([])
  return (
    <div>
      {timezonesToShow.map(t => {
        return <p>{t}</p>
      })}
      <TimeList timeZones={timezonesToShow}/>
      <Map onTimeZoneClick={setTimezonesToShow}/>
    </div>
  )
}

export default Home