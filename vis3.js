// Set up the SVG canvas
const margin = { top: 20, right: 20, bottom: 70, left: 70 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Load the data from the CSV file
d3.csv('IMDB Movies 2000-2020.csv', (error, data) => {
    if (error) throw error;

    // Convert the budget and worldwide_gross_income strings to numbers
    data.forEach(d => {
        d.budget = +d.budget;
        d.worldwide_gross_income = +d.worldwide_gross_income;
    });

    // Set up the scales for the x and y axes
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.budget)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.worldwide_gross_income)])
        .range([height, 0]);

    // Add the x and y axes to the SVG canvas
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    svg.append('g')
        .call(yAxis);

    // Add the data points to the SVG canvas
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.budget))
        .attr('cy', d => yScale(d.worldwide_gross_income))
        .attr('r', 5)
        .attr('fill', 'steelblue');
});
