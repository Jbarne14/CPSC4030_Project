let moviesToActors; // Placeholder, should be loaded with the actual data

// Load the JSON data for moviesToActors
fetch('movies_to_actors.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        moviesToActors = data;
    })
    .catch(error => console.error('Error loading the JSON data:', error));

    
function updateActorsGraph(movieData) {
    // Extract the actors list from the movie data
    let actorsList = movieData.actors.split(", ");

    // Prepare nodes data
    let nodes = actorsList.map(actor => ({ id: actor, name: actor }));

    // Prepare links data
    let links = findSharedMoviesBetweenActors(nodes);

    // Set dimensions for the graph
    const width = 960;
    const height = 600;

    // Create SVG container for the graph
    const svg = d3.select("#actorsGraph")
    .html("") // Clear any existing content
    .append("svg")
    .attr("width", width)
    .attr("height", height);

                
    // Calculate normalization factors based on graph size and complexity
    const chargeNormalization = Math.cbrt(nodes.length) * 10; // Cube root used as a scaling function
    const linkDistanceNormalization = 350 / Math.sqrt(nodes.length); // Square root to scale down distance as nodes increase

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links)
            .id(d => d.id)
            .distance(d => linkDistanceNormalization * d.movies.length)) // Normalize link distance based on shared movies count
        .force("charge", d3.forceManyBody()
            .strength(-400 / chargeNormalization)) // Normalize charge strength based on number of nodes
        .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw lines for the links
    const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke-width", 1) // Reduced stroke-width for less prominent links
    .attr("stroke", "#bbb"); // Lighter color for the links

    // Draw circles for the nodes
    const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", 5)
    .attr("fill", "#69b3a2")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add labels to each node
    const labels = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("dx", 15)
    .attr("dy", ".35em")
    .text(d => d.name)
    .style("font-weight", "bold"); // Bold font for the names

    // Define drag behavior
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

    // Update positions on each tick
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        labels
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });
}

function findSharedMoviesBetweenActors(nodes, minShared = 2) {
    let links = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            let sharedMovies = actorsHaveSharedMovie(nodes[i].id, nodes[j].id, minShared);
            if (sharedMovies.length > 0) {
                links.push({ source: nodes[i].id, target: nodes[j].id, movies: sharedMovies });
            }
        }
    }
    return links;
}

function actorsHaveSharedMovie(actor1, actor2, minShared = 2) {
    let sharedMovies = [];
    for (let movie in moviesToActors) {
        if (moviesToActors[movie].includes(actor1) && moviesToActors[movie].includes(actor2)) {
            sharedMovies.push(movie);
        }
    }
    // Only consider actors that have shared at least 'minShared' movies as connected
    return sharedMovies.length >= minShared ? sharedMovies : [];
}

// To be called when a movie is clicked in visualization 1
function onMovieClick(movieTitle) {
    // Update the movie title display
    document.getElementById('movieTitle').textContent = `Actors network for "${movieTitle}"`;

    // Find the movie data from the JSON object
    let movieData = { actors: moviesToActors[movieTitle].join(", ") };
    updateActorsGraph(movieData);
}


