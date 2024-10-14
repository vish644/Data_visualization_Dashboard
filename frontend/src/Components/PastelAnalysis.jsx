import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const StackedBarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const categories = ["Political", "Economic", "Social", "Technological", "Legal", "Environmental"];
    
    const x = d3.scaleBand()
      .domain(data.map(d => d.year))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.sum(categories, category => d[category]))])
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(categories)
      .range(d3.schemeCategory10);

    const stack = d3.stack().keys(categories);
    
    svg.selectAll("g").remove(); // clear previous renders

    svg.append("g")
      .selectAll("g")
      .data(stack(data))
      .enter().append("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .enter().append("rect")
      .attr("x", d => x(d.data.year))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    svg.append("g")
      .call(d3.axisBottom(x).tickSize(0))
      .attr("transform", `translate(0,${height - margin.bottom})`);

    svg.append("g")
      .call(d3.axisLeft(y));
  }, [data]);

  return <svg ref={svgRef} width={500} height={300}></svg>;
};

export default StackedBarChart;
