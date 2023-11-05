// Load the CSV file
d3.csv("IMDB Movies 2000 - 2020.csv").then(data => {
    // Prepare and sort the data
    data.forEach(d => {
        d.worlwide_gross_income = +d.worlwide_gross_income;
        d.budget = +d.budget;
    });
    let topMovies = data.sort((a, b) => b.worlwide_gross_income - a.worlwide_gross_income).slice(0, 10);

    // Set up SVG canvas dimensions for the bar chart
    const width = 960;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 120, left: 90 };

    // Append the svg object to the barChart div
    const svg = d3.select("#barChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create the stacks
    const stack = d3.stack()
        .keys(["budget", "worlwide_gross_income"])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    const stackedData = stack(topMovies);

    // X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(topMovies.map(d => d.title))
        .padding(0.2);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(topMovies, d => d.budget + d.worlwide_gross_income)])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Colors
    const colors = d3.scaleOrdinal()
        .domain(["budget", "worlwide_gross_income"])
        .range(["#6f6f6f", "#69b3a2"]);

    // Tooltip for the bar chart
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Create the stacked bars
    svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
        .attr("fill", d => colors(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
            .attr("x", d => x(d.data.title))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .on("click", function(event, d) {
                // When a bar is clicked, call the onMovieClick function with the movie's title
                onMovieClick(d.data.title);
            });
            

        // Create a legend
        const legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(["Budget", "Worldwide Gross Income"])
        .enter().append("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

        legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", d => colors(d === "Budget" ? "budget" : "worlwide_gross_income"));

        legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(d => d);

});

// Function to create a network graph based on the movie's actors
function updateActorsGraph(movieData) {
    // Extract actors and prepare the nodes for the graph
    let actors = movieData.actors.split(", ");
    let nodes = actors.map(actor => ({ id: actor, group: 1 }));
    let links = [];

    // Create links between actors (this is a simplified example)
    for (let i = 0; i < actors.length - 1; i++) {
        links.push({
            source: actors[i],
            target: actors[i + 1],
            value: 1
        });
    }

    // Set up the svg width and height for the network graph
    const graphWidth = 960;
    const graphHeight = 600;

    // Clear any previous graph
    const graphSvg = d3.select("#actorsGraph").html("").append("svg")
        .attr("width", graphWidth)
        .attr("height", graphHeight);

    // Set up the simulation and add forces
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(graphWidth / 2, graphHeight / 2));

    // Draw lines for the links
    const link = graphSvg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    // Draw circles for the nodes
    const node = graphSvg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", "#69b3a2");

    // Drag functions for the nodes
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Tick function for the simulation
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    // Zoom capabilities for the SVG
    const zoom_handler = d3.zoom()
        .on("zoom", (event) => {
            graphSvg.attr("transform", event.transform);
        });

    zoom_handler(graphSvg);

    // Add tooltips to the nodes
    node.append("title")
        .text(d => d.id);
}
