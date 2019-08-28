import React, { useState } from "react";
import TimeList from "../components/TimeList";
import Map from "../components/Map";
import "../styles/global.css";
import Title from "../components/Title"; 
import Head from "next/head" 

const Home = () => {
  const [timezonesToShow, setTimezonesToShow] = useState([])
  return (
    <div>
      <Head>
        <title>What time where</title>
        <link rel="shortcut icon" href="/static/favicon.ico" />
      </Head>
      <Title />
      <TimeList timezones={timezonesToShow}/>
      <div className="map-container">
        <Map onTimeZoneClick={setTimezonesToShow}/>
      </div>
    </div>
  )
}

export default Home