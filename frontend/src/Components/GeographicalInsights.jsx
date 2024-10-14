import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ChoroplethMap = ({ data, geoData }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;

    const projection = d3.geoMercator()
      .scale(100)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const color = d3.scaleQuantize()
      .domain([0, d3.max(data, d => d.value)])
      .range(d3.schemeBlues[9]);

    svg.selectAll("path")
      .data(geoData.features)
      .join("path")
      .attr("d", path)
      .attr("fill", d => {
        const country = data.find(country => country.id === d.id);
        return country ? color(country.value) : '#ccc';
      });
  }, [data, geoData]);

  return <svg ref={svgRef} width={800} height={400}></svg>;
};

export default ChoroplethMap;
