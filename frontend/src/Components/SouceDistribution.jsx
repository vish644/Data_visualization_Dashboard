import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DonutChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    const arc = d3.arc()
      .innerRadius(radius - 70)
      .outerRadius(radius - 20);
    
    const pie = d3.pie()
      .value(d => d.value);
    
    svg.attr("width", width)
       .attr("height", height)
       .append("g")
       .attr("transform", `translate(${width / 2}, ${height / 2})`)
       .selectAll("path")
       .data(pie(data))
       .join("path")
       .attr("d", arc)
       .attr("fill", (d, i) => color(i));
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default DonutChart;
