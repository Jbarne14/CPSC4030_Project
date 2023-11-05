// Function to update the actors network graph
function updateActorsGraph(movieData) {
    // Extract the actors list from the movie data
    let actorsList = movieData.actors.split(", ");

    // Prepare nodes data
    let nodes = actorsList.map(actor => ({ id: actor, name: actor }));

    // Prepare links data (this example assumes a function that finds shared movies)
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

    // Create simulation for nodes
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw lines for the links
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", 2)
        .attr("stroke", "#999");

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
        .text(d => d.name);

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

// Example usage with a dummy movie data
// This would be called when a movie is clicked in visualization 1
updateActorsGraph({
    // Placeholder movie data
    actors: "Meg Ryan, Hugh Jackman, Liev Schreiber"
});

// This is a placeholder function and needs to be implemented 
function findSharedMoviesBetweenActors(nodes) {
    // Implement logic to find shared movies between actors
    // For each pair of actors, check if there is a movie they both played in
    // Return an array of links with source and target for each pair that has a shared movie
    let links = [];
    // Example of what the data might look like
    nodes.forEach((source, i) => {
        nodes.slice(i + 1).forEach(target => {
            // Check if actors have a shared movie
            if (actorsHaveSharedMovie(source.id, target.id)) {
                links.push({ source: source.id, target: target.id });
            }
        });
    });
    return links;
}

// Placeholder function to check if two actors have shared a movie
function actorsHaveSharedMovie(actor1, actor2) {
    // Implement your logic to check for a shared movie
    // For this example, it just returns false to avoid errors
    return false;
}
