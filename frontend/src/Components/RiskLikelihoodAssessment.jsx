// RiskLikelihoodAssessment.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const RiskLikelihoodAssessment = ({ data, width = 600, height = 600 }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set margins
    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
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
      .domain([0, d3.max(data, d => d.likelihood) * 1.1])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.impact) * 1.1])
      .range([innerHeight, 0]);

    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, d => d.relevance)])
      .range([5, 20]);

    const colorScale = d3.scaleSequential(d3.interpolateReds)
      .domain([0, d3.max(data, d => d.relevance)]);

    // Add X axis
    chart
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));

    // Add Y axis
    chart.append('g').call(d3.axisLeft(yScale));

    // Add grid lines
    chart.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat('')
      );

    chart.append('g')
      .attr('class', 'grid')
      .call(d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickFormat('')
      );

    // Add risk matrix quadrants
    const medianLikelihood = d3.median(data, d => d.likelihood);
    const medianImpact = d3.median(data, d => d.impact);

    // Define quadrant colors
    const quadrantColors = ['#d4f0d4', '#f9e79f', '#f5b7b1', '#d7bde2'];

    // Define quadrants
    const quadrants = [
      { x: 0, y: 0, width: medianLikelihood, height: medianImpact, color: quadrantColors[0], label: 'Low Likelihood, Low Impact' },
      { x: medianLikelihood, y: 0, width: innerWidth - medianLikelihood, height: medianImpact, color: quadrantColors[1], label: 'High Likelihood, Low Impact' },
      { x: 0, y: medianImpact, width: medianLikelihood, height: innerHeight - medianImpact, color: quadrantColors[2], label: 'Low Likelihood, High Impact' },
      { x: medianLikelihood, y: medianImpact, width: innerWidth - medianLikelihood, height: innerHeight - medianImpact, color: quadrantColors[3], label: 'High Likelihood, High Impact' },
    ];

    // Draw quadrants
    chart.selectAll('.quadrant')
      .data(quadrants)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y + d.height))
      .attr('width', d => xScale(d.width))
      .attr('height', d => yScale(0) - yScale(d.height))
      .attr('fill', d => d.color)
      .attr('opacity', 0.3);

    // Add labels for quadrants
    chart.selectAll('.quadrant-label')
      .data(quadrants)
      .enter()
      .append('text')
      .attr('x', d => xScale(d.x + d.width / 2))
      .attr('y', d => yScale(d.y + d.height / 2))
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#000')
      .text(d => d.label);

    // Add dots
    chart
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.likelihood))
      .attr('cy', d => yScale(d.impact))
      .attr('r', d => sizeScale(d.relevance))
      .attr('fill', d => colorScale(d.relevance))
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
            `<strong>Risk:</strong> ${d.risk}<br/>
             <strong>Likelihood:</strong> ${d.likelihood}<br/>
             <strong>Impact:</strong> ${d.impact}<br/>
             <strong>Relevance:</strong> ${d.relevance}`
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
      .text('Likelihood');

    // Add Y axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 20)
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
      // .text('Risk and Likelihood Assessment');

  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default RiskLikelihoodAssessment;
