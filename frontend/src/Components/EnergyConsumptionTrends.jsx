// EnergyConsumptionTrends.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const EnergyConsumptionTrends = ({ data, width = 800, height = 400 }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set margins
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Append SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create chart group
    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse the year
    const parseYear = d3.timeParse('%Y');
    const formattedData = data.map(d => ({
      year: parseYear(d.year),
      consumption: +d.consumption,
      sector: d.sector,
    }));

    // Group data by sector
    const sectors = Array.from(new Set(formattedData.map(d => d.sector)));
    const dataBySector = sectors.map(sector => ({
      sector,
      values: formattedData.filter(d => d.sector === sector).sort((a, b) => a.year - b.year),
    }));

    // Set scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(formattedData, d => d.year))
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(formattedData, d => d.consumption) * 1.1])
      .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(sectors);

    // Add X axis
    chart
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6));

    // Add Y axis
    chart.append('g').call(d3.axisLeft(yScale));

    // Add lines
    const line = d3
      .line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.consumption))
      .curve(d3.curveMonotoneX);

    chart
      .selectAll('.line')
      .data(dataBySector)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('d', d => line(d.values))
      .attr('fill', 'none')
      .attr('stroke', d => colorScale(d.sector))
      .attr('stroke-width', 2);

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top - 30})`);

    sectors.forEach((sector, i) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(${i * 150},0)`);

      legendRow
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colorScale(sector));

      legendRow
        .append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(sector)
        .attr('font-size', '12px')
        .attr('fill', '#000');
    });

    // Add titles
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      // .text('Energy Consumption Trends Over Time');

    // Add X axis label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('Year');

    // Add Y axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('Energy Consumption');

  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default EnergyConsumptionTrends;
