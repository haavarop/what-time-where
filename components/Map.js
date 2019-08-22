import React, { useEffect } from "react";
import { select } from "d3-selection";
import { json } from "d3-fetch";
import * as topojson from "topojson-client";
import { geoMiller } from "d3-geo-projection"
import { geoGraticule, geoPath } from "d3-geo"
import { extent } from "d3-array"
import { interpolateRdBu, interpolateRainbow } from "d3-scale-chromatic"
import { scaleSequential } from "d3-scale"
 
const Map = () =>  {
  
  useEffect(() => {
    createMap();
  })

  const createMap = async () =>  {
    const svg = select("#parent")
    
    const land = await json("https://cdn.jsdelivr.net/npm/world-atlas@1/world/50m.json").then(topology => topojson.feature(topology, topology.objects.land))
    
    const timezones = await json("https://gist.githubusercontent.com/mbostock/f0ae25cf1f057d443ca903277e3eb330/raw/254996390d4e19ef5eb1429103e0138ad08e19d0/timezones.json")
    const mesh = topojson.mesh(timezones, timezones.objects.timezones)
    const zones = topojson.feature(timezones, timezones.objects.timezones).features

    const graticule = geoGraticule().stepMinor([15, 10])()
    const outline = ({type: "Sphere"})

    const projection = geoMiller();
    const path = geoPath(projection)
    
    const color = scaleSequential(extent(zones, f => f.properties.zone), interpolateRainbow);
    
    const width = 975;

    const [[x0, y0], [x1, y1]] = geoPath(projection.fitWidth(width, outline)).bounds(outline);
    const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
      
    svg.selectAll("path")
      .data(zones)
      .enter()
      .append("path")
      .attr("d", d => path(d))
      .attr("fill", d => color(d.properties.zone))
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
  }

  return <svg  
    id="parent"
    viewBox={`0 2 975 711`}
    strokeLinejoin="round"
  />;
}
  
  export default Map;