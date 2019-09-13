import React, { useEffect, useState } from "react";
import { select } from "d3-selection";
import { json } from "d3-fetch";
import * as topojson from "topojson-client";
import { geoMiller } from "d3-geo-projection"
import { geoGraticule, geoPath } from "d3-geo"
import { extent } from "d3-array"
import { interpolateRdBu, interpolateRainbow } from "d3-scale-chromatic"
import { scaleSequential, scaleLinear } from "d3-scale"
import { transition } from "d3-transition"
import "../styles/map.css"
 
const Map = (props) =>  {
  // Prevent createMap from being called more than once 
  const [isRendered, setIsRenderd] = useState(true);
  const [loadingText, setLoadingText] = useState("Laster inn...")
  const [loadingBar, setLoadingBar] = useState(0);
  let selectedAreas = [];
  const loadingBarScale = scaleLinear().range([0,975]).domain([0, 100]);
  
  useEffect(() => {
    createLoadingBar();
    createMap();
  }, [isRendered])

  useEffect(() => {
    updateLoadingBar()
  }, [loadingBar])

  function handleClick(d,i) {    
    const area = select(this);
    
    const timezoneDataItem = {
      id: i,
      ...d.properties,
      color: area.attr("fill")
    }

    // Remove items
    if (selectedAreas.find(area => area.id === i)) {      
      area.attr("opacity", "0");
      selectedAreas = selectedAreas.filter(j => j.id !== i)
    // Add items
    } else {      
      area.attr("opacity", "1")
      selectedAreas.push(timezoneDataItem)
    }

    props.onTimeZoneClick([...selectedAreas])

  }

  function handleMouseOver(d,i) {
    if (selectedAreas.find(area => area.id === i)) return;
    select(this).attr("opacity", "0.5")

  }
  
  function handleMouseOut(d,i) {
    if (selectedAreas.find(area => area.id === i)) return;
    select(this).attr("opacity", "0")
  }

  const updateLoadingBar = () => {
    select("#loading-rect")
      .transition()
      .duration(loadingBar*4)
      .attr("width", loadingBarScale(loadingBar))
  }

  const createLoadingBar = () => {
    
    select("#loading")
      .append("rect")
      .attr("x", 0)
      .attr("y", 200)
      .attr("height", 32)
      .attr("width", loadingBarScale(100))
      .attr("fill", "lightgrey")

    select("#loading")
      .append("rect")
      .attr("id", "loading-rect")
      .attr("x", 0)
      .attr("y", 200)
      .attr("height", 32)
      .attr("width", 0)
      .attr("fill", "steelblue")


  }

  const createMap = async () =>  {
    const svg = select("#parent")
    
    
    setLoadingText("Loading world map...")
    setLoadingBar(25)
    const land = await json("https://cdn.jsdelivr.net/npm/world-atlas@1/world/50m.json").then(topology => topojson.feature(topology, topology.objects.land))

    setLoadingText("Loading timezones...")
    setLoadingBar(95)
    const timezones = await json("https://gist.githubusercontent.com/mbostock/f0ae25cf1f057d443ca903277e3eb330/raw/254996390d4e19ef5eb1429103e0138ad08e19d0/timezones.json")
    const mesh = topojson.mesh(timezones, timezones.objects.timezones)
    const zones = topojson.feature(timezones, timezones.objects.timezones).features
    
    const graticule = geoGraticule().stepMinor([15, 10])()
    const outline = ({type: "Sphere"})

    setLoadingText("Create projection...")
    setLoadingBar(75)

    const projection = geoMiller();
    const path = geoPath(projection)
    
    const color = scaleSequential(extent(zones, f => f.properties.zone), interpolateRainbow);
    
    const width = 975;
    const [[x0, y0], [x1, y1]] = geoPath(projection.fitWidth(width, outline)).bounds(outline);
    const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    
    setLoadingText("Generating map...")
    setLoadingBar(100)

    svg.selectAll("path")
      .data(zones)
      .enter()
      .append("path")
      .attr("d", d => path(d))
      .attr("fill", d  => color(d.properties.zone))
      .attr("opacity", "0")
      .on("click", handleClick)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .append("title")
      .text(d => `${d.properties.places} ${d.properties.time_zone}`)

    svg.append("g").attr("id", "container")

    const g = svg.select("#container")

    g.attr("pointer-events", "none")

    g.append("path")
      .attr("d", path(mesh))
      .attr("fill", "none")
      .attr("stroke", "black")
        
    g.append("path")
      .attr("d", path(land))
      .attr("stroke", "black")
      .attr("fill-opacity", "0.1")
      .attr("stroke-opacity", "0.5")
      
    g.append("path")
      .attr("d", path(graticule))
      .attr("stroke-opacity", "0.15")
      .attr("fill", "none")

    setLoadingText("")
    select("#loading").remove();
  }

  return (
    <svg viewBox={`0 2 975 711`} strokeLinejoin="round">
      <text x="490" y="50" className="loading-text">{loadingText}</text>
      <g id="loading" />
      <g id="parent" />
    </svg>
  )
}
  
  export default Map;