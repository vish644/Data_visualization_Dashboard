// SectorImpactRelevance.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const SectorImpactRelevance = ({ data, width = 600, height = 400 }) => {
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

    // Set scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.relevance) * 1.1])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.impact) * 1.1])
      .range([innerHeight, 0]);

    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, d => d.intensity)])
      .range([5, 20]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Add X axis
    chart
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));

    // Add Y axis
    chart.append('g').call(d3.axisLeft(yScale));

    // Add dots
    chart
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.relevance))
      .attr('cy', d => yScale(d.impact))
      .attr('r', d => sizeScale(d.intensity))
      .attr('fill', d => colorScale(d.sector))
      .attr('opacity', 0.7)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke', '#000');
        // Tooltip
        const tooltip = d3
          .select('body')
          .append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', '#f9f9f9')
          .style('padding', '8px')
          .style('border', '1px solid #d3d3d3')
          .style('border-radius', '4px')
          .style('pointer-events', 'none')
          .html(
            `<strong>Sector:</strong> ${d.sector}<br/>
             <strong>Impact:</strong> ${d.impact}<br/>
             <strong>Relevance:</strong> ${d.relevance}<br/>
             <strong>Intensity:</strong> ${d.intensity}`
          );

        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', 'none');
        d3.selectAll('.tooltip').remove();
      });

    // Add X axis label
    svg
      .append('text')
      .attr('x', margin.left + innerWidth / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('Relevance');

    // Add Y axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('Impact');

    // Add title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      // .text('Sector Impact vs. Relevance');

    // Add legend for color
    const sectors = Array.from(new Set(data.map(d => d.sector)));
    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin.left + innerWidth + 20}, ${margin.top})`);

    sectors.forEach((sector, i) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`);

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

  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default SectorImpactRelevance;
